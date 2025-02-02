<script lang="ts">
	import type { WorkoutInfo } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import { buttonVariants, Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import ConfirmDelete from '$lib/hard-components/confirm-delete-workout-info.svelte';

	export let workout: WorkoutInfo;
	export let href: string = '';
	export let deletionCallback: (workout: WorkoutInfo) => void;
	export let brief: boolean = false;

	let updatedTitle = workout.title;
	let updatedNotes = workout.notes;

	async function updateWorkout() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/workouts/${workout.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timestamp: workout.timestamp,
					objectId: workout.objectId,
					title: updatedTitle,
					notes: updatedNotes,
					workoutDate: workout.workoutDate
				})
			}
		);

		if (!response.ok) {
			console.error('Failed to update workout: ', workout);
		} else {
			workout.title = updatedTitle;
			workout.notes = updatedNotes;
		}
	}

	let asDate = new Date(workout.workoutDate);
	$: japaneseDate = `${asDate.getFullYear()}年${asDate.getMonth() + 1}月${asDate.getDate()}日`;
</script>

<Card.Root class="mt-4">
	{#if !brief}
		<Dialog.Root>
			<Dialog.Trigger class={`float-right top-4 right-4 ${buttonVariants({ variant: 'ghost' })}`}
				>編集</Dialog.Trigger
			>
			<Dialog.Content class="w-3/4 max-w-lg">
				<Dialog.Header>
					<Dialog.Title>編集 {workout.title}</Dialog.Title>
					<Dialog.Description>編集トレーニング</Dialog.Description>
				</Dialog.Header>
				<label for="date">日付</label>
				<Input value={japaneseDate} disabled />
				<label for="title">タイトル</label>
				<Input placeholder="タイトル" bind:value={updatedTitle} />
				<label for="Notes">メモ</label>
				<Input placeholder="メモ" bind:value={updatedNotes} />
				<br />
				<Dialog.Footer class="flex flex-row gap-2">
					<ConfirmDelete {deletionCallback} {workout} />
					<Dialog.Close
						class={buttonVariants({ variant: 'default' }) + ' ml-auto'}
						on:click={updateWorkout}>保存</Dialog.Close
					>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
		<Button
			variant="ghost"
			class="float-right top-4 right-4"
			href={`/workouts?date=${workout.workoutDate}`}>⤶</Button
		>
	{/if}
	<Card.Header>
		<Card.Title>
			<a {href}>{workout.title}</a>
		</Card.Title>
		<Card.Description>{japaneseDate}のトレーニング</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid grid-cols-2 gap-4">
			<div class="flex flex-col gap-2">
				<div class="flex gap-2">
					{#if workout.tags && workout.tags.length > 0}
						<div class="flex-1">
							<span class="text-sm font-semibold">Tags</span>
							<div class="flex flex-wrap gap-2">
								{#each workout.tags as tag}
									<div class="flex items-center gap-2">
										<span
											class="rounded-full w-4 h-4 bg-gray-200"
											style="background-color: {tag.color}"
										/>
										<span>{tag.name}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if workout.notes}
						<div class="flex-1">
							<span class="text-sm font-semibold">メモ</span>
							<p>{workout.notes}</p>
						</div>
					{/if}
				</div>
			</div>
		</div></Card.Content
	>
</Card.Root>
