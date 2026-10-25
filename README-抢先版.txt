# 抢先版 / Preview — 在线部署

构建：20261025e63（2A–2E 补丁 / 语义核对）
通道：PREVIEW / 抢先版

部署根目录就是本目录：

```text
public/
server/
package.json
render.yaml
.gitignore
```

Render：

```text
Build Command: npm install
Start Command: node server/server.js
Environment:
  GOK_CHANNEL=preview
  NODE_VERSION=24
  DATABASE_URL=Neon / Supabase 的 Postgres Pooled 连接串
```

不需要 Render 持久化磁盘。账号数据在免费云数据库里，Render 免费实例休眠重启不会丢账号。

账号后端包含：

```text
server/auth.js     SQLite 本地模式
server/auth_pg.js Postgres 线上模式
```

本地或离线启动不要设置 `DATABASE_URL`，会使用 SQLite。

在线包：`戈克世界-抢先版-在线部署-e63.zip`

数值表：`戈克世界-抢先版-数值表-e63-语义核对-2026-10-25.xlsx`

上线地址：
https://gok-vein-gambit-preview.onrender.com
