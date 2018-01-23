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

const removeDuplicates = array => Array.from(new Set(array))

// Given a tech and a set of projects which have common techs
const extractRelatedTech = (tech, projectsWithRelatedTechs) => {
  if (projectsWithRelatedTechs.length > 1) {
    return projectsWithRelatedTechs.reduce((previousProject, currentProject) => {
      const relatedTechs = [...previousProject.techs, ...currentProject.techs]
      const relatedTechsWithoutDuplicates = removeDuplicates(relatedTechs)
      const relatedTechsWithoutDuplicatesAndSelf = relatedTechsWithoutDuplicates.filter(e => tech !== e)
      const aggregatedTech = {
        name: tech,
        relatedTechs: relatedTechsWithoutDuplicatesAndSelf
      }
      return [aggregatedTech]
    })
  } else {
    return [{
      name: tech,
      relatedTechs: projectsWithRelatedTechs[0].techs.filter(e => tech !== e)
    }]
  }
}

const extractRelatedTechs = projects => {
  const techs = []
  // Loop through projects
  for (let project of projects) {
    // Loop through each tech of each project
    for (let tech of project.techs) {
      // Once we have a tech we have to find every other project which uses that tech. Also we have as default value the techs used in that project
      const onselfTechs = project.techs.filter(e => e !== tech)
      const projectsWithCommonTechs = findProjectsWithCommonTechs(tech, projects)
      const extractedRelatedTechs = extractRelatedTech(tech, projectsWithCommonTechs)

      techs.push(...extractedRelatedTechs)
    }
  }
  const techsWithoutDuplicates = removeDuplicatesBy(x => x.name, techs)
  return techsWithoutDuplicates
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