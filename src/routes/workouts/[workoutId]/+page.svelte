<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';
	import NewItem from '$lib/hard-components/new-item.svelte';

	export let data;

	const { exercises, workoutInfo } = data;
</script>

<WorkoutInfoComponent workout={workoutInfo} />

<NewItem item="Exercise">
	<!-- TODO: Add NewItem form -->
</NewItem>

{#each exercises as exercise}
	<ExerciseComponent {exercise} />
{/each}
