<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import { type Exercise } from '$lib/types';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fetchAuthSession } from '@aws-amplify/auth';

	export let data;

	let { exercises, workoutInfo } = data;

	const getPossibleExercises = async () => {
		const session = await fetchAuthSession();
		const response = await fetch(`/api/exercises?token=${session.tokens?.idToken?.toString()}`);
		let possibleExercises: Exercise[] = await response.json();
		possibleExercises = possibleExercises.filter(
			(exercise: Exercise) => !exercises.find((e: Exercise) => e.objectId === exercise.objectId)
		);
		return possibleExercises;
	};

	const addExercise = async (exercise: Exercise) => {
		console.log(`adding exercise: ${exercise.name}`);
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workoutId: workoutInfo.objectId,
					exerciseId: exercise.objectId
				})
			}
		);
		if (!response.ok) {
			console.log(`Unable to create exercise-join for '${exercise.name}'`);
		} else {
			exercises.push(exercise);
			exercises = exercises;
		}
	};

	const removeExercise = async (exercise: Exercise) => {
		console.log(`removing exercise: ${exercise.name}`);
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					workoutId: workoutInfo.objectId,
					exerciseId: exercise.objectId
				})
			}
		);

		if (!response.ok) {
			console.error('Failed to delete exercise: ', exercise);
		} else {
			exercises = exercises.filter((e: Exercise) => e.objectId !== exercise.objectId);
			exercises = exercises;
		}
	};
</script>

<WorkoutInfoComponent workout={workoutInfo} brief />

<NewItem item="Exercise" description={`Add exercise to '${workoutInfo.title}'`}>
	{#await getPossibleExercises() then possibleExercises}
		<ScrollArea>
			{#each possibleExercises as possibleExercise}
				<Dialog.Close class="w-full text-left" on:click={() => addExercise(possibleExercise)}>
					<ExerciseInfoComponent exercise={possibleExercise} brief />
				</Dialog.Close>
			{/each}
		</ScrollArea>
	{/await}
</NewItem>

{#each exercises as exercise}
	<ExerciseComponent {exercise} />
{/each}
