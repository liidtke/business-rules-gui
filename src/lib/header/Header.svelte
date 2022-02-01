<script lang="ts">
	import { isLoading } from "$lib/store";
	import { fade } from "svelte/transition";
	import { page } from "$app/stores";
	import logo from "./logo.svg";
	import { onMount, afterUpdate } from "svelte";
	import { isLight, initialCheck, changeTheme } from "$lib/setup-theme";
	import type { AuthService } from "$lib/auth-service";
	import { goto } from '$app/navigation';

	let isLight: boolean = true;
	let light = "light-theme";
	let dark = "dark-theme";
	export let authService: AuthService;

	onMount(async () => {
		initialCheck();
	});

	function logout(){
		authService.logout();
		goto("/login");
	}
</script>

<header class="container">
	<div class="corner">
		<a href="/">
			<img src={logo} alt="DracmaLogo" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li class:active={$page.url.pathname === "/"}>
				<a sveltekit:prefetch href="/">Home</a>
			</li>
			<li class:active={$page.url.pathname === "/rules"}>
				<a sveltekit:prefetch href="/rules">Regras</a>
			</li>
			<li class:active={$page.url.pathname === "/about"}>
				<a sveltekit:prefetch href="/about">Sobre</a>
			</li>
			<li>
				<a on:click={logout}>Sair</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		<a href="" on:click={changeTheme}>
			<span class="icon">
				<i class="fas fa-{isLight ? 'sun' : 'moon'}" />
			</span>
		</a>
	</div>
</header>

{#if $isLoading}
	<div class="top-loader" out:fade>
		<div class="bar show" />
	</div>
{/if}

<style>
	header {
		display: flex;
		justify-content: space-between;
		flex-grow: 0;
	}

	.corner {
		width: 3em;
		height: 3em;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 3em;
		height: 3em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: var(--primary-color);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 5px;
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--primary-button);
	}

	.top-loader {
		position: absolute;
		z-index: 99;
		height: 5px;
		width: 100%;
	}

	.top-loader .bar.show {
		animation-name: loader-animation;
		animation-duration: 2s;
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
	}

	.top-loader .bar {
		width: 0%;
		position: relative;
		height: 5px;
		background-color: var(--accent-color2);
	}

	@keyframes loader-animation {
		0% {
			width: 0%;
		}
		100% {
			width: 100%;
			left: 0%;
		}
	}
</style>
