import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const folder = fileURLToPath(new URL('../public/media/projects/visual-reasoning/', import.meta.url))
const embed = async name => 'data:image/webp;base64,' + (await fs.readFile(path.join(folder, name + '.webp'))).toString('base64')
const label = (x, y, w, h, value, size = 19, bg = '#fff', fg = '#333') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/><text x="${x+w/2}" y="${y+h/2}" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size}" fill="${fg}">${value}</text>`

// English annotation layers over the saved figures. No measurements, points,
// confidence values, masks or model predictions are regenerated or altered.
let detection = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="729" viewBox="0 0 1080 729"><title>Object detections with English confidence labels</title><image href="${await embed('detection')}" width="1080" height="729"/>`
for (const [x,y,confidence] of [[128,181,87],[220,275,46],[436,302,41],[558,186,96],[649,150,36],[812,238,69]]) {
  detection += label(x,y,157,25,'Confidence: '+confidence+'%',17,'#252525','#fff')
}
detection += '</svg>'
await fs.writeFile(path.join(folder,'detection-en.svg'),detection)

let graph = `<svg xmlns="http://www.w3.org/2000/svg" width="1075" height="898" viewBox="0 0 1075 898"><title>Scene graph with translated object and spatial labels</title><image href="${await embed('scene_graph')}" width="1075" height="898"/>`
for (const row of [[283,166,195,34,'brown cylinder'],[131,412,247,34,'purple cylinder'],[453,628,160,35,'brown sphere'],[719,607,154,34,'blue sphere'],[601,698,140,33,'yellow cube'],[855,744,166,33,'green sphere']]) graph += label(...row,20)
graph += '<rect x="0" y="0" width="123" height="823" fill="white"/>'
graph += label(39,103,82,32,'front',18) + label(35,394,86,32,'middle',18) + label(39,680,82,32,'behind',18)
graph += '<text transform="translate(26 450) rotate(-90)" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#333">← behind     in front →</text>'
graph += label(202,831,103,27,'left',18) + label(540,831,112,27,'center',18) + label(888,831,100,27,'right',18) + label(469,864,264,33,'← left     right →',18)
graph += '</svg>'
await fs.writeFile(path.join(folder,'scene-graph-en.svg'),graph)

const svgData = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64')
const architecture = `<svg xmlns="http://www.w3.org/2000/svg" width="806" height="1200" viewBox="0 0 806 1200"><title>Neuro-symbolic visual reasoning architecture, English annotations</title><image href="${await embed('thesis_architecture_en')}" width="806" height="1200"/><rect x="58" y="344" width="156" height="105" fill="white"/><image href="${svgData(detection)}" x="58" y="344" width="156" height="105"/><rect x="602" y="891" width="138" height="115" fill="white"/><image href="${svgData(graph)}" x="602" y="891" width="138" height="115"/></svg>`
await fs.writeFile(path.join(folder,'architecture-en.svg'),architecture)
console.log('English figure annotations exported.')

