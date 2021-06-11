module.exports = [
  {
    id: '1',
    url: 'https://example1.com',
    value: '1.00',
    maxAcceptsPerDay: '1',
    accept: {
      geoState: {
        $in: ['ca', 'ny']
      },
      hour: {
        $in: ['13', '14', '15']
      }
    }
  },
  {
    id: '2',
    url: 'https://example2.com',
    value: '0.02',
    maxAcceptsPerDay: '2',
    accept: {
      geoState: {
        $in: ['ca', 'ny']
      },
      hour: {
        $in: ['13', '14', '15']
      }
    }
  },
  {
    id: '8',
    url: 'https://example8.com',
    value: '0.80',
    maxAcceptsPerDay: '8',
    accept: {
      geoState: {
        $in: ['ca', 'ny']
      },
      hour: {
        $in: ['8', '9', '10']
      }
    }
  },
  {
    id: '14',
    url: 'https://example14.com',
    value: '0.14',
    maxAcceptsPerDay: '14',
    accept: {
      geoState: {
        $in: ['ca', 'ny']
      },
      hour: {
        $in: ['13', '14', '15']
      }
    }
  },
  {
    id: '11101',
    url: 'https://example11101.com',
    value: '11.10',
    maxAcceptsPerDay: '0',
    accept: {
      geoState: {
        $in: ['al', 'as']
      },
      hour: {
        $in: ['11', '12', '13']
      }
    }
  }
]
