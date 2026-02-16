// Vercel serverless function handler
const app = require('../server.js');

// Export handler for Vercel serverless
module.exports = async (req, res) => {
    return app(req, res);
};
