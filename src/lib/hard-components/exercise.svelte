<script lang="ts">
	import { onMount } from 'svelte';
	import * as Accordion from '$lib/components/ui/accordion';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import SetComponent from '$lib/hard-components/set.svelte';
	import InlineSetEdit from '$lib/hard-components/inline-set-edit.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import type { Exercise, Set } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import { fetchAuthSession } from 'aws-amplify/auth';
	import Input from '$lib/components/ui/input/input.svelte';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { writable } from 'svelte/store';

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

	let workingSetWeight = undefined;
	let workingSetReps = undefined;
	let workingSetNotes = '';

	if (workingSets.length > 0) {
		workingSetWeight = workingSets.at(-1).weight;
	}

	const creatingWarmupSet = writable(false);
	const creatingWorkingSet = writable(false);

	async function createWarmupSet() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}&workout=${workoutId}&exercise=${exercise.objectId}`
		);
		const joinJson = await response.json();
		const join = joinJson[0];
		creatingWarmupSet.set(true);
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
		creatingWarmupSet.set(false);
		if (createSetResponse.ok) {
			const set = await createSetResponse.json();
			warmupSets.push(set);
			warmupSets = warmupSets;

			warmupSetWeight = undefined;
			warmupSetReps = undefined;
			warmupSetNotes = '';
		} else {
			console.log('Error creating warmup set');
		}
	}

	async function createWorkingSet() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}&workout=${workoutId}&exercise=${exercise.objectId}`
		);
		const joinJson = await response.json();
		const join = joinJson[0];
		creatingWorkingSet.set(true);
		const createSetResponse = await fetch(
			`/api/sets?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					setType: 'working',
					weight: workingSetWeight,
					weightUnit: 'kg',
					reps: workingSetReps,
					notes: workingSetNotes,
					exerciseJoinId: join.objectId
				})
			}
		);
		creatingWorkingSet.set(false);
		if (createSetResponse.ok) {
			const set = await createSetResponse.json();
			workingSets.push(set);
			workingSets = workingSets;

			// workingSetWeight = 0;
			workingSetReps = undefined;
			workingSetNotes = '';
		} else {
			console.log('Error creating working set');
		}
	}

	async function deleteSet(set: Set) {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/sets/${set.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			console.error('Failed to delete set: ', set);
		} else {
			if (set.setType === 'warmup') {
				warmupSets = warmupSets.filter((s: Set) => s.objectId !== set.objectId);
			} else {
				workingSets = workingSets.filter((s: Set) => s.objectId !== set.objectId);
			}
			goto(`/workouts/${workoutId}`);
		}
	}

	let oldSets: Set[] = [];

	async function fetchOldSets() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/sets/mostRecent?token=${session.tokens?.idToken?.toString()}&exercise=${exercise.objectId}`
		);
		if (!response.ok) {
			console.error(`Failed to fetch old sets for ${exercise.name}, got ${response.status}`);
			return;
		}
		const sets = await response.json();
		oldSets = sets;
	}

	function sortOldSets(sets: Set[]) {
		return {
			warmup: sets.filter((set) => set.setType === 'warmup'),
			working: sets.filter((set) => set.setType === 'working')
		};
	}

	onMount(fetchOldSets);
	$: sortedOldSets = sortOldSets(oldSets);
</script>

<Card.Root class="mt-4">
	<Dialog.Root>
		<Dialog.Trigger class={`float-right top-4 right-4 ${buttonVariants({ variant: 'ghost' })}`}
			>Remove</Dialog.Trigger
		>
		<Dialog.Content class="w-3/4">
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
			{#if oldSets.length > 0}
				<Accordion.Root>
					<Accordion.Item value="previous-sets">
						<Accordion.Trigger class="w-full mt-0"
							>Previous Sets ({new Date(oldSets[0].timestamp).toLocaleDateString('en-GB', {
								day: '2-digit',
								month: '2-digit',
								year: '2-digit'
							})})</Accordion.Trigger
						>
						<Accordion.Content class="w-full">
							{#if sortedOldSets.warmup.length > 0}
								<h4 class="text-l font-bold">Warmup Sets</h4>
								{#each sortedOldSets.warmup as set}
									<SetComponent {set} deletionCallback={deleteSet} brief />
								{/each}
							{/if}
							{#if sortedOldSets.working.length > 0}
								<h4 class="text-l font-bold mt-2">Working Sets</h4>
								{#each sortedOldSets.working as set}
									<SetComponent {set} deletionCallback={deleteSet} brief />
								{/each}
							{/if}
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			{/if}
		</div>
		<div class="mt-4">
			<h3 class="text-xl font-bold">Warmup Sets</h3>
			{#each warmupSets as set}
				<SetComponent {set} deletionCallback={deleteSet} />
			{/each}
			{#if $creatingWarmupSet}
				<Skeleton class="h-14 w-full mt-2" />
			{/if}
			<NewItem item="Warmup Set">
				<InlineSetEdit
					bind:reps={warmupSetReps}
					bind:weight={warmupSetWeight}
					bind:notes={warmupSetNotes}
				/>
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
				<SetComponent {set} deletionCallback={deleteSet} />
			{/each}
			{#if $creatingWorkingSet}
				<Skeleton class="h-14 w-full mt-2" />
			{/if}
			<NewItem item="Working Set">
				<InlineSetEdit
					bind:reps={workingSetReps}
					bind:weight={workingSetWeight}
					bind:notes={workingSetNotes}
				/>
				<Dialog.Footer>
					<Dialog.Close class={buttonVariants({ variant: 'default' })} on:click={createWorkingSet}
						>Add</Dialog.Close
					>
				</Dialog.Footer>
			</NewItem>
		</div>
	</Card.Content>
</Card.Root>
