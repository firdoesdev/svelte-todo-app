<script lang="ts">
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import CreateTodoForm from '$lib/components/todo/create-todo-form.svelte';
	import TodoList from '$lib/components/todo/todo-list.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let search = $state('');
	let status = $state('all');
	let sort = $state('createdAt');
	let page = $state(1);

	// Debounce search
	let debouncedSearch = $state('');
	let timer: ReturnType<typeof setTimeout>;

	$effect(() => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			debouncedSearch = search;
			page = 1; // Reset page on search
		}, 500);
	});

	const query = createQuery(() => ({
		queryKey: ['todos', debouncedSearch, status, sort, page],
		queryFn: async () => {
			const params = new URLSearchParams({
				search: debouncedSearch,
				status,
				sort,
				page: page.toString(),
				limit: '5'
			});
			const res = await fetch(`/api/todos?${params.toString()}`);
			if (!res.ok) throw new Error('Failed to fetch todos');
			return res.json();
		},
		placeholderData: keepPreviousData
	}));

	function handleNextPage() {
		if (query.data?.meta.page < query.data?.meta.totalPages) {
			page++;
		}
	}

	function handlePrevPage() {
		if (page > 1) {
			page--;
		}
	}
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex w-full flex-row justify-between">
		<div class="flex flex-col gap-2">
			<h2 class="text-3xl font-bold tracking-tight">Your Todos</h2>
			<p class="text-muted-foreground">Manage your tasks efficiently.</p>
		</div>
		<CreateTodoForm />
	</div>

	<div class="flex flex-col gap-4 sm:flex-row">
		<Input placeholder="Search todos..." bind:value={search} class="flex-1" />

		<Select
			type="single"
			bind:value={status}
			onValueChange={(v: string) => {
				status = v;
				page = 1;
			}}
		>
			<SelectTrigger class="w-[140px]">
				{status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Completed'}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				<SelectItem value="active">Active</SelectItem>
				<SelectItem value="completed">Completed</SelectItem>
			</SelectContent>
		</Select>

		<Select
			type="single"
			bind:value={sort}
			onValueChange={(v: string) => {
				sort = v;
				page = 1;
			}}
		>
			<SelectTrigger class="w-[140px]">
				{sort === 'createdAt' ? 'Created Date' : 'Title'}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="createdAt">Created Date</SelectItem>
				<SelectItem value="title">Title</SelectItem>
			</SelectContent>
		</Select>
	</div>

	{#if query.isLoading}
		<p>Loading todos...</p>
	{:else if query.isError}
		<p class="text-destructive">Error: {query.error.message}</p>
	{:else if query.data}
		<TodoList todos={query.data.data} />

		<div class="mt-4 flex items-center justify-between">
			<p class="text-sm text-muted-foreground">
				Page {query.data.meta.page} of {query.data.meta.totalPages || 1}
			</p>
			<div class="flex gap-2">
				<Button variant="outline" size="icon" onclick={handlePrevPage} disabled={page === 1}>
					<ChevronLeft class="h-4 w-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onclick={handleNextPage}
					disabled={!(query.data.meta.page < query.data.meta.totalPages)}
				>
					<ChevronRight class="h-4 w-4" />
				</Button>
			</div>
		</div>
	{/if}
</div>
