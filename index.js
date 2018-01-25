const diameter = 1200
const radius = diameter / 2
const innerRadius = radius - 120
const beta = 0.3
const palette = {
  ci: '#0869ba',
  ux: '#9d00b8',
  back: '#840096',
  front: '#0778a7',
  agile: '#cefeff',
  mobile: '#0aeadb',
  testing: '#ff00aa',
  infraestructure: '#ff0db9',
}

const cluster = d3.cluster().size([360, innerRadius])

const line = d3.radialLine()
  .curve(d3.curveBundle.beta(beta))
  .radius(d => d.y)
  .angle(d => d.x / 180 * Math.PI)

const svg = d3.select('body').append('svg')
  .attr('width', diameter)
  .attr('height', diameter)
  .append('g')
  .attr('transform', 'translate(' + radius + ',' + radius + ')')
  
  d3.json('data.json', (error, classes) => {
    const root = relatedTechsHierarchy(classes)
    .sum(d => d.size)
    
    cluster(root)

    let link = svg.append('g').selectAll('.link')
    link
    .data(getRelatedTechs(root.leaves()))
    .enter().append('path')
    .each(d => { d.source = d[0], d.target = d[d.length - 1] })
    .attr('class', 'link')
    .attr('d', line)
    
    let node = svg.append('g').selectAll('.node')
    node
    .data(root.leaves())
      .enter().append('text')
      .attr('class', 'node')
      .attr('dy', '0.31em')
      .attr('transform', d => `rotate(${d.x - 90}) translate(${d.y + 8},0) ${d.x < 180 ? '' : 'rotate(180)'}`)
      .attr('text-anchor', d => d.x < 180 ? 'start' : 'end')
      .text(d => d.data.key)
      
      d3.selectAll('.link')
      .each(function(d, i) {
        d3.select(this)
        .attr('style', d => `stroke: ${getColor(d[0].data.type)};`)
        
    })
})

function getColor(type) {
  return palette[type.toLowerCase()]
}

function relatedTechsHierarchy(classes) {
  const map = {}

  function find(name, data) {
    let node = map[name]
    let i
    if (!node) {
      node = map[name] = data || { name: name, children: [] }
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf('.')))
        node.parent.children.push(node)
        // Add the tech's name
        node.key = name.substring(i + 1)
      }
    }
    return node
  }

  classes.forEach(d => {
    find(d.name, d)
  })

  return d3.hierarchy(map[''])
}

function getRelatedTechs(nodes) {
  const map = {},
    relatedTechs = []

  nodes.forEach(d => {
    map[d.data.name] = d
  })

  nodes.forEach(d => {
    if (d.data.relatedTechs) {
      d.data.relatedTechs.forEach(i => {
        relatedTechs.push(map[d.data.name].path(map[i]))
      })
    }
  })

  return relatedTechs
}
