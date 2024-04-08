<script lang="ts">
	import '../app.css'
	import NavBar from '$lib/components/NavBar.svelte'
	import { Toaster } from 'svelte-french-toast'
	import type { LayoutServerData } from './$types'
	import { page } from '$app/stores'

	export let data: LayoutServerData

	$: ({ user } = data)
</script>

<svelte:head>
	<title>Linkly</title>
	<meta name="description" content="Short your links with Linkly in just one go." />
</svelte:head>

<Toaster />

{#if $page.url.pathname !== '/create-handle'}
	<NavBar {user} />
{/if}

<div class="min-h-size mt-24 relative">
	<slot />
</div>
