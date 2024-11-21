<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import SetComponent from '$lib/hard-components/set.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import type { Exercise, Set } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';

	export let exercise: Exercise;
	export let deletionCallback: (exercise: Exercise) => void;

	const warmupSets: Set[] = [];
	const workingSets: Set[] = [];

	if (exercise.sets && exercise.sets.length > 0) {
		exercise.sets.forEach((set) => {
			if (set.setType === 'warmup') {
				warmupSets.push(set);
			} else {
				workingSets.push(set);
			}
		});
	}
</script>

<Card.Root class="mt-4">
	<Dialog.Root>
		<Dialog.Trigger class={`float-right top-4 right-4 ${buttonVariants({ variant: 'ghost' })}`}
			>Remove</Dialog.Trigger
		>
		<Dialog.Content class="max-w-lg">
			<Dialog.Header>
				<Dialog.Title>Are you sure you want to remove this exercise?</Dialog.Title>
				<Dialog.Description>This cannot be undone.</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'ghost' })}>Cancel</Dialog.Close>
				<Dialog.Close on:click={deletionCallback} class={buttonVariants({ variant: 'destructive' })}
					>Remove</Dialog.Close
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
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
						<span class="rounded-full w-4 h-4 bg-gray-200" style="background-color: {tag.color}" />
						<span>{tag.name}</span>
					</div>
				{/each}
			{/if}
		</div>
		<div class="mt-6">
			<h3 class="text-xl font-bold">Warmup Sets</h3>
			{#each warmupSets as set}
				<SetComponent {set} />
			{/each}
			<NewItem item="Warmup Set">
				<!-- TODO: Add NewItem form -->
			</NewItem>
		</div>
		<div class="mt-6">
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
