var redis = require('../redis')
var Validations = require('./validations')

const TARGET_MODEL_KEY = 'target'

module.exports = {
  createTarget,
  getAllTargets,
  getTargetById,
  updateTargetById
}

// creates a new target from given data
function createTarget (newData, cb) {
  validateNewTargetData(newData, function (err) {
    if (err) return cb(err)

    redis.hset(
      TARGET_MODEL_KEY,
      newData.id,
      JSON.stringify(newData),
      err => cb(err)
    )
  })
}

// gets all targets
function getAllTargets (cb) {
  redis.hgetall(
    TARGET_MODEL_KEY,
    function (err, loadedTargets) {
      if (err) return cb(err)

      let targets = []
      if (loadedTargets) {
        targets = Object.values(loadedTargets)

        targets = targets.map(targetData => JSON.parse(targetData))
      }

      cb(err, targets)
    }
  )
}

// gets a target by id
function getTargetById (id, cb) {
  redis.hget(
    TARGET_MODEL_KEY,
    id,
    function (err, loadedTarget) {
      if (err) return cb(err)

      const target = JSON.parse(loadedTarget)
      cb(err, target)
    }
  )
}

// updates a target by id
function updateTargetById (id, updateData, cb) {
  const validationError = Validations.UpdateTargetData.validate(updateData)

  if (validationError.length !== 0) return cb(validationError)

  // load target by id
  getTargetById(id, function (err, target) {
    if (err) return cb(err)

    // update target if only exists
    if (!target) return cb(new Error('No target with given id exists.'))

    // safely set id in update data if id exists
    if (updateData.id) updateData.id = id

    Object.keys(updateData).forEach((key) => {
      target[key] = updateData[key]
    })
    target = JSON.stringify(target)

    // save updated target on redis
    redis.hset(
      TARGET_MODEL_KEY,
      id,
      target,
      err => cb(err)
    )
  })
}

// validate given data for creating new target
function validateNewTargetData (newData, cb) {
  const validationError = Validations.NewTargetData.validate(newData)
  if (validationError.length !== 0) return cb(validationError)

  getTargetById(newData.id, function (err, target) {
    if (err) return cb(err)

    if (target) {
      return cb(new Error('Target with the given id already exists.'))
    }

    return cb(null)
  })
}
