<script lang="ts">
	export let oldRule: any; //History
	export let currentRule: any; //IRule

	let fields: string[] = ['code', 'title', 'text', 'status'];

	console.log(oldRule, 'old');
	console.log(currentRule, 'current');
</script>

{#if oldRule && currentRule}
	{#each fields as field}
		<div class="label">{field}</div>
		<div class="field">
			{#if oldRule[field] === currentRule[field]}
				<div class="equal item">{currentRule[field] ?? ''}</div>
			{:else}
				<div class="diff">
					{#if field == 'text'}
						<div class="old item">{@html oldRule[field]}</div>
						<div class="new item">{@html currentRule[field]}</div>
					{:else}
						<div class="old item">{oldRule[field] ?? ''}</div>
						<div class="new item">{currentRule[field] ?? ''}</div>
					{/if}
				</div>
			{/if}
		</div>
	{/each}
{/if}

<style>
	.field {
		display: flex;
	}

	.item {
		padding: 0.5rem;
		min-height: 40px;
		min-width: 70px;
		border: 1pt solid var(--tertiary-color);
		border-radius: 2px;
	}

	.equal {
		background-color: var(--primary-color);
		flex-grow: 1 100%;
	}

	.diff {
		display: inline-flex;
	}
	.diff .old {
		text-decoration: line-through;
		background-color: var(--red);
	}
	.diff .new {
		background-color: var(--blue);
	}
</style>
