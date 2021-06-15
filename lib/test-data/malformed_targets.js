module.exports = {
  NoFields: {},
  Target: {
    Mistyped: {
      id: 1,
      url: 2,
      value: 3,
      maxAcceptsPerDay: 4,
      accept: {
        geoState: {
          $in: [5]
        },
        hour: {
          $in: [6]
        }
      }
    },
    InvalidFormats: {
      id: '11',
      url: 'httxps://malformed-example.com',
      value: '2x',
      maxAcceptsPerDay: '-12',
      accept: {
        geoState: {
          $in: ['ca', 'cx']
        },
        hour: {
          $in: ['23', '24']
        }
      }
    }
  },
  RouteData: {
    InvalidFormats: {
      geoState: 'cx',
      publisher: 'abc',
      timestamp: '018-07-19T23:28:59.513Z'
    }
  }
}
