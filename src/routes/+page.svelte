<script lang="ts">
	import { isValidHttpUrl } from '$lib/links'
	import type { LinkType } from '$lib/types'
	import { page } from '$app/stores'

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
			const res = await fetch(`/api/shorten/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ link })
			})

			if (res.ok) {
				const data = (await res.json()) as LinkType

				shortenedLink = data.shortLink
			}
		} catch (e) {
			if (!(e instanceof Error)) {
				throw new Error('Failed to create link, please try again later.')
			}

			error = e.message
		}

		loading = false
		link = ''
	}
</script>

<main class="flex items-center flex-col justify-center min-h-[calc(100vh-132px)]">
	<section class="bg-base-200 p-8 text-center rounded-lg">
		<header class="mb-4">
			<h1 class="text-4xl font-bold text-primary">Shorten your link!</h1>
		</header>

		<form on:submit|preventDefault={handleSubmit}>
			<p class={'text-error ' + (error !== null ? 'visible' : 'invisible')}>
				{error}
			</p>
			<input
				class="input input-bordered w-full max-w-xs mb-4"
				type="url"
				bind:value={link}
				class:input-error={error !== null}
				placeholder="https://example.com"
			/>
			<button class="btn bg-base-300 mx-auto" type="submit">Shorten</button>
		</form>
		{#if loading}
			<div class="">
				<span class="loading size-8 mx-auto mt-4"></span>
			</div>
		{/if}
		{#if !loading && error === null && shortenedLink !== null}
			<div class="mt-4" data-sveltekit-preload-data="off">
				<p class="text-success">Your link has been shortened!</p>
				<a class="link link-primary text-lg" href={shortenedLink}
					>Go to &rarr; {`/${shortenedLink}`}</a
				>
				<button
					class="mt-4 btn btn-md text-md btn-accent text-base-100 mx-auto flex items-center"
					on:click={() => navigator.clipboard.writeText(`${$page.url.href}${shortenedLink}` ?? '')}
				>
					Copy link
					<svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24"
						><path
							fill="currentColor"
							fill-rule="evenodd"
							d="M15 1.25h-4.056c-1.838 0-3.294 0-4.433.153c-1.172.158-2.121.49-2.87 1.238c-.748.749-1.08 1.698-1.238 2.87c-.153 1.14-.153 2.595-.153 4.433V16a3.751 3.751 0 0 0 3.166 3.705c.137.764.402 1.416.932 1.947c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h3.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982c.602-.602.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337v-5.11c0-1.367 0-2.47-.116-3.337c-.122-.9-.38-1.658-.982-2.26c-.531-.53-1.183-.795-1.947-.932A3.751 3.751 0 0 0 15 1.25m2.13 3.021A2.25 2.25 0 0 0 15 2.75h-4c-1.907 0-3.261.002-4.29.14c-1.005.135-1.585.389-2.008.812c-.423.423-.677 1.003-.812 2.009c-.138 1.028-.14 2.382-.14 4.289v6a2.25 2.25 0 0 0 1.521 2.13c-.021-.61-.021-1.3-.021-2.075v-5.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.602-.602 1.36-.86 2.26-.981c.867-.117 1.97-.117 3.337-.117h3.11c.775 0 1.464 0 2.074.021M7.408 6.41c.277-.277.665-.457 1.4-.556c.754-.101 1.756-.103 3.191-.103h3c1.435 0 2.436.002 3.192.103c.734.099 1.122.28 1.399.556c.277.277.457.665.556 1.4c.101.754.103 1.756.103 3.191v5c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103h-3c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191v-5c0-1.435.002-2.437.103-3.192c.099-.734.28-1.122.556-1.399"
							clip-rule="evenodd"
						/></svg
					>
				</button>
			</div>
		{/if}
	</section>
</main>
