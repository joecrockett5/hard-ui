import type { Exercise, WorkoutInfo, Set } from '$lib/types';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, cookies, params }) => {
	const idToken = cookies.get('idToken');
	const workoutId = params.workoutId;
	console.log('idToken: ', idToken);
	const response = await fetch(`/api/workouts/${workoutId}?token=${idToken}`);

	if (!response.ok) {
		throw new Error('Failed to fetch exercises');
	}

	const workoutInfo: WorkoutInfo = await response.json();

	const exercisesResponse = await fetch(
		`/api/exercises?workout=${workoutInfo.objectId}&token=${idToken}`
	);
	const exercises: Exercise[] = await exercisesResponse.json();

	const possibilitiesResponse = await fetch(`/api/exercises?token=${idToken}`);
	const allExercises: Exercise[] = await possibilitiesResponse.json();

	console.log(`workout: ${workoutInfo.title}, found ${exercises.length} exercises`);

	for (const exercise of exercises) {
		const setsResponse = await fetch(
			`/api/sets?workout=${workoutInfo.objectId}&exercise=${exercise.objectId}&token=${idToken}`
		);
		const sets: Set[] = await setsResponse.json();
		console.log(
			`found ${sets.length} sets for ${exercise.name} from /api/sets?workout=${workoutInfo.objectId}&exercise=${exercise.objectId}`
		);
		exercise.sets = sets;
	}

	exercises.sort((a, b) => {
		const aHasSets = a.sets.length > 0;
		const bHasSets = b.sets.length > 0;

		// Objects with at least one set come first
		if (aHasSets && !bHasSets) return -1;
		if (!aHasSets && bHasSets) return 1;
		if (!aHasSets && !bHasSets) return 0;

		// Both have sets; compare the date on the 0th element.
		const dateA = new Date(a.sets[0].timestamp).getTime();
		const dateB = new Date(b.sets[0].timestamp).getTime();
		return dateA - dateB;
	});

	return {
		workoutInfo,
		exercises,
		allExercises
	};
}) satisfies PageLoad;
