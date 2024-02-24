<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'
	import { invalidateAll } from '$app/navigation'
	import { onMount } from 'svelte'

	let err = false
	let handle: string
	let password: string
	let dialogElement: HTMLDialogElement

	onMount(() => {
		dialogElement = document.getElementById('login-menu') as HTMLDialogElement
	})

	const handleSignIn = async () => {
		const res = await signIn('credentials', { handle, password, redirect: false })

		if (res == null) {
			err = true
			return
		}

		const { url } = (await res.json()) as { url: string }

		const params = new URLSearchParams(url.split('?')[1])

		if (params.has('error')) {
			err = true
		} else {
			invalidateAll()
		}
	}
</script>

<button class="btn btn-ghost text-lg" on:click={() => dialogElement.showModal()}>
	<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
		><circle cx="12" cy="6" r="4" fill="currentColor" /><path
			fill="currentColor"
			d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
		/></svg
	>
	Login
</button>
<dialog id="login-menu" class="modal">
	<div class="modal-box grid place-items-center py-8 gap-4">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>

		<h3 class="font-bold text-xl">Log In with one of the following options:</h3>

		<form class="flex flex-col max-w-xs items-stretch">
			<input
				type="text"
				bind:value={handle}
				placeholder="cool_shortener_user"
				class="input input-bordered"
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="**********"
				class="input input-bordered"
			/>
			<button class="btn btn-accent" on:click={handleSignIn}>Log in</button>
		</form>
		{#if err}
			<p class="text-red-500">Couldn't sign in, invalid credentials.</p>
		{/if}

		<p>Or sign in with:</p>

		<button class="btn btn-primary" on:click={() => signIn('github')}>
			Sign In using GitHub
		</button>

		<p class="py-1 text-sm">
			(you can press <kbd class="kbd kbd-xs">esc</kbd> key or click on
			<kbd class="kbd kbd-xs">✕</kbd> button to close)
		</p>
	</div>
</dialog>
