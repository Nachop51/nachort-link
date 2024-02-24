<script lang="ts">
	import { page } from '$app/stores'
	import { RANDOM_AVATAR_URL } from '$lib/constants'

	const user = $page.data.session?.user
	const name = user?.name ?? 'User'

	const image = user?.image ?? `${RANDOM_AVATAR_URL}${name}.svg`
</script>

<svelte:head>
	<title>{name}'s - profile</title>
</svelte:head>

<img
	src={image}
	width="200"
	height="200"
	alt={`${name} avatar`}
	class="border-4 border-white rounded-full"
/>

<h1>{name}</h1>
