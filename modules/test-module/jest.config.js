const path = require("path")

module.exports = {
  name: 'test-module',
  displayName: {
    name: 'MODULE: TEST-MODULE',
    color: 'green',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
