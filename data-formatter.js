const fs = require('fs')
const csv = require('csvtojson')

function formatData(input) {
  const data = []
  return new Promise(resolve => {
    csv({ noheader: false, headers: ['project'] })
      .fromFile(input)
      .on('json', row => {
        data.push(formatRow(row))
      })
      .on('done', err => {
        resolve(data)
      })
  })
}

function formatRow(row) {
  const rowElements = Object.values(row)
  const nonEmptyRow = rowElements.filter(e => e !== '')
  const formattedRow = {
    name: nonEmptyRow[0],
    techs: []
  }

  formattedRow.techs = nonEmptyRow.slice(1, nonEmptyRow.length)
  return formattedRow
}

module.exports = {
  formatData
}