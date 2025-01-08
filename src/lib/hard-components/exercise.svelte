<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import SetComponent from '$lib/hard-components/set.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import type { Exercise, Set } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { fetchAuthSession } from 'aws-amplify/auth';
	import Input from '$lib/components/ui/input/input.svelte';

	export let exercise: Exercise;
	export let workoutId: string;
	export let deletionCallback: (exercise: Exercise) => void;

	let warmupSets: Set[] = [];
	let workingSets: Set[] = [];

	if (exercise.sets && exercise.sets.length > 0) {
		exercise.sets.forEach((set) => {
			if (set.setType === 'warmup') {
				warmupSets.push(set);
			} else {
				workingSets.push(set);
			}
		});
	}

	let warmupSetWeight = undefined;
	let warmupSetReps = undefined;
	let warmupSetNotes = '';

	let workingSetWeight = 0;
	let workingSetReps = 0;
	let workingSetNotes = '';

	async function createWarmupSet() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}&workout=${workoutId}&exercise=${exercise.objectId}`
		);
		const joinJson = await response.json();
		const join = joinJson[0];
		console.log(join);
		const createSetResponse = await fetch(
			`/api/sets?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					setType: 'warmup',
					weight: warmupSetWeight,
					weightUnit: 'kg',
					reps: warmupSetReps,
					notes: warmupSetNotes,
					exerciseJoinId: join.objectId
				})
			}
		);
		if (createSetResponse.ok) {
			const set = await createSetResponse.json();
			warmupSets.push(set);
			warmupSets = warmupSets;

			warmupSetWeight = 0;
			warmupSetReps = 0;
			warmupSetNotes = '';
		} else {
			console.log('Error creating warmup set');
		}
	}

	async function createWorkingSet() {
		// TODO: Create a new set
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
				<Dialog.Close
					on:click={() => deletionCallback(exercise)}
					class={buttonVariants({ variant: 'destructive' })}>Remove</Dialog.Close
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
				<Input placeholder="Reps" type="number" bind:value={warmupSetReps} />
				<Input placeholder="Weight (Kg)" type="number" bind:value={warmupSetWeight} />
				<Input placeholder="Notes" bind:value={warmupSetNotes} />
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'default' })} on:click={createWarmupSet}
						>Add</Dialog.Close
					>
				</Dialog.Footer>
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
