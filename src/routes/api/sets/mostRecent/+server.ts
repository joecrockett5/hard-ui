import { HARD_API } from '$env/static/private';
import { type RequestHandler } from '@sveltejs/kit';
import { type Set } from '$lib/types';

export const GET: RequestHandler = async ({ url }) => {
	// Need to update backend to allow for filtering by set_date
	// will then add tag support
	const exerciseId = url.searchParams.get('exercise');
	console.log('GET /api/sets/mostRecent' + (exerciseId ? '?exercise=' + exerciseId : ''));
	const token = url.searchParams.get('token');
	if (!token) {
		console.log('Missing token');
		return new Response('Unauthorized', { status: 401 });
	}
	if (!exerciseId) {
		console.log('Missing exerciseId');
		return new Response('Missing exerciseId', { status: 400 });
	}
	// get ex joins where exercise_id = exerciseId
	const exJoinsResponse = await fetch(`${HARD_API}/exercise-joins?exercise=${exerciseId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const exJoins = await exJoinsResponse.json();
	if (exJoins.length < 2) {
		return new Response('No other instances found', { status: 404 });
	}
	// order by timestamp desc
	exJoins.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	// get sets where exercise_join_id = ex joins
	const setsResponse = await fetch(`${HARD_API}/sets?exercise=${exerciseId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const rawSets = await setsResponse.json();
	const relevantSets = rawSets.filter((set) => exJoins[1].object_id === set.exercise_join_id);
	if (relevantSets.length === 0) {
		return new Response('No relevant sets found', { status: 404 });
	}

	// order by timestamp asc
	relevantSets.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

	const sets: Set[] = [];
	for (const set of relevantSets) {
		sets.push({
			userId: set.user_id,
			timestamp: set.timestamp,
			objectType: set.object_type,
			objectId: set.object_id,
			setType: set.set_type,
			weight: set.weight,
			weightUnit: set.unit,
			reps: set.reps,
			notes: set.notes,
			exerciseJoinId: set.exercise_join_id
		});
	}
	return new Response(JSON.stringify(sets), {
		status: 200
	});
};
