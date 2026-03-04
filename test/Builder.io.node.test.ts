/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Builderio } from '../nodes/Builder.io/Builder.io.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Builderio Node', () => {
  let node: Builderio;

  beforeAll(() => {
    node = new Builderio();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Builder.io');
      expect(node.description.name).toBe('builderio');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 8 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(8);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(8);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Content Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get all content entries successfully', async () => {
    const mockResponse = { results: [{ id: '1', name: 'Test Content' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getAll';
        case 'model': return 'page';
        case 'query': return '{}';
        case 'limit': return 10;
        case 'offset': return 0;
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://builder.io/api/v2/content/page?apiKey=test-api-key&limit=10&offset=0',
      json: true,
    });
  });

  test('should get specific content entry successfully', async () => {
    const mockResponse = { id: '123', name: 'Specific Content' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'get';
        case 'model': return 'page';
        case 'contentId': return '123';
        case 'includeRefs': return false;
        case 'includeUnpublished': return false;
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://builder.io/api/v2/content/page/123?apiKey=test-api-key',
      json: true,
    });
  });

  test('should create content entry successfully', async () => {
    const mockResponse = { id: '456', name: 'New Content' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'create';
        case 'model': return 'page';
        case 'contentData': return '{"title": "Test Page"}';
        case 'published': return 'draft';
        case 'name': return 'Test Page';
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://builder.io/api/v2/content/page?apiKey=test-api-key',
      json: true,
      body: {
        data: { title: 'Test Page' },
        published: 'draft',
        name: 'Test Page',
      },
    });
  });

  test('should update content entry successfully', async () => {
    const mockResponse = { id: '123', name: 'Updated Content' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'update';
        case 'model': return 'page';
        case 'contentId': return '123';
        case 'contentData': return '{"title": "Updated Page"}';
        case 'published': return 'published';
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://builder.io/api/v2/content/page/123?apiKey=test-api-key',
      json: true,
      body: {
        data: { title: 'Updated Page' },
        published: 'published',
      },
    });
  });

  test('should delete content entry successfully', async () => {
    const mockResponse = { success: true };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'delete';
        case 'model': return 'page';
        case 'contentId': return '123';
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://builder.io/api/v2/content/page/123?apiKey=test-api-key',
      json: true,
    });
  });

  test('should handle API errors gracefully', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'get';
        case 'model': return 'page';
        case 'contentId': return '123';
        default: return undefined;
      }
    });

    await expect(executeContentOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'get';
        case 'model': return 'page';
        case 'contentId': return '123';
        default: return undefined;
      }
    });

    const result = await executeContentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Models Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all content models successfully', async () => {
      const mockResponse = {
        models: [
          { id: 'model1', name: 'Test Model 1', kind: 'page' },
          { id: 'model2', name: 'Test Model 2', kind: 'component' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getAll';
          case 'spaceId':
            return 'test-space-id';
          case 'includeBuiltIn':
            return true;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/models',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
          includeBuiltIn: true,
        },
        json: true,
      });
    });
  });

  describe('get operation', () => {
    it('should get specific content model successfully', async () => {
      const mockResponse = {
        id: 'model1',
        name: 'Test Model',
        kind: 'page',
        fields: [],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'get';
          case 'spaceId':
            return 'test-space-id';
          case 'modelId':
            return 'model1';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/models/model1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('create operation', () => {
    it('should create new content model successfully', async () => {
      const mockResponse = {
        id: 'new-model-id',
        name: 'New Model',
        kind: 'page',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'create';
          case 'spaceId':
            return 'test-space-id';
          case 'name':
            return 'New Model';
          case 'kind':
            return 'page';
          case 'modelData':
            return '{"description": "Test model"}';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://builder.io/api/v2/models',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
        },
        body: {
          name: 'New Model',
          kind: 'page',
          description: 'Test model',
        },
        json: true,
      });
    });
  });

  describe('update operation', () => {
    it('should update content model successfully', async () => {
      const mockResponse = {
        id: 'model1',
        name: 'Updated Model',
        kind: 'page',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'update';
          case 'spaceId':
            return 'test-space-id';
          case 'modelId':
            return 'model1';
          case 'modelData':
            return '{"name": "Updated Model"}';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://builder.io/api/v2/models/model1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
        },
        body: {
          name: 'Updated Model',
        },
        json: true,
      });
    });
  });

  describe('delete operation', () => {
    it('should delete content model successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'delete';
          case 'spaceId':
            return 'test-space-id';
          case 'modelId':
            return 'model1';
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://builder.io/api/v2/models/model1',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'getAll';
          case 'spaceId':
            return 'test-space-id';
          case 'includeBuiltIn':
            return false;
          default:
            return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const items = [{ json: {} }];
      const result = await executeModelsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ error: 'API Error' });
    });

    it('should handle invalid JSON in model data', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation':
            return 'create';
          case 'spaceId':
            return 'test-space-id';
          case 'name':
            return 'New Model';
          case 'kind':
            return 'page';
          case 'modelData':
            return 'invalid json';
          default:
            return undefined;
        }
      });

      const items = [{ json: {} }];

      await expect(
        executeModelsOperations.call(mockExecuteFunctions, items),
      ).rejects.toThrow('Invalid JSON in model data');
    });
  });
});

