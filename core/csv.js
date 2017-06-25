'use strict'

const cloneArray = require('../misc/utils').cloneArray
const DEFAULT_OPTIONS = require('../misc/constants').DEFAULT_OPTIONS

module.exports = class Csv {
  constructor(data, options) {
    if (!data || typeof data !== 'string') {
      throw new TypeError(`Invalid data source, data should be type string, got ${typeof data}`)
    }
    if (options && typeof options !== 'object') {
      throw new TypeError(`Invalid options, options should be type object, got ${typeof options}`)
    }
    options = Object.assign({}, DEFAULT_OPTIONS, options)

    try {
      let dataArray = data.split(options.newLine)
      if (!options.noHeader) {
        this.header = getHeader(cloneArray(dataArray), options)
        dataArray.shift()
      }
      if (options.shiftFirstRow) { dataArray.shift() }
      this.rows = getRows(cloneArray(dataArray), options)
      if (options.dropLastRow) { this.rows.pop() }
      this.csv = this.header ? [ this.header.join(options.separator) ] : []
      this.rules = options.rules
    } catch (err) {
      throw new Error(`Failed to parse data: ${err.toString()}`)
    }
  }
}

function getHeader(data, options) {
  let header = data[0].split(options.separator)
  return options.trimTrailing
    ? trim(cloneArray(header))
    : cloneArray(header)
}

function getRows(data, options) {
  let rows = data.filter(row => {
    // remove rows with no data
    return !row.split(options.separator).every(cell => !cell)
  })
  return rows.map(row => {
    let rowArray = cloneArray(row.split(options.separator))
    rowArray = options.trimTrailing ? trim(rowArray) : rowArray
    return rowArray.join(',')
  })
}

// remove trailing empty cells
function trim(data) {
  while (!data[data.length - 1]) {
    data.pop()
  }
  return data
}
