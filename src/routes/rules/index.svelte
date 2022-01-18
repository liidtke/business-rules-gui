<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/stores";
	import { storeAreas, storeRules, selectedArea, api } from "$lib/store";
	import { text } from "svelte/internal";
	import type { IArea, IRule } from "$lib/service";
	import Viewer from "$lib/Viewer.svelte";
	import Area from "$lib/Area.svelte";
	import RuleEdit from "$lib/RuleEdit.svelte";

	let areas: IArea[] = [];
	let editArea: IArea;
	let sub: any;
	let areaSearchField: string = "";
	let area: IArea;
	let selectedRule: IRule;
	let ruleSearchField: string;
	let detailedRule: IRule;
	let showAllDetails:boolean = false;

	onMount(async () => {
		sub = storeAreas.subscribe((value) => {
			areas = value;
		});

		selectedArea.subscribe((value) => {
			let diff = area != value;
			area = value as IArea;
			if (diff) {
				loadRules();
			}
		});

		loadRules();

		loadAreas();
		//console.log($page)
		//console.log($page.query.get('id'))
	});

	onDestroy(() => {
		//sub();
	});

	$: filteredAreas = !areaSearchField ? areas : searchArea(areaSearchField);

	async function loadAreas() {
		let feched = await $api.getAreas();
		if (feched) {
			storeAreas.set(feched);
		}
	}

	function searchArea(search) {
		search = search.toLowerCase();

		return areas.filter((area) => {
			if (area._hasChild === undefined) {
				area._hasChild = false;
			}

			return area.name.toLowerCase().includes(search) || area._hasChild;
		});
	}

	function addArea(area) {
		editArea = { ...area };
	}

	function selectArea(area) {
		selectedArea.set({ ...area });
	}

	function deselectArea() {
		selectedArea.set(null);
	}

	function areaChanged(event) {
		console.log("area changed", event);
		if (event.detail?.save) {
			editArea = null;
			loadAreas();
		}
	}

	function selectRule(rule) {
		selectedRule = rule;
	}

	function viewDetails(rule) {
		rule.showDetails = !rule.showDetails;
	  showAllDetails = !showAllDetails;
	}

	$: filteredRules = !ruleSearchField
		? $storeRules
		: searchRules(ruleSearchField);

	async function loadRules() {
		let feched;
		if (area) {
			feched = await $api.getRulesByArea(area.id);
		} else {
			feched = await $api.getRules();
		}
		if (feched) {
			storeRules.set(feched);
		}
	}

	function searchRules(search) {
		if (!$storeRules) {
			return $storeRules;
		}

		let predicate = search.toLowerCase();

		return $storeRules.filter(
			(x) =>
				x.code.toLowerCase().includes(predicate) ||
				x.title.toLowerCase().includes(predicate)
		);
	}

	function handleChangeRule(event) {
		if (event.detail.remove) {
			loadRules();
			return;
		}

		let saved = event.detail.save;
		selectedRule = null;
		console.log("handlesave", saved);
		let all = $storeRules;
		let index = all.findIndex((x) => x.id == saved.id);
		if (index > -1) {
			all[index] = saved;
			storeRules.set(all);
		} else {
			all.push(saved);
			storeRules.set(all);
		}
	}

	function addRule() {
		selectedRule = { areaId: null, status: "Proposed" } as any;
	}
</script>

<svelte:head>
	<title>Regras de Negócio</title>
