<script lang="ts">
	export let success: boolean = false
	export let error: boolean = false
</script>

<p
	class="mt-4 text-sm font-semibold"
	class:text-neutral-500={!error && !success}
	class:text-error={error}
	class:text-success={success}
>
	<slot />
</p>
