<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { signIn } from '@auth/sveltekit/client'
	import KeyIcon from '$lib/components/icons/key.svelte'
	import UserIcon from '$lib/components/icons/user.svelte'
	import { applyAction, enhance } from '$app/forms'
	import { error } from '@sveltejs/kit'
	import toast from 'svelte-french-toast'
	import { DATA_SERVER_NAMES, TOAST_DURATIONS } from '$lib/constants'

	let handle: string = ''
	let password: string = ''
	let loading = false

	async function signInTheApp({ handle, password }: { handle: string; password: string }) {
		const res = await signIn('credentials', {
			handle,
			password,
			redirect: false
		})

		if (res == null) {
			throw error(500, 'Something went wrong, please try again later.')
		}

		const data = (await res.json()) as { url: string }

		if (data.url == null) {
			throw error(500, 'Something went wrong, please try again later.')
		}

		const params = new URLSearchParams(data.url.split('?')[1])

		if (params.has('error')) {
			throw error(500, 'Something went wrong, please try again later.')
		} else {
			invalidate(DATA_SERVER_NAMES.USER)
		}
	}
</script>

<form
	action="/login?/registerUser"
	method="post"
	class="flex flex-col items-stretch gap-2 w-full"
	use:enhance={() => {
		if (loading === true) {
			return
		}

		loading = true

		return async ({ result }) => {
			if (result.type === 'failure') {
				const errorMsg = result.data?.error ?? 'Something went wrong.'

				// @ts-expect-error errorMsg is a string
				toast.error(errorMsg, {
					duration: TOAST_DURATIONS.LONG
				})
				loading = false
			}
			if (result.type === 'success') {
				await applyAction(result)

				if (typeof result.data?.email === 'string' && typeof result.data?.password === 'string') {
					await signInTheApp({
						handle: result.data?.email,
						password: result.data?.password
					})

					goto('/create-handle')
				}
			}
		}
	}}
>
	<label class="input input-primary input-bordered flex items-center gap-2">
		<UserIcon />
		<input
			type="email"
			bind:value={handle}
			class="grow"
			name="email"
			placeholder="user@linkly.com"
		/>
	</label>
	<label class="input input-primary input-bordered flex items-center gap-2">
		<KeyIcon />
		<input
			type="password"
			bind:value={password}
			placeholder="**********"
			class="grow"
			name="password"
		/>
	</label>

	<button class="btn btn-secondary" disabled={loading === true}>Sign Up</button>
</form>
