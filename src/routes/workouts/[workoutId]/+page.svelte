<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import { type Exercise, type WorkoutInfo } from '$lib/types';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import { goto } from '$app/navigation';

	export let data;

	let { exercises, workoutInfo, allExercises } = data;
	let possibleExercises = [...allExercises];

	$: possibleExercises = possibleExercises.filter(
		(exercise: Exercise) => !exercises.find((e: Exercise) => e.objectId === exercise.objectId)
	);

	let search = '';

	$: possibleExercises = allExercises.filter((exercise: Exercise) =>
		exercise.name.toLowerCase().includes(search.toLowerCase())
	);

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
			`/api/exercise-joins?token=${session.tokens?.idToken?.toString()}&workoutId=${workoutInfo.objectId}&exerciseId=${exercise.objectId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);

		if (!response.ok) {
			console.error('Failed to delete exercise: ', exercise);
		} else {
			exercises = exercises.filter((e: Exercise) => e.objectId !== exercise.objectId);
			exercises = exercises;
		}
	};

	async function deleteWorkout(workout: WorkoutInfo) {
		console.log('deleting workout: ', workout);
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/workouts/${workout.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'DELETE'
			}
		);

		if (!response.ok) {
			console.error('Failed to delete workout: ', workout);
		} else {
			goto(`/workouts?date=${workout.workoutDate}`);
		}
	}
</script>

<WorkoutInfoComponent workout={workoutInfo} deletionCallback={deleteWorkout} />

<NewItem item="Exercise" description={`Add exercise to '${workoutInfo.title}'`} className="h-3/4">
	<div class="self-start">
		<label for="Search" class="text-left">Search:</label>
		<Input placeholder="Exercise Name" bind:value={search} />
	</div>
	<ScrollArea>
		{#each possibleExercises as possibleExercise}
			<Dialog.Close class="w-full text-left" on:click={() => addExercise(possibleExercise)}>
				<ExerciseInfoComponent exercise={possibleExercise} brief />
			</Dialog.Close>
		{/each}
	</ScrollArea>
</NewItem>

{#each exercises as exercise}
	<ExerciseComponent
		{exercise}
		workoutId={workoutInfo.objectId}
		deletionCallback={removeExercise}
	/>
{/each}
