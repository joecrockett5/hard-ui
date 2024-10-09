import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	console.log('GET /api/workouts');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	return response;
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/workouts');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: request.body
	});
	return response;
};
