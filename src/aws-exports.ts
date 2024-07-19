const amplifyConfig = {
	aws_project_region: '$REGION',
	aws_cognito_region: '$REGION',
	aws_user_pools_id: '$USER_POOL_ID',
	aws_user_pools_web_client_id: '$USER_POOL_CLIENT_ID',
	oauth: {
		domain: '$USER_POOL_DOMAIN.auth.$REGION.amazoncognito.com'
	},
	aws_cognito_username_attributes: ['EMAIL'],
	aws_cognito_social_providers: [],
	aws_cognito_signup_attributes: [],
	aws_cognito_mfa_configuration: 'OFF',
	aws_cognito_mfa_types: [],
	aws_cognito_password_protection_settings: {
		passwordPolicyMinLength: 10,
		passwordPolicyCharacters: [
			'REQUIRES_LOWERCASE',
			'REQUIRES_UPPERCASE',
			'REQUIRES_NUMBERS',
			'REQUIRES_SYMBOLS'
		]
	},
	aws_cognito_verification_mechanisms: ['EMAIL']
};

export default amplifyConfig;
