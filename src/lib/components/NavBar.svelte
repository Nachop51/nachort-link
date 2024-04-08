<script lang="ts">
	import AuthButton from './AuthButton.svelte'
	import { goto } from '$app/navigation'
	import { signOut } from '@auth/sveltekit/client'
	import { RANDOM_AVATAR_URL } from '$lib/constants'
	import ThemeHandler from './theme-handler.svelte'
	import type { User } from '@auth/sveltekit'

	export let user:
		| ({
				handle?: string | null | undefined
		  } & User)
		| null

	$: image = user?.image ?? `${RANDOM_AVATAR_URL}${user?.handle ?? 'User'}.svg`

	const handleSignOut = () => {
		goto('/')
		signOut()
	}
</script>

<nav class="navbar top-0">
	<a class="flex items-center" href="/" title="Go to home page">
		<svg
			class="fill-current"
			height="30px"
			width="30px"
			version="1.1"
			id="Layer_1"
			viewBox="0 0 490.452 490.452"
		>
			<path
				d="M245.226,0L43.836,126.814v236.823l201.39,126.814l201.39-126.814V126.814L245.226,0z M403.465,135.095l-158.239,99.643  L86.987,135.095l158.239-99.643L403.465,135.095z M73.836,162.267l156.39,98.477v184.81l-156.39-98.478V162.267z M260.226,445.555  v-184.81l156.39-98.478v184.81L260.226,445.555z"
			/>
		</svg>
		<span class="mx-3"> | </span>
		<span> Linkly </span>
	</a>
	<div class="flex items-center gap-2">
		<ThemeHandler />
		{#if user != null}
			<a href="/dashboard" class="btn btn-sm btn-ghost text-lg"> Dashboard </a>
			<div class="dropdown dropdown-end max-h-8">
				<button tabindex="0" class="btn btn-sm btn-ghost btn-circle avatar w-8 h-8">
					<div class="w-full h-full border border-gray-600 rounded-full">
						<img alt={`${user?.name ?? user?.email ?? 'User'}'s profile`} src={image} />
					</div>
				</button>
				<ul
					role="menu"
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
				>
					<!-- <li>
						<a href="/profile" class="justify-between">
							Profile
							<span class="badge">New</span>
						</a>
					</li> -->
					<li>
						<button on:click={handleSignOut}>Logout</button>
					</li>
				</ul>
			</div>
		{:else}
			<AuthButton />
		{/if}
	</div>
</nav>

<style lang="postcss">
	@keyframes blur {
		from {
			backdrop-filter: blur(0px);
		}
		to {
			backdrop-filter: blur(10px);
		}
	}

	.navbar {
		@apply fixed left-0 z-[10] flex w-full items-center justify-between px-8 py-4 text-xl sm:px-16 sm:py-8 sm:text-2xl;

		animation: blur linear both;
		animation-timeline: scroll();
		animation-range: 0 500px;
	}
</style>
