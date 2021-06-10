var test = require('ava')
var TargetModel = require('../lib/models/target')

var target = {
  id: '1',
  url: 'http://example.com',
  value: '0.50',
  maxAcceptsPerDay: '10',
  accept: {
    geoState: {
      $in: ['ca', 'ny']
    },
    hour: {
      $in: ['13', '14', '15']
    }
  }
}

test.serial.cb('Should create target', function (t) {
  TargetModel.createTarget(target, function (err) {
    t.falsy(err, 'Should not error')
    t.end()
  })
})

test.serial.cb('Should get all targes', function (t) {
  TargetModel.getAllTargets(function (err, tagets) {
    t.falsy(err, 'Should not error')

    t.is(tagets.length, 1, 'Correct number of targets')
    t.end()
  })
})

test.serial.cb('Should get target by id', function (t) {
  TargetModel.getTargetById('1', function (err, targetFound) {
    t.falsy(err, 'Should not error')

    t.deepEqual(targetFound, target, 'Targets should match')
    t.end()
  })
})

test.serial.cb('Should update target by id', function (t) {
  var updateField = { url: 'http://example-updated.com' }
  TargetModel.updateTargetById('1', updateField, function (err) {
    t.falsy(err, 'Should not error')

    TargetModel.getTargetById('1', function (err, targetFound) {
      t.falsy(err, 'Should not error')

      t.is(targetFound.url, updateField.url, 'Updated field should match')
      t.end()
    })
  })
})
