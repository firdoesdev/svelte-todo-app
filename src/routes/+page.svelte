<script lang="ts">
	import { Button } from "$lib/components/ui/button";
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
	<h1 class="text-4xl font-bold mb-4">Todo App</h1>
	<p class="text-muted-foreground mb-8">A simple todo app built with Svelte 5 and Drizzle.</p>
	<div class="flex gap-4">
		<Button href="/login">Login</Button>
		<Button href="/register" variant="outline">Register</Button>
	</div>
</div>
