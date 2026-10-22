# 抢先版 / Preview — 在线部署

构建：20261022e61
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

在线包：`戈克世界-抢先版-在线部署-e61.zip`

上线地址：
https://gok-vein-gambit-preview.onrender.com
