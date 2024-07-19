<script lang="ts">
	import { Auth } from 'aws-amplify';

	async function login() {
		const user = await Auth.signIn('jpcrock@outlook.com', 'LaLaLa1234');
		return user;
	}
	console.log(login());
</script>

<p>login page</p>
