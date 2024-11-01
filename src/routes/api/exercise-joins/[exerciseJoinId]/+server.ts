import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { getTags, putTags, deleteTags } from '$lib/tag-helpers';
import { type Exercise } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { exerciseJoinId } = params;
	console.log(`GET /api/exercise-joins/${exerciseJoinId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercise-joins/${exerciseJoinId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const exerciseJoin = await response.json();

	const exerciseTags = await getTags(token, exerciseJoin.exercise_id);

	const exerciseResponse = await fetch(`${HARD_API}/exercises/${exerciseJoin.exercise_id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const exerciseData = await exerciseResponse.json();

	const setsResponse = await fetch(`${HARD_API}/sets?exercise=${exerciseJoin.exercise_id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const setsData = await setsResponse.json();

	const formattedBody = {
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
	};
	return new Response(JSON.stringify(formattedBody), {
		status: response.status,
		headers: response.headers
	});
};

export const PUT: RequestHandler = async ({ url, params, request }) => {
	const { exercisejoinId } = params;
	console.log(`PUT /api/exercise-joins/${exercisejoinId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const tags = json.tags;
	const formattedBody = {
		timestamp: json.timestamp,
		object_id: json.objectId,
		exercisejoin_date: json.exercisejoinDate,
		notes: json.notes,
		title: json.title
	};
	const response = await fetch(`${HARD_API}/exercisejoins/${exercisejoinId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await putTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};

export const DELETE: RequestHandler = async ({ url, params }) => {
	const { exercisejoinId } = params;
	console.log(`DELETE /api/exercisejoins/${exercisejoinId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const tags = await getTags(token, exercisejoinId);
	const response = await fetch(`${HARD_API}/exercisejoins/${exercisejoinId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});
	const failedTags = await deleteTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
