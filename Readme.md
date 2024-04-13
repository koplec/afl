# 環境
## postgres 
dataフォルダがあることを確認

ないときは、
mkdir data 
chmod 755 data

windowsだとdocker desktopを起動
WSLの権限の関係で以下で起動仕様としていたがダメ
```
UID_GID="$(id -u):$(id -g)" docker compose up
```

```
docker compose upで現在は対応
```

```
db-1  | 2024-02-10 01:15:14.515 UTC [1] LOG:  database system is ready to accept connections
```
と表示されたら準備完了

psql -U user -d dbname -h localhostで接続できる
パスワードは、docker-componse.ymlに書いている通り、pass


## backend 
cd packages/backend 
tscでbuild 
node dist/index.js

testは、npm run testで以下のように実行される
```
$ cd packages/backend
$ npm run test

> backend@1.0.0 test
> jest

 PASS  dist/application/user/GetUser.test.js
 PASS  dist/infrastructure/db/UserRepository.test.js
 PASS  dist/interfaces/controllers/UserController.test.js
 PASS  dist/domain/User.test.js
 PASS  src/application/user/GetUser.test.ts (10.178 s)
 PASS  src/interfaces/controllers/UserController.test.ts (13.62 s)
 PASS  src/domain/User.test.ts
 PASS  src/infrastructure/db/UserRepository.test.ts (11.29 s)
A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.

Test Suites: 8 passed, 8 total
Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        15.232 s
Ran all test suites.
```


## scripts

node dist/scripts/collect-file-info-batch.js 