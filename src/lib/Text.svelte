<script lang="ts">
     import Editor from '@tinymce/tinymce-svelte';

	import { onMount, onDestroy } from 'svelte';

	export let text: string; //html do texto

	let config = {
	plugins: 'lists',
  toolbar: 'bold italic | h1 h2 h3 | numlist bullist | alignleft aligncenter alignright | removeformat undo redo',
  lists_indent_on_tab: false
	}

	let apiKey = "jxsx37g28enageva7nt9gd5wjqfgsjitjqss1gjdpbmyhrrj"

	onMount(async () => {
		
	});

</script>

<Editor bind:apiKey={apiKey} bind:value={text} bind:conf={config} />


<style global>
	button.active {
		background: black;
		color: var(--heading-color);
	}

	.ProseMirror {
		min-height: 100px;
		border: solid 1px;
	}
</style>
