const diameter = 1200
const radius = diameter / 2
const innerRadius = radius - 120
const beta = 0.85
const palette = ['#0869ba', '#ba4508', '#eb816e', '#6f7a97', '#e8e2cb']

const cluster = d3.cluster().size([360, innerRadius])

const line = d3.radialLine()
  .curve(d3.curveBundle.beta(beta))
  .radius(function(d) { return d.y })
  .angle(function(d) { return d.x / 180 * Math.PI })

const svg = d3.select('body').append('svg')
  .attr('width', diameter)
  .attr('height', diameter)
  .append('g')
  .attr('transform', 'translate(' + radius + ',' + radius + ')')

let link = svg.append('g').selectAll('.link'),
  node = svg.append('g').selectAll('.node')

d3.json('data.json', function(error, classes) {
  if (error) throw error

  const root = relatedTechsHierarchy(classes)
    .sum(function(d) { return d.size })

  cluster(root)
  
  link = link
    .data(getRelatedTechs(root.leaves()))
    .enter().append('path')
    .each(function(d) { d.source = d[0], d.target = d[d.length - 1] })
    .attr('class', 'link')
    .attr('d', line)

  node = node
    .data(root.leaves())
    .enter().append('text')
      .attr('class', 'node')
      .attr('dy', '0.31em')
      .attr('transform', function(d) { return `rotate(${d.x - 90}) translate(${d.y + 8},0) ${d.x < 180 ? '' : 'rotate(180)'}`})
      .attr('text-anchor', function(d) { return d.x < 180 ? 'start' : 'end' })
      .text(function(d) { return d.data.key })

  d3.selectAll('.link')
    .each(function(d, i) {
      d3.select(this)
      .attr('style', `stroke: ${palette[Math.trunc(Math.random() * palette.length)]};`)
    })
})

function relatedTechsHierarchy(classes) {
  const map = {}

  function find(name, data) {
    let node = map[name]
    let i
    if (!node) {
      node = map[name] = data || {name: name, children: []}
      if (name.length) {
        node.parent = find(name.substring(0, i = name.lastIndexOf('.')))
        node.parent.children.push(node)
        node.key = name.substring(i + 1)
      }
    }
    return node
  }

  classes.forEach(function(d) {
    find(d.name, d)
  })

  return d3.hierarchy(map[''])
}

function getRelatedTechs(nodes) {
  const map = {},
    relatedTechs = []

  nodes.forEach(function(d) {
    map[d.data.name] = d
  })

  nodes.forEach(function(d) {
    if (d.data.relatedTechs) d.data.relatedTechs.forEach(function(i) {
      relatedTechs.push(map[d.data.name].path(map[i]))
    })
  })

  return relatedTechs
}
