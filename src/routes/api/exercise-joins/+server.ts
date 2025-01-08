import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Exercise } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercisejoin_date
	// will then add tag support
	const exerciseId = url.searchParams.get('exercise');
	const workoutId = url.searchParams.get('workout');
	console.log(
		'GET /api/exercise-joins' +
			(exerciseId ? '?exercise=' + exerciseId : '') +
			(workoutId ? '&workout=' + workoutId : '')
	);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(
		`${HARD_API}/exercise-joins` +
			(exerciseId ? '?exercise=' + exerciseId : '') +
			(workoutId ? '&workout=' + workoutId : ''),
		{
			headers: { Authorization: `Bearer ${token}` }
		}
	);
	const rawExerciseJoins = await response.json();
	const exerciseJoins = [];
	for (const join of rawExerciseJoins) {
		exerciseJoins.push({
			userId: join.user_id,
			timestamp: join.timestamp,
			objectType: join.object_type,
			objectId: join.object_id,
			exerciseId: join.exercise_id,
			workoutId: join.workout_id
		});
	}
	return new Response(JSON.stringify(exerciseJoins), {
		status: response.status
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
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	return response;
};

export const DELETE: RequestHandler = async ({ url, request }) => {
	const workoutId = url.searchParams.get('workoutId');
	const exerciseId = url.searchParams.get('exerciseId');
	console.log('DELETE /api/exercise-joins?workoutId=' + workoutId + '&exerciseId=' + exerciseId);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(
		`${HARD_API}/exercise-joins?workout=${workoutId}&exercise=${exerciseId}`,
		{
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		}
	);
	return response;
};
