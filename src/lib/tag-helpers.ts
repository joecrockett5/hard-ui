import { HARD_API } from '$env/static/private';
import { type Tag } from '$lib/types';

export const getTags = async (token: string, objectId: string) => {
	console.log(`Getting tags for ${objectId}`);
	if (!token) {
		console.log('Missing token');
		return;
	}
	const response = await fetch(`${HARD_API}/tags?target=${objectId}`, {
		headers: { Authorization: `Bearer ${token}` }
	});
	const tags = await response.json();
	return tags;
};

export const postTags = async (token: string, targetId: string, tags: Tag[]) => {
	console.log(`Posting tags for ${targetId}`);
	if (!token) {
		console.log('Missing token');
		return;
	}
	const failedTags: Tag[] = [];
	tags.forEach((tag) => {
		console.log(`Tagging ${targetId} with ${tag.name}`);
		const res = await fetch(`${HARD_API}/tag-joins`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${token}` },
			body: JSON.stringify({
				timestamp: new Date().toISOString(),
				target_id: targetId,
				tag_id: tag.objectId
			})
		});
		if (!res.ok) {
			failedTags.push(tag);
		}
	});
	if (failedTags.length > 0) {
		console.log(`Failed to tag ${targetId} with ${failedTags.map((tag) => tag.name).join(', ')}`);
		return failedTags;
	}
};

export const putTags = async (token: string, tags: Tag[]) => {
	console.log(`Updating tags`);
	if (!token) {
		console.log('Missing token');
		return;
	}
	const failedTags: Tag[] = [];
	tags.forEach((tag) => {
		console.log(`Updating ${tag.name} instance (${tag.objectId})`);
		const res = await fetch(`${HARD_API}/tag-joins/${tag.objectId}`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${token}` },
			body: JSON.stringify(tag)
		});
		if (!res.ok) {
			failedTags.push(tag);
		}
	});
	if (failedTags.length > 0) {
		console.log(
			`Failed to update tag(s) with id(s): ${failedTags.map((tag) => tag.objectId).join(', ')}`
		);
		return failedTags;
	}
};

export const deleteTags = async (token: string, tags: Tag[]) => {
	console.log(`Deleting tags`);
	if (!token) {
		console.log('Missing token');
		return;
	}
	const failedTags: Tag[] = [];
	tags.forEach((tag) => {
		console.log(`Deleting ${tag.name} instance (${tag.objectId})`);
		const res = await fetch(`${HARD_API}/tag-joins/${tag.objectId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${token}` }
		});
		if (!res.ok) {
			failedTags.push(tag);
		}
	});
	if (failedTags.length > 0) {
		console.log(
			`Failed to delete tag(s) with id(s): ${failedTags.map((tag) => tag.objectId).join(', ')}`
		);
		return failedTags;
	}
};
