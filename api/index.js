// Vercel serverless function entry point
const app = require('../server.js');

// Export as default for Vercel
module.exports = app;
module.exports.default = app;
