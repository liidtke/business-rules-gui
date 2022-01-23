<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
  import { marked } from 'marked';

	export let text: string; //text .md
  let html:string;

  $: html = marked.parse(text);
	
	onMount(async () => {
	
	});

</script>

<div class="content">
  {@html html}
</div>
