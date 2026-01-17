#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import admin from "firebase-admin";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from the script's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, "..", ".env") });

// Initialize Firebase Admin SDK
function initializeFirebase(): admin.app.App {
  if (admin.apps.length === 0) {
    const serviceAccount: admin.ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID as string,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") as string,
    };

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  return admin.app();
}

// Initialize Firebase
initializeFirebase();
const db = admin.firestore();

// Helper function to convert Firestore data to JSON-serializable format
function serializeFirestoreData(data: admin.firestore.DocumentData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof admin.firestore.Timestamp) {
      result[key] = value.toDate().toISOString();
    } else if (value instanceof admin.firestore.DocumentReference) {
      result[key] = value.path;
    } else if (value instanceof admin.firestore.GeoPoint) {
      result[key] = { latitude: value.latitude, longitude: value.longitude };
    } else if (Array.isArray(value)) {
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null ? serializeFirestoreData(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      result[key] = serializeFirestoreData(value);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// Create MCP server
const server = new Server(
  {
    name: "firestore-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_collections",
        description: "List all top-level collections in Firestore",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "list_subcollections",
        description: "List subcollections of a document",
        inputSchema: {
          type: "object",
          properties: {
            documentPath: {
              type: "string",
              description: "Path to the document (e.g., 'users/userId123')",
            },
          },
          required: ["documentPath"],
        },
      },
      {
        name: "get_document",
        description: "Get a single document by path",
        inputSchema: {
          type: "object",
          properties: {
            documentPath: {
              type: "string",
              description: "Path to the document (e.g., 'users/userId123')",
            },
          },
          required: ["documentPath"],
        },
      },
      {
        name: "list_documents",
        description: "List documents in a collection with optional limit",
        inputSchema: {
          type: "object",
          properties: {
            collectionPath: {
              type: "string",
              description: "Path to the collection (e.g., 'users' or 'users/userId123/notes')",
            },
            limit: {
              type: "number",
              description: "Maximum number of documents to return (default: 20)",
            },
          },
          required: ["collectionPath"],
        },
      },
      {
        name: "query_documents",
        description: "Query documents with filters",
        inputSchema: {
          type: "object",
          properties: {
            collectionPath: {
              type: "string",
              description: "Path to the collection",
            },
            field: {
              type: "string",
              description: "Field to filter on",
            },
            operator: {
              type: "string",
              description: "Comparison operator (==, !=, <, <=, >, >=, array-contains, in, array-contains-any)",
            },
            value: {
              type: "string",
              description: "Value to compare against (use JSON for arrays/objects)",
            },
            limit: {
              type: "number",
              description: "Maximum number of documents to return (default: 20)",
            },
          },
          required: ["collectionPath", "field", "operator", "value"],
        },
      },
      {
        name: "create_document",
        description: "Create a new document in a collection",
        inputSchema: {
          type: "object",
          properties: {
            collectionPath: {
              type: "string",
              description: "Path to the collection",
            },
            documentId: {
              type: "string",
              description: "Optional document ID (auto-generated if not provided)",
            },
            data: {
              type: "string",
              description: "JSON string of the document data",
            },
          },
          required: ["collectionPath", "data"],
        },
      },
      {
        name: "update_document",
        description: "Update an existing document",
        inputSchema: {
          type: "object",
          properties: {
            documentPath: {
              type: "string",
              description: "Path to the document",
            },
            data: {
              type: "string",
              description: "JSON string of the fields to update",
            },
            merge: {
              type: "boolean",
              description: "If true, merge with existing data. If false, replace entirely (default: true)",
            },
          },
          required: ["documentPath", "data"],
        },
      },
      {
        name: "delete_document",
        description: "Delete a document",
        inputSchema: {
          type: "object",
          properties: {
            documentPath: {
              type: "string",
              description: "Path to the document to delete",
            },
          },
          required: ["documentPath"],
        },
      },
      {
        name: "count_documents",
        description: "Count documents in a collection",
        inputSchema: {
          type: "object",
          properties: {
            collectionPath: {
              type: "string",
              description: "Path to the collection",
            },
          },
          required: ["collectionPath"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_collections": {
        const collections = await db.listCollections();
        const collectionIds = collections.map((col) => col.id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ collections: collectionIds }, null, 2),
            },
          ],
        };
      }

      case "list_subcollections": {
        const { documentPath } = args as { documentPath: string };
        const docRef = db.doc(documentPath);
        const collections = await docRef.listCollections();
        const collectionIds = collections.map((col) => col.id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ subcollections: collectionIds }, null, 2),
            },
          ],
        };
      }

      case "get_document": {
        const { documentPath } = args as { documentPath: string };
        const docRef = db.doc(documentPath);
        const doc = await docRef.get();

        if (!doc.exists) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: "Document not found", path: documentPath }),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                id: doc.id,
                path: doc.ref.path,
                data: serializeFirestoreData(doc.data() || {}),
              }, null, 2),
            },
          ],
        };
      }

      case "list_documents": {
        const { collectionPath, limit = 20 } = args as { collectionPath: string; limit?: number };
        const colRef = db.collection(collectionPath);
        const snapshot = await colRef.limit(limit).get();

        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          path: doc.ref.path,
          data: serializeFirestoreData(doc.data()),
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                count: documents.length,
                documents,
              }, null, 2),
            },
          ],
        };
      }

      case "query_documents": {
        const { collectionPath, field, operator, value, limit = 20 } = args as {
          collectionPath: string;
          field: string;
          operator: string;
          value: string;
          limit?: number;
        };

        // Parse value (handle JSON for arrays/objects)
        let parsedValue: unknown;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          parsedValue = value;
        }

        const colRef = db.collection(collectionPath);
        const query = colRef
          .where(field, operator as admin.firestore.WhereFilterOp, parsedValue)
          .limit(limit);

        const snapshot = await query.get();

        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          path: doc.ref.path,
          data: serializeFirestoreData(doc.data()),
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                count: documents.length,
                documents,
              }, null, 2),
            },
          ],
        };
      }

      case "create_document": {
        const { collectionPath, documentId, data } = args as {
          collectionPath: string;
          documentId?: string;
          data: string;
        };

        const parsedData = JSON.parse(data);
        const colRef = db.collection(collectionPath);

        let docRef: admin.firestore.DocumentReference;
        if (documentId) {
          docRef = colRef.doc(documentId);
          await docRef.set(parsedData);
        } else {
          docRef = await colRef.add(parsedData);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                id: docRef.id,
                path: docRef.path,
              }, null, 2),
            },
          ],
        };
      }

      case "update_document": {
        const { documentPath, data, merge = true } = args as {
          documentPath: string;
          data: string;
          merge?: boolean;
        };

        const parsedData = JSON.parse(data);
        const docRef = db.doc(documentPath);

        if (merge) {
          await docRef.set(parsedData, { merge: true });
        } else {
          await docRef.set(parsedData);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                path: documentPath,
                merged: merge,
              }, null, 2),
            },
          ],
        };
      }

      case "delete_document": {
        const { documentPath } = args as { documentPath: string };
        const docRef = db.doc(documentPath);
        await docRef.delete();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                deleted: documentPath,
              }, null, 2),
            },
          ],
        };
      }

      case "count_documents": {
        const { collectionPath } = args as { collectionPath: string };
        const colRef = db.collection(collectionPath);
        const snapshot = await colRef.count().get();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                collection: collectionPath,
                count: snapshot.data().count,
              }, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ error: `Unknown tool: ${name}` }),
            },
          ],
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }),
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Firestore MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
