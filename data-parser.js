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
  // This means that there were some matches
  if (projectsWithRelatedTechs.length > 1) {
    return projectsWithRelatedTechs.reduce((previousProject, currentProject) => {
      // As there are matching related techs we aggregate all the techs
      let relatedTechs = []
      if (previousProject.techs !== undefined) {
        relatedTechs = [...previousProject.techs]
      }

      relatedTechs.push(...currentProject.techs)
      const relatedTechsWithoutDuplicates = removeDuplicates(relatedTechs)
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
  extractRelatedTechs
}
