import type { PageLoad } from './$types';

export const load = (async ({ fetch, cookies }) => {
	const idToken = cookies.get('idToken');
	console.log('idToken: ', idToken);
	const response = await fetch(`/api/exercises?token=${idToken}`);

	if (!response.ok) {
		throw new Error('Failed to fetch exercises');
	}

	const exercises = await response.json();
	console.log('exercises: ', exercises);

	return {
		exercises
	};
}) satisfies PageLoad;
