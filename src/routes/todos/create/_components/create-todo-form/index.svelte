<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { zodValidator } from '@tanstack/zod-form-adapter';
	import { createTodoSchema, type CreateTodoSchema } from './schema';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		mutationFn: async (values: CreateTodoSchema) => {
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
			toast.success('Todo created successfully');
			goto('/todos');
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
		}
	}));
</script>

<form
	method="POST"
	onsubmit={(e) => {
		e.preventDefault();
		e.stopPropagation();
		form.handleSubmit();
	}}
	class="flex flex-col gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
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
					<Label for="description">Description (Optional)</Label>
					<Input
						id="description"
						name="description"
						value={state.value || ''}
						oninput={(e) => handleChange(e.currentTarget.value)}
						onblur={handleBlur}
						placeholder="Optional details about your task"
					/>
				</div>
			{/snippet}
		</form.Field>
	</div>

	<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
		{#snippet children([canSubmit, isSubmitting])}
			<div class="flex gap-2">
				<Button type="submit" disabled={!canSubmit || isSubmitting}>
					{isSubmitting ? 'Creating...' : 'Create Todo'}
				</Button>
				<Button variant="outline" type="button" href="/todos">Cancel</Button>
			</div>
		{/snippet}
	</form.Subscribe>
</form>
