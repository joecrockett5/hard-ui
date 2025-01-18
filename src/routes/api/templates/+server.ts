import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Template } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercise_date
	// will then add tag support
	console.log('GET /api/templates');
	const token = url.searchParams.get('token');
	if (!token || token == undefined) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/templates`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawTemplates = await response.json();
	const templates: Template[] = [];
	for (const template of rawTemplates) {
		templates.push({
			userId: template.user_id,
			timestamp: template.timestamp,
			objectType: template.object_type,
			objectId: template.object_id,
			name: template.name,
			description: template.description ?? ''
		});
	}
	return new Response(JSON.stringify(templates), {
		status: response.status
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api//templates');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		name: json.name,
		description: json.description
	};
	const response = await fetch(`${HARD_API}/templates`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	return response;
};
