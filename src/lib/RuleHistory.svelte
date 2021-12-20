<script lang="ts">
    import { onMount } from "svelte";
    import RuleComparison from "$lib/RuleComparison.svelte";
    import { api } from '$lib/store';
    import dateConverter from "./date-converter";
    import type { IRule } from "./service";

    export let rule:IRule;

    let history: any[];

    let oldRule;
    let selectedRule;
    let selectedHistory;
    let loading: boolean;

    onMount(async () => {
       
        if (rule) {
            loading = true;
            history = await $api.getRuleHistory(rule.id);
            //rule = await $api.getRule(rule.id);
            loading = false;
        }
    });

    function selectHistory(hist) {
        selectedHistory = hist;
        oldRule = null;
        selectedRule = null;
        
        //select previous history
        let index = history.indexOf(hist);
        
        if(history.length == 1 || index + 1 == history.length){
            oldRule = hist.rule;
            selectedRule = rule; //current rule
        }
        else {
            oldRule = hist.rule;
            selectedRule = history[index + 1].rule;
        }
    }
</script>

<div class="v-section">
    <h1 class="is-size-3">Histórico</h1>
    {#if history && rule}
        {#if rule}
            <h3 class="subtitle">Regra {rule.code}</h3>
        {/if}
  
                <div class="brules-menu box secondary">
                    {#each history as hist}
                        <a class="item" on:click={selectHistory(hist)}>
                            Por {hist.createdBy} em {dateConverter.convert(
                                hist.creationDate
                            )}
                        </a>
                    {:else}
                        <p>Essa regra não possui histórico</p>
                    {/each}
                </div>
            <div class="column">
                {#if selectedRule && oldRule}
                    <h3 class="title">Modificações</h3>
                    <h3 class="subtitle">Alterado por {selectedHistory.createdBy} em {dateConverter.convert(
                        selectedHistory.creationDate
                    )}</h3>
                    <RuleComparison
                        bind:oldRule={oldRule}
                        bind:currentRule={selectedRule}
                    />
                {/if}
            </div>

    {/if}
</div>

<style>
    .brules-menu {
	 font-size: 1rem;
	 display: block;
	 line-height: 1.25;
}
 .brules-menu a.action, .brules-menu a.item {
	 display: block;
	 padding: 0.5em 0.75em;
	 border-radius: 2px;
	 cursor: pointer;
	 text-decoration: none;
	 color: var(--primary-inverted-color);
}
 .brules-menu a.action:hover, .brules-menu a.item:hover {
	 background-color: #f5f5f5;
	 color: #363636;
}
 .brules-menu a.action.is-active, .brules-menu a.item.is-active {
	 background-color: #3273dc;
	 color: var(--heading-color)
}
 .brules-menu a.action.stronger, .brules-menu a.item.stronger {
	 font-weight: 600;
}
 
</style>
