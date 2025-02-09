<script lang="ts">
	import InlineSetEdit from '$lib/hard-components/inline-set-edit.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Card from '$lib/components/ui/card';
	import Input from '$lib/components/ui/input/input.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import type { Set } from '$lib/types';
	import { fetchAuthSession } from '@aws-amplify/auth';
	import ConfirmDelete from '$lib/hard-components/confirm-delete-set.svelte';
	import Tick from '$lib/svg/tick.svelte';
	import Cross from '$lib/svg/cross.svelte';
	import Dash from '$lib/svg/dash.svelte';

	export let set: Set;
	export let deletionCallback: (set: Set) => void;
	export let brief = false;
	export let display: number | undefined = undefined;

	let updatedWeight = set.weight;
	let updatedReps = set.reps;
	let updatedNotes = set.notes;

	async function updateSet() {
		const session = await fetchAuthSession();
		const response = await fetch(
			`/api/sets/${set.objectId}?token=${session.tokens?.idToken?.toString()}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timestamp: set.timestamp,
					objectId: set.objectId,
					setType: set.setType,
					weight: updatedWeight,
					weightUnit: set.weightUnit,
					reps: updatedReps,
					notes: updatedNotes,
					exerciseJoinId: set.exerciseJoinId
				})
			}
		);

		if (!response.ok) {
			console.error('Failed to update set: ', set);
		} else {
			set.weight = updatedWeight;
			set.reps = updatedReps;
			set.notes = updatedNotes;
		}
	}
</script>

<Card.Root class="w-full mt-2">
	<div class="m-2">
		<div class="flex justify-between items-center">
			<p class="ml-4">{set.reps} レプス @ {set.weight} キロ</p>

			<div class="ml-auto">
				{#if display !== undefined}
					{#if display > 0}
						<Tick />
					{:else if display < 0}
						<Cross />
					{:else}
						<Dash />
					{/if}
				{/if}
			</div>

			{#if !brief}
				<Dialog.Root>
					<Dialog.Trigger class={`${buttonVariants({ variant: 'ghost' })}`}>Edit</Dialog.Trigger>
					<Dialog.Content class="w-3/4 max-w-lg">
						<Dialog.Header>
							<Dialog.Title>Edit Set</Dialog.Title>
						</Dialog.Header>
						<InlineSetEdit
							bind:reps={updatedReps}
							bind:weight={updatedWeight}
							bind:notes={updatedNotes}
						/>
						<br />
						<Dialog.Footer class="flex flex-row gap-2">
							<ConfirmDelete {deletionCallback} {set} />
							<Dialog.Close
								class={buttonVariants({ variant: 'default' }) + ' ml-auto'}
								on:click={updateSet}>Save</Dialog.Close
							>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Root>
			{/if}
		</div>
		{#if set.notes}
			<p class="ml-4 mb-4"><b>Notes:</b> {set.notes}</p>
		{/if}
	</div>
</Card.Root>
