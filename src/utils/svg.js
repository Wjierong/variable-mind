const svgNS = 'http://www.w3.org/2000/svg'

export const createLinkSvg = function(className) {
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('class', className)
  return svg
}

export const createMainPath = function(d, color = '#666') {
  const path = document.createElementNS(svgNS, 'path')
  path.setAttribute('d', d)
  path.setAttribute('stroke', color)
  path.setAttribute('fill', 'none')
  path.setAttribute('stroke-width', '2')
  return path
}

export const createCircle = function(svg2nd, cx,cy, color) {
  if(!svg2nd) {
    return;
  }
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('cx', cx)
  circle.setAttribute('cy', cy)
  circle.setAttribute('r', 5)
  circle.setAttribute('fill', color)
  svg2nd.appendChild(circle)
}