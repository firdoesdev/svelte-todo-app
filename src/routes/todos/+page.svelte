<script lang="ts">
	import { createQuery, keepPreviousData } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import CreateTodoForm from '$lib/components/todo/create-todo-form.svelte';
	import BulkCreateTodoForm from '$lib/components/todo/bulk-create-todo-form.svelte';
	import TodoList from '$lib/components/todo/todo-list.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let { data } = $props();

	// Initialize state from URL params (provided by +page.server.ts)
	let search = $state(data.searchParams.search);
	let status = $state(data.searchParams.status);
	let sort = $state(data.searchParams.sort);
	let page = $state(data.searchParams.page);

	// Debounce search
	let debouncedSearch = $state(data.searchParams.search);
	let timer: ReturnType<typeof setTimeout>;

	function updateUrl() {
		const params = new URLSearchParams();
		if (debouncedSearch) params.set('search', debouncedSearch);
		if (status !== 'all') params.set('status', status);
		if (sort !== 'createdAt') params.set('sort', sort);
		if (page > 1) params.set('page', page.toString());

		const query = params.toString();
		goto(`/todos${query ? `?${query}` : ''}`, { replaceState: true, keepFocus: true, noScroll: true });
	}

	$effect(() => {
		const currentSearch = search; // Read synchronously to track dependency
		clearTimeout(timer);
		timer = setTimeout(() => {
			debouncedSearch = currentSearch;
			page = 1; // Reset page on search
			updateUrl();
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
			updateUrl();
		}
	}

	function handlePrevPage() {
		if (page > 1) {
			page--;
			updateUrl();
		}
	}
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex w-full flex-row justify-between">
		<div class="flex flex-col gap-2">
			<h2 class="text-3xl font-bold tracking-tight">Your Todos</h2>
			<p class="text-muted-foreground">Manage your tasks efficiently.</p>
		</div>
		<div class="flex items-center gap-2">
			<Button href="/todos/create">Create Todo</Button>
			<CreateTodoForm />
			<BulkCreateTodoForm />
		</div>
	</div>

	<div class="flex flex-col gap-4 sm:flex-row">
		<Input placeholder="Search todos..." bind:value={search} class="flex-1" />

		<Select
			type="single"
			bind:value={status}
			onValueChange={(v: string) => {
				status = v;
				page = 1;
				updateUrl();
			}}
		>
			<SelectTrigger class="w-[140px]">
				{status === 'all' ? 'All' : status === 'true' ? 'Completed' : 'Incomplete'}
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				<SelectItem value="true">Completed</SelectItem>
				<SelectItem value="false">Incomplete</SelectItem>
			</SelectContent>
		</Select>

		<Select
			type="single"
			bind:value={sort}
			onValueChange={(v: string) => {
				sort = v;
				page = 1;
				updateUrl();
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
