import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Tag } from '$lib/types';
import { getTags, postTags } from '$lib/tag-helpers';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by tag_date
	// will then add tag support
	console.log('GET /api/tags');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/tags`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawtags = await response.json();
	const tags: Tag[] = [];
	rawtags.forEach((tag) => {
		tags.push({
			userId: tag.user_id,
			timestamp: tag.timestamp,
			objectType: tag.object_type,
			objectId: tag.object_id,
			name: tag.name,
			colorHex: tag.color_hex
		});
	});
	return new Response(JSON.stringify(tags), {
		status: response.status,
		headers: response.headers
	});
};

export const POST: RequestHandler = async ({ url, request }) => {
	console.log('POST /api/tags');
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	const json = await request.json();
	const formattedBody = {
		name: json.name,
		color_hex: json.colorHex
	};
	const response = await fetch(`${HARD_API}/tags`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(formattedBody)
	});
	return response;
};
