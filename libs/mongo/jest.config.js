const path = require("path")

module.exports = {
  name: 'lib-test',
  displayName: {
    name: 'LIB: LIB-TEST',
    color: 'cyan',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
