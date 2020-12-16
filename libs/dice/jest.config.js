const path = require("path")

module.exports = {
  name: 'dice',
  displayName: {
    name: 'LIB: DICE',
    color: 'cyan',
  },
  
  testPathIgnorePatterns: [
    "dist/",
  ],

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testEnvironment: 'node',
}
