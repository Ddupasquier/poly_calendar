<script lang="ts">
	import { addToast } from "$lib/stores";
	import { Common } from "$lib/components";
	import { siteName } from "../lib/constants";
</script>

<Common.Toast />

<div class="container">
	WELCOME TO {siteName}!!!

	<button
		on:click={() =>
			addToast("New message", {
				closable: true,
				openTilClosed: true,
			})}
	>
		Show Toast
	</button>
	<button
		on:click={() =>
			addToast("New message 2", {
				duration: 1000,
				closable: true,
			})}
	>
		Show Toast 2
	</button>
</div>

<style lang="scss">
</style>
