<script lang="ts">
	// Svelte-specific imports: Framework imports for lifecycle and reactivity.

	// Supabase imports: Authentication and database connections for user management and data retrieval.

	// UI components: Custom Svelte components and UI elements from design system libraries.
	import { addToast } from "$lib/stores";
	import { Common } from "$lib/components";

	// Services: Business logic, API calls, and other service-related interactions.

	// Models: Type definitions and interfaces for structured data representation.

	// Utilities and constants: Reusable code snippets and app-wide constants for color schemes, etc.
	import { siteName } from "../lib/constants";

	// Store: Svelte stores and reactive variables for state management (placeholder for future additions).

	// Helpers: Utility functions for common tasks like formatting dates or numbers (placeholder for future additions).

	// Global styles: Centralized styling sheets that define universal CSS rules for the app (placeholder for future additions).
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
				duration: 5000,
				closable: true,
			})}
	>
		Show Toast 2
	</button>
</div>

<style lang="scss">
</style>