</svelte:head>
<section class="">
	<div class="columns is-variable is-3">
		<div class="column">
			<div class="brules-menu">
				<h3 class="title is-5">Áreas</h3>

				<div class="search">
					<div class="control has-icons-left">
						<input
							class="input search"
							type="text"
							placeholder="Buscar"
							bind:value={areaSearchField}
						/>
						<span class="icon is-small is-left">
							<i class="fas fa-search" />
						</span>
					</div>
				</div>

				<button class="button add-area" on:click={addArea}>
					<span class="icon">
						<i class="fab fa-plus" />
					</span>
					<span>Adicionar Área</span>
				</button>
				<div class="area">
					<a class="lbl" on:click={deselectArea}> Todas </a>
				</div>
				{#each filteredAreas as area}
					<div class="area">
						<a class="lbl" on:click={selectArea(area)}>
							{area.name}
						</a>
						<a class="icon" on:click={addArea(area)}>
							<i class="fab fa-edit" />
						</a>
					</div>
				{/each}
			</div>
		</div>

		<div class="column is-9">
			{#if editArea}
				<Area bind:area={editArea} on:change={areaChanged} />
			{:else}
				<!-- rules -->
				{#if selectedRule}
					<div class="box">
						<RuleEdit
							bind:rule={selectedRule}
							bind:areas
							on:change={handleChangeRule}
						/>
					</div>
				{/if}

				<nav class="panel is-primary">
					<p class="panel-heading">
						Regras de Negócio
						{#if area}- {area.name}{/if}
					</p>
					<div class="panel-block">
						<button class="button add-area" on:click={addRule}>
							<span class="icon">
								<i class="fab fa-plus" />
							</span>
							<span>Adicionar Regra</span>
						</button>
					</div>
					<div class="panel-block">
						<p class="control has-icons-left">
							<input
								class="input"
								type="text"
								placeholder="Buscar"
								bind:value={ruleSearchField}
							/>
							<span class="icon is-left">
								<i class="fas fa-search" aria-hidden="true" />
							</span>
						</p>
					</div>
					{#each filteredRules as rule}
						<!-- svelte-ignore a11y-missing-attribute -->
						<div class="panel-block bb-0" on:click={viewDetails(rule)}>
							<a class="panel-icon">
								<i class="fas fa-caret-down" aria-hidden="true" />
							</a>
							<a on:click={selectRule(rule)}>
								{rule.code} - {rule.title}
							</a>
						</div>
						{#if rule.showDetails || showAllDetails}
							<div class="rule-detail">
								<p>
									<Viewer bind:text={rule.text} />
								</p>
							</div>
						{/if}
					{/each}
				</nav>
			{/if}
		</div>
	</div>
</section>

<style>
	.brules-menu {
		font-size: 1rem;
		display: block;
		line-height: 1.25;
	}
	.brules-menu .lbl {
		color: var(--primary-inverted-color);
		font-size: 0.8em;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		font-weight: 400;
		line-height: 1.5;
		margin-top: 1em;
		font-weight: 600;
	}
	.brules-menu .lbl:hover {
		color: var(--blue);
		cursor: pointer;
	}
	.brules-menu input {
		margin-bottom: 0.5em;
	}
	.brules-menu div.search {
		padding-bottom: 1rem;
	}
	.brules-menu .add-area {
		margin-bottom: 0.5rem;
	}
	.brules-menu a.action,
	.brules-menu a.item {
		display: block;
		padding: 0.5em 0.75em;
		border-radius: 2px;
		cursor: pointer;
		text-decoration: none;
		color: var(--heading-color);
	}
	.brules-menu a.action:hover,
	.brules-menu a.item:hover {
		background-color: var(--primary-color);
		color: var(--heading-color);
	}
	.brules-menu a.action.is-active,
	.brules-menu a.item.is-active {
		background-color: var(--blue);
		color: var(--heading-color) !important;
	}
	.brules-menu a.action.stronger,
	.brules-menu a.item.stronger {
		font-weight: 600;
	}
	.brules-menu .items {
		border-left: 1px solid var(--primary-color);
		margin: 0.75em;
		padding-left: 0.75em;
	}
	.form {
		padding: 1rem 0rem;
	}
	.noptop {
		padding-top: 0px !important;
	}

	.area {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: space-between;

		width: 100%;
	}

	.area .icon {
		align-self: flex-end;
		margin-left: auto;
	}

	.panel {
		background-color: var(--primary-color);
	}

	.rule-detail {
		position: relative;
		padding-left: 40px;
		border-bottom: 1px solid #ededed;
		box-shadow: inset 0px 12px 9px -10px var(--tertiary-color);
		background: var(--primary-color);
	}

	.panel-block:hover {
		color: var(--blue) !important;
		background-color: var(--secondary-color) !important;
	}

	.panel-block.active {
		color: var(--blue) !important;
	}

	a.panel-block {
		background: var(--tertiary-color) !important;
	}

	.rule-detail > p {
		padding: 8px 0px;
	}

	.bb-0 {
		border-bottom: none !important;
	}

	.panel-block {
    align-items: center;
    display: flex;
    justify-content: flex-start;
    padding: .5em .75em;
		cursor: pointer;
}

a.panel-block, label.panel-block {
    cursor: pointer;
}

</style>
