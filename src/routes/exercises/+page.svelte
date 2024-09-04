<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import ExerciseInfoComponent from '$lib/hard-components/exercise-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';

	export let data;

	let { exercises } = data;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Exercises</Card.Title>
		<Card.Description>All registered exercises</Card.Description>
	</Card.Header>
</Card.Root>

<NewItem item="Exercise">
	<!-- TODO: Add NewItem form -->
</NewItem>

{#each exercises as exercise}
	<ExerciseInfoComponent {exercise} />
{/each}
