import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Mylar3 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mylar3',
		name: 'mylar3',
		icon: { light: 'file:mylar3.svg', dark: 'file:mylar3.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Query your Mylar3 comics library through its API',
		defaults: { name: 'Mylar3' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mylar3Api', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Comic', value: 'getComic', action: 'Get a comic' },
					{ name: 'Get Index', value: 'getIndex', action: 'Get the comic index' },
					{ name: 'Get Version', value: 'getVersion', action: 'Get the server version' },
					{ name: 'Get Wanted', value: 'getWanted', action: 'Get the wanted list' },
				],
				default: 'getIndex',
			},
			{
				displayName: 'Comic ID',
				name: 'comicId',
				type: 'string',
				default: '',
				required: true,
				description: 'ComicVine ID of the comic to fetch',
				displayOptions: { show: { operation: ['getComic'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const CMD_BY_OP: Record<string, string> = {
			getComic: 'getComic',
			getIndex: 'getIndex',
			getVersion: 'getVersion',
			getWanted: 'getWanted',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('mylar3Api', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;

				const cmd = CMD_BY_OP[operation];
				if (!cmd) {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`, {
						itemIndex: i,
					});
				}

				const qs: IDataObject = { cmd };
				if (operation === 'getComic') {
					qs.id = this.getNodeParameter('comicId', i) as string;
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'mylar3Api', {
					method: 'GET' as IHttpRequestMethods,
					baseURL,
					url: '/api',
					qs,
					json: true,
				} as IHttpRequestOptions);

				returnData.push({
					json: (typeof response === 'object' && response !== null
						? response
						: { result: response }) as IDataObject,
					pairedItem: { item: i },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
