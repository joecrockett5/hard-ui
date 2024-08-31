<script>
	import '../app.css';

	import { Amplify } from 'aws-amplify';

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: process.env.USER_POOL_ID,
				userPoolClientId: process.env.USER_POOL_CLIENT_ID,
				signUpVerificationMethod: 'code',
				loginWith: {
					oauth: {
						domain: `${process.env.USER_POOL_DOMAIN}.auth.${process.env.REGION}.amazoncognito.com`,
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

<slot />
