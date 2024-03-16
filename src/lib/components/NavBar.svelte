<script lang="ts">
	import type { User } from '@auth/sveltekit'
	import AuthButton from './AuthButton.svelte'
	import { THEME } from '$lib/types.d'
	import { onMount } from 'svelte'
	import { goto } from '$app/navigation'
	import { signOut } from '@auth/sveltekit/client'
	import { RANDOM_AVATAR_URL } from '$lib/constants'

	export let user: User | undefined
	$: image = user?.image ?? `${RANDOM_AVATAR_URL}${user?.name ?? 'User'}.svg`

	let theme = THEME.DARK

	onMount(() => {
		const preferredTheme = localStorage.getItem('theme')

		if (preferredTheme) {
			theme = preferredTheme as THEME
		} else if (window?.matchMedia('(prefers-color-scheme: light)').matches) {
			theme = THEME.LIGHT
		}

		document.documentElement.setAttribute('data-theme', theme)
	})

	const handleChangeTheme = () => {
		const newTheme = theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT

		theme = newTheme
		document.documentElement.setAttribute('data-theme', newTheme)

		localStorage.setItem('theme', theme)
	}

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
		<label class="swap swap-rotate">
			<input on:change={handleChangeTheme} type="checkbox" class="theme-controller" />

			<svg
				class="swap-on fill-current w-8 h-8"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
				/></svg
			>

			<svg
				class="swap-off fill-current w-8 h-8"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				><path
					d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
				/></svg
			>
		</label>

		{#if user != null}
			<a href="/dashboard" class="btn btn-sm btn-ghost text-lg"> Dashboard </a>
			<div class="dropdown dropdown-end max-h-8">
				<button tabindex="0" class="btn btn-sm btn-ghost btn-circle avatar">
					<div class="w-8 h-8 border border-gray-600 rounded-full">
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
