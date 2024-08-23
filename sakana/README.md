This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Prisma がマイグレーションを実行する際に必要な「シャドウデータベース」を作成できないことを示しています。

```
# MySQLコンテナに接続
docker exec -it fish_encyclopedia_mysql mysql -u root -p

# MySQLプロンプトで以下のコマンドを実行
# 'your_password'を実際のパスワードに置き換えてください
GRANT ALL PRIVILEGES ON *.* TO 'your_username'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

```
# MySQLコンテナに接続
docker exec -it fish_encyclopedia_mysql mysql -u root -p

# MySQLプロンプトで以下のコマンドを実行
CREATE DATABASE fish_encyclopedia_shadow;
GRANT ALL PRIVILEGES ON fish_encyclopedia_shadow.* TO 'your_username'@'%';
FLUSH PRIVILEGES;
EXIT;
```
