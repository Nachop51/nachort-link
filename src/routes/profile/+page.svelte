<script lang="ts">
	import { page } from '$app/stores'
</script>

<svelte:head>
	<title>{$page.data.session?.user?.name}'s - profile</title>
</svelte:head>

<img
	src={$page.data.session?.user?.image}
	width="200"
	height="200"
	alt={`${$page.data.session?.user?.name} github avatar`}
	class="border-4 border-white rounded-full"
/>

<h1>{$page.data.session?.user?.name}</h1>
