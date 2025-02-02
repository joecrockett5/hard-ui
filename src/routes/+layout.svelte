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
	import { browser } from '$app/environment';

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

	const getIdToken = async () => {
		const session = await fetchAuthSession();
		if (session.tokens?.idToken !== undefined && browser) {
			console.log('Setting idToken to ', session.tokens.idToken.toString());
			document.cookie = `idToken=${session.tokens.idToken.toString()}; path=/`;
			return session.tokens.idToken.toString();
		}
		return undefined;
	};
</script>

{#await getIdToken() then idToken}
	{#if idToken}
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
					<Sheet.Close>
						<Sheet.Title><a href="/">ハード</a></Sheet.Title>
						<Sheet.Description>ハードトレーニングアプリ</Sheet.Description>
					</Sheet.Close>
				</Sheet.Header>
				<Sheet.Close class="w-full">
					<div class="grid gap-2 py-4">
						<div class="grid grid-cols-2 items-center gap-4">
							<Button href="/workouts" variant="secondary" class="h-20">トレーニング</Button>
							<Button href="/exercises" variant="secondary" class="h-20">エクササイズ</Button>
						</div>
					</div>
				</Sheet.Close>
			</Sheet.Content>
		</Sheet.Root>

		<div class="mx-4 mb-4">
			<ScrollArea>
				<slot />
			</ScrollArea>
		</div>
	{:else}
		<p>サインインしてください</p>
		<Button class="mt-4" on:click={() => signInWithRedirect()}>ログイン</Button>
	{/if}
{/await}