describe('Pages Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all pages successfully', async () => {
      const mockResponse = {
        results: [
          { id: 'page1', name: 'Home Page', url: '/' },
          { id: 'page2', name: 'About Page', url: '/about' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAll';
          case 'spaceId': return 'test-space-id';
          case 'limit': return 20;
          case 'offset': return 0;
          case 'url': return '';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle errors in getAll operation', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'getAll';
          case 'spaceId': return 'test-space-id';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('get operation', () => {
    it('should get a specific page successfully', async () => {
      const mockResponse = {
        id: 'page1',
        name: 'Home Page',
        data: { url: '/', title: 'Welcome' },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'get';
          case 'spaceId': return 'test-space-id';
          case 'pageId': return 'page1';
          case 'includeRefs': return false;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('create operation', () => {
    it('should create a page successfully', async () => {
      const mockResponse = {
        id: 'new-page-id',
        name: 'New Page',
        data: { url: '/new-page' },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'create';
          case 'spaceId': return 'test-space-id';
          case 'name': return 'New Page';
          case 'pageUrl': return '/new-page';
          case 'content': return { title: 'New Page Title' };
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('update operation', () => {
    it('should update a page successfully', async () => {
      const mockResponse = {
        id: 'page1',
        name: 'Updated Page',
        published: 'published',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'update';
          case 'spaceId': return 'test-space-id';
          case 'pageId': return 'page1';
          case 'published': return 'published';
          case 'content': return { title: 'Updated Title' };
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('delete operation', () => {
    it('should delete a page successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        switch (paramName) {
          case 'operation': return 'delete';
          case 'spaceId': return 'test-space-id';
          case 'pageId': return 'page1';
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePagesOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });
});

describe('Symbols Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all symbols successfully', async () => {
      const mockResponse = {
        results: [
          { id: 'symbol1', name: 'Test Symbol 1' },
          { id: 'symbol2', name: 'Test Symbol 2' },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'getAll';
        if (param === 'limit') return 100;
        if (param === 'offset') return 0;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/content/symbol',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          apiKey: 'test-api-key',
          limit: 100,
          offset: 0,
        },
        json: true,
      });
    });
  });

  describe('get operation', () => {
    it('should get specific symbol successfully', async () => {
      const mockResponse = {
        id: 'symbol1',
        name: 'Test Symbol',
        data: { blocks: [] },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'get';
        if (param === 'symbolId') return 'symbol1';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('create operation', () => {
    it('should create symbol successfully', async () => {
      const mockResponse = {
        id: 'new-symbol',
        name: 'New Symbol',
        data: { blocks: [] },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'create';
        if (param === 'name') return 'New Symbol';
        if (param === 'data') return '{"blocks": []}';
        if (param === 'published') return 'draft';
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should handle invalid JSON in data parameter', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'create';
        if (param === 'name') return 'New Symbol';
        if (param === 'data') return 'invalid json';
        return undefined;
      });

      await expect(
        executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid JSON in data parameter');
    });
  });

  describe('update operation', () => {
    it('should update symbol successfully', async () => {
      const mockResponse = {
        id: 'symbol1',
        name: 'Updated Symbol',
        data: { blocks: [] },
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string, index: number, defaultValue?: any) => {
        if (param === 'operation') return 'update';
        if (param === 'symbolId') return 'symbol1';
        if (param === 'data') return '{"blocks": []}';
        if (param === 'published') return 'published';
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('delete operation', () => {
    it('should delete symbol successfully', async () => {
      const mockResponse = { success: true };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        if (param === 'operation') return 'delete';
        if (param === 'symbolId') return 'symbol1';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('error handling', () => {
    it('should handle API errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        {
          json: { error: 'API Error' },
          pairedItem: { item: 0 },
        },
      ]);
    });

    it('should throw error when continueOnFail is false', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeSymbolsOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });
});

describe('Webhooks Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getAll operation', () => {
    it('should get all webhooks successfully', async () => {
      const mockWebhooks = [
        { id: '1', url: 'https://example.com/webhook1', events: ['content.created'] },
        { id: '2', url: 'https://example.com/webhook2', events: ['content.updated'] },
      ];

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'getAll';
        if (paramName === 'spaceId') return 'test-space-id';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhooks);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/webhooks',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          spaceId: 'test-space-id',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockWebhooks, pairedItem: { item: 0 } }
      ]);
    });
  });

  describe('get operation', () => {
    it('should get specific webhook successfully', async () => {
      const mockWebhook = { id: '1', url: 'https://example.com/webhook', events: ['content.created'] };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'get';
        if (paramName === 'webhookId') return 'webhook-123';
        if (paramName === 'spaceId') return 'test-space-id';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockWebhook);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/webhooks/webhook-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          spaceId: 'test-space-id',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockWebhook, pairedItem: { item: 0 } }
      ]);
    });
  });

  describe('create operation', () => {
    it('should create webhook successfully', async () => {
      const mockCreatedWebhook = { 
        id: 'new-webhook-id', 
        url: 'https://example.com/webhook',
        events: ['content.created', 'content.updated'],
        active: true
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'create';
        if (paramName === 'spaceId') return 'test-space-id';
        if (paramName === 'url') return 'https://example.com/webhook';
        if (paramName === 'events') return ['content.created', 'content.updated'];
        if (paramName === 'secret') return 'webhook-secret';
        if (paramName === 'active') return true;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreatedWebhook);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://builder.io/api/v2/webhooks',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          url: 'https://example.com/webhook',
          events: ['content.created', 'content.updated'],
          active: true,
          spaceId: 'test-space-id',
          secret: 'webhook-secret',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockCreatedWebhook, pairedItem: { item: 0 } }
      ]);
    });

    it('should throw error for non-HTTPS URL', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'create';
        if (paramName === 'spaceId') return 'test-space-id';
        if (paramName === 'url') return 'http://example.com/webhook';
        if (paramName === 'events') return ['content.created'];
        if (paramName === 'active') return true;
        return defaultValue;
      });

      await expect(
        executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Webhook URL must use HTTPS for production environments');
    });
  });

  describe('update operation', () => {
    it('should update webhook successfully', async () => {
      const mockUpdatedWebhook = { 
        id: 'webhook-123', 
        url: 'https://example.com/updated-webhook',
        events: ['content.published'],
        active: false
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number, defaultValue?: any) => {
        if (paramName === 'operation') return 'update';
        if (paramName === 'webhookId') return 'webhook-123';
        if (paramName === 'spaceId') return 'test-space-id';
        if (paramName === 'url') return 'https://example.com/updated-webhook';
        if (paramName === 'events') return ['content.published'];
        if (paramName === 'active') return false;
        return defaultValue;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdatedWebhook);

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://builder.io/api/v2/webhooks/webhook-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          url: 'https://example.com/updated-webhook',
          events: ['content.published'],
          active: false,
          spaceId: 'test-space-id',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: mockUpdatedWebhook, pairedItem: { item: 0 } }
      ]);
    });
  });

  describe('delete operation', () => {
    it('should delete webhook successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string, itemIndex: number) => {
        if (paramName === 'operation') return 'delete';
        if (paramName === 'webhookId') return 'webhook-123';
        if (paramName === 'spaceId') return 'test-space-id';
        return '';
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://builder.io/api/v2/webhooks/webhook-123',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        qs: {
          spaceId: 'test-space-id',
        },
        json: true,
      });

      expect(result).toEqual([
        { json: { success: true }, pairedItem: { item: 0 } }
      ]);
    });
  });

  describe('error handling', () => {
    it('should handle errors when continueOnFail is true', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'getAll';
        if (paramName === 'spaceId') return 'test-space-id';
        return '';
      });

      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([
        { json: { error: 'API Error' }, pairedItem: { item: 0 } }
      ]);
    });

    it('should throw unknown operation error', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

      await expect(
        executeWebhooksOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Unknown operation: unknownOperation');
    });
  });
});

describe('Publishing Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://builder.io/api/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('publish operation', () => {
    it('should publish content successfully', async () => {
      const mockResponse = {
        jobId: 'job123',
        status: 'queued',
        message: 'Content queued for publishing',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'publish',
          model: 'page',
          id: 'content123',
          spaceId: 'space123',
          targets: { target: [{ environment: 'production', url: 'https://example.com' }] },
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePublishingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://builder.io/api/v2/publish',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          apiKey: 'test-api-key',
          model: 'page',
          id: 'content123',
          targets: [{ environment: 'production', url: 'https://example.com' }],
          spaceId: 'space123',
        },
        json: true,
      });
    });

    it('should handle publish errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'publish',
          model: 'page',
          id: 'content123',
          spaceId: 'space123',
          targets: { target: [] },
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Publishing failed'),
      );

      await expect(
        executePublishingOperations.call(mockExecuteFunctions, [{ json: {} }]),
      ).rejects.toThrow('Publishing failed');
    });
  });

  describe('unpublish operation', () => {
    it('should unpublish content successfully', async () => {
      const mockResponse = {
        success: true,
        message: 'Content unpublished successfully',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'unpublish',
          model: 'page',
          id: 'content123',
          spaceId: 'space123',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePublishingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getStatus operation', () => {
    it('should get publishing status successfully', async () => {
      const mockResponse = {
        jobId: 'job123',
        status: 'completed',
        progress: 100,
        result: 'Published successfully',
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getStatus',
          jobId: 'job123',
          spaceId: 'space123',
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePublishingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);
    });
  });

  describe('getVersions operation', () => {
    it('should get content versions successfully', async () => {
      const mockResponse = {
        results: [
          {
            id: 'version1',
            rev: 'rev123',
            published: 'published',
            lastUpdated: 1640995200000,
          },
          {
            id: 'version2',
            rev: 'rev124',
            published: 'draft',
            lastUpdated: 1641081600000,
          },
        ],
      };

      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        const params: any = {
          operation: 'getVersions',
          model: 'page',
          id: 'content123',
          spaceId: 'space123',
          preview: true,
        };
        return params[param];
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executePublishingOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([
        {
          json: mockResponse,
          pairedItem: { item: 0 },
        },
      ]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://builder.io/api/v2/content/page/versions',
        headers: {
          'Authorization': 'Bearer test-api-key',
        },
        qs: {
          apiKey: 'test-api-key',
          id: 'content123',
          spaceId: 'space123',
          includeUnpublished: 'true',
        },
        json: true,
      });
    });
  });
});
});
