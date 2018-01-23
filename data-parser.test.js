const dataParser = require('./data-parser')

describe('findProjectsWithCommonTechs', () => {
  test('finds projects which have related tech', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      },
      { 
        name: 'qux',
        techs: [
          'bar',
          'quux',
        ]
      }
    ]
  
    const techs = dataParser.findProjectsWithCommonTechs('bar', projects)
  
    expect(techs).toEqual(projects)
  })
  
  test('handle no related tech found projects', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      },
      { 
        name: 'qux',
        techs: [
          'quux',
          'quuux',
        ]
      }
    ]
  
    const techs = dataParser.findProjectsWithCommonTechs('x', projects)
  
    expect(techs).toEqual([])
  })
})

describe('extractRelatedTech', () => {
  test('parses projects with common tech into an another shape', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      },
      { 
        name: 'qux',
        techs: [
          'bar',
          'quux',
        ]
      }
    ]
  
    const techs = dataParser.extractRelatedTech('bar', projects)
  
    expect(techs).toEqual([
      {
        name: 'bar',
        relatedTechs: [
          'baz',
          'quux'
        ]
      }
    ])
  })

  test('parses projects into another shape even if they don\'t have related tech', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      }
    ]
  
    const techs = dataParser.extractRelatedTech('bar', projects)
  
    expect(techs).toEqual([
      {
        name: 'bar',
        relatedTechs: ['baz']
      }
    ])
  })
})

describe('extractRelatedTechs', () => {
  test('extract related techs', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      },
      { 
        name: 'qux',
        techs: [
          'bar',
          'quux',
        ]
      }
    ]
  
    const relatedTechs = dataParser.extractRelatedTechs(projects)
    expect(relatedTechs).toEqual([
      {
        name: 'bar',
        relatedTechs: [
          'baz',
          'quux'
        ]
      },
      {
        name: 'baz',
        relatedTechs: ['bar']
      },
      {
        name: 'quux',
        relatedTechs: ['bar']
      }
    ])
  })

  test('has as related technology as itself when there are no related techs', () => {
    const projects = [
      { 
        name: 'foo',
        techs: [
          'bar',
          'baz',
        ]
      }
    ]
  
    const techs = dataParser.extractRelatedTechs(projects)
  
    expect(techs).toEqual([
      {
        name: 'bar',
        relatedTechs: ['baz']
      },
      {
        name: 'baz',
        relatedTechs: ['bar']
      }
    ])
  })

})