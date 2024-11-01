import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by workout_date
	// will then add tag support
	console.log('GET /api/workouts');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawWorkouts = await response.json();
	const workouts = [];
	rawWorkouts.forEach((workout) => {
		const tags = await getTags(token, workout.object_id);
		workouts.push({
			userId: workout.user_id,
			timestamp: workout.timestamp,
			objectType: workout.object_type,
			objectId: workout.object_id,
			workoutDate: workout.workout_date,
			notes: workout.notes,
			title: workout.title,
			tags
		});
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
	const json = await request.json();
	const tags = json.tags;
	const formattedBody = {
		timestamp: new Date().toISOString(),
		object_id: json.objectId,
		workout_date: json.workoutDate,
		notes: json.notes,
		title: json.title
	};
	const response = await fetch(`${HARD_API}/workouts`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await postTags(token, json.objectId, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
