<script lang="ts">
    import { page } from "$app/stores";
</script>

<div class="flex flex-col gap-4">
    <h2 class="text-xl font-bold">Welcome back, {$page.data.user?.name}</h2>
    <p class="text-muted-foreground">This is your dashboard overview.</p>
</div>
