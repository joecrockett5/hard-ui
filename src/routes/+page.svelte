<script lang="ts">
	import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<img src="/hard-logo.png" alt="Hard Logo" class="h-64 w-64 mx-auto rounded-xl mt-12 mb-4" />

{#await getCurrentUser() then user}
	<p class="text-2xl mt-4 text-center">Current User: {user.userId}</p>
{/await}

<Button
	on:click={async () => {
		console.log('Fetching workouts');
		const session = await fetchAuthSession();
		fetch(`/api/workouts?token=${session.tokens?.idToken}`);
	}}>Fetch Workouts</Button
>
