<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';

	export let reps: number;
	export let weight: number;
	export let notes: string;
</script>

<span class="flex gap-2 items-center">
	<Input placeholder="Reps" type="tel" bind:value={reps} class="w-20" /> reps @
	<Input placeholder="Weight" type="tel" bind:value={weight} class="w-24" /> kg
</span>
<Input placeholder="Notes" bind:value={notes} />
