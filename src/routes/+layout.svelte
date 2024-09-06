<script lang="ts">
	import '../app.css';

	import {
		PUBLIC_USER_POOL_ID,
		PUBLIC_USER_POOL_CLIENT_ID,
		PUBLIC_OAUTH_DOMAIN,
		PUBLIC_REDIRECT
	} from '$env/static/public';
	import { Amplify } from 'aws-amplify';
	import { fetchAuthSession, signInWithRedirect } from 'aws-amplify/auth';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import RedPlus from '$lib/svg/red-plus.svelte';

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: PUBLIC_USER_POOL_ID,
				userPoolClientId: PUBLIC_USER_POOL_CLIENT_ID,
				signUpVerificationMethod: 'code',
				loginWith: {
					oauth: {
						domain: PUBLIC_OAUTH_DOMAIN,
						scopes: ['openid', 'email'],
						redirectSignIn: [PUBLIC_REDIRECT],
						redirectSignOut: [PUBLIC_REDIRECT],
						responseType: 'code'
					}
				}
			}
		}
	});
</script>

{#await fetchAuthSession() then session}
	{#if session.tokens?.idToken}
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="ghost"
					size="icon"
					class="fixed right-4 bottom-4 z-50"
				>
					<RedPlus />
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="bottom">
				<Sheet.Header>
					<Sheet.Title><a href="/">Hard</a></Sheet.Title>
					<Sheet.Description>lorem ipsum dolor sit amet, consectetur adipiscing</Sheet.Description>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					<div class="grid grid-cols-4 items-center gap-4">
						<Button href="/workouts" variant="secondary">Workouts</Button>
						<Button href="/exercises" variant="secondary">Exercises</Button>
					</div>
					<div class="grid grid-cols-4 items-center gap-4">
						<Button href="/tags" variant="secondary">Tags</Button>
						<Button href="/meso-cycles" variant="secondary">Meso Cycles</Button>
					</div>
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<div class="mx-4 mb-4">
			<ScrollArea>
				<slot />
			</ScrollArea>
		</div>
	{:else}
		<p>Please Log In</p>
		<Button class="mt-4" on:click={() => signInWithRedirect()}>Sign In</Button>
	{/if}
{/await}
