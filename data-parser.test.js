const dataParser = require('./data-parser')

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

  test('finds complex related techs', () => {
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
          'baz',
          'bar',
          'quux'
        ]
      }
    ]
  
    const techs = dataParser.extractRelatedTechs(projects)
  
    expect(techs).toEqual([
      {
        name: 'bar',
        relatedTechs: ['baz', 'quux']
      },
      {
        name: 'baz',
        relatedTechs: ['bar', 'quux']
      },
      {
        name: 'quux',
        relatedTechs: ['baz', 'bar']
      }
    ])
  })

})