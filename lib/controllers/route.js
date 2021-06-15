const sendJson = require('send-data/json')
const body = require('body/json')

const TargetModel = require('../models/target')
const Validations = require('../models/validations')
const { respondError } = require('./utils')

module.exports = {
  route
}

// handles POST request for /route
function route (req, res) {
  body(req, res, function (err, payload) {
    if (err) return respondError(req, res, err)

    // check request data conforms validation criterias
    const validationError = Validations.RouteRequestData.validate(payload)
    if (validationError.length !== 0) {
      return respondError(req, res, validationError)
    }

    TargetModel.getAllTargets(function (err, targets) {
      if (err) return respondError(req, res, err)

      // filter today eligible targets
      const todayString = new Date().toDateString()
      const todayKey = `acceptedCountOf${todayString}`

      const filteredTargets = filterTodayEligibleTargets(targets, todayKey)

      // find target that satisfies the criteria
      const { geoState, timestamp } = payload
      const timestampDate = new Date(timestamp)
      const criteriaHour = timestampDate.getUTCHours().toString()
      const criteria = {
        geoState: geoState,
        hour: criteriaHour
      }

      const foundTarget = findCriteriaTarget(filteredTargets, criteria)

      // if no target found, reject
      if (!foundTarget) {
        return sendJson(req, res, {
          statusCode: 200, body: { decision: 'reject' }
        })
      }

      // if satisfying target found, respond decision with target url
      respondFoundTargetUrl(req, res, { foundTarget, todayKey })
    })
  })
}

// find the best target that satisfies given criteria
function findCriteriaTarget (targets, criteria) {
  const { geoState, hour } = criteria

  let highestTargetValue = 0
  let foundTarget = null

  targets.forEach(function (target) {
    let {
      value: currentValue,
      accept: {
        geoState: { $in: acceptedGeo },
        hour: { $in: acceptedHour }
      }
    } = target
    // don't forget parsing value to float
    currentValue = parseFloat(currentValue)

    const isMatchTarget = acceptedGeo.includes(geoState) &&
      acceptedHour.includes(hour)

    // update found target if better match target found
    if (isMatchTarget && (currentValue > highestTargetValue)) {
      highestTargetValue = currentValue
      foundTarget = target
    }
  })

  return foundTarget
}

// filters targets that are eligible for today
function filterTodayEligibleTargets (targets, todayCountKey) {
  const filteredTargets = targets.filter(
    function (target) {
      // target not eligible if maxAcceptsPerDay is 0
      const maxAcceptsPerDay = parseInt(target.maxAcceptsPerDay)
      if (!maxAcceptsPerDay) return false

      // target eligible if no today count key exist
      if (!target[todayCountKey]) return true

      // if today count key exists check it doesn't exceed max accept per day
      if (maxAcceptsPerDay &&
           parseInt(target[todayCountKey]) < maxAcceptsPerDay) {
        return true
      }
    }
  )

  return filteredTargets
}

// respond target url including updating the accept count for today
function respondFoundTargetUrl (req, res, opts) {
  const { foundTarget, todayKey } = opts

  let acceptCountOnToday = foundTarget[todayKey]
    ? parseInt(foundTarget[todayKey])
    : 0

  acceptCountOnToday = acceptCountOnToday + 1

  TargetModel.updateTargetById(
    foundTarget.id,
    { [todayKey]: acceptCountOnToday },
    function (err, updatedTarget) {
      if (err) return respondError(req, res, err)

      // send update response if only target accept count of today is successfully updated
      sendJson(req, res, { statusCode: 200, body: { url: foundTarget.url } })
    })
}
