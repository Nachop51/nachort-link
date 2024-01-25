<script lang="ts">
	import { page } from '$app/stores'
	import { signIn } from '@auth/sveltekit/client'
</script>

<h1>SvelteKit Auth Example</h1>
<p>
	{#if $page.data.session}
		<span class="signedInText">
			<small>Signed in as</small><br />
			<strong>{$page.data.session.user?.name ?? 'User'}</strong>
		</span>
	{:else}
		<span class="notSignedInText">You are not signed in</span>
		<button on:click={() => signIn('github')}>Sign In with GitHub</button>
	{/if}
</p>

<a href="/protected">Protected route</a>
