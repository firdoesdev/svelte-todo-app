<script lang="ts">
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import TodoList from '$lib/components/todo/todo-list.svelte';
    import { onMount } from 'svelte';

	const query = createInfiniteQuery(() => ({
		queryKey: ['todos', 'infinite'],
		queryFn: async ({ pageParam = 1 }) => {
            const params = new URLSearchParams({
                page: pageParam.toString(),
                limit: '10'
            });
			const res = await fetch(`/api/todos?${params.toString()}`);
			if (!res.ok) throw new Error('Failed to fetch todos');
			return res.json();
		},
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.meta.page < lastPage.meta.totalPages) {
                return lastPage.meta.page + 1;
            }
            return undefined;
        }
	}));

    let loadMoreTrigger: HTMLElement;

    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
                query.fetchNextPage();
            }
        }, { threshold: 0.1 });

        if (loadMoreTrigger) {
            observer.observe(loadMoreTrigger);
        }

        return () => {
             if (loadMoreTrigger) observer.unobserve(loadMoreTrigger);
        };
    });
</script>

<div class="flex flex-col gap-6 max-w-2xl mx-auto">
	<div class="flex flex-col gap-2">
		<h2 class="text-3xl font-bold tracking-tight">Infinite Scroll Todos</h2>
		<p class="text-muted-foreground">Scroll down to load more.</p>
	</div>

	{#if query.isLoading}
		<p>Loading todos...</p>
	{:else if query.isError}
		<p class="text-destructive">Error: {query.error.message}</p>
	{:else if query.data}
        {@const allTodos = query.data.pages.flatMap(page => page.data)}
		<TodoList todos={allTodos} />
        
        <div bind:this={loadMoreTrigger} class="h-10 flex items-center justify-center p-4">
            {#if query.isFetchingNextPage}
                <span class="text-muted-foreground">Loading more...</span>
            {:else if !query.hasNextPage}
                <span class="text-muted-foreground">No more todos</span>
            {/if}
        </div>
	{/if}
</div>
