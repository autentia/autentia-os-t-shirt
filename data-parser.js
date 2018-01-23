const utils = require('./utils')

function findProjectsWithCommonTechs(techToFind, projects) {
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
function extractRelatedTech(tech, projectsWithRelatedTechs) {
  // This means that there were some matches
  if (projectsWithRelatedTechs.length > 1) {
    return projectsWithRelatedTechs.reduce((previousProject, currentProject) => {
      // As there are matching related techs we aggregate all the techs
      let relatedTechs = []
      if (previousProject.techs !== undefined) {
        relatedTechs = [...previousProject.techs]
      }

      relatedTechs.push(...currentProject.techs)
      const relatedTechsWithoutDuplicates = utils.removeDuplicates(relatedTechs)
      const relatedTechsWithoutDuplicatesAndSelf = relatedTechsWithoutDuplicates.filter(e => tech !== e)
      const aggregatedTech = {
        name: tech,
        relatedTechs: relatedTechsWithoutDuplicatesAndSelf
      }
      return [aggregatedTech]
    })
  } else {
    // If there are no matches just return the techs of that project
    return [{
      name: tech,
      relatedTechs: projectsWithRelatedTechs[0].techs.filter(e => tech !== e)
    }]
  }
}

function extractRelatedTechs(projects) {
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
  const techsWithoutDuplicates = utils.removeDuplicatesBy(x => x.name, techs)
  return techsWithoutDuplicates
}

module.exports = {
  extractRelatedTechs
}
