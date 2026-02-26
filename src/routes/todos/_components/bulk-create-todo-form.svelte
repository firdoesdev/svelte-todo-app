<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';

	type TodoItem = {
		title: string;
		description: string;
	};

	function createEmptyItem(): TodoItem {
		return { title: '', description: '' };
	}

	let isOpen = $state(false);
	let items: TodoItem[] = $state([createEmptyItem()]);
	let errors: string[] = $state([]);

	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		mutationFn: async (payload: { title: string; description?: string }[]) => {
			const res = await fetch('/api/todos/bulk', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: payload.map((item) => ({
						title: item.title,
						description: item.description || undefined
					}))
				})
			});
			if (!res.ok) throw new Error('Failed to create todos');
			return res.json();
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			const count = Array.isArray(data) ? data.length : 0;
			toast.success(`${count} todo(s) created successfully`);
			resetForm();
			isOpen = false;
		},
		onError: (err) => {
			toast.error(err.message);
		}
	}));

	function addItem() {
		items = [...items, createEmptyItem()];
		errors = [...errors, ''];
	}

	function removeItem(index: number) {
		items = items.filter((_, i) => i !== index);
		errors = errors.filter((_, i) => i !== index);
	}

	function resetForm() {
		items = [createEmptyItem()];
		errors = [];
	}

	function validate(): boolean {
		let valid = true;
		const newErrors = items.map((item) => {
			if (!item.title.trim()) {
				valid = false;
				return 'Title is required';
			}
			return '';
		});
		errors = newErrors;
		return valid;
	}

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (!validate()) return;
		mutation.mutate(
			items.map((item) => ({
				title: item.title.trim(),
				description: item.description.trim() || undefined
			}))
		);
	}

	function handleToggle() {
		isOpen = !isOpen;
		if (!isOpen) resetForm();
	}
</script>

<Dialog open={isOpen}>
	<DialogTrigger class={buttonVariants({ variant: 'outline' })} onclick={handleToggle}>
		Bulk Add
	</DialogTrigger>
	<DialogContent class="max-h-[85vh] sm:max-w-xl">
		<DialogHeader>
			<DialogTitle>Bulk Add Todos</DialogTitle>
			<DialogDescription>
				Add multiple todos at once. Click "Add Another" to add more items.
			</DialogDescription>
		</DialogHeader>
		<form
			onsubmit={handleSubmit}
			class="flex w-full flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
		>
			<div class="flex max-h-[50vh] flex-col gap-4 overflow-y-auto pr-1">
				{#each items as item, index}
					<div class="relative flex flex-col gap-3 rounded-md border bg-muted/30 p-3">
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium text-muted-foreground">
								Todo #{index + 1}
							</span>
							{#if items.length > 1}
								<button
									type="button"
									class="text-xs text-destructive hover:underline"
									onclick={() => removeItem(index)}
								>
									Remove
								</button>
							{/if}
						</div>

						<div class="grid gap-1.5">
							<Label for="bulk-title-{index}">Title</Label>
							<Input
								id="bulk-title-{index}"
								placeholder="Buy groceries"
								value={item.title}
								oninput={(e) => {
									items[index].title = e.currentTarget.value;
									if (errors[index]) errors[index] = '';
								}}
							/>
							{#if errors[index]}
								<p class="text-sm text-destructive">{errors[index]}</p>
							{/if}
						</div>

						<div class="grid gap-1.5">
							<Label for="bulk-desc-{index}">Description</Label>
							<Input
								id="bulk-desc-{index}"
								placeholder="Optional details"
								value={item.description}
								oninput={(e) => {
									items[index].description = e.currentTarget.value;
								}}
							/>
						</div>
					</div>
				{/each}
			</div>

			<Button type="button" variant="outline" onclick={addItem} class="w-full">
				+ Add Another
			</Button>

			<div class="flex items-center justify-between">
				<span class="text-sm text-muted-foreground">
					{items.length} todo(s) will be created
				</span>
				<Button type="submit" disabled={mutation.isPending}>
					{mutation.isPending ? 'Creating...' : 'Create Todos'}
				</Button>
			</div>
		</form>
	</DialogContent>
</Dialog>
