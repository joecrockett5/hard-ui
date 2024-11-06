import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Exercise } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercise_date
	// will then add tag support
	console.log('GET /api/exercises');
	const token = url.searchParams.get('token');
	if (!token || token == undefined) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercises`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawexercises = await response.json();
	const exercises: Exercise[] = [];
	for (const exercise of rawexercises) {
		// const tags = await getTags(token, exercise.object_id);
		const tags = [];
		exercises.push({
			userId: exercise.user_id,
			timestamp: exercise.timestamp,
			objectType: exercise.object_type,
			objectId: exercise.object_id,
			name: exercise.name,
			description: exercise.description ?? '',
			tags
		});
	}
	return new Response(JSON.stringify(exercises), {
		status: response.status,
		headers: response.headers
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
	const tags = json.tags;
	const formattedBody = {
		name: json.name,
		description: json.description
	};
	const response = await fetch(`${HARD_API}/exercises`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await postTags(token, json.objectId, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
