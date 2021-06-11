const sendJson = require('send-data/json')

module.exports = { respondError }

// utility function to respond error cases
function respondError (req, res, err) {
  res.statusCode = err.statusCode || 500

  sendJson(req, res, { error: err.message || 'Error while handling request' })
}
