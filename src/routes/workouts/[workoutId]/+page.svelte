<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';
	import WorkoutInfoComponent from '$lib/hard-components/workout-info.svelte';

	export let data;

	const { date, workoutTitle, exercises, workoutInfo } = data;
</script>

<WorkoutInfoComponent workout={workoutInfo} />

{#each exercises as exercise}
	<ExerciseComponent {exercise} />
{/each}
