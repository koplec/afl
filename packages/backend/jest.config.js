module.exports = {
  preset: "ts-jest",
  testEnvironment: "node", //ブラウザ側テストではなくサーバ側テスト
  transformIgnorePatterns: [
    'node_modules/(?!(webdav)/)',  // webdavモジュールをトランスパイルの対象に含める
  ],
};
　