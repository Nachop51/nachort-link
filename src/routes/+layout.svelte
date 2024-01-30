<script lang="ts">
	import '../app.css'
	import { page } from '$app/stores'
	import { signIn, signOut } from '@auth/sveltekit/client'
	import { onMount } from 'svelte'
	import { invalidateAll } from '$app/navigation'
	import { RANDOM_AVATAR_URL } from '$lib/constants'

	let dialogElement: HTMLDialogElement
	let handle: string
	let password: string
	let err = false

	onMount(() => {
		dialogElement = document.getElementById('login-menu') as HTMLDialogElement
	})

	const handleSignIn = async () => {
		const res = await signIn('credentials', { handle, password, redirect: false })

		if (res == null) {
			err = true
			return
		}

		const { url } = (await res.json()) as { url: string }

		const params = new URLSearchParams(url.split('?')[1])

		if (params.has('error')) {
			err = true
		} else {
			invalidateAll()
		}
	}

	const handleSignOut = () => {
		signOut()
	}
</script>

<svelte:head>
	<title>Nachort Links</title>
	<meta name="description" content="Short your links with Nachort Links in just one go." />
</svelte:head>

<nav class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Nachort Links</a>
	</div>
	{#if $page.data.session?.user != null}
		<div class="flex-none">
			<a href="/dashboard" class="btn btn-ghost">Dashboard</a>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						{#if $page.data.session.user?.image != null}
							<img
								alt={`${$page.data.session.user.name} profile`}
								src={$page.data.session.user.image}
							/>
						{:else}
							<img
								alt={`${$page.data.session.user?.name ?? $page.data.session.user?.email ?? 'User'}'s profile`}
								src={`${RANDOM_AVATAR_URL}${$page.data.session.user?.name ?? $page.data.session.user?.email ?? 'User'}.svg`}
							/>
						{/if}
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
		<button on:click={() => dialogElement.showModal()}> Login </button>
		<dialog id="login-menu" class="modal">
			<div class="modal-box grid place-items-center py-8 gap-4">
				<form method="dialog">
					<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">❌</button>
				</form>

				<h3 class="font-bold text-lg">Log In with one of the following options:</h3>

				<form class="flex flex-col">
					<input
						type="text"
						bind:value={handle}
						placeholder="Type here"
						class="input input-bordered w-full max-w-xs"
					/>
					<input
						type="password"
						bind:value={password}
						placeholder="Type here"
						class="input input-bordered w-full max-w-xs"
					/>
					<button class="btn btn-accent" on:click={handleSignIn}>Log in</button>
				</form>
				{#if err}
					<p class="text-red-500">Couldn't sign in, invalid credentials.</p>
				{/if}

				<p>Or sign in with:</p>

				<button class="btn btn-primary" on:click={() => signIn('github')}>
					Sign In using GitHub
				</button>
				<p class="py-1 text-xs">(you can press ESC key or click on ✕ button to close)</p>
			</div>
		</dialog>
	{/if}
</nav>

<main class="flex items-center flex-col justify-center min-h-[calc(100vh-132px)]">
	<slot />
</main>
