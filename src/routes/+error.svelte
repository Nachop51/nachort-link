<script lang="ts">
	import { page } from '$app/stores'
</script>

<div class="grid place-items-center min-h-[calc(100vh-132px)]">
	<div class="text-center">
		<h1 class="text-4xl font-bold mb-8">{$page.status}: {$page.error?.message}</h1>
		<a class="text-base btn link link-primary" href="/">&larr; Go back home</a>
	</div>
</div>
