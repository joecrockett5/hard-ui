import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { fetchAuthSession } from 'aws-amplify/auth';

export const GET: RequestHandler = async () => {
	console.log('GET /api/workouts');
	const session = await fetchAuthSession();
	if (!session.tokens?.idToken) {
		console.log('Missing tokens');
		return new Response('Unauthorized', { status: 401 });
	}
	const response = await fetch(`${HARD_API}/workouts`, {
		headers: { Authorization: `Bearer ${session.tokens.idToken}` }
	});
	const json = await response.json();
	console.log(json);
	return json;
};
