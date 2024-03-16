<script lang="ts">
	import { signIn } from '@auth/sveltekit/client'
	import { invalidateAll } from '$app/navigation'
	import { onMount } from 'svelte'
	import UserIcon from './icons/user.svelte'
	import KeyIcon from './icons/key.svelte'
	import GithubIcon from './icons/github.svelte'
	import GoogleIcon from './icons/google.svelte'

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
	<UserIcon />
	Log In
</button>

<dialog id="login-menu" class="modal">
	<div class="modal-box flex flex-col gap-4">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">✕</button>
		</form>

		<div class="max-w-sm w-full mx-auto">
			<h2 class="font-bold text-3xl text-accent mb-2">Log In</h2>

			<h3 class="text-xl mb-3">
				Don't have an account? <button class="link link-accent">Sign Up</button>
			</h3>

			<form class="flex flex-col items-stretch gap-2">
				<label class="input input-bordered flex items-center gap-2">
					<UserIcon />
					<input type="text" bind:value={handle} class="grow" placeholder="cool_shortener_user" />
				</label>
				<label class="input input-bordered flex items-center gap-2">
					<KeyIcon />
					<input type="password" bind:value={password} placeholder="**********" class="grow" />
				</label>

				<button class="btn btn-accent" on:click={handleSignIn}>Log In</button>
			</form>
			{#if err}
				<p class="text-error">Couldn't sign in, invalid credentials.</p>
			{/if}

			<div class="divider my-8 text-base">Or continue with</div>

			<div class="text [&>button]:mb-2">
				<button class="btn btn-primary text-base w-full" on:click={() => signIn('google')}>
					<GoogleIcon /> Google
				</button>
				<button class="btn btn-primary text-base w-full" on:click={() => signIn('github')}>
					<GithubIcon /> GitHub
				</button>
			</div>

			<p class="py-1 text-sm text-center mt-4">
				(you can press <kbd class="kbd kbd-xs">esc</kbd> key or click on
				<kbd class="kbd kbd-xs">✕</kbd> button to close)
			</p>
		</div>
	</div>
</dialog>
