process.env.NODE_ENV = 'test'

var test = require('ava')
var servertest = require('servertest')
var mapLimit = require('map-limit')

var server = require('../lib/server')
var testTargets = require('../lib/test-data/targets')

test.serial.cb('healthcheck', function (t) {
  var url = '/health'
  servertest(server(), url, { encoding: 'json' }, function (err, res) {
    t.falsy(err, 'no error')

    t.is(res.statusCode, 200, 'correct statusCode')
    t.is(res.body.status, 'OK', 'status is ok')
    t.end()
  })
})

test.serial.cb('should create target by POST /api/targets', function (t) {
  var url = '/api/targets'
  mapLimit(testTargets, 1, createTarget, function (err) {
    t.falsy(err, 'No error')
    t.end()
  })

  function createTarget (target, cb) {
    var opts = { encoding: 'json', method: 'POST' }
    var stream = servertest(server(), url, opts, function (err, res) {
      t.is(res.statusCode, 200)
      cb(err)
    })
    stream.end(JSON.stringify(target))
  }
})

test.serial.cb('should get targets by GET /api/targets', function (t) {
  var url = '/api/targets'

  servertest(server(), url, {
    encoding: 'json', method: 'GET'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, testTargets, 'Correct targets found')
    t.end()
  })
})

test.serial.cb('should get specified target by GET /api/target/:id', function (t) {
  var selectedTarget = testTargets[testTargets.length - 1]
  var url = `/api/target/${selectedTarget.id}`

  servertest(server(), url, {
    encoding: 'json', method: 'GET'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, selectedTarget, 'Correct target')
    t.end()
  })
})

test.serial.cb('should update target by POST /api/target/:id', function (t) {
  var selectedTarget = testTargets[testTargets.length - 1]
  var url = `/api/target/${selectedTarget.id}`
  var updateData = { url: 'https://updatedexample.com' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, { success: true }, 'Target updating successful')
    t.end()
  })
  stream.end(JSON.stringify(updateData))
})

test.serial.cb('should route reject decision if given unaccepted hour', function (t) {
  var url = '/route'
  var routeRequest = {
    geoState: 'ca',
    publisher: 'abc',
    timestamp: '2018-07-19T23:28:59.513Z' // unacceptable hour from test data
  }

  var expected = { decision: 'reject' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, expected, 'Correct reject decision')
    t.end()
  })

  stream.end(JSON.stringify(routeRequest))
})

test.serial.cb('should route reject decision if given unaccepted state', function (t) {
  var url = '/route'
  var routeRequest = {
    geoState: 'az', // unacceptable state from test data
    publisher: 'abc',
    timestamp: '2018-07-19T16:28:59.513Z'
  }

  var expected = { decision: 'reject' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, expected, 'Correct reject decision')
    t.end()
  })

  stream.end(JSON.stringify(routeRequest))
})

test.serial.cb('should route reject decision if target max accepts per day exceeds', function (t) {
  var url = '/route'
  var routeRequest = {
    geoState: 'al', // geo state matches with target accept per day exceeding
    publisher: 'abc',
    timestamp: '2018-07-19T11:28:59.513Z'
  }

  var expected = { decision: 'reject' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, expected, 'Correct reject decision')
    t.end()
  })

  stream.end(JSON.stringify(routeRequest))
})

test.serial.cb('should route respond with url for acceptable state and hour', function (t) {
  var url = '/route'
  var routeRequest = {
    geoState: 'ca',
    publisher: 'abc',
    timestamp: '2018-07-19T08:28:59.513Z' // hour only matches test target with id 8
  }
  var expected = { url: 'https://example8.com' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, expected, 'Correct target url')
    t.end()
  })
  stream.end(JSON.stringify(routeRequest))
})

test.serial.cb('should route respond with url of highest value target', function (t) {
  var url = '/route'
  var routeRequest = {
    geoState: 'ca',
    publisher: 'abc',
    timestamp: '2018-07-19T15:28:59.513Z' // hour matches 3 test targets
  }
  // expected target url with the highest value
  var expected = { url: 'https://example1.com' }

  var stream = servertest(server(), url, {
    encoding: 'json', method: 'POST'
  }, function (err, res) {
    t.falsy(err, 'No error')
    t.is(res.statusCode, 200, 'Correct status code')
    t.deepEqual(res.body, expected, 'Correct target url')
    t.end()
  })
  stream.end(JSON.stringify(routeRequest))
})
