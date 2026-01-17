# Firestore MCP Server

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for Firebase Firestore. This server enables AI assistants like Claude to directly interact with your Firestore database.

## Features

- **Full CRUD Operations**: Create, read, update, and delete documents
- **Collection Management**: List collections and subcollections
- **Query Support**: Filter documents with Firestore query operators
- **Document Counting**: Get document counts without fetching all data
- **Type Conversion**: Automatic handling of Firestore types (Timestamp, GeoPoint, etc.)

## Requirements

- Node.js 18+
- Firebase project with Firestore enabled
- Firebase Admin SDK credentials (service account)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/firestore-mcp.git
cd firestore-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase credentials

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### How to get Firebase credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Project Settings** > **Service accounts**
4. Click **Generate new private key**
5. Download the JSON file
6. Copy values to your `.env` file:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 4. Build the project

```bash
npm run build
```

## Claude Code Configuration

### Project-level configuration (recommended)

Create `.mcp.json` in your project root:

```json
{
  "mcpServers": {
    "firestore": {
      "command": "node",
      "args": ["/path/to/firestore-mcp/dist/index.js"],
      "cwd": "/path/to/firestore-mcp"
    }
  }
}
```

### With environment variables inline

If you prefer not to use a `.env` file:

```json
{
  "mcpServers": {
    "firestore": {
      "command": "node",
      "args": ["/path/to/firestore-mcp/dist/index.js"],
      "env": {
        "FIREBASE_PROJECT_ID": "your-project-id",
        "FIREBASE_CLIENT_EMAIL": "your-client-email",
        "FIREBASE_PRIVATE_KEY": "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
      }
    }
  }
}
```

### After configuration

1. Restart Claude Code
2. When prompted, approve the MCP server
3. The Firestore tools will be available in your conversation

## Available Tools

### Collection Operations

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_collections` | List all top-level collections | None |
| `list_subcollections` | List subcollections of a document | `documentPath` |
| `count_documents` | Count documents in a collection | `collectionPath` |

### Document Operations

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_document` | Get a single document | `documentPath` |
| `list_documents` | List documents in a collection | `collectionPath`, `limit?` |
| `create_document` | Create a new document | `collectionPath`, `data`, `documentId?` |
| `update_document` | Update an existing document | `documentPath`, `data`, `merge?` |
| `delete_document` | Delete a document | `documentPath` |

### Query Operations

| Tool | Description | Parameters |
|------|-------------|------------|
| `query_documents` | Query with filters | `collectionPath`, `field`, `operator`, `value`, `limit?` |

#### Supported Query Operators

- `==` - Equal to
- `!=` - Not equal to
- `<` - Less than
- `<=` - Less than or equal to
- `>` - Greater than
- `>=` - Greater than or equal to
- `array-contains` - Array contains value
- `in` - Value in array
- `array-contains-any` - Array contains any of values

## Usage Examples

### List all collections

```
Tool: list_collections
```

### Get a specific document

```
Tool: get_document
Parameters:
  documentPath: "users/user123"
```

### List documents with limit

```
Tool: list_documents
Parameters:
  collectionPath: "users"
  limit: 10
```

### Query documents

```
Tool: query_documents
Parameters:
  collectionPath: "users"
  field: "status"
  operator: "=="
  value: "active"
  limit: 20
```

### Create a document

```
Tool: create_document
Parameters:
  collectionPath: "users"
  data: {"name": "John Doe", "email": "john@example.com", "createdAt": "2024-01-01T00:00:00Z"}
  documentId: "user123"  # optional, auto-generated if not provided
```

### Update a document

```
Tool: update_document
Parameters:
  documentPath: "users/user123"
  data: {"name": "Jane Doe"}
  merge: true  # true = merge with existing, false = replace entirely
```

### Delete a document

```
Tool: delete_document
Parameters:
  documentPath: "users/user123"
```

### Access subcollections

```
Tool: list_documents
Parameters:
  collectionPath: "users/user123/orders"
  limit: 10
```

## Configuration Options

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_PROJECT_ID` | Yes | Your Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Yes | Service account email |
| `FIREBASE_PRIVATE_KEY` | Yes | Service account private key |

### Adjusting Behavior

#### Default query limit

The default limit for `list_documents` and `query_documents` is 20. You can override this per-request by specifying the `limit` parameter.

#### Merge vs Replace on update

By default, `update_document` merges new data with existing document data (`merge: true`). Set `merge: false` to replace the entire document.

## Security Considerations

- **Never commit `.env` files** - They contain sensitive credentials
- **Use service accounts with minimal permissions** - Only grant Firestore access needed
- **Consider read-only service accounts** for development - Prevent accidental data modification
- **Rotate credentials regularly** - Generate new service account keys periodically

### Creating a read-only service account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **IAM & Admin** > **Service Accounts**
3. Create a new service account
4. Grant only the `Cloud Datastore User` role (read-only)
5. Generate and download the key

## Firestore Data Types

The server automatically handles these Firestore types:

| Firestore Type | JSON Output |
|----------------|-------------|
| `Timestamp` | ISO 8601 string (`"2024-01-01T00:00:00.000Z"`) |
| `GeoPoint` | `{"latitude": 35.6762, "longitude": 139.6503}` |
| `DocumentReference` | Document path string (`"users/user123"`) |
| `Array` | JSON array |
| `Map` | JSON object |

## Troubleshooting

### "Permission denied" errors

- Verify your service account has Firestore access
- Check that `FIREBASE_PROJECT_ID` matches your actual project
- Ensure the private key includes `\n` characters for newlines

### "Could not load the default credentials"

- Verify all three environment variables are set
- Check that `FIREBASE_PRIVATE_KEY` is properly quoted

### MCP server not appearing in Claude

- Restart Claude Code after adding `.mcp.json`
- Check the file path in configuration is correct
- Verify the build completed successfully (`dist/index.js` exists)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode (rebuild on changes)
npm run dev
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
