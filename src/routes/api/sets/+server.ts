import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Set } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by set_date
	// will then add tag support
	console.log('GET /api/sets');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/sets`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawSets = await response.json();
	const sets: Set[] = [];
	rawSets.forEach((set) => {
		const tags = await getTags(token, set.object_id);
		sets.push({
			userId: set.user_id,
			timestamp: set.timestamp,
			objectType: set.object_type,
			objectId: set.object_id,
			setType: set.set_type,
			weight: set.weight,
			weightUnit: set.weight_unit,
			reps: set.reps,
			notes: set.notes,
			exerciseJoinId: set.exercise_join_id,
			tags
		});
	});
	return new Response(JSON.stringify(sets), {
		status: response.status,
		headers: response.headers
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/sets');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const tags = json.tags;
	const formattedBody = {
		set_type: json.setType,
		weight: json.weight,
		weight_unit: json.weightUnit,
		reps: json.reps,
		notes: json.notes,
		exercise_join_id: json.exerciseJoinId
	};
	const response = await fetch(`${HARD_API}/sets`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await postTags(token, json.objectId, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
