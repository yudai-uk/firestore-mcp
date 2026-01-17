# Security Policy / セキュリティポリシー

## Supported Versions / サポートされているバージョン

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability / 脆弱性の報告

If you discover a security vulnerability in this project, please report it responsibly.

このプロジェクトでセキュリティ脆弱性を発見した場合は、責任を持って報告してください。

**Please do NOT report security vulnerabilities through public GitHub issues.**

**セキュリティ脆弱性を公開のGitHub Issueで報告しないでください。**

Instead, please report them via one of the following methods:

代わりに、以下のいずれかの方法で報告してください：

1. **GitHub Security Advisories**: Use the [Security tab](https://github.com/yudai-uk/firestore-mcp/security/advisories/new) to privately report a vulnerability.

   **GitHub Security Advisories**: [セキュリティタブ](https://github.com/yudai-uk/firestore-mcp/security/advisories/new)を使用して非公開で脆弱性を報告してください。

2. **Email**: Contact the maintainer directly (if email is available in the repository).

   **メール**: メンテナーに直接連絡してください（リポジトリにメールアドレスがある場合）。

### What to Include / 含めるべき情報

When reporting a vulnerability, please include:

脆弱性を報告する際は、以下の情報を含めてください：

- A description of the vulnerability / 脆弱性の説明
- Steps to reproduce the issue / 問題を再現する手順
- Potential impact of the vulnerability / 脆弱性の潜在的な影響
- Any suggested fixes (if applicable) / 修正案（該当する場合）

### Response Timeline / 対応タイムライン

- We will acknowledge receipt of your report within 48 hours / 48時間以内に報告の受領を確認します
- We will provide a more detailed response within 7 days / 7日以内により詳細な回答を提供します
- We will work with you to understand and resolve the issue / 問題を理解し解決するために協力します

## Security Best Practices for Users / ユーザー向けセキュリティベストプラクティス

When using this MCP server:

このMCPサーバーを使用する際：

1. **Credentials**: Never commit your Firebase service account credentials to version control

   **認証情報**: Firebaseサービスアカウントの認証情報をバージョン管理にコミットしないでください

2. **Environment Variables**: Use environment variables or secure secret management for sensitive configuration

   **環境変数**: 機密性の高い設定には環境変数または安全なシークレット管理を使用してください

3. **Access Control**: Follow the principle of least privilege when configuring Firebase IAM roles

   **アクセス制御**: Firebase IAMロールを設定する際は最小権限の原則に従ってください

4. **Updates**: Keep the package updated to receive security patches

   **アップデート**: セキュリティパッチを受け取るためにパッケージを最新の状態に保ってください
