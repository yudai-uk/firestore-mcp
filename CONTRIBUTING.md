# Contributing to Firestore MCP / Firestore MCPへのコントリビュート

Thank you for your interest in contributing to Firestore MCP! This document provides guidelines and instructions for contributing.

Firestore MCPへのコントリビュートに興味を持っていただきありがとうございます！このドキュメントでは、コントリビュートのためのガイドラインと手順を説明します。

## How to Contribute / コントリビュート方法

### Reporting Bugs / バグの報告

1. Check if the issue already exists in [GitHub Issues](https://github.com/yudai-uk/firestore-mcp/issues)

   [GitHub Issues](https://github.com/yudai-uk/firestore-mcp/issues)で既に問題が報告されていないか確認してください

2. If not, create a new issue with: / まだ報告されていない場合は、以下を含む新しいIssueを作成してください：
   - A clear, descriptive title / 明確で説明的なタイトル
   - Steps to reproduce the problem / 問題を再現する手順
   - Expected vs actual behavior / 期待される動作と実際の動作
   - Your environment (Node.js version, OS, etc.) / 環境（Node.jsバージョン、OSなど）

### Suggesting Features / 機能の提案

1. Open a new issue with the `enhancement` label

   `enhancement`ラベルを付けて新しいIssueを作成してください

2. Describe the feature and its use case

   機能とそのユースケースを説明してください

3. Explain why this would be useful to other users

   なぜこの機能が他のユーザーにとって有用なのかを説明してください

### Pull Requests / プルリクエスト

1. **Fork the repository** and create your branch from `main`

   **リポジトリをフォーク**して、`main`からブランチを作成してください

2. **Make your changes** following the code style below

   以下のコードスタイルに従って**変更を加えてください**

3. **Test your changes** locally

   ローカルで**変更をテスト**してください

4. **Commit your changes** with clear, descriptive messages

   明確で説明的なメッセージで**変更をコミット**してください

5. **Open a Pull Request** with: / 以下を含む**プルリクエストを作成**してください：
   - A clear description of the changes / 変更の明確な説明
   - Reference to any related issues / 関連するIssueへの参照
   - Screenshots if applicable / 該当する場合はスクリーンショット

#### Pull Request Process / プルリクエストのプロセス

- All PRs require review and approval from maintainers / すべてのPRはメンテナーによるレビューと承認が必要です
- PRs must pass any automated checks / PRは自動チェックに合格する必要があります
- Keep PRs focused - one feature or fix per PR / PRは1つの機能または修正に集中させてください
- Update documentation if needed / 必要に応じてドキュメントを更新してください

## Code Style / コードスタイル

- Use TypeScript for all source code / すべてのソースコードにTypeScriptを使用
- Follow existing code formatting / 既存のコードフォーマットに従う
- Use meaningful variable and function names / 意味のある変数名と関数名を使用
- Add comments for complex logic / 複雑なロジックにはコメントを追加

## Development Setup / 開発環境のセットアップ

```bash
# Clone your fork / フォークをクローン
git clone https://github.com/YOUR_USERNAME/firestore-mcp.git
cd firestore-mcp

# Install dependencies / 依存関係をインストール
npm install

# Set up environment / 環境をセットアップ
cp .env.example .env
# Edit .env with your Firebase credentials
# .envにFirebase認証情報を設定

# Build / ビルド
npm run build

# Watch mode for development / 開発用ウォッチモード
npm run dev
```

## Testing Your Changes / 変更のテスト

Before submitting a PR, ensure: / PRを送信する前に、以下を確認してください：

1. The project builds without errors: `npm run build`

   プロジェクトがエラーなくビルドされる：`npm run build`

2. Your changes work with Claude Code

   変更がClaude Codeで動作する

3. No sensitive data is included in commits

   コミットに機密データが含まれていない

## Code of Conduct / 行動規範

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

[行動規範](CODE_OF_CONDUCT.md)をお読みになり、それに従ってください。

## Questions? / 質問がありますか？

Feel free to open an issue for any questions about contributing.

コントリビュートに関する質問がある場合は、お気軽にIssueを作成してください。

## License / ライセンス

By contributing, you agree that your contributions will be licensed under the MIT License.

コントリビュートすることにより、あなたのコントリビューションがMITライセンスの下でライセンスされることに同意したものとみなされます。
