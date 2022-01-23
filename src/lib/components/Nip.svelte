<script lang="ts">
    import IMask from "imask";
    import { onMount, onDestroy } from "svelte";

    export let value;
    export let inputclass = "input";
    let id = Math.random().toString(36).substr(2, 9);
    let mask;

    $: {
        if(mask && mask.value != value){
            if(value){
                mask.typedValue = value.toString();
            }
            else mask.typedValue = "";
        }
    }

    onMount(async () => {
        var element = document.getElementById(id);
        var maskOptions = {
            mask: "00000",
        };
        mask = IMask(element, maskOptions);
        if(value !== null && value !== undefined){
            mask.typedValue = value.toString();
        }
        mask.on("accept", changed);
    });

    onDestroy(async () => {
        mask.destroy();
    });

    function changed(){
        value = Number(mask.value);
    }

</script>

<input {id} class={inputclass} type="text"/>
