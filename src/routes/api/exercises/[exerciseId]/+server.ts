import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { getTags, putTags, deleteTags } from '$lib/tag-helpers';
import { type Exercise } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { exerciseId } = params;
	console.log(`GET /api/exercises/${exerciseId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercises/${exerciseId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const tags = await getTags(token, exerciseId);
	const json = await response.json();
	const formattedBody: Exercise = {
		userId: json.user_id,
		timestamp: json.timestamp,
		objectType: json.object_type,
		objectId: json.object_id,
		name: json.name,
		description: json.description,
		tags
	};
	return new Response(JSON.stringify(formattedBody), {
		status: response.status,
		headers: response.headers
	});
};

export const PUT: RequestHandler = async ({ url, params, request }) => {
	const { exerciseId } = params;
	console.log(`PUT /api/exercises/${exerciseId}`);
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
		name: json.name,
		description: json.description
	};
	const response = await fetch(`${HARD_API}/exercises/${exerciseId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await putTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};

export const DELETE: RequestHandler = async ({ url, params }) => {
	const { exerciseId } = params;
	console.log(`DELETE /api/exercises/${exerciseId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const tags = await getTags(token, exerciseId);
	const response = await fetch(`${HARD_API}/exercises/${exerciseId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});
	const failedTags = await deleteTags(token, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
