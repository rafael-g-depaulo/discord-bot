const path = require("path")

module.exports = {
  name: 'lib-test',
  displayName: {
    name: 'MODULE: MODULE-TEST',
    color: 'green',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
