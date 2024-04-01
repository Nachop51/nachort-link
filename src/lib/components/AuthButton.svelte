<script lang="ts">
	import { onMount } from 'svelte'
	import UserIcon from './icons/user.svelte'
	import CrossIcon from './icons/cross.svelte'
	import GithubIcon from './icons/github.svelte'
	import GoogleIcon from './icons/google.svelte'

	import Login from './login.svelte'
	import Signup from './signup.svelte'
	import { SIGN_MODE } from '$lib/types.d'
	import { signIn } from '@auth/sveltekit/client'

	let dialogElement: HTMLDialogElement
	let mode = SIGN_MODE.SIGN_IN

	onMount(() => {
		dialogElement = document.getElementById('login-menu') as HTMLDialogElement
	})
</script>

<button class="btn btn-ghost text-lg" on:click={() => dialogElement.showModal()}>
	<UserIcon />
	Log In
</button>

<dialog id="login-menu" class="modal">
	<div class="modal-box flex flex-col gap-4">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
				<CrossIcon className="size-5" />
			</button>
		</form>

		<div class="max-w-sm w-full mx-auto">
			<h2 class="font-bold text-3xl text-accent mb-2">
				{#if mode === SIGN_MODE.SIGN_IN}
					Log In
				{:else}
					Sign Up
				{/if}
			</h2>

			<h3 class="text-xl mb-3">
				{#if mode === SIGN_MODE.SIGN_IN}
					Don't have an account? <button
						class="link link-accent"
						on:click={() => (mode = SIGN_MODE.SIGN_UP)}>Sign Up</button
					>
				{:else}
					Already have an account? <button
						class="link link-accent"
						on:click={() => (mode = SIGN_MODE.SIGN_IN)}>Log In</button
					>
				{/if}
			</h3>

			{#if mode === SIGN_MODE.SIGN_IN}
				<Login />
			{:else}
				<Signup />
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
				<kbd class="kbd kbd-xs">X</kbd> button to close)
			</p>
		</div>
	</div>
</dialog>
