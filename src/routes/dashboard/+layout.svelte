<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import Zap from 'lucide-svelte/icons/zap';

	let { children } = $props();

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/login');
				}
			}
		});
	}
</script>

<div class="flex h-screen w-full bg-muted/40">
	<aside class="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
		<div class="border-b p-4">
			<a href="/" class="flex items-center gap-2 font-semibold">
				<Zap class="h-6 w-6" />
				<span>Todo App</span>
			</a>
		</div>
		<div class="flex-1 overflow-auto py-2">
			<nav class="grid items-start px-4 text-sm font-medium">
				<a
					href="/dashboard"
					class="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
				>
					Dashboard
				</a>
				<a
					href="/dashboard/todos"
					class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
				>
					Todos
				</a>
			</nav>
		</div>
		<div class="mt-auto border-t p-4">
			<Button variant="outline" class="w-full" onclick={handleSignOut}>Sign Out</Button>
		</div>
	</aside>
	<div class="flex w-full flex-col sm:gap-4 sm:pl-64">
		<header
			class="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"
		>
			<h1 class="text-lg font-semibold md:text-2xl">Dashboard</h1>
			<div class="ml-auto flex items-center gap-2">
				<!-- User Menu or other header items -->
			</div>
		</header>
		<main class="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			{@render children()}
		</main>
	</div>
</div>
