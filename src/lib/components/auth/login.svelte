<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { signIn } from '@auth/sveltekit/client'
	import KeyIcon from '$lib/components/icons/key.svelte'
	import UserIcon from '$lib/components/icons/user.svelte'
	import { DATA_SERVER_NAMES } from '$lib/constants'
	import { onMount } from 'svelte'
	import { page } from '$app/stores'
	import { validateEmail, validateHandle } from '$lib/schemas/user'

	let err = {
		password: false,
		handle: false,
		message: ''
	}
	let handle = ''
	let password = ''

	const handleSignIn = async () => {
		const validHandle = validateHandle({ handle }).success
		const validEmail = validateEmail({ email: handle }).success

		err = {
			handle: (validHandle || validEmail) === false,
			password: password.length < 8,
			message: ''
		}

		if (err.handle || err.password) {
			err = {
				...err,
				message: 'Please enter valid credentials'
			}
			return
		}

		const res = await signIn('credentials', { handle, password, redirect: false })

		if (res == null) {
			err = {
				...err,
				message: 'An error occurred while signing in'
			}
			return
		}

		const { url } = (await res.json()) as { url: string }

		console.log({ url })

		const params = new URLSearchParams(url.split('?')[1])

		if (params.has('error')) {
			err = {
				handle: false,
				password: false,
				message: 'Invalid credentials'
			}
			return
		}

		invalidate(DATA_SERVER_NAMES.USER)
		goto('/')
	}

	onMount(() => {
		if ($page.url.searchParams.has('error')) {
			const error = $page.url.searchParams.get('error') as string

			const message =
				error === 'OAuthAccountNotLinked'
					? 'This account might be already linked to another provider'
					: 'Invalid credentials'

			err = {
				...err,
				message
			}
		}
	})
</script>

<form class="flex flex-col items-stretch gap-2 w-full">
	<label
		class="input input-primary input-bordered flex items-center gap-2"
		class:input-error={err.handle === true}
	>
		<UserIcon />
		<input type="text" bind:value={handle} class="grow" placeholder="cool_linkly_user" />
	</label>
	<label
		class="input input-primary input-bordered flex items-center gap-2"
		class:input-error={err.password === true}
	>
		<KeyIcon />
		<input type="password" bind:value={password} placeholder="**********" class="grow" />
	</label>

	{#if err.message !== ''}
		<p class="text-error text-bold text-base text-center mb-2 bg-error/20 p-2 rounded-lg w-full">
			{err.message}
		</p>
	{/if}

	<button class="btn btn-secondary" on:click={handleSignIn}>Log In</button>
</form>
