<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/components/ui/card";
	import { authClient } from "$lib/auth-client";
	import { goto } from "$app/navigation";

	let name = $state("");
	let email = $state("");
	let password = $state("");
	let loading = $state(false);

	async function handleSignUp() {
		loading = true;
		await authClient.signUp.email({
			email,
			password,
			name,
			fetchOptions: {
				onSuccess: () => {
					loading = false;
                    goto("/dashboard");
				},
				onError: (ctx) => {
					loading = false;
					alert(ctx.error.message);
				}
			}
		});
	}

	async function handleSocialSignIn(provider: "github" | "google") {
		await authClient.signIn.social({
			provider
		});
	}
</script>

<div class="flex items-center justify-center min-h-screen bg-background">
	<Card class="w-full max-w-md">
		<CardHeader>
			<CardTitle>Register</CardTitle>
			<CardDescription>Create an account to get started</CardDescription>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input id="name" type="text" placeholder="John Doe" bind:value={name} />
			</div>
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input id="email" type="email" placeholder="m@example.com" bind:value={email} />
			</div>
			<div class="space-y-2">
				<Label for="password">Password</Label>
				<Input id="password" type="password" bind:value={password} />
			</div>
			<Button class="w-full" onclick={handleSignUp} disabled={loading}>
				{loading ? "Loading..." : "Sign up"}
			</Button>
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<Button variant="outline" onclick={() => handleSocialSignIn("github")}>GitHub</Button>
				<Button variant="outline" onclick={() => handleSocialSignIn("google")}>Google</Button>
			</div>
		</CardContent>
		<CardFooter class="flex justify-center">
			<p class="text-sm text-muted-foreground">
				Already have an account? <a href="/login" class="underline hover:text-primary">Login</a>
			</p>
		</CardFooter>
	</Card>
</div>
