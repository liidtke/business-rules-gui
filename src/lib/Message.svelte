<script lang="ts">
    export let title = "Atenção";
    export let type = "is-warning";
    export let text;

    function close(){
        text = null;
    }
</script>

<div class="message-component">
    {#if text}
    <article class="message {type}">
        <div class="message-header">
            <p on:click={close}>{title}</p>
            <button class="delete" aria-label="delete" on:click={close} />
        </div>
        <div class="message-body">
            {text}
        </div>
    </article>
    {/if}
</div>


<style>
    .message-component{
        margin-bottom: 1rem;
    }
</style>