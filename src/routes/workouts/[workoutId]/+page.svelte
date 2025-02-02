<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import { type Exercise, type WorkoutInfo } from '$lib/types';
	import * as Pagination from '$lib/components/ui/pagination';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import { goto } from '$app/navigation';

	export let data;

	let { exercises, workoutInfo, allExercises } = data;
	let possibleExercises = [...allExercises];

	let search = '';

	$: possibleExercises = allExercises
		.filter(
			(exercise: Exercise) =>
				exercise.name.toLowerCase().includes(search.toLowerCase()) ||
				exercise.description.toLowerCase().includes(search.toLowerCase())
		)
		.filter(
			(exercise: Exercise) => !exercises.find((e: Exercise) => e.objectId === exercise.objectId)
		)
		.sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name));

	let exercisePage = 1;
	const pageSize = 3;

	$: viewableExercises = possibleExercises.slice(
		(exercisePage - 1) * pageSize,
		exercisePage * pageSize
	);

	$: {
		console.log(search);
		exercisePage = 1;
	}

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
			search = '';
		}
	};

	const removeExercise = async (exercise: Exercise) => {
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

<NewItem
	item="エクササイズ"
	description={`「${workoutInfo.title}」にエクササイズを追加する`}
	className="h-4/5"
>
	<div>
		<label for="Search" class="text-left"><b>検索：</b></label>
		<Input placeholder="名前または説明" bind:value={search} />
	</div>
	<Pagination.Root
		class="mt-4"
		count={possibleExercises.length}
		perPage={pageSize}
		siblingCount={0}
		let:pages
		let:currentPage
		bind:page={exercisePage}
	>
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton>
					<ChevronLeft class="h-4 w-4" />
				</Pagination.PrevButton>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item isVisible={currentPage == page.value}>
						<Pagination.Link {page} isActive={currentPage == page.value}>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton>
					<ChevronRight class="h-4 w-4" />
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	</Pagination.Root>

	{#each viewableExercises as possibleExercise}
		<Dialog.Close class="w-full text-left" on:click={() => addExercise(possibleExercise)}>
			<ExerciseInfoComponent exercise={possibleExercise} brief />
		</Dialog.Close>
	{/each}
	<div class={`h-[${(pageSize - viewableExercises.length) * 134}px]`} />
</NewItem>

{#each exercises as exercise}
	<ExerciseComponent
		{exercise}
		workoutId={workoutInfo.objectId}
		deletionCallback={removeExercise}
	/>
{/each}
