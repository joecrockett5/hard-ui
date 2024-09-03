<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button/index.js';
	import SetComponent from '$lib/hard-components/set.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import type { Exercise, Set } from '$lib/types';

	export let exercise: Exercise;

	const warmupSets: Set[] = [];
	const workingSets: Set[] = [];

	if (exercise.sets) {
		exercise.sets.forEach((set) => {
			if (set.setType === 'warmup') {
				warmupSets.push(set);
			} else {
				workingSets.push(set);
			}
		});
	}
</script>

<Card.Root class="mb-4">
	<Card.Header class="w-1/2">
		<Card.Title>
			{exercise.name}
		</Card.Title>
		{#if exercise.description}
			<Card.Description>{exercise.description}</Card.Description>
		{/if}
	</Card.Header>
	<!-- TODO: Add Edit button -->
	<Card.Content>
		<div>
			{#if exercise.tags}
				{#each exercise.tags as tag}
					<div class="flex gap-2 items-center">
						<div class="w-4 h-4 rounded-full bg-gray-200"></div>
						<span>{tag.name}</span>
					</div>
				{/each}
			{/if}
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
