const path = require("path")

module.exports = {
  name: 'logging',
  displayName: {
    name: 'LIB: LOGGING',
    color: 'cyan',
  },

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
