<script lang="ts">
	import ExerciseComponent from '$lib/hard-components/exercise.svelte';

	const exercises: Exercise[] = [
		{
			name: 'Squat',
			description: 'This is a description',
			tags: [
				{
					name: 'Squat',
					color: 'blue'
				},
				{
					name: 'Bench Press',
					color: 'red'
				}
			],
			sets: [
				{
					setType: 'warmup',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Squat',
							color: 'blue'
						},
						{
							name: 'Bench Press',
							color: 'red'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Squat',
							color: 'blue'
						},
						{
							name: 'Bench Press',
							color: 'red'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Squat',
							color: 'blue'
						},
						{
							name: 'Bench Press',
							color: 'red'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				}
			]
		},
		{
			name: 'Bench Press',
			description: 'This is a description',
			tags: [
				{
					name: 'Bench Press',
					color: 'red'
				},
				{
					name: 'Squat',
					color: 'blue'
				}
			],
			sets: [
				{
					setType: 'warmup',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Bench Press',
							color: 'red'
						},
						{
							name: 'Squat',
							color: 'blue'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Bench Press',
							color: 'red'
						},
						{
							name: 'Squat',
							color: 'blue'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				},
				{
					setType: 'working',
					weight: 5,
					weightUnit: 'kg',
					reps: 5,
					tags: [
						{
							name: 'Bench Press',
							color: 'red'
						},
						{
							name: 'Squat',
							color: 'blue'
						}
					],
					notes: 'This is a note',
					comparison: 'This is a comparison'
				}
			]
		}
	];
</script>

<img src="/hard-logo.png" alt="Hard Logo" class="h-64 w-64 mx-auto rounded-xl mt-16 mb-4" />

{#each exercises as exercise}
	<ExerciseComponent {exercise} />
{/each}
