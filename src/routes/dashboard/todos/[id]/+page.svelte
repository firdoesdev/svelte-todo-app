<script lang="ts">
    import EditTodoForm from '$lib/components/todo/edit-todo-form.svelte';
    import { ChevronLeft } from 'lucide-svelte';
    import { Button } from '$lib/components/ui/button';

    let { data } = $props();
</script>

<div class="flex flex-col gap-6 max-w-2xl mx-auto">
    <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" href="/dashboard/todos">
            <ChevronLeft class="h-4 w-4" />
        </Button>
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Edit Todo</h2>
            <p class="text-muted-foreground">Update your task details.</p>
        </div>
    </div>

    <EditTodoForm todo={data.todo} />
</div>
