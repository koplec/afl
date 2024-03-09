export default {
  preset: "ts-jest/presets/default-esm", //ESモジュール用のプリセット
  globals: {
    'ts-jest': {
      useESM: true, //ESモジュールを使う
    }
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',  // ES モジュールでの相対パスの解決
  },
  extensionsToTreatAsEsm: ['.ts'],  // .ts ファイルを ESM として扱う
  testEnvironment: "node", //ブラウザ側テストではなくサーバ側テスト
  testPathIgnorePatterns: [
    "dist/",
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(webdav)/)',  // webdavモジュールをトランスパイルの対象に含める
  ],
}