const path = require("path")

module.exports = {
  name: 'regex',
  displayName: {
    name: 'LIB: REGEX',
    color: 'cyan',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
