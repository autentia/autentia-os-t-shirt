const fs = require('fs')
const csv = require('csvtojson')

const filePath = './data.csv'

function formatData() {
  const data = []
  return new Promise(resolve => {
    csv({ noheader: false, headers: ['project'] })
      .fromFile(filePath)
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

const findProjectsWithCommonTechs = (techToFind, projects) => {
  const foundProjects = []

  projects.forEach(project => {
    project.techs.forEach(tech => {
      if (techToFind === tech) {
        foundProjects.push(project)
      }
    })
  })

  return foundProjects
}

// Given a tech and a set of projects which have common techs
const extractRelatedTech = (tech, projectsWithRelatedTechs) => {
  return projectsWithRelatedTechs.reduce((previousProject, currentProject) => {
    const relatedTechs = [...previousProject.techs, ...currentProject.techs]
    const relatedTechsWithoutDuplicates = Array.from(new Set(relatedTechs))
    const relatedTechsWithoutDuplicatesAndSelf = relatedTechsWithoutDuplicates.filter(e => tech !== e)
    const aggregatedTech = {
      name: tech,
      relatedTechs: relatedTechsWithoutDuplicatesAndSelf
    }
    return [aggregatedTech]
  })
}

const extractRelatedTechs = (projects) => {
  const foundTechs = []
  projects.forEach(project => {
    project.techs.forEach(tech => {
      
      const projectsWithCommonTechs = findProjectsWithCommonTechs(tech, projects)
      const relatedTechs = extractRelatedTech(tech, projects)
      
      console.warn('tech: ' + tech)
      console.warn('projects which have common techs: ' + JSON.stringify(projectsWithCommonTechs))
      console.warn('related techs: ' + JSON.stringify(relatedTechs))


      foundTechs.push(...relatedTechs)
    })
  })

  return removeDuplicatesBy(x => x.name, foundTechs)
}

function removeDuplicatesBy(keyFn, array) {
  let mySet = new Set();
  return array.filter(function(x) {
    let key = keyFn(x), isNew = !mySet.has(key);
    if (isNew) mySet.add(key);
    return isNew;
  });
}

module.exports = {
  findProjectsWithCommonTechs,
  extractRelatedTech,
  extractRelatedTechs
}