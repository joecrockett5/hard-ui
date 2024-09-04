import type { PageLoad } from './$types';
import type { Exercise } from '$lib/types';

export const load = (async ({ params }) => {
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
			]
		}
	];

	return {
		exercises
	};
}) satisfies PageLoad;
