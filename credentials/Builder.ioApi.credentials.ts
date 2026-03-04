import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BuilderioApi implements ICredentialType {
	name = 'builderioApi';
	displayName = 'Builder.io API';
	documentationUrl = 'https://www.builder.io/c/docs/using-api';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'The API key for accessing Builder.io API. Generate this in your Builder.io dashboard under Account Settings > API Keys.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			required: true,
			default: 'https://builder.io/api/v2',
			description: 'The base URL for the Builder.io API',
		},
	];
}