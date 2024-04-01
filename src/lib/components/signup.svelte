<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import { signIn } from '@auth/sveltekit/client'
	import KeyIcon from './icons/key.svelte'
	import UserIcon from './icons/user.svelte'
	import { applyAction, enhance } from '$app/forms'
	import { error } from '@sveltejs/kit'
	import toast from 'svelte-french-toast'

	let handle: string
	let password: string

	async function signInTheApp({ handle, password }: { handle: string; password: string }) {
		const res = await signIn('credentials', {
			handle,
			password,
			redirect: false
		})

		if (res == null) {
			throw error(500, 'Something went wrong, please try again later.')
		}

		const { url } = (await res.json()) as { url: string }

		const params = new URLSearchParams(url.split('?')[1])

		if (params.has('error')) {
			throw error(500, 'Something went wrong, please try again later.')
		} else {
			invalidateAll()
		}
	}
</script>

<form
	action="?/registerUser"
	method="post"
	class="flex flex-col items-stretch gap-2"
	use:enhance={() => {
		return async ({ result }) => {
			console.log(result)

			if (result.type === 'failure') {
				console.log(result.data)

				const errorMsg = result.data?.error ?? 'Something went wrong.'

				// @ts-expect-error errorMsg is a string
				toast.error(errorMsg, {
					duration: 10000
				})
			}
			if (result.type === 'success') {
				await applyAction(result)

				console.log(result.data)

				await signInTheApp({
					handle: result.data?.email,
					password: result.data?.password
				})
			}
		}
	}}
>
	<label class="input input-bordered flex items-center gap-2">
		<UserIcon />
		<input
			type="email"
			bind:value={handle}
			class="grow"
			name="email"
			placeholder="user@linkly.com"
		/>
	</label>
	<label class="input input-bordered flex items-center gap-2">
		<KeyIcon />
		<input
			type="password"
			bind:value={password}
			placeholder="**********"
			class="grow"
			name="password"
		/>
	</label>

	<button class="btn btn-accent">Sign Up</button>
</form>
