<script lang="ts">
	import type { IArea, IRule } from "$lib/service";
	import RuleHistory from "$lib/components/RuleHistory.svelte";
	import Message from "$lib/components/Message.svelte";
	import Tags from "$lib/components/Tags.svelte";
	import { onMount, onDestroy } from "svelte";
	import { api } from "$lib/store";
	import { createEventDispatcher } from "svelte";
	import { mdguide } from "$lib/md-guide";

	const dispatch = createEventDispatcher();

	export let rule: IRule; //parameter
	export let areas: IArea[] = [];

	let selectedRule: IRule = null;
	let errorMessage: string;
	let validationFields: any[];
	let statuses: any[] = [];
	let showHistory: boolean = false;
	let showGuide:boolean = false;

	onMount(async () => {
		validationFields = [];
		statuses = $api.getStatus();
		selectedRule = { ...rule };
	});

	onDestroy(() => {});

	$: codeError =
		validationFields && validationFields.find((v) => v.field == "code");
	$: titleError =
		validationFields && validationFields.find((v) => v.field == "title");
	$: areaError =
		validationFields && validationFields.find((v) => v.field == "areaId");
	$: statusError =
		validationFields && validationFields.find((v) => v.field == "status");

	async function saveRule() {
		console.log("save rule", selectedRule);

		validationFields = [];
		errorMessage = null;

		let result = await $api.saveRule(selectedRule);
		if (result && result.isError) {
			errorMessage = result.message;
			if (result.isValidation) {
				validationFields = result.validations;
			}
		} else {
			//success("Salvo com sucesso");
			dispatch("change", { save: result?.data ?? selectedRule });
		}

		//console.log(selectedRule, 'rule');
	}

	async function removeRule() {
		let result = await $api.removeRule(selectedRule);
		if (result && result.isError) {
			errorMessage = result.message;
			if (result.isValidation) {
				validationFields = result.validations;
			}
		}
		if (result.isSuccess) {
			rule = null;
			dispatch("change", { remove: true });
		}
	}

	function cancelRule() {
		rule = null;
	}

	function handleTags(event) {
		selectedRule.tags = event.detail.tags;
	}

	function viewHistory() {
		showHistory = !showHistory;
	}
</script>

{#if selectedRule}
	<div class="columns is-variable is-0">
		<div class="column">
			{#if selectedRule.id}
				<h3 class="subtitle">Regra</h3>
			{:else}
				<h3 class="title is-4">Nova Regra</h3>
			{/if}
		</div>
		<div class="column noptop">
			<div class="field is-grouped is-grouped-right">
				{#if selectedRule.id}
					<p class="control">
						<a class="button" on:click={viewHistory}> Histórico </a>
					</p>
				{/if}
				<p class="control">
					<a class="button is-danger" on:click={removeRule}>Excluir</a>
				</p>
				<p class="control">
					<a class="button is-light" on:click={cancelRule}>Cancelar</a>
				</p>
				<p class="control">
					<a class="button is-primary" on:click={saveRule}>Salvar</a>
				</p>
			</div>
		</div>
	</div>

	<div class="columns is-variable is-0">
		<div class="column noptop">
			<h3 class="title">
				{#if selectedRule.title}
					{selectedRule.title}
				{/if}
			</h3>

			<h3 class="subtitle">{selectedRule.code ?? " "}</h3>
		</div>
	</div>

	<Message bind:text={errorMessage} />

	<div class="columns is-variable is-0" style="margin-bottom:0px;">
		<div class="column sm-options">
			<div class="field is-grouped is-grouped-left">
				<div class="control">
					<div class="select {areaError ? 'is-danger' : 'is-warning'}">
						<select bind:value={selectedRule.areaId}>
							<option value={null}>Áreas</option>
							{#each areas as aSelect}
								<option value={aSelect.id}>
									{aSelect.name}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="control">
					<div class="select {statusError ? 'is-danger' : ''}">
						<select bind:value={selectedRule.status}>
							<option value={null}>Selecione</option>
							{#each statuses as sStatus}
								<option value={sStatus.id}>
									{sStatus.name}
								</option>
							{/each}
						</select>
					</div>
				</div>
			</div>
		</div>
		<div class="column">
			<Tags on:tags={handleTags} bind:tags={selectedRule.tags} />
		</div>
	</div>

	<div class="form">
		<div class="field">
			<label class="label">Código</label>
			<div class="control">
				<input
					class="input {codeError ? 'is-danger' : ''}"
					type="text"
					placeholder="Código gerado automaticamente"
					bind:value={selectedRule.code}
					disabled={!selectedRule.id}
				/>
			</div>
			{#if codeError}
				<p class="help is-danger">{codeError.message}</p>
			{/if}
		</div>

		<div class="field">
			<label class="label">Título</label>
			<div class="control">
				<input
					class="input {titleError ? 'is-danger' : ''}"
					type="text"
					placeholder="Título"
					bind:value={selectedRule.title}
				/>
			</div>
			{#if titleError}
				<p class="help is-danger">{titleError.message}</p>
			{/if}
		</div>

		<div class="field">
			<label class="label">Descrição</label>
			<div class="control">
				<textarea class="textarea" bind:value={selectedRule.text} rows="12"></textarea>
			</div>
		</div>
		<button class="button" on:click={() => showGuide = !showGuide}>Guia .MD</button>
	</div>
{/if}

{#if showHistory}
	<RuleHistory bind:rule={selectedRule} />
{/if}

{#if showGuide}
	<pre>
		{mdguide}
	</pre>
{/if}
