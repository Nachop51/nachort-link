<script lang="ts">
	import { onMount } from 'svelte'
	import NodeJS from 'node:process'
	import toast from 'svelte-french-toast'
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'

	let formEl: HTMLFormElement

	onMount(() => {
		formEl = document.getElementById('create-handle') as HTMLFormElement
	})

	let timer: NodeJS.Timeout
	let handle = ''
	let isAvailable = false
	let loading = false

	const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/

	$: isValid = handle?.length > 3 && handle?.length < 16 && re.test(handle)
	$: isTouched = handle?.length > 0
	$: isTaken = isValid && !isAvailable && !loading

	function handleChange() {
		isAvailable = false
		clearTimeout(timer)
		loading = true

		if (!isValid) {
			loading = false
			return
		}

		timer = setTimeout(async () => {
			// Check if the username is available
			try {
				const res = await fetch(formEl.action, {
					method: formEl.method,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						handle
					})
				})

				const data = (await res.json()) as { status: number }

				if (data.status === 200) {
					isAvailable = true
				} else {
					toast.error(`Username '${handle}' is not available`)
				}

				if (!res.ok) {
					throw new Error('An error occurred while checking the username')
				}
			} catch (error) {
				toast.error('An error occurred while checking the username')
			}

			loading = false
		}, 500)
	}
</script>

<main class="py-8 px-4 flex flex-col gap-6 items-center">
	<div class="w-fit">
		<h1 class="text-center text-5xl font-semibold">Welcome to Linkly!</h1>
		<div class="divider divider-primary w-full -translate-y-2 mb-0"></div>
	</div>

	<div class="max-w-md">
		<h2 class="text-center text-balance text-neutral-content text-3xl font-extralight mb-6 w-full">
			Let's start by choosing your nickname
		</h2>

		<form
			class="flex flex-col gap-4 mb-6"
			action="/create-handle?/checkAvailability"
			id="create-handle"
			method="post"
			use:enhance={() => {
				loading = true
				return ({ result }) => {
					if (result.type === 'success') {
						toast(
							`Successfully registered your username!
							Welcome to Linkly, ${handle}! We love having you here. 😊

							Let's start by shorten your first link.
							Hope you enjoy your stay! 🎉`,
							{ duration: 10000 }
						)
						goto('/')
					}
				}
			}}
		>
			<input
				type="text"
				name="handle"
				class="input input-primary"
				placeholder="linkler_51"
				bind:value={handle}
				on:input={handleChange}
				class:input-error={isTouched && !isValid}
				class:input-warning={isTaken}
				class:input-success={isAvailable && isValid && !loading}
			/>

			{#if isTouched && !isValid}
				<p class="text-sm text-error">Username must be between 3 and 16 characters</p>
			{/if}

			{#if isTaken}
				<p class="text-sm text-warning">Username @{handle} is already taken</p>
			{/if}

			{#if isAvailable && isValid && !loading}
				<p class="text-sm text-success">
					Username <span class="bold">@{handle}</span> is available
				</p>
			{/if}

			<button
				formaction="/create-handle?/confirmUsername"
				type="submit"
				class="btn btn-primary"
				disabled={isAvailable === false || loading}>Confirm username</button
			>
		</form>
	</div>

	<div class="text-base max-w-lg text-neutral-content/80">
		<p class="mb-2">
			Your username is a unique identifier that will be used to access your links. It can be your
			nickname, a word, or a combination of characters.
		</p>

		<p>
			This username will be used to create your public profile, where you can share your links with
			the world. You can also create private links that only you can access.
		</p>
	</div>
</main>
