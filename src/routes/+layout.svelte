<script lang="ts">
	import '../app.css';

	import { Amplify } from 'aws-amplify';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import RedPlus from '$lib/svg/red-plus.svelte';

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: 'eu-west-2_g70ekREnm',
				userPoolClientId: '2pa9i84eu8oflrarbm9v4hg3pc',
				signUpVerificationMethod: 'code',
				loginWith: {
					oauth: {
						domain: 'hard.auth.eu-west-2.amazoncognito.com',
						scopes: ['openid', 'email'],
						redirectSignIn: ['http://localhost:5173'],
						redirectSignOut: ['http://localhost:5173'],
						responseType: 'code'
					}
				}
			}
		}
	});
</script>

<Sheet.Root>
	<Sheet.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon" class="fixed right-4 bottom-4 z-50">
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

<div class="mx-4 mt-4">
	<ScrollArea>
		<slot />
	</ScrollArea>
</div>
