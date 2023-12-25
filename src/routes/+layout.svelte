<script lang="ts">
	import "$lib/styles/index-styles.scss";
	import { Common, Layout } from "$lib/components";
	import { onMount } from "svelte";
	import { siteName } from "../lib/constants";
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";

	$: currentPath = $page.url.pathname;

	export let data: AppLayoutData;
	const { status, redirect, props } = data;

	onMount(async () => {
		if (redirect && currentPath !== "/confirm-signup") goto(redirect);

		// initializeAuthListener();
	});
</script>

<svelte:head>
	<title>{siteName}</title>
	<meta name="description" content="A SvelteKit app" />
	<meta name="og:title" content={siteName} />
	<!-- <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@sveltejs" />
    <meta name="twitter:title" content="{siteName}" />
    <meta name="twitter:description" content="A SvelteKit app" />
    <meta name="twitter:image" content="/twitter-image.png" /> -->
	<meta name="og:description" content="A SvelteKit app" />
	<meta name="og:image" content="/og-image.png" />
	<meta name="og:url" content="https://svelte.dev" />
	<link rel="icon" type="image/png" href="/favicon.png" />
</svelte:head>

<div class="app">
	<Layout.Logo />
	<Layout.Nav />

	<main>
		<slot />
	</main>

	<!-- <footer>
		<p>
			visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit
		</p>
	</footer> -->
</div>

<Common.Toast />

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 60rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
