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

<button on:click={() => dialogElement.showModal()}> Login </button>
<dialog id="login-menu" class="modal">
	<div class="modal-box grid place-items-center py-8 gap-4">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">❌</button>
		</form>

		<h3 class="font-bold text-lg">Log In with one of the following options:</h3>

		<form class="flex flex-col">
			<input
				type="text"
				bind:value={handle}
				placeholder="Type here"
				class="input input-bordered w-full max-w-xs"
			/>
			<input
				type="password"
				bind:value={password}
				placeholder="Type here"
				class="input input-bordered w-full max-w-xs"
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
		<p class="py-1 text-xs">(you can press ESC key or click on ✕ button to close)</p>
	</div>
</dialog>
