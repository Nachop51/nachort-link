<script lang="ts">
	import { isValidHttpUrl, isValidShortLink } from '$lib/utils/links'
	import { copyWithToast } from '$lib/utils/toast'
	import toast from 'svelte-french-toast'
	import type { User } from '@auth/sveltekit'
	import CopyIcon from './icons/copy.svelte'
	import { page } from '$app/stores'
	import { createShortlink } from '$lib/services/api'
	import { TOAST_DURATIONS } from '$lib/constants'

	export let user: User | null = null

	let customShortlink = ''
	let link = ''
	let isPublic = true
	let isCreatingCustom = false

	let shortenedLink: string
	let isLoading = false
	let formError: { link?: boolean; custom?: boolean; message: string } | null = null

	$: success = shortenedLink != null

	function checkErrors() {
		const errors: Record<string, boolean> = {}

		if (!isValidHttpUrl(link)) {
			errors.link = true
		}

		if (isCreatingCustom === true && !isValidShortLink(customShortlink)) {
			errors.custom = true
		}

		if (Object.keys(errors).length === 0) {
			return null
		}

		return {
			...errors,
			message: 'Please check the fields and try again.'
		} as typeof formError
	}

	async function handleSubmit() {
		if (isLoading) return

		isLoading = true
		formError = checkErrors()

		if (formError != null) {
			isLoading = false
			toast.error(formError.message, { duration: TOAST_DURATIONS.NORMAL })
			return
		}

		try {
			const short = await createShortlink({
				link,
				isPublic: user == null ? true : isPublic,
				custom: isCreatingCustom,
				customShortlink
			})

			const appendCustom = isCreatingCustom ? `/${user?.handle}` : ''
			shortenedLink = `${$page.url.origin}${appendCustom}/${short}`
		} catch (error) {
			let message = 'An error occurred while shortening the link. Please try again later.'

			if (error instanceof Error) {
				message = error.message
			}

			formError = {
				message
			}
		}

		isLoading = false

		if (formError) {
			toast.error(formError.message, { duration: TOAST_DURATIONS.NORMAL })
			return
		}

		customShortlink = ''
		link = ''

		toast.success('Link shortened!', { duration: TOAST_DURATIONS.SHORT })
	}

	export const updateLink = (newLink: string) => (link = newLink)

	const setIsCreatingCustom = (
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement
		}
	) => {
		if (e.currentTarget.dataset.custom === 'true') {
			isCreatingCustom = true
		} else {
			isCreatingCustom = false
		}
	}
</script>

<div class="wrapper">
	{#if user != null}
		<div class="tabs">
			<button
				class="btn btn-sm flex-1"
				data-custom={false}
				class:btn-ghost={isCreatingCustom}
				class:btn-primary={!isCreatingCustom}
				on:click={setIsCreatingCustom}>Normal</button
			>
			<button
				class="btn btn-sm btn-ghost flex-1"
				data-custom={true}
				class:btn-ghost={!isCreatingCustom}
				class:btn-primary={isCreatingCustom}
				on:click={setIsCreatingCustom}>Custom</button
			>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		<label class="form-control w-full">
			<div class="label pt-0">
				<span class="label-text font-semibold">Insert a link</span>
			</div>
			<input
				class="input input-bordered"
				type="url"
				name="link"
				bind:value={link}
				class:input-error={formError?.link === true}
				placeholder="https://example.com"
			/>
		</label>
		{#if user != null}
			{#if isCreatingCustom}
				<label class="form-control w-full mt-2">
					<div class="label">
						<span class="label-text font-semibold">Custom slug</span>
					</div>
					<input
						class="input input-bordered"
						type="text"
						bind:value={customShortlink}
						class:input-error={formError?.custom === true}
						minlength="2"
						maxlength="10"
						name="customSlug"
						placeholder="custom-slug"
					/>
				</label>
			{/if}

			<label class="label cursor-pointer pb-0">
				<span class="label-text">Public link?</span>
				<input
					type="checkbox"
					class="checkbox checkbox-accent"
					name="isPublic"
					bind:checked={isPublic}
				/>
			</label>
		{/if}
		<button class="btn btn-accent text-accent-content w-full mt-2" type="submit">Shorten</button>
	</form>

	<p
		class="mt-4 text-sm font-semibold"
		class:text-neutral-500={!success && !formError}
		class:text-error={formError != null}
		class:text-success={formError == null && success}
	>
		{#if formError != null}
			{formError.message}
		{:else if success}
			Your link has been shortened!
		{:else}
			Insert a link and then click on "Shorten"
		{/if}
	</p>

	{#if isLoading}
		<div class="mt-4">
			<span class="loading size-8 mx-auto"></span>
		</div>
	{/if}

	{#if !isLoading && formError == null && success}
		<div class="divider"></div>

		<div class="mx-auto">
			<p class="text-lg font-semibold">Try it now!</p>
			<div class="my-4 py-2 px-4 border border-accent/40 rounded-xl">
				<a
					data-sveltekit-preload-data="off"
					class="link link-secondary text-xl w-full break-all whitespace-pre-wrap"
					href={shortenedLink}
					target="_blank"
					rel="noopener noreferrer">{shortenedLink}</a
				>
			</div>
			<button
				class="btn btn-accent btn-sm mx-auto text-base-100 flex items-center"
				on:click={() => copyWithToast({ text: shortenedLink })}
			>
				Copy link
				<CopyIcon />
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	.wrapper {
		@apply bg-base-100/50 px-8 py-6 text-center rounded-xl border border-accent/70 w-full;
	}

	.tabs {
		@apply w-full bg-base-200 flex flex-nowrap rounded-lg mb-4;
	}
</style>
