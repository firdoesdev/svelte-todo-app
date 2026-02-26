<script lang="ts">
	import EditTodoForm from './_components/edit-todo-form/index.svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronLeft } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="flex max-w-2xl flex-col gap-6">
	<div class="flex items-center gap-4">
		<Button variant="ghost" size="icon" href="/todos">
			<ChevronLeft class="h-4 w-4" />
		</Button>
		<div>
			<h2 class="text-3xl font-bold tracking-tight">Edit Todo</h2>
			<p class="text-muted-foreground">Update your task details.</p>
		</div>
	</div>

	<EditTodoForm todo={data.todo} />
</div>
