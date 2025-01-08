import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Set } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by set_date
	// will then add tag support
	const workoutId = url.searchParams.get('workout');
	const exerciseId = url.searchParams.get('exercise');
	console.log(
		'GET /api/sets' +
			(workoutId ? '?workout=' + workoutId : '') +
			(exerciseId ? '&exercise=' + exerciseId : '')
	);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(
		`${HARD_API}/sets` +
			(workoutId ? '?workout_id=' + workoutId : '') +
			(exerciseId ? '&exercise_id=' + exerciseId : ''),
		{
			headers: { Authorization: `Bearer ${token}` }
		}
	);
	const rawSets = await response.json();
	const sets: Set[] = [];
	for (const set of rawSets) {
		sets.push({
			userId: set.user_id,
			timestamp: set.timestamp,
			objectType: set.object_type,
			objectId: set.object_id,
			setType: set.set_type,
			weight: set.weight,
			weightUnit: set.unit,
			reps: set.reps,
			notes: set.notes,
			exerciseJoinId: set.exercise_join_id
		});
	}
	return new Response(JSON.stringify(sets), {
		status: response.status
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/sets');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		set_type: json.setType,
		weight: json.weight,
		unit: json.weightUnit,
		reps: json.reps,
		notes: json.notes,
		exercise_join_id: json.exerciseJoinId
	};
	console.log(formattedBody);
	const response = await fetch(`${HARD_API}/sets`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	// const failedTags = await postTags(token, json.objectId, tags);
	// console.log(`failed tags: ${failedTags}`);
	const responseJson = await response.json();
	const formattedResponse = {
		objectId: responseJson.object_id,
		objectType: responseJson.object_type,
		timestamp: responseJson.timestamp,
		userId: responseJson.user_id,
		setType: responseJson.set_type,
		weight: responseJson.weight,
		weightUnit: responseJson.unit,
		reps: responseJson.reps,
		notes: responseJson.notes,
		exerciseJoinId: responseJson.exercise_join_id
	};
	return new Response(JSON.stringify(formattedResponse), {
		status: response.status
	});
};
