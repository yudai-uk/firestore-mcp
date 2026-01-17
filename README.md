# Firestore MCP Server

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for Firebase Firestore. This server enables AI assistants like Claude to directly interact with your Firestore database.

Firebase Firestore用の[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)サーバーです。ClaudeなどのAIアシスタントがFirestoreデータベースと直接やり取りできるようになります。

## Features / 機能

- **Full CRUD Operations**: Create, read, update, and delete documents
- **Collection Management**: List collections and subcollections
- **Query Support**: Filter documents with Firestore query operators
- **Document Counting**: Get document counts without fetching all data
- **Type Conversion**: Automatic handling of Firestore types (Timestamp, GeoPoint, etc.)

---

- **フルCRUD操作**: ドキュメントの作成、読み取り、更新、削除
- **コレクション管理**: コレクションとサブコレクションの一覧表示
- **クエリサポート**: Firestoreクエリ演算子によるドキュメントのフィルタリング
- **ドキュメントカウント**: 全データを取得せずにドキュメント数を取得
- **型変換**: Firestoreの型（Timestamp、GeoPointなど）の自動処理

## Requirements / 必要条件

- Node.js 18+
- Firebase project with Firestore enabled / Firestoreが有効なFirebaseプロジェクト
- Firebase Admin SDK credentials (service account) / Firebase Admin SDK認証情報（サービスアカウント）

## Installation / インストール

### 1. Clone the repository / リポジトリをクローン

```bash
git clone https://github.com/your-username/firestore-mcp.git
cd firestore-mcp
```

### 2. Install dependencies / 依存関係をインストール

```bash
npm install
```

### 3. Configure Firebase credentials / Firebase認証情報を設定

Copy the example environment file: / 環境変数ファイルをコピー:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials: / `.env`にFirebase認証情報を設定:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

#### How to get Firebase credentials / Firebase認証情報の取得方法

