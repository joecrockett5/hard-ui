<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { buttonVariants } from '$lib/components/ui/button';
	import Workout from '$lib/hard-components/workout-info.svelte';
	import { type WorkoutInfo } from '$lib/types';

	export let workout: WorkoutInfo;
	export let deletionCallback;
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive' }) + 'm-4'}>Delete</Dialog.Trigger>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Are you sure you want to delete this exercise?</Dialog.Title>
			<Dialog.Description>This cannot be undone.</Dialog.Description>
		</Dialog.Header>
		<Workout {workout} brief={true} />
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: 'ghost' })}>Cancel</Dialog.Close>
			<Dialog.Close
				class={buttonVariants({ variant: 'destructive' })}
				on:click={() => deletionCallback(workout)}>Delete</Dialog.Close
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
