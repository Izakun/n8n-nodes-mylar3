import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class Mylar3Api implements ICredentialType {
	name = 'mylar3Api';

	displayName = 'Mylar3 API';

	icon = 'file:mylar3Api.svg' as const;

	documentationUrl = 'https://github.com/mylar3/mylar3/wiki';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://mylar3:8090',
			required: true,
			description: 'Base URL of the Mylar3 instance (e.g. http://mylar3:8090). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Mylar3 API key (Settings → Web Interface → API)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				apikey: '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api',
			qs: { cmd: 'getVersion' },
		},
	};
}
