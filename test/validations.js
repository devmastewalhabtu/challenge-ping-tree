process.env.NODE_ENV = 'test'

var test = require('ava')
var servertest = require('servertest')

var server = require('../lib/server')
var TargetModel = require('../lib/models/target')
var MalformedData = require('../lib/test-data/malformed_targets')

const TargetFieldsPath = [
  'id',
  'url',
  'value',
  'maxAcceptsPerDay',
  'accept.geoState.$in',
  'accept.hour.$in'
]

test.serial.cb('Should not create target without required fields',
  function (t) {
    TargetModel.createTarget(MalformedData.NoFields, function (err) {
      t.truthy(err, 'Should error')
      t.is(
        err.length, TargetFieldsPath.length,
        'All fields should fail validation'
      )

      t.end()
    })
  })

test.serial.cb('Should not create target without correct field types',
  function (t) {
    TargetModel.createTarget(MalformedData.Target.Mistyped, function (err) {
      t.truthy(err, 'Should error')
      t.is(
        err.length, TargetFieldsPath.length,
        'All fields should fail validation'
      )
      t.end()
    })
  })

test.serial.cb('Should not create target without valid field formats',
  function (t) {
    TargetModel.createTarget(MalformedData.Target.InvalidFormats,
      function (err) {
        t.truthy(err, 'Should error')
        t.is(err.length, 5, '5 fields should fail validation')
        t.end()
      })
  })

test.serial.cb('Should not update target without correct field types',
  function (t) {
    const testData = MalformedData.Target.Mistyped
    TargetModel.updateTargetById(testData.id, testData, function (err) {
      t.truthy(err, 'Should error')
      t.is(
        err.length, TargetFieldsPath.length,
        'All fields should fail validation'
      )
      t.end()
    })
  })

test.serial.cb('Should not update target without valid field formats',
  function (t) {
    const testData = MalformedData.Target.InvalidFormats
    TargetModel.updateTargetById(testData.id, testData, function (err) {
      t.truthy(err, 'Should error')
      t.is(err.length, 5, '5 fields should fail validation')
      t.end()
    })
  })

test.serial.cb('Should route respond error without required fields',
  function (t) {
    const url = '/route'
    const routeRequest = MalformedData.NoFields

    servertest(server(), url, {
      encoding: 'json', method: 'POST'
    }, function (err, res) {
      t.falsy(err, 'Servertest should not error')
      t.not(res.statusCode, 200, 'Status code should not 200')
      t.truthy(res.body.message, 'response should contain error')
      t.end()
    }).end(JSON.stringify(routeRequest))
  })

test.serial.cb('Should route respond error without valid fields',
  function (t) {
    const url = '/route'
    const routeRequest = MalformedData.RouteData.InvalidFormats

    servertest(server(), url, {
      encoding: 'json', method: 'POST'
    }, function (err, res) {
      t.falsy(err, 'Servertest should not error')
      t.not(res.statusCode, 200, 'Status code should not 200')
      t.truthy(res.body.message, 'response should contain error message')
      t.end()
    }).end(JSON.stringify(routeRequest))
  })
