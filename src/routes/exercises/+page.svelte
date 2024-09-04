<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Exercise } from '$lib/types';
	import NewItem from '$lib/hard-components/new-item.svelte';

	let exercises: Exercise[] = [];
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Exercises</Card.Title>
		<Card.Description>All registered exercises</Card.Description>
	</Card.Header>
</Card.Root>

{#each exercises as exercise}
	<Card.Root>
		<Card.Header>
			<Card.Title>{exercise.name}</Card.Title>
			<Card.Description>{exercise.description}</Card.Description>
		</Card.Header>
	</Card.Root>
{/each}

<NewItem item="Exercise">
	<!-- TODO: Add NewItem form -->
</NewItem>
