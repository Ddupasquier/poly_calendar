<script lang="ts">
	import { Layout } from "$lib/components";
	import { siteName } from "$lib/constants/site-labels";
	import "./styles.scss";
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
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	/* footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	} */

	/* footer a {
		font-weight: bold;
	} */

	@media (min-width: 480px) {
		/* footer {
			padding: 12px 0;
		} */
	}
</style>
