<script lang="ts">
	import { AuthService } from "$lib/auth-service";
	import { goto } from "$app/navigation";
	import { onMount, onDestroy } from "svelte";
	import { isAuthenticated } from "$lib/store";

	let pwd: string;
	let user: string;
	let err: string;
	let service = new AuthService();

	onMount(async () => {
		if ($isAuthenticated) {
			goto("/");
		}
	});

	async function doit() {
		err = null;
		if (user && pwd) {
			let res = await service.login(user, pwd);
			if (res.isSuccess) {
				goto("/");
			} else {
				console.log(res);
				err = res.message;
			}
		}
	}

	function keypress(e){
		if(e && e.keyCode == 13){
			doit();
		}
	}

</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="container mt1">
	<div class="columns is-centered">
		<div class="column is-5-tablet is-4-desktop is-3-widescreen">
			<h3 class="title">Login Dracma Rules</h3>
			<div action="" class="box">
				<div class="field">
					<label for="" class="label">Usuário ou Email</label>
					<div class="control has-icons-left">
						<input
							type="text"
							placeholder="username"
							class="input"
							required
							bind:value={user}
						/>
						<span class="icon is-small is-left">
							<i class="fa fa-user" />
						</span>
					</div>
				</div>
				<div class="field">
					<label for="" class="label">Senha</label>
					<div class="control has-icons-left">
						<input
							type="password"
							placeholder="*******"
							class="input"
							required
							bind:value={pwd}
							on:keypress={keypress}
						/>
						<span class="icon is-small is-left">
							<i class="fa fa-lock" />
						</span>
					</div>
				</div>
				<div class="field">
					<button class="button is-primary" on:click={doit}> Login </button>
				</div>
			</div>
			{#if err}
				<article class="message is-warning">
					<div class="message-body">
						{err}
					</div>
				</article>
			{/if}
		</div>
	</div>
</div>

<style>
	.mt1 {
		margin-top: 50px;
	}
</style>
