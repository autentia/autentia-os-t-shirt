const fs = require('fs')
const parser = require('./data-parser')
const formatter = require('./data-formatter')

const csvPath = './data.csv'
const jsonPath = './data.json'

console.log('Starting...')
formatter.formatData(csvPath)
  .then(data => {
    const techs = parser.extractRelatedTechs(data)
    fs.writeFileSync(jsonPath, JSON.stringify(techs, null, 2))
    console.log('Done')
  })