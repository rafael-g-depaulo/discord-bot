const path = require("path")

module.exports = {
  name: 'discord-mock',
  displayName: {
    name: 'LIB: DISCORD-MOCK',
    color: 'cyan',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
