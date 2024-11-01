import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type exercisejoin } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by exercisejoin_date
	// will then add tag support
	console.log('GET /api/exercisejoins');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/exercisejoins`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawexercisejoins = await response.json();
	const exercisejoins: exercisejoin[] = [];
	rawexercisejoins.forEach((exercisejoin) => {
		const tags = await getTags(token, exercisejoin.object_id);
		exercisejoins.push({
			userId: exercisejoin.user_id,
			timestamp: exercisejoin.timestamp,
			objectType: exercisejoin.object_type,
			objectId: exercisejoin.object_id,
			exercisejoinDate: exercisejoin.exercisejoin_date,
			notes: exercisejoin.notes,
			title: exercisejoin.title,
			tags
		});
	});
	return new Response(JSON.stringify(exercisejoins), {
		status: response.status,
		headers: response.headers
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/exercisejoins');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const tags = json.tags;
	const formattedBody = {
		exercisejoin_date: json.exercisejoinDate,
		notes: json.notes,
		title: json.title
	};
	const response = await fetch(`${HARD_API}/exercisejoins`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	const failedTags = await postTags(token, json.objectId, tags);
	console.log(`failed tags: ${failedTags}`);
	return response;
};
