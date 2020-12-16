const path = require("path")

module.exports = {
  name: 'create-client',
  displayName: {
    name: 'LIB: CREATE-CLIENT',
    color: 'cyan',
  },
  
  testEnvironment: 'node',

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testPathIgnorePatterns: [
    "dist/",
  ],
}
