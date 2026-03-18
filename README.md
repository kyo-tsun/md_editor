# Markdown Editor

ブラウザで動くシンプルなマークダウンエディター。左右分割のリアルタイムプレビュー付き。

## 機能

- マークダウンのリアルタイムプレビュー
- Mermaid図のプレビュー
- 箇条書きの自動継続（Enter）
- Tabキーでインデント挿入

## 技術スタック

- フロントエンド: HTML / CSS / JavaScript + [marked.js](https://github.com/markedjs/marked) + [mermaid.js](https://github.com/mermaid-js/mermaid)
- インフラ: AWS CDK (TypeScript) - S3 + CloudFront

## デプロイ

```bash
npm install
npx cdk bootstrap   # 初回のみ
npx cdk deploy
```

デプロイ完了後、出力される URL にアクセスしてください。

## ローカル確認

`frontend/index.html` をブラウザで直接開けば動作確認できます。
