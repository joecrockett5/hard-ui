import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { getTags, putTags, deleteTags } from '$lib/tag-helpers';
import { type exercisejoin } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { exercisejoinId } = params;
	console.log(`GET /api/exercisejoins/${exercisejoinId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercisejoins/${exercisejoinId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const tags = await getTags(token, exercisejoinId);
	const json = await response.json();
	const formattedBody: exercisejoin = {
		userId: json.user_id,
		timestamp: json.timestamp,
		objectType: json.object_type,
		objectId: json.object_id,
		exercisejoinDate: json.exercisejoin_date,
		notes: json.notes,
		title: json.title,
		tags
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
