<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import { type Exercise } from '$lib/types';

	export let data;

	let { exercises } = data;
	console.log('exercises');
	console.log(exercises);

	let newExerciseName = '';
	let newExerciseDescription = '';

	async function addExercise() {
		if (newExerciseName) {
			console.log(`adding exercise: ${newExerciseName}`);
			const session = await fetchAuthSession();
			const response = await fetch(`/api/exercises?token=${session.tokens?.idToken?.toString()}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: newExerciseName,
					description: newExerciseDescription,
					tags: []
				})
			});
			if (!response.ok) {
				console.log(`Unable to create exercise '${newExerciseName}'`);
			}
			newExerciseName = '';
			newExerciseDescription = '';

			const json = await response.json();
			const createdExercise = {
				userId: json.user_id,
				timestamp: json.timestamp,
				objectType: json.object_type,
				objectId: json.object_id,
				name: json.name,
				description: json.description,
				tags: []
			};
			exercises.push(createdExercise);
			exercises = exercises;

			console.log('exercises: ', exercises);
		}
	}

	async function deleteExercise(exercise: Exercise) {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercises/${exercise.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			console.error('Failed to delete exercise: ', exercise);
		} else {
			exercises = exercises.filter((e: Exercise) => e.objectId !== exercise.objectId);
			exercises = exercises;
		}
	}
</script>

<Card.Root class="mt-4">
	<Card.Header>
		<Card.Title>Exercises</Card.Title>
		<Card.Description>All registered exercises</Card.Description>
	</Card.Header>
</Card.Root>

<NewItem item="Exercise">
	<label for="name">Name</label>
	<Input placeholder="Name of the exercise" bind:value={newExerciseName} />
	<label for="description">Description</label>
	<Input placeholder="Description of the exercise" bind:value={newExerciseDescription} />
	<br />
	<Dialog.Footer>
		<Dialog.Close class={buttonVariants({ variant: 'default' })} on:click={addExercise}
			>Add</Dialog.Close
		>
	</Dialog.Footer>
</NewItem>

{#each exercises as exercise}
	<ExerciseInfoComponent {exercise} deletionCallback={deleteExercise} />
{/each}
