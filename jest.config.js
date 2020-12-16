const path = require("path")

module.exports = {
  projects: [
    "<rootDir>/libs/*",
    "<rootDir>/apps/*",
  ],
  
  testPathIgnorePatterns: [
    "<rootDir>",
    "node_modules/",
    "dist/",
  ],

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testEnvironment: 'node',

}
