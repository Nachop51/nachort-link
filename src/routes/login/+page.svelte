<script lang="ts">
	import GithubIcon from '$lib/components/icons/github.svelte'
	import GoogleIcon from '$lib/components/icons/google.svelte'
	import Login from '$lib/components/auth/login.svelte'
	import Signup from '$lib/components/auth/signup.svelte'
	import { signIn } from '@auth/sveltekit/client'

	let isLogginIn = true

	function handleChange() {
		isLogginIn = !isLogginIn
	}
</script>

<main class="min-h-size grid grid-cols-2 text-neutral-content">
	<section
		class="flex flex-col items-start justify-center bg-base-100 px-6 sm:px-12 min-h-size pb-16 sm:pb-24"
	>
		<div class="max-w-xl mx-auto w-full">
			<h2 class="font-bold text-5xl text-primary mb-2">
				{isLogginIn ? 'Log in' : 'Sign up'}
			</h2>

			<h3 class="text-xl mb-3">
				{isLogginIn ? 'Welcome back linkler!' : 'Create an account to start shortening links!'}
			</h3>

			{#if isLogginIn}
				<Login />
			{:else}
				<Signup />
			{/if}

			<button on:click={handleChange} class="text-sm mt-4">
				Don't have an account?
				<span class="underline text-accent">
					{isLogginIn ? 'Sign up' : 'Log in'}
				</span>
			</button>

			<div class="divider divider-accent my-8 text-neutral-content">Or continue with</div>

			<div class="text [&>button]:mb-2 w-full">
				<button class="btn btn-primary text-base w-full" on:click={() => signIn('google')}>
					<GoogleIcon /> Google
				</button>

				<button class="btn btn-primary text-base w-full" on:click={() => signIn('github')}>
					<GithubIcon /> GitHub
				</button>
			</div>
		</div>
	</section>

	<div class="gradient-divider"></div>

	<section class="grid place-content-center px-6 sm:px-12 gap-8 py-20 md:pb-24">
		<div class="max-w-xl mx-auto w-full">
			<h1 class="text-5xl font-extrabold mb-4">Shorten your links with Linkly in just one go!</h1>

			<div class="text-xl">
				<p class="text-center"><span class="highlight">Transform</span> this weird thing:</p>
				<a
					href="https://onlineminitools.com/long-url-maker?r=iIIIIiIIiiIiiiIiiIIiIIiiiIIiIIIIiIIiIIIiiIIiiIIIiIiIiIiIiIIIiiIiiIIiIIiiiiIiiiIiiiIIIiIiiiIiiiIiiIIiIiiiiIIIiIiiiIIIiIiiiIIIiiiiiIIIiiIIiiIIIiIiiIiIIIiiiiIiIIIIiIiIIIiiiiIiIIIIiIIIiIIIiIIIiIIIiIIIiIIIiiIiIIIiiIIIIiiIiIIiIIIIiIIIiIiIiIIIiIiiiIIIiIiIiIIiiiIiiIIiiIiIiiIiIIIiiIIiiiIIiIIiIIIIiIIiIIiIiIiIIIiiiiIiIIIIiIIIiIIIiIIiiiiIiIIIiIiiiIIiiiIIiIIiIiiiiiIIIIIIiIIIiIIiiiIIIIiIiIIiiIiiiIiIiiiIiIIIiIIIiiIIiIiiiIIIiIIIiiIIIiiIiIiIiIIIiIIiiIIIiIiIIiiiiIIiiiIIiIiIiiiIiiIiiiIiiiIiIIiiiiIiiiIiiIIIiiIIiIIIiIiiiIIIiiIiiIIiiiiIiIIIiIiiiIIiiIiIiIIiiIIIiIIIIiiIiiIiiiIiiiIIIiIiiiIIiiiIiiIiIIiiiiIiiiIiiIIIiIiIiIIIiiIIiIIiiIiIiIIiIIiiiIIiiIiIiIIIiiIIiIIIiiIIiIiiiIiiiIIiiiiIiIIIiIiiiIIiiiiIiiIiiiIiiiIIIiIiiiIiiiIiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIIiiIIiiIIiIiiiiIiiiIiiIIIIIiI"
					title="https://onlineminitools.com/long-url-maker?r=iIIIIiIIiiIiiiIiiIIiIIiiiIIiIIIIiIIiIIIiiIIiiIIIiIiIiIiIiIIIiiIiiIIiIIiiiiIiiiIiiiIIIiIiiiIiiiIiiIIiIiiiiIIIiIiiiIIIiIiiiIIIiiiiiIIIiiIIiiIIIiIiiIiIIIiiiiIiIIIIiIiIIIiiiiIiIIIIiIIIiIIIiIIIiIIIiIIIiIIIiiIiIIIiiIIIIiiIiIIiIIIIiIIIiIiIiIIIiIiiiIIIiIiIiIIiiiIiiIIiiIiIiiIiIIIiiIIiiiIIiIIiIIIIiIIiIIIiIiIiIIIiiiiIiIIIIiIIIiIIIiIIiiiiIiIIIiIiiiIIiiiIIiIIiIiiiiiIIIIIIiIIIiIIiiiIIIIiIiIIiiIiiiIiIiiiIiIIIiIIIiiIIiIiiiIIIiIIIiiIIIiiIiIiIiIIIiIIiiIIIiIiIIiiiiIIiiiIIiIiIiiiIiiIiiiIiiiIiIIiiiiIiiiIiiIIIiiIIiIIIiIiiiIIIiiIiiIIiiiiIiIIIiIiiiIIiiIiIiIIiiIIIiIIIIiiIiiIiiiIiiiIIIiIiiiIIiiiIiiIiIIiiiiIiiiIiiIIIiIiIiIIIiiIIiIIiiIiIiIIiIIiiiIIiiIiIiIIIiiIIiIIIiiIIiIiiiIiiiIIiiiiIiIIIiIiiiIIiiiiIiiIiiiIiiiIIIiIiiiIiiiIiii"
					target="_blank"
					rel="noopener noreferrer"
					class="link link-accent text-ellipsis overflow-hidden break-all whitespace-pre-wrap"
					>https://onlineminitools.com/long-url-maker?r=iIIIIiIIiiIiiiIiiIIiIIiiiIIiIIIIiIIiIIIiiIIiiIIIiIiIiIiIiIIIiiIiiIIiIIiiiiIiiiIiiiIIIiIiiiIiiiIiiIIiIiiiiIIIiIiiiIIIiIiiiIIIiiiiiIIIii...</a
				>

				<p class="text-center"><span class="highlight">Into</span> this:</p>

				<p class="text-center">
					<a
						href="http://links.nachop.xyz/@p2Kp"
						target="_blank"
						rel="noopener noreferrer"
						class="link link-accent">http://links.nachop.xyz/@p2Kp</a
					>
				</p>
			</div>
		</div>
	</section>
</main>

<style lang="postcss">
	.highlight {
		@apply bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text font-bold;
	}

	main section:first-child::before {
		@apply content-[''] absolute w-full md:w-1/2 h-16 sm:h-24 top-0 left-0 bg-base-100;
	}

	@keyframes gradient-vertical {
		0% {
			background-position-y: 0%;
		}
		100% {
			background-position-y: 500%;
		}
	}

	@keyframes gradient-horizontal {
		0% {
			background-position-x: 0%;
		}
		100% {
			background-position-x: 500%;
		}
	}

	.gradient-divider {
		@apply w-full h-2 z-20 md:w-2 md:h-full relative md:absolute md:top-0 md:left-1/2 md:-translate-x-1/2;
		background: linear-gradient(
			0deg,
			oklch(var(--p)) 0%,
			oklch(var(--s)) 33%,
			oklch(var(--a)) 66%,
			oklch(var(--p)) 100%
		);
		background-size: 100% 250%;

		animation: gradient-vertical 10s infinite linear;
	}

	.gradient-divider::before {
		content: '';
		@apply w-full h-12 md:h-full md:w-12 absolute left-0 top-1/2 -translate-y-1/2 md:translate-y-0 md:top-0 md:left-1/2 md:-translate-x-1/2 z-10 opacity-40 blur-lg;
		background: linear-gradient(
			0deg,
			oklch(var(--p)) 0%,
			oklch(var(--s)) 33%,
			oklch(var(--a)) 66%,
			oklch(var(--p)) 100%
		);
		background-size: 100% 250%;
		animation: gradient-vertical 10s infinite linear;
	}

	@media only screen and (max-width: 767px) {
		main {
			grid-template-columns: 1fr;
		}

		.gradient-divider {
			background: linear-gradient(
				90deg,
				oklch(var(--p)) 0%,
				oklch(var(--s)) 33%,
				oklch(var(--a)) 66%,
				oklch(var(--p)) 100%
			);
			background-size: 250% 100%;
			animation: gradient-horizontal 10s infinite linear;
		}

		.gradient-divider::before {
			background: linear-gradient(
				90deg,
				oklch(var(--p)) 0%,
				oklch(var(--s)) 33%,
				oklch(var(--a)) 66%,
				oklch(var(--p)) 100%
			);
			background-size: 250% 100%;
			animation: gradient-horizontal 10s infinite linear;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.gradient-divider {
			animation: none;
		}

		.gradient-divider::before {
			animation: none;
		}
	}
</style>
