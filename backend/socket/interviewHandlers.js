/**
 * DEPRECATED - This file is kept for backwards compatibility only
 * The actual handler is at: backend/websocket/interviewHandlers.js
 * 
 * If you're seeing errors here, update your imports to use:
 * require('../websocket/interviewHandlers')
 */

console.warn('⚠️  DEPRECATED: /socket/interviewHandlers.js is outdated. Using /websocket/interviewHandlers.js');

// Re-export the correct module
module.exports = require('../websocket/interviewHandlers');