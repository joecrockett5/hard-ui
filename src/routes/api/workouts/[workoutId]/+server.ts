import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Workout } from '$lib/types';

export const GET: RequestHandler = async ({ url, params }) => {
	const { workoutId } = params;
	console.log(`GET /api/workouts/${workoutId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts/${workoutId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const json = await response.json();
	const formattedBody: Workout = {
		userId: json.user_id,
		timestamp: json.timestamp,
		objectType: json.object_type,
		objectId: json.object_id,
		workoutDate: json.workout_date,
		notes: json.notes,
		title: json.title
	};
	return new Response(JSON.stringify(formattedBody), {
		status: response.status,
		headers: response.headers
	});
};

export const PUT: RequestHandler = async ({ url, params, request }) => {
	const { workoutId } = params;
	console.log(`PUT /api/workouts/${workoutId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		timestamp: json.timestamp,
		object_id: json.objectId,
		workout_date: json.workoutDate,
		notes: json.notes,
		title: json.title
	};
	const response = await fetch(`${HARD_API}/workouts/${workoutId}`, {
		method: 'PUT',
		headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify(formattedBody)
	});
	return response;
};

export const DELETE: RequestHandler = async ({ url, params }) => {
	const { workoutId } = params;
	console.log(`DELETE /api/workouts/${workoutId}`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts/${workoutId}`, {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${token}` }
	});
	console.log(response.status);
	return response;
};
