<script lang="ts">
	import '../app.css'
	import { page } from '$app/stores'
	import { signOut } from '@auth/sveltekit/client'
	import { RANDOM_AVATAR_URL } from '$lib/constants'
	import AuthButton from '$lib/components/AuthButton.svelte'
	import { goto } from '$app/navigation'

	$: user = $page.data.session?.user
	$: image = user?.image ?? `${RANDOM_AVATAR_URL}${user?.name ?? 'User'}.svg`

	const handleSignOut = () => {
		goto('/')
		signOut()
	}
</script>

<svelte:head>
	<title>Nachort Links</title>
	<meta name="description" content="Short your links with Nachort Links in just one go." />
</svelte:head>

<nav class="navbar bg-base-200">
	<div class="flex-1 flex items-center">
		<a href="/" class="btn btn-ghost text-xl">
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
			Nachort Links
		</a>
	</div>
	{#if user != null}
		<div class="flex-none">
			<a href="/dashboard" class="btn btn-ghost mr-2 text-lg"> Dashboard </a>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 border border-gray-600 rounded-full">
						<img alt={`${user?.name ?? user?.email ?? 'User'}'s profile`} src={image} />
					</div>
				</button>
				<ul
					role="menu"
					class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
				>
					<li>
						<a href="/profile" class="justify-between">
							Profile
							<span class="badge">New</span>
						</a>
					</li>
					<li>
						<button on:click={handleSignOut}>Logout</button>
					</li>
				</ul>
			</div>
		</div>
	{:else}
		<AuthButton />
	{/if}
</nav>

<slot />
