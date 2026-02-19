<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';

	let session = authClient.useSession();
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
	<h1 class="mb-4 text-4xl font-bold">Todo App</h1>
	<p class="mb-8 text-muted-foreground">A simple todo app built with Svelte 5 and Drizzle.</p>
	{#if $session.data}
		<Button href="/dashboard">Dashboard</Button>
	{:else}
		<div class="flex gap-4">
			<Button href="/login">Login</Button>
			<Button href="/register" variant="outline">Register</Button>
		</div>
	{/if}
</div>
