<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { signIn } from '@auth/sveltekit/client'
	import KeyIcon from './icons/key.svelte'
	import UserIcon from './icons/user.svelte'

	let err: boolean = false
	let handle: string
	let password: string

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

<form class="flex flex-col items-stretch gap-2">
	<label class="input input-bordered flex items-center gap-2">
		<UserIcon />
		<input type="text" bind:value={handle} class="grow" placeholder="cool_linkly_user" />
	</label>
	<label class="input input-bordered flex items-center gap-2">
		<KeyIcon />
		<input type="password" bind:value={password} placeholder="**********" class="grow" />
	</label>

	<button class="btn btn-accent" on:click={handleSignIn}>Log In</button>
</form>
{#if err}
	<p class="text-error text-bold text-base text-center mt-4">
		Couldn't sign in, invalid credentials.
	</p>
{/if}
