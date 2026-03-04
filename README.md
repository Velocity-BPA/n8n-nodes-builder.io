# n8n-nodes-builder.io

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with Builder.io's visual development platform, offering 6 core resources with comprehensive content management, page creation, model configuration, and webhook automation capabilities for headless CMS workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Builder.io](https://img.shields.io/badge/Builder.io-Compatible-purple)
![CMS](https://img.shields.io/badge/CMS-Headless-green)
![Visual Builder](https://img.shields.io/badge/Visual-Builder-orange)

## Features

- **Content Management** - Create, update, retrieve, and delete Builder.io content entries with full field support
- **Model Configuration** - Manage content models, schemas, and field definitions programmatically
- **Page Operations** - Handle page creation, updates, publishing, and metadata management
- **Symbol Library** - Work with reusable components and symbol libraries across projects
- **Webhook Integration** - Set up automated workflows triggered by Builder.io content changes
- **Publishing Workflows** - Control content publishing, scheduling, and deployment processes
- **Real-time Sync** - Bi-directional data synchronization between Builder.io and external systems
- **Bulk Operations** - Process multiple content items efficiently with batch operations

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-builder.io`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-builder.io
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-builder.io.git
cd n8n-nodes-builder.io
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-builder.io
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Builder.io private API key from Account Settings | ✅ |
| Space ID | The space/organization identifier (optional for multi-space accounts) | ❌ |
| Environment | Target environment (development, staging, production) | ❌ |

## Resources & Operations

### 1. Content

| Operation | Description |
|-----------|-------------|
| Create | Create new content entries with custom fields and metadata |
| Get | Retrieve content by ID or query parameters |
| Get All | List content entries with filtering and pagination |
| Update | Modify existing content entries and field values |
| Delete | Remove content entries from Builder.io |
| Publish | Publish content entries to live environment |
| Unpublish | Revert content to draft status |

### 2. Models

| Operation | Description |
|-----------|-------------|
| Create | Create new content models with field definitions |
| Get | Retrieve model configuration and schema |
| Get All | List all models in the space with metadata |
| Update | Modify model structure, fields, and settings |
| Delete | Remove content models from Builder.io |

### 3. Pages

| Operation | Description |
|-----------|-------------|
| Create | Create new pages with layout and content |
| Get | Retrieve page data by URL or ID |
| Get All | List pages with filtering options |
| Update | Modify page content, layout, and settings |
| Delete | Remove pages from Builder.io |
| Publish | Deploy pages to production environment |
| Clone | Duplicate existing pages with modifications |

### 4. Symbols

| Operation | Description |
|-----------|-------------|
| Create | Create reusable component symbols |
| Get | Retrieve symbol definition and usage |
| Get All | List available symbols in the library |
| Update | Modify symbol structure and properties |
| Delete | Remove symbols from the library |

### 5. Webhooks

| Operation | Description |
|-----------|-------------|
| Create | Set up webhook endpoints for content events |
| Get | Retrieve webhook configuration |
| Get All | List all configured webhooks |
| Update | Modify webhook URLs and trigger settings |
| Delete | Remove webhook configurations |
| Test | Trigger test webhook events |

### 6. Publishing

| Operation | Description |
|-----------|-------------|
| Publish Content | Deploy content to production environment |
| Schedule Publish | Set up automated publishing schedules |
| Get Status | Check publishing status and history |
| Rollback | Revert to previous published versions |
| Batch Publish | Publish multiple items simultaneously |

## Usage Examples

```javascript
// Create a new blog post content entry
{
  "model": "blog-post",
  "name": "Getting Started with Builder.io",
  "data": {
    "title": "Getting Started with Builder.io",
    "slug": "getting-started-builderio",
    "content": {
      "@type": "@builder.io/sdk:Element",
      "component": {
        "name": "Text",
        "options": {
          "text": "Welcome to Builder.io!"
        }
      }
    },
    "author": "John Doe",
    "publishedDate": "2024-01-15T10:00:00.000Z",
    "tags": ["tutorial", "getting-started"]
  }
}
```

```javascript
// Retrieve all published pages with filtering
{
  "model": "page",
  "query": {
    "published": "published",
    "limit": 20,
    "offset": 0,
    "fields": "id,name,data.url,lastUpdated"
  }
}
```

```javascript
// Create a webhook for content updates
{
  "url": "https://your-app.com/webhooks/builder-content",
  "events": ["content.create", "content.update", "content.delete"],
  "models": ["blog-post", "page"],
  "secret": "your-webhook-secret-key"
}
```

```javascript
// Update a reusable symbol component
{
  "id": "symbol-header-123",
  "name": "Site Header v2",
  "data": {
    "blocks": [
      {
        "@type": "@builder.io/sdk:Element",
        "component": {
          "name": "Header",
          "options": {
            "logo": "https://cdn.builder.io/api/v1/image/assets%2Flogo.png",
            "navigation": [
              {"label": "Home", "url": "/"},
              {"label": "About", "url": "/about"},
              {"label": "Contact", "url": "/contact"}
            ]
          }
        }
      }
    ]
  }
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or expired API key | Verify API key in credentials configuration |
| 403 Forbidden | Insufficient permissions for the operation | Check API key permissions and space access |
| 404 Not Found | Content, model, or resource does not exist | Verify resource ID and ensure it exists |
| 422 Validation Error | Invalid data format or missing required fields | Review field requirements and data structure |
| 429 Rate Limited | Too many API requests in short timeframe | Implement delays between requests or reduce frequency |
| 500 Server Error | Builder.io service temporarily unavailable | Retry request after brief delay or check Builder.io status |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-builder.io/issues)
- **Builder.io API Documentation**: [https://builder.io/c/docs/developers](https://builder.io/c/docs/developers)
- **Builder.io Community Forum**: [https://forum.builder.io](https://forum.builder.io)