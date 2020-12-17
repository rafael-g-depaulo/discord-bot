const path = require("path")

module.exports = {
  name: 'fantasy-battle',
  displayName: {
    name: 'MODULE: FANTASY_BATTLE',
    color: 'green',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
