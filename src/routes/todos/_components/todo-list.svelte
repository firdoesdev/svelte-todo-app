<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import Trash from 'lucide-svelte/icons/trash';
	import Pencil from 'lucide-svelte/icons/pencil';
	import ArrowUp from 'lucide-svelte/icons/arrow-up';
	import ArrowDown from 'lucide-svelte/icons/arrow-down';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import type { todo } from '$lib/server/db/schema';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	type Todo = typeof todo.$inferSelect;

	type SortField = 'title' | 'createdAt' | 'completed';

	let {
		todos,
		sort = 'createdAt',
		order = 'desc',
		onSortChange
	} = $props<{
		todos: Todo[];
		sort?: string;
		order?: string;
		onSortChange?: (field: SortField, order: string) => void;
	}>();

	const queryClient = useQueryClient();

	const toggleMutation = createMutation(() => ({
		mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
			const res = await fetch(`/api/todos/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed })
			});
			if (!res.ok) throw new Error('Failed to update todo');
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
		},
		onError: (err) => {
			toast.error(err.message);
		}
	}));

	const deleteMutation = createMutation(() => ({
		mutationFn: async (id: string) => {
			const res = await fetch(`/api/todos/${id}`, {
				method: 'DELETE'
			});
			if (!res.ok) throw new Error('Failed to delete todo');
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			toast.success('Todo deleted');
		},
		onError: (err) => {
			toast.error(err.message);
		}
	}));

	function handleToggle(id: string, completed: boolean) {
		toggleMutation.mutate({ id, completed });
	}

	let deleteDialogOpen = $state(false);
	let todoToDelete = $state<Todo | null>(null);

	function openDeleteDialog(todo: Todo) {
		todoToDelete = todo;
		deleteDialogOpen = true;
	}

	function confirmDelete() {
		if (todoToDelete) {
			deleteMutation.mutate(todoToDelete.id);
			deleteDialogOpen = false;
			todoToDelete = null;
		}
	}

	function handleSort(field: SortField) {
		if (sort === field) {
			const newOrder = order === 'asc' ? 'desc' : 'asc';
			onSortChange?.(field, newOrder);
		} else {
			onSortChange?.(field, 'asc');
		}
	}

	function formatDate(date: Date | string | null) {
		if (!date) return '—';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="space-y-4">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>
					<button class="flex items-center gap-1 hover:text-foreground transition-colors" onclick={() => handleSort('title')}>
						Title
						{#if sort === 'title'}
							{#if order === 'asc'}
								<ArrowUp class="h-3.5 w-3.5" />
							{:else}
								<ArrowDown class="h-3.5 w-3.5" />
							{/if}
						{:else}
							<ArrowUpDown class="h-3.5 w-3.5 opacity-40" />
						{/if}
					</button>
				</TableHead>
				<TableHead>Description</TableHead>
				<TableHead>
					<button class="flex items-center gap-1 hover:text-foreground transition-colors" onclick={() => handleSort('completed')}>
						Completed
						{#if sort === 'completed'}
							{#if order === 'asc'}
								<ArrowUp class="h-3.5 w-3.5" />
							{:else}
								<ArrowDown class="h-3.5 w-3.5" />
							{/if}
						{:else}
							<ArrowUpDown class="h-3.5 w-3.5 opacity-40" />
						{/if}
					</button>
				</TableHead>
				<TableHead>
					<button class="flex items-center gap-1 hover:text-foreground transition-colors" onclick={() => handleSort('createdAt')}>
						Created At
						{#if sort === 'createdAt'}
							{#if order === 'asc'}
								<ArrowUp class="h-3.5 w-3.5" />
							{:else}
								<ArrowDown class="h-3.5 w-3.5" />
							{/if}
						{:else}
							<ArrowUpDown class="h-3.5 w-3.5 opacity-40" />
						{/if}
					</button>
				</TableHead>
				<TableHead>Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each todos as todo (todo.id)}
				<TableRow>
					<TableCell>{todo.title}</TableCell>
					<TableCell>{todo.description}</TableCell>
					<TableCell>
					<div class="flex items-center space-x-2">
						<Switch checked={todo.completed} onCheckedChange={(checked) => handleToggle(todo.id, !!checked)}/>
						<Label>{todo.completed ? 'Completed' : 'Incomplete'}</Label>
					</div>
					</TableCell>
					<TableCell class="text-muted-foreground text-sm">{formatDate(todo.createdAt)}</TableCell>
					<TableCell>
						<div class="flex gap-1">
							<Button variant="ghost" size="icon" href={`/todos/edit/${todo.id}`}>
								<Pencil class="h-4 w-4" />
								<span class="sr-only">Edit</span>
							</Button>
							<Button variant="ghost" size="icon" onclick={() => openDeleteDialog(todo)}>
								<Trash class="h-4 w-4" />
								<span class="sr-only">Delete</span>
							</Button>
						</div>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
	{#if todos.length === 0}
		<p class="p-8 text-center text-muted-foreground">No todos yet. Create one above!</p>
	{/if}
</div>

<!-- Delete Confirmation Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="rounded-lg border bg-card text-card-foreground shadow-sm sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Delete Todo</Dialog.Title>
			<Dialog.Description>
				Are you sure you want to delete "{todoToDelete?.title}"? This action cannot be undone.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Cancel</Button>
			<Button variant="destructive" onclick={confirmDelete}>Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
