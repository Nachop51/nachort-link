<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client'
	import '../app.css'
	import { page } from '$app/stores'
	import { onMount } from 'svelte'

	let dialogElement: HTMLDialogElement
	let email: string
	let password: string

	onMount(() => {
		dialogElement = document.getElementById('login-menu') as HTMLDialogElement
	})

	const handleClick = () => {
		signOut()
	}

	console.log($page.data.session)
</script>

<svelte:head>
	<title>Nachort Links</title>
	<meta name="description" content="Short your links with Nachort Links in just one go." />
</svelte:head>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">Nachort Links</a>
	</div>
	{#if $page.data.session?.user != null}
		<div class="flex-none">
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost focus:ring">Button</button>
				<ul
					role="menu"
					class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
				>
					<li class="card-body">
						<span class="font-bold text-lg">8 Items</span>
						<span class="text-info">Subtotal: $999</span>
						<div class="card-actions">
							<button class="btn btn-primary btn-block">View cart</button>
						</div>
					</li>
				</ul>
			</div>
			<div class="dropdown dropdown-end">
				<button tabindex="0" class="btn btn-ghost btn-circle avatar focus:ring">
					<div class="w-10 rounded-full">
						<img alt="Tailwind CSS Navbar component" src={$page.data.session.user.image} />
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
						<button on:click={handleClick}>Logout</button>
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
						type="email"
						bind:value={email}
						placeholder="Type here"
						class="input input-bordered w-full max-w-xs"
					/>
					<input
						type="password"
						bind:value={password}
						placeholder="Type here"
						class="input input-bordered w-full max-w-xs"
					/>
					<button class="btn btn-accent" on:click={() => signIn('credentials', { email, password })}
						>Log in</button
					>
				</form>

				<p>Or sign in with:</p>

				<button class="btn btn-primary" on:click={() => signIn('github')}>
					Sign In using GitHub
				</button>
				<p class="py-1 text-xs">(you can press ESC key or click on ✕ button to close)</p>
			</div>
		</dialog>
	{/if}
</div>

<main class="flex items-center flex-col justify-start">
	<slot />
</main>
