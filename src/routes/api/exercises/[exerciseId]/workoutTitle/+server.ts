import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, params }) => {
	const { exerciseId } = params;
	console.log(`GET /api/exercises/${exerciseId}/workoutTitle`);
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const joinResponse = await fetch(`${HARD_API}/exercises/${exerciseId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const joinJson = await joinResponse.json();
	const workoutResponse = await fetch(`${HARD_API}/workouts/${joinJson.workout_id}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const workoutJson = await workoutResponse.json();
	const formattedBody = {
		workoutTitle: workoutJson.title
	};
	return new Response(JSON.stringify(formattedBody), {
		status: 200
	});
};
