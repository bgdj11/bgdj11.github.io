// Explanatory diagrams derived from the implementation, not measured results.
import {mkdir, writeFile} from 'node:fs/promises'
const dir=new URL('../public/media/projects/diagrams/',import.meta.url)
await mkdir(dir,{recursive:true})
const colors=['#9bc3df','#a4cba6','#cfb77c','#baaad8']
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;')
const text=(x,y,s,size=22,color='#e7e5dd')=>`<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}">${escape(s)}</text>`
const node=(x,y,w,title,sub,c=colors[0])=>`<path d="M${x+8} ${y}h${w-16}v8h8v84h-8v8H${x+8}v-8h-8v-84h8z" fill="#15202b" stroke="${c}" stroke-width="2"/>${text(x+20,y+39,title,23,c)}${text(x+20,y+70,sub,17,'#bac3ce')}`
const line=(x,y,x2,y2,c=colors[0])=>`<path d="M${x} ${y}L${x2} ${y2}" stroke="${c}" stroke-width="3" fill="none"/><rect x="${x2-4}" y="${y2-4}" width="8" height="8" fill="${c}"/>`
async function save(name,title,subtitle,body){await writeFile(new URL(name+'.svg',dir),`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="560" viewBox="0 0 1000 560"><rect width="1000" height="560" fill="#0d141c"/>${text(40,55,title,30)}${text(40,88,subtitle,19,'#aab8c6')}${body}</svg>`)}
await save('federated-coordinated','Learning together, keeping data local','Coordinated rounds',
 line(280,240,380,240)+line(160,355,160,290)+line(630,240,700,240)+line(820,290,820,355)+
 node(40,190,240,'Regional workers','Local training',colors[1])+node(40,355,240,'Regional data','Feature partitions A–C',colors[1])+
 node(380,190,250,'Provider','Coordinates rounds')+node(700,190,260,'Aggregator','Weighted model average',colors[2])+node(700,355,260,'Evaluator','Control region D',colors[3])+
 text(350,485,'Workers exchange model updates; raw samples stay local.',20))
await save('federated-gossip','Learning without a central coordinator','Peer-to-peer model exchange',
 line(290,220,700,220)+line(230,270,480,400)+line(770,270,520,400)+
 node(90,170,250,'Peer A','Train + merge + gossip',colors[0])+node(660,170,250,'Peer B','Train + merge + gossip',colors[1])+node(375,370,250,'Peer C','Train + merge + gossip',colors[3])+
 text(350,320,'CRDT state exchange',23,colors[2])+text(290,515,'Each peer maintains its own aggregate model.',20))
await save('moderation','Rules that explain their decisions','An example from the implemented moderation policy',
 node(45,190,265,'Reports accumulate','Within a 24-hour window',colors[0])+line(310,240,375,240)+node(375,190,250,'More than 5 reports','Threshold is crossed',colors[2])+line(625,240,690,240)+node(690,190,265,'Posting restricted','For the next 24 hours',colors[3])+
 text(70,405,'Every flag carries a reason, a scope and an expiry time.',24)+text(70,448,'Other rules handle blocks, repeat reports and login restrictions.',19,'#bac3ce'))
await save('checkmate','From a suspicious page to supporting evidence','CheckMate — source-based risk analysis',
 node(50,175,260,'Website or query','Browser extension / web app')+line(310,225,375,225)+node(375,175,250,'Relevant discussions','Semantic retrieval',colors[1])+line(625,225,690,225)+node(690,175,260,'Contextual analysis','LLM-assisted assessment',colors[2])+
 node(375,365,250,'Page signals','Content and HTML checks',colors[3])+line(625,415,820,275)+text(55,505,'The output supports investigation; it is not a guarantee of trust.',20))
await save('bunhub','BunHub','A social experience supported by asynchronous services',
 node(55,180,265,'Community interface','Posts, maps and chat',colors[1])+line(320,230,380,230)+node(380,180,240,'Spring services','Accounts and interactions')+line(620,230,685,230)+node(685,180,260,'PostgreSQL','Persistent application data',colors[2])+
 line(500,280,500,370)+node(355,370,290,'Messages + background work','RabbitMQ / custom queue',colors[3])+text(55,505,'Care locations and promotions can arrive independently of the feed.',19))
// The English PPTX carries a stale Serbian Office thumbnail. Derive a title preview
// from the actual English slide text instead of displaying that cached thumbnail.
await writeFile(new URL('presentation-en-preview.svg',dir),`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540"><rect width="960" height="540" fill="white"/><g fill="#222" font-family="Arial,sans-serif" text-anchor="middle"><text x="480" y="190" font-size="36" font-weight="bold">Visual Scene Understanding</text><text x="480" y="240" font-size="32" font-weight="bold">through Neuro-Symbolic Reasoning</text><text x="480" y="302" font-size="24">Bachelor’s Thesis</text><text x="480" y="342" font-size="22">Bogdan Đukić, RA98/2021</text><text x="480" y="380" font-size="20">Supervisor: Dr. Milan Segedinac</text><text x="480" y="424" font-size="20">University of Novi Sad, Faculty of Technical Sciences</text></g></svg>`)
console.log('Generated explanatory diagrams and English document title preview.')
