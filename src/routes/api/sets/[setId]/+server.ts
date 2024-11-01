import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { getTags, putTags, deleteTags } from '$lib/tag-helpers';
import { type Set } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { setId } = params;
	console.log(`GET /api/sets/${setId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/sets/${setId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const tags = await getTags(token, setId);
	const json = await response.json();
	const formattedBody: Set = {
		userId: json.user_id,
		timestamp: json.timestamp,
		objectType: json.object_type,
		objectId: json.object_id,
		setType: json.set_type,
		weight: json.weight,
		weightUnit: json.weight_unit,
		reps: json.reps,
		notes: json.notes,
		exerciseJoinId: json.exercise_join_id,
		tags
	};
	return new Response(JSON.stringify(formattedBody), {
		status: response.status,
		headers: response.headers
	});
};

export const PUT: RequestHandler = async ({ url, params, request }) => {
	const { setId } = params;
	console.log(`PUT /api/sets/${setId}`);
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
		set_type: json.setType,
		weight: json.weight,
		weight_unit: json.weightUnit,
		reps: json.reps,
		notes: json.notes,
		exercise_join_id: json.exerciseJoinId
	};
	const response = await fetch(`${HARD_API}/sets/${setId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await putTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};

export const DELETE: RequestHandler = async ({ url, params }) => {
	const { setId } = params;
	console.log(`DELETE /api/sets/${setId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const tags = await getTags(token, setId);
	const response = await fetch(`${HARD_API}/sets/${setId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});
	const failedTags = await deleteTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