1. Go to [Firebase Console](https://console.firebase.google.com/) / [Firebaseコンソール](https://console.firebase.google.com/)にアクセス
2. Select your project / プロジェクトを選択
3. Navigate to **Project Settings** > **Service accounts** / **プロジェクトの設定** > **サービスアカウント**に移動
4. Click **Generate new private key** / **新しい秘密鍵を生成**をクリック
5. Download the JSON file / JSONファイルをダウンロード
6. Copy values to your `.env` file: / `.env`ファイルに値をコピー:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

### 4. Build the project / プロジェクトをビルド

```bash
npm run build
```

## Claude Code Configuration / Claude Code設定

### Project-level configuration (recommended) / プロジェクトレベル設定（推奨）

Create `.mcp.json` in your project root: / プロジェクトルートに`.mcp.json`を作成:

```json
{
  "mcpServers": {
    "firestore": {
      "command": "node",
      "args": ["/path/to/firestore-mcp/dist/index.js"]
    }
  }
}
```

> **Note**: The server automatically loads `.env` from its installation directory, so `cwd` is not required.
>
> **注意**: サーバーはインストールディレクトリから自動的に`.env`を読み込むため、`cwd`は不要です。

### With environment variables inline / 環境変数をインラインで指定

If you prefer not to use a `.env` file: / `.env`ファイルを使用しない場合:

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

### After configuration / 設定後

1. Restart Claude Code / Claude Codeを再起動
2. When prompted, approve the MCP server / プロンプトが表示されたらMCPサーバーを承認
3. The Firestore tools will be available in your conversation / Firestoreツールが会話で使用可能になります

## Available Tools / 利用可能なツール

### Collection Operations / コレクション操作

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_collections` | List all top-level collections / トップレベルコレクションを一覧表示 | None |
| `list_subcollections` | List subcollections of a document / ドキュメントのサブコレクションを一覧表示 | `documentPath` |
| `count_documents` | Count documents in a collection / コレクション内のドキュメント数をカウント | `collectionPath` |

### Document Operations / ドキュメント操作

| Tool | Description | Parameters |
|------|-------------|------------|
| `get_document` | Get a single document / 単一ドキュメントを取得 | `documentPath` |
| `list_documents` | List documents in a collection / コレクション内のドキュメントを一覧表示 | `collectionPath`, `limit?` |
| `create_document` | Create a new document / 新しいドキュメントを作成 | `collectionPath`, `data`, `documentId?` |
| `update_document` | Update an existing document / 既存ドキュメントを更新 | `documentPath`, `data`, `merge?` |
| `delete_document` | Delete a document / ドキュメントを削除 | `documentPath` |

### Query Operations / クエリ操作

| Tool | Description | Parameters |
|------|-------------|------------|
| `query_documents` | Query with filters / フィルタ付きクエリ | `collectionPath`, `field`, `operator`, `value`, `limit?` |

#### Supported Query Operators / サポートされているクエリ演算子

- `==` - Equal to / 等しい
- `!=` - Not equal to / 等しくない
- `<` - Less than / より小さい
- `<=` - Less than or equal to / 以下
- `>` - Greater than / より大きい
- `>=` - Greater than or equal to / 以上
- `array-contains` - Array contains value / 配列に値が含まれる
- `in` - Value in array / 配列内の値
- `array-contains-any` - Array contains any of values / 配列にいずれかの値が含まれる

## Usage Examples / 使用例

### List all collections / 全コレクションを一覧表示

```
Tool: list_collections
```

### Get a specific document / 特定のドキュメントを取得

```
Tool: get_document
Parameters:
  documentPath: "users/user123"
```

### List documents with limit / ドキュメントを件数制限付きで一覧表示

```
Tool: list_documents
Parameters:
  collectionPath: "users"
  limit: 10
```

### Query documents / ドキュメントをクエリ

```
Tool: query_documents
Parameters:
  collectionPath: "users"
  field: "status"
  operator: "=="
  value: "active"
  limit: 20
```

### Create a document / ドキュメントを作成

```
Tool: create_document
Parameters:
  collectionPath: "users"
  data: {"name": "John Doe", "email": "john@example.com", "createdAt": "2024-01-01T00:00:00Z"}
  documentId: "user123"  # optional, auto-generated if not provided
```

### Update a document / ドキュメントを更新

```
Tool: update_document
Parameters:
  documentPath: "users/user123"
  data: {"name": "Jane Doe"}
  merge: true  # true = merge with existing, false = replace entirely
```

### Delete a document / ドキュメントを削除

```
Tool: delete_document
Parameters:
  documentPath: "users/user123"
```

### Access subcollections / サブコレクションにアクセス

```
Tool: list_documents
Parameters:
  collectionPath: "users/user123/orders"
  limit: 10
```

## Configuration Options / 設定オプション

### Environment Variables / 環境変数

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_PROJECT_ID` | Yes | Your Firebase project ID / FirebaseプロジェクトID |
| `FIREBASE_CLIENT_EMAIL` | Yes | Service account email / サービスアカウントのメールアドレス |
| `FIREBASE_PRIVATE_KEY` | Yes | Service account private key / サービスアカウントの秘密鍵 |

### Adjusting Behavior / 動作の調整

#### Default query limit / デフォルトのクエリ制限

The default limit for `list_documents` and `query_documents` is 20. You can override this per-request by specifying the `limit` parameter.

`list_documents`と`query_documents`のデフォルト制限は20件です。`limit`パラメータを指定することでリクエストごとに上書きできます。

#### Merge vs Replace on update / 更新時のマージと置換

By default, `update_document` merges new data with existing document data (`merge: true`). Set `merge: false` to replace the entire document.

デフォルトでは、`update_document`は新しいデータを既存のドキュメントデータにマージします（`merge: true`）。ドキュメント全体を置き換えるには`merge: false`を設定します。

## Security Considerations / セキュリティに関する注意事項

- **Never commit `.env` files** - They contain sensitive credentials
- **Use service accounts with minimal permissions** - Only grant Firestore access needed
- **Consider read-only service accounts** for development - Prevent accidental data modification
- **Rotate credentials regularly** - Generate new service account keys periodically

---

- **`.env`ファイルをコミットしない** - 機密性の高い認証情報が含まれています
- **最小権限のサービスアカウントを使用** - 必要なFirestoreアクセス権限のみを付与
- **開発には読み取り専用サービスアカウントを検討** - 誤ってデータを変更することを防止
- **認証情報を定期的にローテーション** - サービスアカウントキーを定期的に再生成

### Creating a read-only service account / 読み取り専用サービスアカウントの作成

1. Go to [Google Cloud Console](https://console.cloud.google.com/) / [Google Cloudコンソール](https://console.cloud.google.com/)にアクセス
2. Navigate to **IAM & Admin** > **Service Accounts** / **IAMと管理** > **サービスアカウント**に移動
3. Create a new service account / 新しいサービスアカウントを作成
4. Grant only the `Cloud Datastore User` role (read-only) / `Cloud Datastore ユーザー`ロール（読み取り専用）のみを付与
5. Generate and download the key / キーを生成してダウンロード

## Firestore Data Types / Firestoreデータ型

The server automatically handles these Firestore types:

サーバーは以下のFirestoreデータ型を自動的に処理します：

| Firestore Type | JSON Output |
|----------------|-------------|
| `Timestamp` | ISO 8601 string (`"2024-01-01T00:00:00.000Z"`) / ISO 8601形式の文字列 |
| `GeoPoint` | `{"latitude": 35.6762, "longitude": 139.6503}` |
| `DocumentReference` | Document path string (`"users/user123"`) / ドキュメントパス文字列 |
| `Array` | JSON array / JSON配列 |
| `Map` | JSON object / JSONオブジェクト |

## Troubleshooting / トラブルシューティング

### "Permission denied" errors / 「権限が拒否されました」エラー

- Verify your service account has Firestore access / サービスアカウントにFirestoreアクセス権があることを確認
- Check that `FIREBASE_PROJECT_ID` matches your actual project / `FIREBASE_PROJECT_ID`が実際のプロジェクトと一致していることを確認
- Ensure the private key includes `\n` characters for newlines / 秘密鍵に改行用の`\n`文字が含まれていることを確認

### "Could not load the default credentials" / 「デフォルトの認証情報を読み込めませんでした」エラー

- Verify all three environment variables are set / 3つの環境変数がすべて設定されていることを確認
- Check that `FIREBASE_PRIVATE_KEY` is properly quoted / `FIREBASE_PRIVATE_KEY`が適切に引用符で囲まれていることを確認

### MCP server not appearing in Claude / MCPサーバーがClaudeに表示されない

- Restart Claude Code after adding `.mcp.json` / `.mcp.json`を追加した後、Claude Codeを再起動
- Check the file path in configuration is correct / 設定のファイルパスが正しいことを確認
- Verify the build completed successfully (`dist/index.js` exists) / ビルドが正常に完了したことを確認（`dist/index.js`が存在する）

### MCP server shows "failed" status / MCPサーバーが「失敗」ステータスを表示

- The server loads `.env` from its installation directory automatically / サーバーはインストールディレクトリから自動的に`.env`を読み込みます
- Verify your `.env` file exists in the firestore-mcp directory (not your project directory) / `.env`ファイルがfirestore-mcpディレクトリ（プロジェクトディレクトリではなく）に存在することを確認
- Run `node /path/to/firestore-mcp/dist/index.js` manually to see error messages / エラーメッセージを確認するには`node /path/to/firestore-mcp/dist/index.js`を手動で実行

## Development / 開発

```bash
# Install dependencies / 依存関係をインストール
npm install

# Build / ビルド
npm run build

# Watch mode (rebuild on changes) / ウォッチモード（変更時に再ビルド）
npm run dev
```

## License / ライセンス

MIT

## Contributing / コントリビュート

Contributions are welcome! Please open an issue or submit a pull request.

コントリビューションを歓迎します！Issueを作成するか、プルリクエストを送信してください。
