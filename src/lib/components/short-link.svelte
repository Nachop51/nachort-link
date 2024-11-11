<script lang="ts">
	import { isValidHttpUrl, isValidShortLink } from '$lib/utils/links'
	import { copyWithToast } from '$lib/utils/toast'
	import toast from 'svelte-french-toast'
	import type { User } from '@auth/sveltekit'
	import CopyIcon from './icons/copy.svelte'
	import { page } from '$app/stores'
	import { createShortlink } from '$lib/services/api'
	import { TOAST_DURATIONS } from '$lib/constants'
	import DisplayText from './ui/display-text.svelte'

	export let user: User | null = null

	let isCreatingCustom = false
	let customShortlink = ''
	let link = ''
	let isPublic = true

	let shortenedLink: string
	let isLoading = false
	let formError: { link?: boolean; custom?: boolean; message: string } | null = null

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

		if (user == null) {
			isPublic = true
		}

		try {
			const short = await createShortlink({
				link,
				isPublic,
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

			toast.error(formError.message, { duration: TOAST_DURATIONS.NORMAL })
		}

		isLoading = false

		if (formError) {
			return
		}

		if (isCreatingCustom) {
			customShortlink = ''
		}
		link = ''
		toast.success('Link shortened!', { duration: TOAST_DURATIONS.SHORT })
	}

	export const updateLink = (newLink: string) => (link = newLink)

	export const setIsCreatingCustom = () => (isCreatingCustom = !isCreatingCustom)
</script>

<form class="max-w-[300px] mx-auto" on:submit|preventDefault={handleSubmit}>
	<label class="form-control w-full">
		<div class="label">
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

<DisplayText success={formError == null && shortenedLink != null} error={formError != null}>
	{#if formError != null}
		{formError.message}
	{:else if shortenedLink != null}
		Your link has been shortened!
	{:else}
		Insert a link and then click on "Shorten"
	{/if}
</DisplayText>

{#if isLoading}
	<div class="mt-4">
		<span class="loading size-8 mx-auto"></span>
	</div>
{/if}

{#if !isLoading && formError == null && shortenedLink != null}
	<div class="divider"></div>

	<div class="mx-auto" data-sveltekit-preload-data="off">
		<p class="text-lg font-semibold">Try it now!</p>
		<div class="my-4 py-2 px-4 border border-neutral rounded-xl">
			<a
				class="link link-secondary text-xl max-w-[300px] w-full"
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
