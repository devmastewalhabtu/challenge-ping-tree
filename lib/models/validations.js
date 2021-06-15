var Schema = require('validate')

// us states 2 letter code
const USStates = [
  'al', 'ak', 'as', 'az', 'ar', 'ca', 'co', 'ct',
  'de', 'dc', 'fm', 'fl', 'ga', 'gu', 'hi', 'id',
  'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'mh',
  'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne',
  'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'mp',
  'oh', 'ok', 'or', 'pw', 'pa', 'pr', 'ri', 'sc',
  'sd', 'tn', 'tx', 'ut', 'vt', 'vi', 'va', 'wa',
  'wv', 'wi', 'wy'
]

// general target field structures that can be reused to define schemas
const TargetSchema = {
  id: {
    type: String
  },
  url: {
    type: String,
    match: // url regex
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
    message: {
      match: 'url is invalid'
    }
  },
  value: {
    type: String,
    match: /^-?\d+\.?\d*$/, // decimal number
    message: {
      match: 'value must be number'
    }
  },
  maxAcceptsPerDay: {
    type: String,
    match: /^\d+$/, // non-negative whole number
    message: {
      match: 'maxAcceptsPerDay must be non-negative whole number'
    }
  },
  accept: {
    geoState: {
      $in: {
        type: Array,
        each: {
          type: String,
          enum: USStates

        }
      }
    },
    hour: {
      $in: {
        type: Array,
        each: {
          type: String,
          match: /^([0-1]?[0-9]|2[0-3])$/ // 0-23 numbers
        }
      }
    }
  }
}

// schema defining target fields for target updating data
const UpdateTargetData = new Schema(TargetSchema, { strip: false })

// schema defining fields for new target data
const NewTargetData = new Schema({
  id: {
    ...TargetSchema.id,
    required: true
  },
  url: {
    ...TargetSchema.url,
    required: true
  },
  value: {
    ...TargetSchema.value,
    required: true
  },
  maxAcceptsPerDay: {
    ...TargetSchema.maxAcceptsPerDay,
    required: true
  },
  accept: {
    geoState: {
      $in: {
        ...TargetSchema.accept.geoState.$in,
        required: true
      }
    },
    hour: {
      $in: {
        ...TargetSchema.accept.hour.$in,
        required: true
      }
    }
  }
},
{ strip: false })

// schema defining fields for route request data
const RouteRequestData = new Schema({
  geoState: {
    type: String,
    required: true,
    enum: USStates
  },
  publisher: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true,
    match: // timestamp regex
      /\b[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z\b/
  }
})

module.exports = {
  NewTargetData,
  UpdateTargetData,
  RouteRequestData
}
