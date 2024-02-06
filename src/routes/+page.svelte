<script lang="ts">
	let link = ''

	const handleSumbit = () => {
		console.log(link)
		link = ''
	}
</script>

<section class="bg-base-200 p-8 text-center rounded-lg">
	<header class="mb-6">
		<h1 class="text-4xl font-bold text-primary">Shorten your link!</h1>
	</header>

	<form on:submit|preventDefault={handleSumbit}>
		<input
			class="input input-bordered w-full max-w-xs mb-4"
			type="url"
			bind:value={link}
			placeholder="https://example.com"
		/>
		<button class="btn bg-base-300" type="submit">Shorten</button>
	</form>
</section>
