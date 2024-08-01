<script lang="ts">
	import { Amplify } from 'aws-amplify';

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

	import { signInWithRedirect } from 'aws-amplify/auth';

	function signIn() {
		console.log('running');
		signInWithRedirect();
	}
</script>

<button on:click={signIn}> Login </button>
