import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Template } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { templateId } = params;
	console.log(`GET /api/templates/${templateId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercises/${templateId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const json = await response.json();
	const formattedBody: Template = {
		userId: json.user_id,
		timestamp: json.timestamp,
		objectType: json.object_type,
		objectId: json.object_id,
		name: json.name,
		description: json.description
	};
	return new Response(JSON.stringify(formattedBody), {
		status: response.status
	});
};

export const PUT: RequestHandler = async ({ url, params, request }) => {
	const { templateId } = params;
	console.log(`PUT /api/templates/${templateId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		timestamp: json.timestamp,
		object_id: json.objectId,
		name: json.name,
		description: json.description
	};
	const response = await fetch(`${HARD_API}/templates/${templateId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	return response;
};

export const DELETE: RequestHandler = async ({ url, params }) => {
	const { templateId } = params;
	console.log(`DELETE /api/templates/${templateId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/templates/${templateId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});
	return response;
};
