
<script lang="ts">
	import { onMount, afterUpdate, beforeUpdate } from 'svelte';
	import {isLight, initialCheck, changeTheme } from '$lib/setup-theme'
	
	beforeUpdate(async () => {
		initialCheck();
	});

</script>

<main>
	<slot />
</main>