<script lang="ts">
	import { createForm } from '@tanstack/svelte-form';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { zodValidator } from '@tanstack/zod-form-adapter';
	import { editTodoFormSchema, type EditTodoFormSchema } from '$lib/schemas';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let { todo } = $props<{ todo: any }>();
	const queryClient = useQueryClient();

	const mutation = createMutation(() => ({
		mutationFn: async (values: any) => {
			const res = await fetch(`/api/todos/${todo.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(values)
			});
			if (!res.ok) throw new Error('Failed to update todo');
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['todos'] });
			queryClient.invalidateQueries({ queryKey: ['todo', todo.id] });
			toast.success('Todo updated');
			goto('/dashboard/todos');
		},
		onError: (err) => {
			toast.error(err.message);
		}
	}));

	const form = createForm(() => ({
		defaultValues: {
			title: todo.title,
			description: todo.description || undefined,
			completed: !!todo.completed
		} as EditTodoFormSchema,
		validatorAdapter: zodValidator(),
		validators: {
			onChange: editTodoFormSchema
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
	class="flex max-w-md flex-col gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
>
	<h3 class="leading-none font-semibold tracking-tight">Edit Todo</h3>
	<div>
		<form.Field name="title">
			{#snippet children({ state, handleChange, handleBlur })}
				<Label for="title">Title</Label>
				<Input
					id="title"
					name="title"
					value={state.value}
					oninput={(e) => handleChange(e.currentTarget.value)}
					onblur={handleBlur}
				/>
				{#if state.meta.errors}
					<p class="text-sm text-destructive">{state.meta.errors.join(', ')}</p>
				{/if}
			{/snippet}
		</form.Field>
	</div>

	<div>
		<form.Field name="description">
			{#snippet children({ state, handleChange, handleBlur })}
				<Label for="description">Description (Optional)</Label>
				<Input
					id="description"
					name="description"
					value={state.value || ''}
					oninput={(e) => handleChange(e.currentTarget.value)}
					onblur={handleBlur}
				/>
			{/snippet}
		</form.Field>
	</div>

	<div>
		<form.Field name="completed">
			{#snippet children({ state, handleChange, handleBlur })}
				<div class="flex items-center gap-2">
					<Checkbox
						id="completed"
						checked={state.value}
						onCheckedChange={(v) => handleChange(!!v)}
					/>
					<Label for="completed">Completed</Label>
				</div>
			{/snippet}
		</form.Field>
	</div>

	<form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
		{#snippet children([canSubmit, isSubmitting])}
			<div class="flex gap-2">
				<Button type="submit" disabled={!canSubmit || isSubmitting}>
					{isSubmitting ? 'Saving...' : 'Save Changes'}
				</Button>
				<Button variant="outline" type="button" href="/dashboard/todos">Cancel</Button>
			</div>
		{/snippet}
	</form.Subscribe>
</form>
