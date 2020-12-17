const path = require("path")

module.exports = {
  projects: [
    "<rootDir>/apps/*",
    "<rootDir>/libs/*",
    "<rootDir>/modules/*",
  ],
  
  testPathIgnorePatterns: [
    "<rootDir>",
    "node_modules/",
    "dist/",
  ],

  moduleDirectories: ["node_modules", path.join(__dirname, "src")],

  testEnvironment: 'node',
}
