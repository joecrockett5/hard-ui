<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import { type Exercise } from '$lib/types';
	import * as Pagination from '$lib/components/ui/pagination';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	export let data;

	let page = 1;

	let { exercises } = data;
	exercises = exercises.sort((a: Exercise, b: Exercise) => a.name.localeCompare(b.name));

	$: viewableExercises = exercises.slice((page - 1) * 10, page * 10);

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
		<Card.Title>エクササイズ</Card.Title>
		<Card.Description>全てのエクササイズ</Card.Description>
	</Card.Header>
</Card.Root>

<NewItem item="エクササイズ">
	<label for="name">名前：</label>
	<Input placeholder="名前" bind:value={newExerciseName} />
	<label for="description">説明：</label>
	<Input placeholder="説明" bind:value={newExerciseDescription} />
	<br />
	<Dialog.Footer>
		<Dialog.Close class={buttonVariants({ variant: 'default' })} on:click={addExercise}
			>追加</Dialog.Close
		>
	</Dialog.Footer>
</NewItem>

<Pagination.Root
	class="mt-4"
	count={exercises.length}
	perPage={10}
	let:pages
	let:currentPage
	bind:page
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

{#each viewableExercises as exercise}
	<ExerciseInfoComponent {exercise} deletionCallback={deleteExercise} />
{/each}

<div class="mb-8" />

<Pagination.Root
	class="mt-4"
	count={exercises.length}
	perPage={10}
	let:pages
	let:currentPage
	bind:page
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
