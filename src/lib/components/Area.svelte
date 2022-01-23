<script lang="ts">
import type { IArea } from "$lib/service";
import Nip from '$lib/components/Nip.svelte';
import { api } from '$lib/store'; 
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let area:IArea;

let validationFields: any[];

async function saveArea() {
		validationFields = [];
		if (!area || !area.name) {
			return;
		}

		let result = await $api.saveArea(area);

		if (result.isError) {
			dispatch('change', {'error': true})
		}
    else{
      dispatch('change', {'save': true})
    }

	}

	function cancelArea() {
		validationFields = [];
		area = null;
    dispatch('change', {'cancel': true})
	}

  function removeArea(){

  }

</script>
<div class="box">
    <!-- AREA -->
    {#if area}
      {#if area.id}
        <h3 class="title">Editar Área</h3>
      {:else}
        <h3 class="title">Nova Área</h3>
      {/if}

      <div class="form">
        <div class="field">
          <label class="label">Nome</label>
          <div class="control">
            <input
              class="input"
              type="text"
              placeholder="ex: Contas a Pagar"
              bind:value={area.name}
            />
          </div>
          <div class="field">
            <label class="label">Prefixo</label>
            <div class="control">
              <input
                class="input"
                type="text"
                placeholder="REQ"
                bind:value={area.prefix}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Número Inicial</label>
            <Nip bind:value={area.startNumber} />
          </div>
          <div class="field">
            <label class="label">Número Atual</label>
            <Nip bind:value={area.currentNumber} />
          </div>
        </div>
      </div>
      <div class="buttons">
        {#if area.id}
          <button class="button is-danger" on:click={removeArea}>Remover</button
          >
        {/if}
        <button class="button is-light" on:click={cancelArea}>Cancelar</button>
        <button class="button is-primary" on:click={saveArea}>Salvar</button>
      </div>
    {/if}

  </div>
 