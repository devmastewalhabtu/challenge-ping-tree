const sendJson = require('send-data/json')
const body = require('body/json')

const TargetModel = require('../models/target')
const { respondError } = require('./utils')

module.exports = {
  postTarget,
  getTargets,
  getTargetById,
  updateTargetById
}

// handles POST request for /api/targets
function postTarget (req, res) {
  body(req, res, function (err, postData) {
    if (err) return respondError(req, res, err)

    TargetModel.createTarget(postData, function (err) {
      if (err) return respondError(req, res, err)

      sendJson(req, res, { statusCode: 200, body: postData })
    })
  })
}

// handles GET request for /api/targets
function getTargets (req, res) {
  TargetModel.getAllTargets(function (err, targets) {
    if (err) return respondError(req, res, err)

    sendJson(req, res, { statusCode: 200, body: targets })
  })
}

// handles GET request for /api/target/:id
function getTargetById (req, res, opts) {
  // extract needed params
  const { params: { id: targetId } } = opts

  TargetModel.getTargetById(targetId, function (err, target) {
    if (err) return respondError(req, res, err)

    sendJson(req, res, { statusCode: 200, body: target })
  })
}

// handles POST request for /api/target/:id
function updateTargetById (req, res, opts) {
  // extract needed params
  const { params: { id: targetId } } = opts

  body(req, res, function (err, updateData) {
    if (err) return respondError(req, res, err)

    TargetModel.updateTargetById(targetId, updateData, function (err) {
      if (err) return respondError(req, res, err)

      sendJson(req, res, { statusCode: 200, body: { success: true } })
    })
  })
}
