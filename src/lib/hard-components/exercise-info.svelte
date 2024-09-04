<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { Exercise } from '$lib/types';

	export let exercise: Exercise;
</script>

<Card.Root class="mt-4">
	<Button class="float-right top-4 right-4" variant="ghost">Edit</Button>
	<!-- TODO: Add Edit button -->
	<Card.Header>
		<Card.Title>{exercise.name}</Card.Title>
		<Card.Description>{exercise.description}</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if exercise.tags}
			{#each exercise.tags as tag}
				<div class="flex gap-2 items-center">
					<span class="rounded-full w-4 h-4 bg-gray-200" style="background-color: {tag.color}" />
					<span>{tag.name}</span>
				</div>
			{/each}
		{/if}
	</Card.Content>
</Card.Root>
