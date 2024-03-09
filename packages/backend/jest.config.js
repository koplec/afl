module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transformIgnorePatterns: [
    'node_modules/(?!(webdav)/)',  // webdavモジュールをトランスパイルの対象に含める
  ],
};
　