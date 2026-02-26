<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { zodValidator } from '@tanstack/zod-form-adapter';
	import { createTodoSchema, type CreateTodoSchema } from '$lib/schemas';
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

	let isOpen = $state(false);

	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		mutationFn: async (values: { title: string; description?: string }) => {
			const res = await fetch('/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values)
			});
			if (!res.ok) throw new Error('Failed to create todo');
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			toast.success('Todo created');
			form.reset();
		},
		onError: (err) => {
			toast.error(err.message);
		}
	}));

	const form = createForm(() => ({
		defaultValues: {
			title: '',
			description: undefined
		} as CreateTodoSchema,
		validatorAdapter: zodValidator(),
		validators: {
			onChange: createTodoSchema
		},
		onSubmit: async ({ value }) => {
			mutation.mutate(value);
			isOpen = false;
		}
	}));

	const handleToggle = () => {
		isOpen = !isOpen;
	};
</script>

<Dialog open={isOpen}>
	<DialogTrigger class={buttonVariants({ variant: 'outline' })} onclick={handleToggle}
		>Add Todo</DialogTrigger
	>
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Add New Todo</DialogTitle>
			<DialogDescription>Create a new todo item to manage your tasks.</DialogDescription>
		</DialogHeader>
		<form
			method="POST"
			onsubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			class="flex w-full flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
		>
			<div>
				<form.Field name="title">
					{#snippet children({ state, handleChange, handleBlur })}
						<div class="grid gap-3">
							<Label for="title">Title</Label>
							<Input
								id="title"
								name="title"
								value={state.value}
								oninput={(e) => handleChange(e.currentTarget.value)}
								onblur={handleBlur}
								placeholder="Buy groceries"
							/>
						</div>
						{#if state.meta.errors}
							<p class="text-sm text-destructive">{state.meta.errors.join(', ')}</p>
						{/if}
					{/snippet}
				</form.Field>
			</div>

			<div>
				<form.Field name="description">
					{#snippet children({ state, handleChange, handleBlur })}
						<div class="grid gap-3">
							<Label for="description">Description</Label>
							<Input
								id="description"
								name="description"
								value={state.value || ''}
								oninput={(e) => handleChange(e.currentTarget.value)}
								onblur={handleBlur}
								placeholder="Optional details"
							/>
						</div>
					{/snippet}
				</form.Field>
			</div>

			<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
				{#snippet children([canSubmit, isSubmitting])}
					<Button type="submit" disabled={!canSubmit || isSubmitting}>
						{isSubmitting ? 'Creating...' : 'Create Todo'}
					</Button>
				{/snippet}
			</form.Subscribe>
		</form>
	</DialogContent>
</Dialog>
