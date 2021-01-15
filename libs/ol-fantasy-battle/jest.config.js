const path = require("path")

module.exports = {
  name: 'ol-fantasy-battle',
  displayName: {
    name: 'SYSTEM: Fantasy Battle',
    color: 'magenta',
  },

  testEnvironment: 'node',

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
