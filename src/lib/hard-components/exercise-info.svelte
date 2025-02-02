<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { buttonVariants } from '$lib/components/ui/button';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import type { Exercise } from '$lib/types';
	import * as Dialog from '$lib/components/ui/dialog';
	import ConfirmDelete from './confirm-delete-exercise-info.svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	export let exercise: Exercise;
	export let deletionCallback: (exercise: Exercise) => void;
	export let brief: boolean = false;

	let updatedName = exercise.name;
	let updatedDescription = exercise.description;

	async function updateExercise() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/exercises/${exercise.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timestamp: exercise.timestamp,
					objectId: exercise.objectId,
					name: updatedName,
					description: updatedDescription
				})
			}
		);

		if (!response.ok) {
			console.error('Failed to update exercise: ', exercise);
		} else {
			exercise.name = updatedName;
			exercise.description = updatedDescription;
		}
	}
</script>

<Card.Root class="mt-4">
	{#if !brief}
		<Dialog.Root>
			<Dialog.Trigger class={`float-right top-4 right-4 ${buttonVariants({ variant: 'ghost' })}`}
				>編集</Dialog.Trigger
			>
			<Dialog.Content class="w-3/4 max-w-lg">
				<Dialog.Header>
					<Dialog.Title>編集 {exercise.name}</Dialog.Title>
					<Dialog.Description>エクササイズを編集する</Dialog.Description>
				</Dialog.Header>
				<label for="name">名前：</label>
				<Input placeholder="名前" bind:value={updatedName} class="mb-2" />
				<label for="description">説明：</label>
				<Input placeholder="説明" bind:value={updatedDescription} />
				<br />
				<Dialog.Footer class="flex flex-row gap-2">
					<ConfirmDelete {deletionCallback} {exercise} />
					<Dialog.Close
						class={buttonVariants({ variant: 'default' }) + ' ml-auto'}
						on:click={updateExercise}>保存</Dialog.Close
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
	<Card.Header>
		<Card.Title>{exercise.name}</Card.Title>
		<Card.Description>{exercise.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if exercise.tags}
			{#each exercise.tags as tag}
				<div class="flex gap-2 items-center">
					<span class={`rounded-full w-4 h-4 bg-${tag.colorHex}-500`} />
					<span>{tag.name}</span>
				</div>
			{/each}
		{/if}
	</Card.Content>
</Card.Root>
