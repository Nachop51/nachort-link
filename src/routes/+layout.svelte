<script lang="ts">
	import '../app.css'
	import { Toaster } from 'svelte-french-toast'
	import { page } from '$app/stores'
	import type { LayoutData } from './$types'
	import Navbar from '$lib/components/navbar.svelte'
	// import Debugger from '$lib/components/debugger.svelte'

	export let data: LayoutData

	$: ({ user } = data)
</script>

<svelte:head>
	<title>Linkly</title>
	<meta name="description" content="Short your links with Linkly in just one go." />
</svelte:head>

<Toaster />

{#if $page.url.pathname !== '/create-handle'}
	<Navbar {user} />
{/if}

{#if $page.url.pathname !== '/login'}
	<div class="min-h-size relative">
		<slot />
	</div>
{:else}
	<slot />
{/if}

<!-- <div class="fixed bottom-0 right-0 p-2 bg-accent text-neutral text-xs">
	<Debugger />
</div> -->
