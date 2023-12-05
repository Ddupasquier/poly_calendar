<script lang="ts">
	import { page } from "$app/stores";
	import { Layout } from "$lib/components";
	import { authUser } from "$lib/stores";
	import { isObjectEmpty } from "$lib/utils";

	$: currentTab = $page.url.pathname;
	$: authUserPresent = $authUser && !isObjectEmpty($authUser);

	const tabs = [
		{
			name: "Profile",
			path: "/profile",
		},
		{
			name: "Partners",
			path: "/partners",
		},
		{
			name: "Calendar",
			path: "/calendar",
		},
		{
			name: "Albums",
			path: "/albums",
		},
	];
</script>

<header>
	<nav>
		{#each tabs as tab}
			{#if authUserPresent || (!authUserPresent && tab.path === "/profile")}
				<Layout.NavTab
					tabName={tab.name}
					tabPath={tab.path}
					{currentTab}
				/>
			{/if}
		{/each}
	</nav>
	<div class="bars">
		<div class="bar1" />
		<div class="bar2" />
		<div class="bar3" />
	</div>
</header>

<style lang="scss">
	header {
		height: 3rem;
	}

	nav {
		display: flex;
		justify-content: flex-end;
		box-sizing: border-box;
		align-items: center;
		width: 100%;
		height: 3rem;
		padding-top: 1rem;
		padding-right: 4rem;
	}

	nav :global(.tab) {
		margin-right: -30px;
		&:last-child {
			margin-right: 0;
		}
	}

	@mixin bar($top, $width, $color, $animation-name, $animation-speed) {
		position: absolute;
		top: $top;
		right: 0;
		height: 2px;
		width: $width;
		background-color: $color;
		animation: $animation-name $animation-speed infinite alternate
			ease-in-out;
	}

	.bars {
		display: block;
		position: relative;
		margin-right: 2rem;

		.bar1 {
			@include bar(0, 65%, var(--color-theme-1), animate-bar1, 12s);
		}

		.bar2 {
			@include bar(
				0.4rem,
				55%,
				var(--color-theme-1-D1),
				animate-bar2,
				14s
			);
		}

		.bar3 {
			@include bar(
				0.8rem,
				45%,
				var(--color-theme-1-L1),
				animate-bar3,
				10s
			);
		}
	}

	@keyframes animate-bar1 {
		0%,
		100% {
			width: 65%;
		}
		50% {
			width: 75%;
		}
	}

	@keyframes animate-bar2 {
		0%,
		100% {
			width: 55%;
		}
		50% {
			width: 65%;
		}
	}

	@keyframes animate-bar3 {
		0%,
		100% {
			width: 45%;
		}
		50% {
			width: 55%;
		}
	}

	@media (max-width: 870px) {
		.bars {
			top: -5.5rem;
			left: 1rem;
			transform: scaleX(-1);
		}

		nav {
			flex-direction: column;
			align-items: flex-end;
			width: 100%;
		}

		nav :global(.tab) {
			margin-right: 0;
			margin-bottom: -7px;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
</style>
