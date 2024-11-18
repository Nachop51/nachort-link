<script lang="ts">
	import UserProfile from '$lib/components/pages/user-profile.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const { user } = data
</script>

<svelte:head>
	<title>{user.handle}'s - profile</title>
</svelte:head>

<UserProfile {user} />
