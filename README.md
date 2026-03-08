# プロジェクト初期設定手順

このドキュメントでは、本プロジェクトをローカル環境で起動するための初期セットアップ手順を説明します。

---

# 前提条件

以下のソフトウェアがインストールされている必要があります。

- Docker
- Docker Compose
- Git

また、本プロジェクトは **Docker環境でLaravelを実行する構成**になっています。

---

# 1. 環境変数ファイルの作成

まず `.env` ファイルを作成します。

```bash
cp .env.docker .env

作成後、以下の内容を必要に応じて編集してください。

NGROK_AUTH_TOKEN
NGROK_DOMAIN

データベース接続情報
その他プロジェクト固有の設定

2. Dockerコンテナの起動

Dockerコンテナをバックグラウンドで起動します。

docker compose up -d

起動後、コンテナが正常に立ち上がっているか確認します。

docker compose ps

3. PHP依存パッケージのインストール

Laravelで使用するPHPパッケージをインストールします。

docker compose exec app composer install

4. アプリケーションキーの生成

Laravelのアプリケーションキーを生成します。

docker compose exec app php artisan key:generate

5. Nodeパッケージのインストール

フロントエンド関連のパッケージをインストールします。

docker compose exec app npm install

6. フロントエンド開発サーバーの起動

Viteの開発サーバーを起動します。

docker compose exec app npm run dev

7. データベースマイグレーション

データベースのテーブルを作成します。

docker compose exec app php artisan migrate

8. 権限調整

Laravelがログやキャッシュを書き込めるように、ディレクトリの権限を調整します。

docker compose exec app php artisan storage:link
chmod -R 777 storage
chmod -R 777 bootstrap/cache

※必要に応じて www-data ユーザーへの所有権変更を行ってください。

9. アプリケーション確認

ブラウザで以下にアクセスします。

https://<NGROK_DOMAIN>

正常に表示されればセットアップ完了です。

よく使うコマンド

docker compose down --rmi all --volumes --remove-orphans
docker compose up -d
docker compose exec app npm run dev

docker compose exec app php artisan test

その他

マイグレーションロールバック
docker compose exec app php artisan migrate:rollback

指定ステップロールバック
docker compose exec app php artisan migrate:rollback --step=3

全テーブル削除 → 再作成
docker compose exec app php artisan migrate:fresh

DB再構築 + シーダー実行
docker compose exec app php artisan migrate:fresh --seed

全シーダー実行
docker compose exec app php artisan db:seed

特定シーダー実行
docker compose exec app php artisan db:seed --class=UserSeeder

すべてのキャッシュ削除（以下のキャッシュ系コマンドが含まれる）
docker compose exec app php artisan optimize:clear

アプリケーションキャッシュ削除
docker compose exec app php artisan cache:clear

設定キャッシュ削除
docker compose exec app php artisan config:clear

設定キャッシュ再生成
docker compose exec app php artisan config:cache

ルートキャッシュ削除
docker compose exec app php artisan route:clear

ルートキャッシュ生成
docker compose exec app php artisan route:cache

ビューキャッシュ削除
docker compose exec app php artisan view:clear

ビューキャッシュ再生成
docker compose exec app php artisan view:cache

ルート一覧表示
docker compose exec app php artisan route:list

Laravelバージョン確認
docker compose exec app php artisan --version

Model + Migration 同時作成
docker compose exec app php artisan make:model Product -m

Model + Controller + Migration 同時作成
docker compose exec app php artisan make:model Product -mcr

Controller 作成
docker compose exec app php artisan make:controller ProductController

Seeder 作成
docker compose exec app php artisan make:seeder ProductSeeder

Factory 作成
docker compose exec app php artisan make:factory ProductFactory


※本番運用でのキャッシュの扱い（キャッシュをクリアし、再生成する）
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload
php artisan optimize
