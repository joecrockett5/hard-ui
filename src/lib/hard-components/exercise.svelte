<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import SetComponent from '$lib/hard-components/set.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';

	type Exercise = {
		name: string;
		description: string;
		tags: string[];
		sets: any[];
	};

	export let exercise: Exercise;

	const warmupSets: any[] = [];
	const workingSets: any[] = [];

	exercise.sets.forEach((set) => {
		if (set.setType === 'warmup') {
			warmupSets.push(set);
		} else {
			workingSets.push(set);
		}
	});
</script>

<Card.Root class="mb-4">
	<Card.Header>
		<Card.Title>{exercise.name}</Card.Title>
		{#if exercise.description}
			<Card.Description>{exercise.description}</Card.Description>
		{/if}
	</Card.Header>
	<Card.Content>
		<div>
			{#each exercise.tags as tag}
				<div class="flex gap-2 items-center">
					<div class="w-4 h-4 rounded-full bg-gray-200"></div>
					<span>{tag}</span>
				</div>
			{/each}
		</div>
		<div class="mt-4">
			<h3 class="text-xl font-bold">Warmup Sets</h3>
			{#each warmupSets as set}
				<SetComponent {set} />
			{/each}
			<NewItem item="Warmup Set">
				<!-- TODO: Add NewItem form -->
			</NewItem>
		</div>
		<div class="mt-4">
			<h3 class="text-xl font-bold">Working Sets</h3>
			{#each workingSets as set}
				<SetComponent {set} />
			{/each}
			<NewItem item="Working Set">
				<!-- TODO: Add NewItem form -->
			</NewItem>
		</div>
	</Card.Content>
</Card.Root>
