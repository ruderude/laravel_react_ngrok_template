# CLAUDE.md

技術方針の詳細は @docs/100_要件定義/130_技術方針作成/技術方針検討書.md を参照すること。

## コマンド

- `docker compose up -d` — コンテナ起動
- `docker compose exec app composer install` — PHP 依存インストール
- `docker compose exec app php artisan migrate --seed` — マイグレーション + シーダー
- `docker compose exec app php artisan test` — PHP テスト実行
- `docker compose exec app php artisan test --filter=クラス名` — 単体テスト実行
- `npm install` — JS 依存インストール
- `npm run dev` — Vite 開発サーバー起動
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint チェック
- `npm run lint:fix` — ESLint 自動修正
- `npm run format` — Prettier フォーマット
- `npm run type-check` — TypeScript 型チェック

## 実装後の確認コマンド

実装が完了したら以下を順に実行し、すべてパスすることを確認する。

1. `docker compose exec app php artisan test` — PHP テスト全件実行
2. `npm run format` — Prettier フォーマット
3. `npm run lint:fix` — ESLint 自動修正
4. `npm run lint` — ESLint チェック（残存エラーがないことを確認）
5. `npm run type-check` — TypeScript 型チェック
6. `npm run build` — フロントエンドビルド

## アーキテクチャ

4 層レイヤードアーキテクチャ。依存の方向は上位層 → 下位層。

| 層 | 配置先 | 配置するもの |
|---|--------|------------|
| プレゼンテーション | `app/Http/`, `app/Console/` | Controller, FormRequest, Resource, Command |
| アプリケーション | `app/UseCase/` | UseCase, DTO |
| ドメイン | `app/Domain/` | Eloquent Model, ValueObject, Enum, DomainException |
| インフラストラクチャ | `app/Infrastructure/` | Repository, API Client |

## PHP コーディング規約

- PSR-12 準拠
- 全ファイルに `declare(strict_types=1)` を記述する
- 引数・戻り値の型宣言は必須
- UseCase, Command, テストクラスには `final` を付ける
- Controller に try-catch を書かない。例外は `App\Exceptions\ExceptionHandler` で一括処理する
- バリデーションは必ず `FormRequest` で行う。Controller 内で直接バリデーションしない
- 生の SQL 文字列結合は禁止。Eloquent / クエリビルダのパラメータバインディングを使う

## UseCase のルール

- 1 UseCase = 1 ユースケース。`final` クラスにする
- データアクセスは Repository を経由する。Model を直接クエリしない
- 複数 Repository の書き込みを伴う場合は `DB::transaction()` を直接使用する
- 単一 Repository のみの書き込みではトランザクション不要
- try-catch は以下の 3 パターンのみ許可:
  1. トランザクション内のロールバック制御
  2. バッチループ内で個別アイテムの失敗を catch して継続
  3. 外部 API の補償アクション（作成済みリソースの削除等）

## Repository のルール

- Interface は作らない。具象クラスを直接 DI する
- Eloquent Model を直接操作し、クエリロジックを集約する
- テスト時は Mockery で具象クラスをモックする

## Domain のルール

- Eloquent Model をドメインモデルとしてそのまま使用する。別途 Entity クラスは作らない
- Model は `app/Domain/Models/` に配置する
- ValueObject, Enum, Exception は `app/Domain/{ドメイン名}/` 配下にグルーピングする
- サブディレクトリ（ValueObjects/, Enums/ 等）は同種のファイルが複数になった時点で作成する

## API レスポンス

- HTTP ステータスコードで成功/失敗を表現する
- `status: "success"` のようなラッパーは使わない
- 成功時: Laravel API Resource でデータを返す
- 失敗時: `message` と必要に応じて `errors` を返す

## フロントエンド（TypeScript / React）

- SPA 構成。Blade は `<div id="root">` を含むシェルのみ
- React Router でクライアントサイドルーティング
- エントリポイントは機能領域ごとに分離（`App.tsx`, `Main.tsx` 等）
- 共通コンポーネントは `resources/ts/Shared/` に配置する
- `dangerouslySetInnerHTML` は原則使用禁止
- CSRF トークンは `<meta name="csrf-token">` から取得して `X-CSRF-TOKEN` ヘッダに付与する

## テスト

### PHP（PHPUnit）

- `#[Test]` 属性を使用する（`@test` アノテーションは使わない）
- テストメソッド名は日本語で記述する
- Given / When / Then パターンで構造化する
- Feature テストでは UseCase を Mockery でモックして DI 差し替え
- `RefreshDatabase` トレイトで毎テストリセット

### TypeScript（Vitest）

- コンポーネントテストは React Testing Library を使用する
- テスト対象の優先度: API クライアント > カスタムフック > 複雑なコンポーネント
- 単純な表示のみのコンポーネントはテスト不要

## Git

- ブランチ命名: `feature/{チケット番号}`, `fix/{チケット番号}`
- コミットメッセージは日本語で書く
