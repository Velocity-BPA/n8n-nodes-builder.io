/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-builderio/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Builderio implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Builder.io',
    name: 'builderio',
    icon: 'file:builderio.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Builder.io API',
    defaults: {
      name: 'Builder.io',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'builderioApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Content',
            value: 'content',
          },
          {
            name: 'Models',
            value: 'models',
          },
          {
            name: 'Pages',
            value: 'pages',
          },
          {
            name: 'unknown',
            value: 'unknown',
          },
          {
            name: 'Symbols',
            value: 'symbols',
          },
          {
            name: 'Webhooks',
            value: 'webhooks',
          },
          {
            name: 'unknown',
            value: 'unknown',
          },
          {
            name: 'Publishing',
            value: 'publishing',
          }
        ],
        default: 'content',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['content'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all content entries for a model',
      action: 'Get all content entries',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get a specific content entry',
      action: 'Get a content entry',
    },
    {
      name: 'Create',
      value: 'create',
      description: 'Create new content entry',
      action: 'Create a content entry',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update existing content entry',
      action: 'Update a content entry',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete content entry',
      action: 'Delete a content entry',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['models'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all content models',
      action: 'Get all content models',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get specific content model',
      action: 'Get content model',
    },
    {
      name: 'Create',
      value: 'create',
      description: 'Create new content model',
      action: 'Create content model',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update content model',
      action: 'Update content model',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete content model',
      action: 'Delete content model',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['pages'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all pages',
      action: 'Get all pages',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get a specific page',
      action: 'Get a page',
    },
    {
      name: 'Create',
      value: 'create',
      description: 'Create a new page',
      action: 'Create a page',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update page content',
      action: 'Update a page',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete a page',
      action: 'Delete a page',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['symbols'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all symbols',
      action: 'Get all symbols',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get specific symbol',
      action: 'Get specific symbol',
    },
    {
      name: 'Create',
      value: 'create',
      description: 'Create new symbol',
      action: 'Create new symbol',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update symbol',
      action: 'Update symbol',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete symbol',
      action: 'Delete symbol',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all webhooks',
      action: 'Get all webhooks',
    },
    {
      name: 'Get',
      value: 'get',
      description: 'Get specific webhook',
      action: 'Get webhook',
    },
    {
      name: 'Create',
      value: 'create',
      description: 'Create new webhook',
      action: 'Create webhook',
    },
    {
      name: 'Update',
      value: 'update',
      description: 'Update webhook configuration',
      action: 'Update webhook',
    },
    {
      name: 'Delete',
      value: 'delete',
      description: 'Delete webhook',
      action: 'Delete webhook',
    },
  ],
  default: 'getAll',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['publishing'],
    },
  },
  options: [
    {
      name: 'Publish Content',
      value: 'publish',
      description: 'Publish content changes',
      action: 'Publish content',
    },
    {
      name: 'Unpublish Content',
      value: 'unpublish',
      description: 'Unpublish content',
      action: 'Unpublish content',
    },
    {
      name: 'Get Publishing Status',
      value: 'getStatus',
      description: 'Get publishing status',
      action: 'Get publishing status',
    },
    {
      name: 'Get Content Versions',
      value: 'getVersions',
      description: 'Get content versions',
      action: 'Get content versions',
    },
  ],
  default: 'publish',
},
      // Parameter definitions
{
  displayName: 'Model',
  name: 'model',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['getAll', 'get', 'create', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The content model name',
},
{
  displayName: 'Content ID',
  name: 'contentId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['get', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The unique identifier of the content entry',
},
{
  displayName: 'Query',
  name: 'query',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['getAll'],
    },
  },
  default: '{}',
  description: 'Query parameters for filtering content',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['getAll'],
    },
  },
  default: 10,
  description: 'Maximum number of entries to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Number of entries to skip',
},
{
  displayName: 'Include References',
  name: 'includeRefs',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['get'],
    },
  },
  default: false,
  description: 'Whether to include referenced content',
},
{
  displayName: 'Include Unpublished',
  name: 'includeUnpublished',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['get'],
    },
  },
  default: false,
  description: 'Whether to include unpublished content',
},
{
  displayName: 'Content Data',
  name: 'contentData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['create', 'update'],
    },
  },
  default: '{}',
  description: 'The content data to create or update',
},
{
  displayName: 'Published',
  name: 'published',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['create', 'update'],
    },
  },
  options: [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Published',
      value: 'published',
    },
  ],
  default: 'draft',
  description: 'Publication status of the content',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['content'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'The name of the content entry',
},
{
  displayName: 'Space ID',
  name: 'spaceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['models'],
    },
  },
  default: '',
  description: 'The Builder.io space ID',
},
{
  displayName: 'Include Built-in Models',
  name: 'includeBuiltIn',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['models'],
      operation: ['getAll'],
    },
  },
  default: false,
  description: 'Whether to include built-in content models',
},
{
  displayName: 'Model ID',
  name: 'modelId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['models'],
      operation: ['get', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The ID of the content model',
},
{
  displayName: 'Model Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['models'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'Name of the content model',
},
{
  displayName: 'Model Kind',
  name: 'kind',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['models'],
      operation: ['create'],
    },
  },
  options: [
    {
      name: 'Page',
      value: 'page',
    },
    {
      name: 'Component',
      value: 'component',
    },
    {
      name: 'Data',
      value: 'data',
    },
  ],
  default: 'page',
  description: 'Type of content model to create',
},
{
  displayName: 'Model Data',
  name: 'modelData',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['models'],
      operation: ['create', 'update'],
    },
  },
  default: '{}',
  description: 'JSON data for the content model configuration',
},
{
  displayName: 'Space ID',
  name: 'spaceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pages'],
    },
  },
  default: '',
  description: 'The Builder.io space ID',
},
{
  displayName: 'URL',
  name: 'url',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['getAll'],
    },
  },
  default: '',
  description: 'Filter pages by URL pattern',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['getAll'],
    },
  },
  default: 20,
  description: 'Number of pages to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Number of pages to skip',
},
{
  displayName: 'Page ID',
  name: 'pageId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['get', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The ID of the page',
},
{
  displayName: 'Include References',
  name: 'includeRefs',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['get'],
    },
  },
  default: false,
  description: 'Whether to include referenced content',
},
{
  displayName: 'Page Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'Name of the page',
},
{
  displayName: 'Page URL',
  name: 'pageUrl',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'URL path for the page',
},
{
  displayName: 'Content',
  name: 'content',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['create', 'update'],
    },
  },
  default: '{}',
  description: 'Page content data',
},
{
  displayName: 'Published',
  name: 'published',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['pages'],
      operation: ['update'],
    },
  },
  options: [
    {
      name: 'Draft',
      value: 'draft',
    },
    {
      name: 'Published',
      value: 'published',
    },
  ],
  default: 'draft',
  description: 'Publication status of the page',
},
{
  displayName: 'Symbol ID',
  name: 'symbolId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['get', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The ID of the symbol',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['getAll'],
    },
  },
  default: 100,
  description: 'Number of symbols to retrieve',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['getAll'],
    },
  },
  default: 0,
  description: 'Number of symbols to skip',
},
{
  displayName: 'Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['create'],
    },
  },
  default: '',
  description: 'Name of the symbol',
},
{
  displayName: 'Data',
  name: 'data',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['create', 'update'],
    },
  },
  default: '{}',
  description: 'Symbol data as JSON object',
},
{
  displayName: 'Published',
  name: 'published',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['symbols'],
      operation: ['create', 'update'],
    },
  },
  options: [
    {
      name: 'Published',
      value: 'published',
    },
    {
      name: 'Draft',
      value: 'draft',
    },
  ],
  default: 'draft',
  description: 'Publication status of the symbol',
},
{
  displayName: 'Webhook ID',
  name: 'webhookId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['get', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The ID of the webhook',
},
{
  displayName: 'Space ID',
  name: 'spaceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['getAll', 'get', 'create', 'update', 'delete'],
    },
  },
  default: '',
  description: 'The space ID for the webhook operations',
},
{
  displayName: 'URL',
  name: 'url',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['create', 'update'],
    },
  },
  default: '',
  description: 'The webhook URL (must be HTTPS for production)',
  placeholder: 'https://your-domain.com/webhook',
},
{
  displayName: 'Events',
  name: 'events',
  type: 'multiOptions',
  required: true,
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['create', 'update'],
    },
  },
  options: [
    {
      name: 'Content Created',
      value: 'content.created',
    },
    {
      name: 'Content Updated',
      value: 'content.updated',
    },
    {
      name: 'Content Deleted',
      value: 'content.deleted',
    },
    {
      name: 'Content Published',
      value: 'content.published',
    },
    {
      name: 'Content Unpublished',
      value: 'content.unpublished',
    },
  ],
  default: [],
  description: 'The events to subscribe to',
},
{
  displayName: 'Secret',
  name: 'secret',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['create', 'update'],
    },
  },
  default: '',
  description: 'Optional secret for webhook verification',
},
{
  displayName: 'Active',
  name: 'active',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['webhooks'],
      operation: ['create', 'update'],
    },
  },
  default: true,
  description: 'Whether the webhook is active',
},
{
  displayName: 'Model',
  name: 'model',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['publish', 'unpublish', 'getVersions'],
    },
  },
  default: '',
  description: 'The content model name',
},
{
  displayName: 'Content ID',
  name: 'id',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['publish', 'unpublish', 'getVersions'],
    },
  },
  default: '',
  description: 'The content ID',
},
{
  displayName: 'Publish Targets',
  name: 'targets',
  type: 'fixedCollection',
  typeOptions: {
    multipleValues: true,
  },
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['publish'],
    },
  },
  default: {},
  options: [
    {
      name: 'target',
      displayName: 'Target',
      values: [
        {
          displayName: 'Environment',
          name: 'environment',
          type: 'string',
          default: '',
          description: 'Target environment',
        },
        {
          displayName: 'URL',
          name: 'url',
          type: 'string',
          default: '',
          description: 'Target URL',
        },
      ],
    },
  ],
  description: 'Publishing targets',
},
{
  displayName: 'Job ID',
  name: 'jobId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['getStatus'],
    },
  },
  default: '',
  description: 'The publishing job ID',
},
{
  displayName: 'Space ID',
  name: 'spaceId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['publish', 'unpublish', 'getStatus', 'getVersions'],
    },
  },
  default: '',
  description: 'The Builder.io space ID',
},
{
  displayName: 'Preview Mode',
  name: 'preview',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['publishing'],
      operation: ['getVersions'],
    },
  },
  default: false,
  description: 'Whether to include preview/draft versions',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'content':
        return [await executeContentOperations.call(this, items)];
      case 'models':
        return [await executeModelsOperations.call(this, items)];
      case 'pages':
        return [await executePagesOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'symbols':
        return [await executeSymbolsOperations.call(this, items)];
      case 'webhooks':
        return [await executeWebhooksOperations.call(this, items)];
      case 'unknown':
        return [await executeunknownOperations.call(this, items)];
      case 'publishing':
        return [await executePublishingOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeContentOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseUrl = 'https://builder.io/api/v2';

      switch (operation) {
        case 'getAll': {
          const model = this.getNodeParameter('model', i) as string;
          const query = this.getNodeParameter('query', i, '{}') as string;
          const limit = this.getNodeParameter('limit', i, 10) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams: any = {
            apiKey: credentials.apiKey,
            limit: limit.toString(),
            offset: offset.toString(),
          };

          if (query && query !== '{}') {
            try {
              const parsedQuery = JSON.parse(query);
              queryParams.query = JSON.stringify(parsedQuery);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), `Invalid query JSON: ${error.message}`);
            }
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/content/${model}?${queryString}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const model = this.getNodeParameter('model', i) as string;
          const contentId = this.getNodeParameter('contentId', i) as string;
          const includeRefs = this.getNodeParameter('includeRefs', i, false) as boolean;
          const includeUnpublished = this.getNodeParameter('includeUnpublished', i, false) as boolean;

          const queryParams: any = {
            apiKey: credentials.apiKey,
          };

          if (includeRefs) {
            queryParams.includeRefs = 'true';
          }

          if (includeUnpublished) {
            queryParams.includeUnpublished = 'true';
          }

          const queryString = new URLSearchParams(queryParams).toString();

          const options: any = {
            method: 'GET',
            url: `${baseUrl}/content/${model}/${contentId}?${queryString}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'create': {
          const model = this.getNodeParameter('model', i) as string;
          const contentData = this.getNodeParameter('contentData', i) as string;
          const published = this.getNodeParameter('published', i, 'draft') as string;
          const name = this.getNodeParameter('name', i, '') as string;

          let parsedContentData: any;
          try {
            parsedContentData = JSON.parse(contentData);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid content data JSON: ${error.message}`);
          }

          const body: any = {
            data: parsedContentData,
            published: published,
          };

          if (name) {
            body.name = name;
          }

          const options: any = {
            method: 'POST',
            url: `${baseUrl}/content/${model}?apiKey=${credentials.apiKey}`,
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const model = this.getNodeParameter('model', i) as string;
          const contentId = this.getNodeParameter('contentId', i) as string;
          const contentData = this.getNodeParameter('contentData', i) as string;
          const published = this.getNodeParameter('published', i, 'draft') as string;

          let parsedContentData: any;
          try {
            parsedContentData = JSON.parse(contentData);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid content data JSON: ${error.message}`);
          }

          const body: any = {
            data: parsedContentData,
            published: published,
          };

          const options: any = {
            method: 'PUT',
            url: `${baseUrl}/content/${model}/${contentId}?apiKey=${credentials.apiKey}`,
            json: true,
            body: body,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const model = this.getNodeParameter('model', i) as string;
          const contentId = this.getNodeParameter('contentId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${baseUrl}/content/${model}/${contentId}?apiKey=${credentials.apiKey}`,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeModelsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const spaceId = this.getNodeParameter('spaceId', i) as string;
      
      switch (operation) {
        case 'getAll': {
          const includeBuiltIn = this.getNodeParameter('includeBuiltIn', i) as boolean;
          
          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/models`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
              includeBuiltIn: includeBuiltIn,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'get': {
          const modelId = this.getNodeParameter('modelId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/models/${modelId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const kind = this.getNodeParameter('kind', i) as string;
          const modelDataString = this.getNodeParameter('modelData', i) as string;
          
          let modelData: any = {};
          try {
            modelData = JSON.parse(modelDataString);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in model data');
          }
          
          const body: any = {
            name,
            kind,
            ...modelData,
          };
          
          const options: any = {
            method: 'POST',
            url: `https://builder.io/api/v2/models`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            body,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'update': {
          const modelId = this.getNodeParameter('modelId', i) as string;
          const modelDataString = this.getNodeParameter('modelData', i) as string;
          
          let modelData: any = {};
          try {
            modelData = JSON.parse(modelDataString);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in model data');
          }
          
          const options: any = {
            method: 'PUT',
            url: `https://builder.io/api/v2/models/${modelId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            body: modelData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'delete': {
          const modelId = this.getNodeParameter('modelId', i) as string;
          
          const options: any = {
            method: 'DELETE',
            url: `https://builder.io/api/v2/models/${modelId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executePagesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const spaceId = this.getNodeParameter('spaceId', i) as string;

      switch (operation) {
        case 'getAll': {
          const url = this.getNodeParameter('url', i, '') as string;
          const limit = this.getNodeParameter('limit', i, 20) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const queryParams = new URLSearchParams({
            apiKey: credentials.apiKey,
            limit: limit.toString(),
            offset: offset.toString(),
          });

          if (url) {
            queryParams.append('url', url);
          }

          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/content/page?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const pageId = this.getNodeParameter('pageId', i) as string;
          const includeRefs = this.getNodeParameter('includeRefs', i, false) as boolean;

          const queryParams = new URLSearchParams({
            apiKey: credentials.apiKey,
          });

          if (includeRefs) {
            queryParams.append('includeRefs', 'true');
          }

          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/content/page/${pageId}?${queryParams.toString()}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const pageUrl = this.getNodeParameter('pageUrl', i) as string;
          const content = this.getNodeParameter('content', i, {}) as any;

          const body: any = {
            name,
            data: {
              url: pageUrl,
              ...content,
            },
          };

          const options: any = {
            method: 'POST',
            url: `https://builder.io/api/v2/content/page?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const pageId = this.getNodeParameter('pageId', i) as string;
          const published = this.getNodeParameter('published', i, 'draft') as string;
          const content = this.getNodeParameter('content', i, {}) as any;

          const body: any = {
            published: published === 'published' ? 'published' : 'draft',
            data: content,
          };

          const options: any = {
            method: 'PUT',
            url: `https://builder.io/api/v2/content/page/${pageId}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const pageId = this.getNodeParameter('pageId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `https://builder.io/api/v2/content/page/${pageId}?apiKey=${credentials.apiKey}`,
            headers: {
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

// PARSE ERROR for unknown — manual fix needed
// Raw: // No additional imports

{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['sections'],
    },
  },
  options: [
    {
      name: 'Get All Sections',
      value: 'getAll',
      description: 'Get all se

async function executeSymbolsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getAll': {
          const limit = this.getNodeParameter('limit', i, 100) as number;
          const offset = this.getNodeParameter('offset', i, 0) as number;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://builder.io/api/v2'}/content/symbol`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
              limit,
              offset,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const symbolId = this.getNodeParameter('symbolId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl || 'https://builder.io/api/v2'}/content/symbol/${symbolId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'create': {
          const name = this.getNodeParameter('name', i) as string;
          const data = this.getNodeParameter('data', i, '{}') as string;
          const published = this.getNodeParameter('published', i, 'draft') as string;

          let parsedData: any = {};
          try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in data parameter: ${error.message}`);
          }

          const body: any = {
            name,
            data: parsedData,
            published: published,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl || 'https://builder.io/api/v2'}/content/symbol`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const symbolId = this.getNodeParameter('symbolId', i) as string;
          const data = this.getNodeParameter('data', i, '{}') as string;
          const published = this.getNodeParameter('published', i) as string;

          let parsedData: any = {};
          try {
            parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), `Invalid JSON in data parameter: ${error.message}`);
          }

          const body: any = {
            data: parsedData,
          };

          if (published) {
            body.published = published;
          }

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl || 'https://builder.io/api/v2'}/content/symbol/${symbolId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const symbolId = this.getNodeParameter('symbolId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl || 'https://builder.io/api/v2'}/content/symbol/${symbolId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              apiKey: credentials.apiKey,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        if (error.httpCode) {
          throw new NodeApiError(this.getNode(), error);
        }
        throw new NodeOperationError(this.getNode(), error.message);
      }
    }
  }

  return returnData;
}

async function executeWebhooksOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const spaceId = this.getNodeParameter('spaceId', i) as string;
      
      switch (operation) {
        case 'getAll': {
          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/webhooks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              spaceId,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'get': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;
          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              spaceId,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'create': {
          const url = this.getNodeParameter('url', i) as string;
          const events = this.getNodeParameter('events', i) as string[];
          const secret = this.getNodeParameter('secret', i, '') as string;
          const active = this.getNodeParameter('active', i, true) as boolean;

          // Validate HTTPS URL for production
          if (!url.startsWith('https://') && !url.startsWith('http://localhost')) {
            throw new NodeOperationError(
              this.getNode(),
              'Webhook URL must use HTTPS for production environments'
            );
          }

          const body: any = {
            url,
            events,
            active,
            spaceId,
          };

          if (secret) {
            body.secret = secret;
          }

          const options: any = {
            method: 'POST',
            url: `https://builder.io/api/v2/webhooks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'update': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;
          const url = this.getNodeParameter('url', i) as string;
          const events = this.getNodeParameter('events', i) as string[];
          const secret = this.getNodeParameter('secret', i, '') as string;
          const active = this.getNodeParameter('active', i, true) as boolean;

          // Validate HTTPS URL for production
          if (!url.startsWith('https://') && !url.startsWith('http://localhost')) {
            throw new NodeOperationError(
              this.getNode(),
              'Webhook URL must use HTTPS for production environments'
            );
          }

          const body: any = {
            url,
            events,
            active,
            spaceId,
          };

          if (secret) {
            body.secret = secret;
          }

          const options: any = {
            method: 'PUT',
            url: `https://builder.io/api/v2/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'delete': {
          const webhookId = this.getNodeParameter('webhookId', i) as string;
          const options: any = {
            method: 'DELETE',
            url: `https://builder.io/api/v2/webhooks/${webhookId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            qs: {
              spaceId,
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ 
        json: result,
        pairedItem: { item: i }
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        if (error.httpCode === 404) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Webhook not found',
            httpCode: 404,
          });
        } else if (error.httpCode === 400) {
          throw new NodeApiError(this.getNode(), error, {
            message: 'Invalid webhook configuration',
            httpCode: 400,
          });
        }
        throw error;
      }
    }
  }

  return returnData;
}

// PARSE ERROR for unknown — manual fix needed
// Raw: // No additional imports

{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['spaces'],
    },
  },
  options: [
    {
      name: 'Get All',
      value: 'getAll',
      description: 'Get all accessible sp

async function executePublishingOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('builderioApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'publish': {
          const model = this.getNodeParameter('model', i) as string;
          const id = this.getNodeParameter('id', i) as string;
          const spaceId = this.getNodeParameter('spaceId', i) as string;
          const targetsParam = this.getNodeParameter('targets', i) as any;
          
          const targets = targetsParam.target ? targetsParam.target.map((t: any) => ({
            environment: t.environment,
            url: t.url,
          })) : [];

          const options: any = {
            method: 'POST',
            url: `https://builder.io/api/v2/publish`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              apiKey: credentials.apiKey,
              model,
              id,
              targets,
              spaceId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'unpublish': {
          const model = this.getNodeParameter('model', i) as string;
          const id = this.getNodeParameter('id', i) as string;
          const spaceId = this.getNodeParameter('spaceId', i) as string;

          const options: any = {
            method: 'POST',
            url: `https://builder.io/api/v2/unpublish`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: {
              apiKey: credentials.apiKey,
              model,
              id,
              spaceId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getStatus': {
          const jobId = this.getNodeParameter('jobId', i) as string;
          const spaceId = this.getNodeParameter('spaceId', i) as string;

          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/publish/status`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: {
              apiKey: credentials.apiKey,
              jobId,
              spaceId,
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getVersions': {
          const model = this.getNodeParameter('model', i) as string;
          const id = this.getNodeParameter('id', i) as string;
          const spaceId = this.getNodeParameter('spaceId', i) as string;
          const preview = this.getNodeParameter('preview', i) as boolean;

          const queryParams: any = {
            apiKey: credentials.apiKey,
            id,
            spaceId,
          };

          if (preview) {
            queryParams.includeUnpublished = 'true';
          }

          const options: any = {
            method: 'GET',
            url: `https://builder.io/api/v2/content/${model}/versions`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
            },
            qs: queryParams,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}
