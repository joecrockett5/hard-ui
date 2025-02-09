<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';

	export let reps: number;
	export let weight: number;
	export let notes: string;
</script>

<span class="flex gap-2 items-center">
	<Input placeholder="レプス" type="tel" autofocus bind:value={reps} class="w-20" /> レプス @
	<Input placeholder="キロ" type="tel" bind:value={weight} class="w-14" /> キロ
</span>
<Input placeholder="メモ" bind:value={notes} class="mt-4 mb-2" />
