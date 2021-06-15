const sendError = require('send-data/error')

module.exports = { respondError }

// utility function to respond error cases
function respondError (req, res, err) {
  res.statusCode = err.statusCode || 500

  sendError(req, res, { body: err.message || 'Error while handling request' })
}
