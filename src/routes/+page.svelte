<script lang="ts">
	import { isValidHttpUrl } from '$lib/links'
	import { page } from '$app/stores'
	import { createShortlink } from '$lib/services/create_shortlink'
	import LinkIcon from '$lib/components/icons/link.svelte'
	import CopyIcon from '$lib/components/icons/copy.svelte'

	let link = ''
	let shortenedLink: string | null = null
	let loading = false
	let error: string | null = null

	const handleSubmit = async () => {
		loading = true
		error = null

		if (!isValidHttpUrl(link)) {
			error = 'Invalid URL'
			loading = false
			return
		}

		try {
			shortenedLink = await createShortlink(link)
			shortenedLink = $page.url.href + shortenedLink
		} catch (e) {
			error = 'An error occurred while shortening the link. Please try again later.'
		}

		loading = false
		link = ''
	}
</script>

<main class="min-h-size sm:-mt-6 md:-mt-12 flex items-center flex-col justify-center px-8">
	<section class="bg-base-100/50 px-8 py-6 text-center rounded-xl border border-neutral/70">
		<header class="mb-4">
			<h1 class="text-4xl font-bold text-accent">Shorten your link!</h1>
		</header>

		<form class="max-w-[300px] mx-auto" on:submit|preventDefault={handleSubmit}>
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Insert a link</span>
				</div>
				<input
					class="input input-bordered mb-2"
					type="url"
					bind:value={link}
					class:input-error={error !== null}
					placeholder="https://example.com"
				/>
			</label>
			<button class="btn btn-accent text-accent-content w-full" type="submit">Shorten</button>
		</form>

		<p
			class="mt-4 text-sm font-semibold text-neutral-500"
			class:error={error !== null}
			class:succeed={!error && shortenedLink !== null}
		>
			{#if error != null}
				{error}
			{:else if shortenedLink !== null}
				Your link has been shortened!
			{:else}
				Insert a link and then click on "Shorten"
			{/if}
		</p>

		{#if loading}
			<div class="mt-4">
				<span class="loading size-8 mx-auto"></span>
			</div>
		{/if}

		{#if !loading && error === null && shortenedLink !== null}
			<div class="divider"></div>

			<div class="mx-auto" data-sveltekit-preload-data="off">
				<p class="text-lg font-semibold">Try it now!</p>
				<p class="my-4 py-2 px-4 border border-neutral rounded-xl">
					<a
						class="link link-secondary text-xl max-w-[300px] w-full"
						href={shortenedLink}
						target="_blank"
						rel="noopener noreferrer">{shortenedLink}</a
					>
				</p>
				<button
					class="btn btn-accent btn-sm mx-auto text-base-100 flex items-center"
					on:click={() => navigator.clipboard.writeText(`${shortenedLink}`)}
				>
					Copy link
					<CopyIcon />
				</button>
			</div>
		{/if}
	</section>

	<section class="mt-8 text-center">
		<header>
			<h2 class="text-lg">Or try to shorten one of the links below:</h2>
		</header>

		<div class="mt-4 flex gap-4 flex-wrap justify-center">
			<button
				class="btn btn-primary text-primary-content"
				on:click={() => (link = 'https://svelte.dev')}
			>
				https://svelte.dev
				<LinkIcon />
			</button>
			<button
				class="btn btn-primary text-primary-content"
				on:click={() => (link = 'https://tailwindcss.com')}
			>
				https://tailwindcss.com
				<LinkIcon />
			</button>
			<button
				class="btn btn-primary text-primary-content"
				on:click={() => (link = 'https://vitejs.dev')}
			>
				https://vitejs.dev
				<LinkIcon />
			</button>
		</div>
	</section>
</main>

<style>
	.succeed {
		@apply text-success;
	}

	.error {
		@apply text-error;
	}
</style>
