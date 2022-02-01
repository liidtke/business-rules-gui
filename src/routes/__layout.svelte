<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
	import { isAuthenticated } from "$lib/store";
	import { goto } from '$app/navigation';
	import { onMount, afterUpdate } from 'svelte';
  import { AuthService } from '$lib/auth-service';

	let authService = new AuthService();

	onMount(async () => {
		if(!$isAuthenticated){
			let isLogIn = authService.reload();
			if(!isLogIn){
				goto("/login");
			}
		}
	});
</script>

<Header bind:authService/>

<main>
	<slot />
</main>

<footer>
	{#if !$isAuthenticated}
		<p>não autenticado</p>
	{/if}
</footer>

<style>
	main {
		padding: 2rem;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
