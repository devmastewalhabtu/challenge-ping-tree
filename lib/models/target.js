var redis = require('../redis')

const TARGET_MODEL_KEY = 'target'

// creates a new target from given data
function createTarget (newData, cb) {
  redis.hset(
    TARGET_MODEL_KEY,
    newData.id,
    JSON.stringify(newData),
    err => cb(err)
  )
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
  // load target by id
  getTargetById(id, function (err, target) {
    if (err) return cb(err)

    // update target if only exists
    if (target) {
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
    }
  })
}
