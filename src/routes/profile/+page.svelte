<script lang="ts">
	import { RANDOM_AVATAR_URL } from '$lib/constants'
	import type { PageServerData } from '../$types'

	export let data: PageServerData

	const { user } = data
</script>

<svelte:head>
	<title>{data.user?.handle}'s - profile</title>
</svelte:head>

<main class="px-4 py-8 flex flex-col items-center">
	<img
		src={user?.image ?? `${RANDOM_AVATAR_URL}${user?.handle}.svg`}
		width="200"
		height="200"
		alt={`${user?.handle} avatar`}
		class="border-4 border-white rounded-full"
	/>

	<h1 class="text-4xl font-bold mt-4">@{user?.handle}</h1>
</main>
