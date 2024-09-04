import type { PageLoad } from './$types';
import type { Exercise, WorkoutInfo } from '$lib/types';

export const load = (async ({ params }) => {
	const { date, workoutTitle } = params;

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

	const workoutInfo: WorkoutInfo = {
		date: '2023-01-01',
		workoutTitle: 'Test Workout',
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
		notes: 'This is a note'
	};
	return {
		date,
		workoutTitle,
		exercises,
		workoutInfo
	};
}) satisfies PageLoad;
