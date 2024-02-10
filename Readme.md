# 環境
## postgres 
windowsだとdocker desktopを起動
docker compose up 起動

```
db-1  | 2024-02-10 01:15:14.515 UTC [1] LOG:  database system is ready to accept connections
```
と表示されたら準備完了

psql -U user -d dbname -h localhostで接続できる
パスワードは、docker-componse.ymlに書いている通り、pass
## background 
cd packages/backend 
tscでbuild 
node dist/index.js