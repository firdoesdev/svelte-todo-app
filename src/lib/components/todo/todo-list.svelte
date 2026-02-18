<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import Trash from 'lucide-svelte/icons/trash';
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

	type Todo = typeof todo.$inferSelect;

	let { todos } = $props<{ todos: Todo[] }>();

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

	function handleDelete(id: string) {
		if (confirm('Are you sure?')) {
			deleteMutation.mutate(id);
		}
	}
</script>

<div class="space-y-4">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead>Title</TableHead>
				<TableHead>Description</TableHead>
				<TableHead>Completed</TableHead>
				<TableHead>Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each todos as todo (todo.id)}
				<TableRow>
					<TableCell>{todo.title}</TableCell>
					<TableCell>{todo.description}</TableCell>
					<TableCell>{todo.completed}</TableCell>
					<TableCell>
						<Button variant="ghost" size="icon" onclick={() => handleDelete(todo.id)}>
							<Trash class="h-4 w-4" />
							<span class="sr-only">Delete</span>
						</Button>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>
	{#if todos.length === 0}
		<p class="p-8 text-center text-muted-foreground">No todos yet. Create one above!</p>
	{/if}
</div>
