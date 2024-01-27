<script lang="ts">
	import { page } from '$app/stores'
</script>

<h1 class="text-4xl font-bold mb-8">{$page.status}: {$page.error?.message}</h1>
<a class="text-base btn link link-primary" href="/">&larr; Go back home</a>
