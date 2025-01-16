import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Exercise } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercise_date
	// will then add tag support
	console.log('GET /api/exercises');
	const token = url.searchParams.get('token');
	const workout = url.searchParams.get('workout');
	if (!token || token == undefined) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercises` + (workout ? `?workout=${workout}` : ''), {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawexercises = await response.json();
	const exercises: Exercise[] = [];
	for (const exercise of rawexercises) {
		exercises.push({
			userId: exercise.user_id,
			timestamp: exercise.timestamp,
			objectType: exercise.object_type,
			objectId: exercise.object_id,
			name: exercise.name,
			description: exercise.description ?? ''
		});
	}
	return new Response(JSON.stringify(exercises), {
		status: response.status
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/exercises');
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
	const response = await fetch(`${HARD_API}/exercises`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	return response;
};
