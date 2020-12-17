const path = require("path")

module.exports = {
  name: 'dice-module',
  displayName: {
    name: 'MODULE: DICE-MODULE',
    color: 'green',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
