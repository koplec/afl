export default {
  preset: "ts-jest/presets/default-esm", //ESモジュール用のプリセット
  testEnvironment: "node", //ブラウザ側テストではなくサーバ側テスト
  testPathIgnorePatterns: [
    "dist/",
  ],
  transform: {
    '^.+\\.(ts|js|tsx|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(webdav|layerr|url-join|@buttercup/fetch)/)',  // webdavモジュールをトランスパイルの対象に含める
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',  // ES モジュールでの相対パスの解決
  },
  extensionsToTreatAsEsm: ['.ts'],  // .ts ファイルを ESM として扱う
  moduleDirectories: [
    '../../node_modules', // ルートの node_modules への相対パス
    'node_modules', // パッケージ固有の node_modules
  ],
}