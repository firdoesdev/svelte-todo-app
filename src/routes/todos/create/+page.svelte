<script lang="ts">
	import CreateTodoForm from './_components/create-todo-form/index.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft } from 'lucide-svelte';
</script>

<div class="flex max-w-2xl flex-col gap-6">
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/todos">
			<ChevronLeft class="h-4 w-4" />
		</Button>
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Create Todo</h2>
			<p class="text-muted-foreground">Add a new task to your list.</p>
		</div>
	</div>

	<CreateTodoForm />
</div>
