import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Exercise } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercisejoin_date
	// will then add tag support
	console.log('GET /api/exercise-joins');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercise-joins`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawExerciseJoins = await response.json();
	const exercises: Exercise[] = [];
	rawExerciseJoins.forEach((exerciseJoin) => {
		const exerciseTags = await getTags(token, exerciseJoin.exercise_id);

		const exerciseResponse = await fetch(`${HARD_API}/exercises/${exerciseJoin.exercise_id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		const exerciseData = await exerciseResponse.json();

		const setsResponse = await fetch(`${HARD_API}/sets?exercise=${exerciseJoin.exercise_id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		const setsData = await setsResponse.json();

		exercises.push({
			userId: exerciseJoin.user_id,
			timestamp: exerciseJoin.timestamp,
			objectType: exerciseData.object_type,
			objectId: exerciseData.object_id,
			joinId: exerciseJoin.object_id,
			workoutId: exerciseJoin.workout_id,
			name: exerciseJoin.title,
			description: exerciseJoin.notes,
			tags: exerciseTags,
			sets: setsData.map((set) => {
				return {
					userId: set.user_id,
					timestamp: set.timestamp,
					objectType: set.object_type,
					objectId: set.object_id,
					setType: set.set_type,
					weight: set.weight,
					weightUnit: set.weight_unit,
					reps: set.reps,
					notes: set.notes,
					exerciseJoinId: set.exercise_join_id
				};
			})
		});
	});
	return new Response(JSON.stringify(exercises), {
		status: response.status,
		headers: response.headers
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/exercise-joins');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		workout_id: json.workoutId,
		exercise_id: json.exerciseId
	};
	const response = await fetch(`${HARD_API}/exercise-joins`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	return response;
};
