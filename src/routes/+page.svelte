<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';

	const exercises = [
		{
			name: 'Squat',
			description: 'This is a description',
			tags: ['Squat', 'Bench Press'],
			sets: [
				{
					setType: 'warmup',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Squat', 'Bench Press'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Squat', 'Bench Press'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Squat', 'Bench Press'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				}
			]
		},
		{
			name: 'Bench Press',
			description: 'This is a description',
			tags: ['Bench Press', 'Squat'],
			sets: [
				{
					setType: 'warmup',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Bench Press', 'Squat'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Bench Press', 'Squat'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: ['Bench Press', 'Squat'],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				}
			]
		}
	];
</script>

<img src="/hard-logo.png" alt="Hard Logo" class="h-64 w-64 mx-auto rounded-xl mt-16" />

{#each exercises as exercise}
	<ExerciseComponent {exercise} />
{/each}
