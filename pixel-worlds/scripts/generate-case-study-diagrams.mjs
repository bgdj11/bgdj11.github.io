// Reproducible architecture illustrations. No synthetic experimental results.
// Original first-pass diagrams remain in public/media/projects/diagrams/.
import { writeFile } from 'node:fs/promises'
const dir = new URL('../public/media/projects/diagrams/', import.meta.url)
const ink='#e7eee9', muted='#b6c8cd', blue='#92c5dc', green='#aacba4', gold='#dec68b'
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
const t=(x,y,s,size=22,color=ink)=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}">${esc(s)}</text>`
const box=(x,y,w,h,title,lines=[],color=blue)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#172831" stroke="${color}" stroke-width="2"/>${t(x+20,y+34,title,23,color)}${lines.map((s,i)=>t(x+20,y+67+i*28,s,20)).join('')}`
const group=(x,y,w,h,label)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#101e26" stroke="#3d5660" stroke-width="2"/>${t(x+20,y+32,label,20,muted)}`
const arrow=(path,color=blue,dashed=false)=>`<path d="${path}" fill="none" stroke="${color}" stroke-width="2.5" ${dashed?'stroke-dasharray="7 5"':''} marker-end="url(#arrow)"/>`
const exchange=path=>arrow(path).replace('marker-end=', 'marker-start="url(#arrow)" marker-end=')
async function save(name,title,subtitle,body,height=650){await writeFile(new URL(name+'.svg',dir),`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img"><title>${esc(title)}</title><desc>${esc(subtitle)}</desc><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${blue}"/></marker></defs><rect width="1000" height="${height}" fill="#0b151d"/><g font-family="Arial,Helvetica,sans-serif">${t(32,45,title,30)}${t(32,80,subtitle,20,muted)}${body}</g></svg>`)}
await save('actor-comparison','One actor runtime, two coordination designs','Async mailboxes and actor references over local or framed TCP messages',
 group(32,110,450,450,'COORDINATED ROUNDS')+group(518,110,450,450,'AUTONOMOUS GOSSIP')+
 box(58,170,190,90,'Provider',['Start round'])+box(274,170,182,90,'Workers',['Local training'])+arrow('M248 215H270')+
 box(58,352,190,90,'Evaluator',['Assess model'])+box(274,352,182,90,'Aggregator',['FedAvg'])+arrow('M365 260V348')+arrow('M274 397H252')+arrow('M153 352V265')+
 t(58,505,'One shared round boundary',21,green)+
 box(570,170,340,95,'Peer A',['Train • merge • publish'],green)+box(544,366,190,95,'Peer B',['Local view'],green)+box(756,366,190,95,'Peer C',['Local view'],green)+
 arrow('M640 265V360')+arrow('M850 366V270')+arrow('M734 415H750')+t(544,540,'LWWMap state + peer discovery',20,gold)+t(544,505,'Independent clocks, temporary divergence',20,green)+t(32,607,'SQLite checkpoints support recovery; CRDT convergence is not model convergence.',22,muted))
await save('coordinated-runtime','Coordinated training: explicit round state','Actors exchange model messages; each worker retains its local samples',
 box(32,145,240,120,'Provider',['Start round','Distribute model'])+box(380,145,240,120,'Workers',['Train local partitions','Return model + count'],green)+box(728,145,240,120,'Aggregator',['Sample-weighted','FedAvg'],gold)+arrow('M272 200H374')+arrow('M620 200H722')+
 box(380,365,240,120,'Local feature data',['Independent partitions','No sample exchange'],green)+arrow('M500 365V272',green)+box(728,365,240,120,'Evaluator',['Evaluate aggregate','Record round'],gold)+arrow('M848 265V358')+arrow('M848 485V520H150V272')+
 t(195,505,'Next round',21,blue)+t(32,576,'The orchestration path owns progress through a round.',23)+t(32,613,'Worker updates are weighted by sample count; evaluation is a separate actor.',20,muted))
await save('gossip-runtime','Asynchronous peer state exchange','No central round barrier; each peer aggregates the models it currently knows',
 box(330,135,340,120,'Peer A',['Local training + LWWMap','Model keyed by peer ID'],green)+box(32,360,350,120,'Peer B',['Local training + LWWMap','SQLite snapshot'],green)+box(618,360,350,120,'Peer C',['Local training + LWWMap','SQLite snapshot'],green)+
 exchange('M395 255L260 353')+exchange('M738 360L605 262')+exchange('M382 420H611')+
 t(402,407,'State merge',21,gold)+t(32,535,'Bootstrap: seed endpoints → join messages → peer information in gossip',21,blue)+t(32,576,'LWWMap: Lamport time + replica ID resolve writes; tombstones retain deletes.',20,muted)+t(32,613,'PNCounter merges replicated counters. An optional reporter observes; it does not lead.',20,muted))
await save('bunhub-system','BunHub: application and integration boundaries','Implemented components — architecture illustration, not a deployment benchmark',
 box(32,135,250,120,'Angular interface',['Posts, maps and chat','HTTP + WebSocket'],blue)+
 group(325,115,355,380,'SPRING BOOT APPLICATION')+box(345,175,315,120,'Application services',['JWT / domain operations','Posts, follows, chat'],green)+box(345,352,315,110,'Caches + scheduled work',['Trends / Ehcache','Image maintenance'],green)+arrow('M502 295V345')+
 box(745,135,223,120,'PostgreSQL',['Persistent domain','and chat state'],gold)+arrow('M282 200H338')+arrow('M660 220H738')+
 box(745,365,223,120,'Monitoring',['Micrometer','Prometheus'],blue)+arrow('M660 245H710V425H738')+
 box(32,365,250,120,'RabbitMQ',['Care locations in','Promotions out'],gold)+exchange('M282 410H305V275H338')+
 box(32,548,430,100,'Separate educational queue service',['In-memory FIFO → scheduled location poll'],gold)+arrow('M462 590H502V470',blue,true)+t(540,570,'WebSocket delivery is broadcast;',21,muted)+t(540,603,'recipient isolation is incomplete.',21,muted),690)
await save('bunhub-chat','Message submission and live delivery','Source flow — the broadcast boundary is an implementation limitation',
 box(32,145,260,120,'POST /api/messages',['Group ID + sender ID','Message content'])+box(370,145,260,120,'Membership check',['Submitted sender','belongs to group?'],green)+box(708,145,260,120,'Persist message',['Transactional save','Map to response DTO'],gold)+arrow('M292 205H364')+arrow('M630 205H702')+
 box(370,370,260,120,'WebSocket broadcast',['All open sessions','No recipient filtering'],gold)+arrow('M838 265V430H637')+box(32,370,260,120,'JWT handshake',['Token validated','Email in attributes'])+arrow('M292 430H364')+
 t(32,550,'Needed: bind the sender to the principal and scope delivery to group members.',21,gold)+t(32,590,'The current membership check does not by itself provide private message delivery.',20,muted))
await save('checkmate-pipeline','CheckMate: evidence retrieval and page analysis','Hackathon architecture — extension service worker remains in mock mode',
 group(32,115,936,180,'OFFLINE EVIDENCE PREPARATION')+box(52,170,250,95,'Reddit discussions',['Filter posts + comments'])+box(375,170,250,95,'Thread documents',['Embedding construction'])+box(698,170,250,95,'FAISS index',['Semantic evidence store'],green)+arrow('M302 215H369')+arrow('M625 215H692')+
 group(32,325,936,215,'QUERY-TIME ANALYSIS')+box(52,385,250,110,'Query + HTML',['Page text / metadata','Heuristic signals'])+box(375,385,250,110,'Retrieve context',['Relevant discussions','OpenAI-compatible LLM'],green)+box(698,385,250,110,'FastAPI response',['Structured assessment','Vue interface'],gold)+arrow('M302 440H369')+arrow('M625 440H692')+arrow('M823 265V310H500V378')+
 t(32,590,'The extension collects page content but currently returns generated mock responses.',21,gold)+t(32,626,'No labeled risk benchmark is available; the diagram is not a measured result.',20,muted),660)
await save('drools-engine','Facts → rule activation → explicit decisions','Spring services insert facts into KIE sessions using the packaged KJAR rules',
 box(32,145,265,155,'Input facts',['User profile / context','Report + block events','Candidate posts'])+box(367,145,265,155,'Working memory',['Match .drl conditions','Activate agenda rules','Fire rules'],green)+box(702,145,265,155,'Decision outputs',['Restrictions + expiry','Scored posts + reasons','Separate friends feed'],gold)+arrow('M297 220H360')+arrow('M632 220H695')+
 group(32,350,936,170,'RECOMMENDATION AGENDA ORDER')+box(52,410,205,75,'Validate',[],blue)+box(282,410,205,75,'Route',[],blue)+box(512,410,205,75,'Score',[],green)+box(742,410,205,75,'Output',[],gold)+arrow('M257 449H276')+arrow('M487 449H506')+arrow('M717 449H736')+
 t(32,580,'Temporal moderation uses its own user-moderation agenda group.',22,muted))
await save('drools-recommendations','Rule-scored recommendation routes','Routing depends on friend or authored-post activity — scores are not learned',
 box(290,125,420,85,'Friends OR authored posts?',[],blue)+arrow('M390 210V260H245V298')+arrow('M610 210V260H755V298')+t(95,265,'Yes → BASE',22,green)+t(775,265,'No → NEW',22,gold)+
 box(32,305,430,220,'Existing-user signals',['Recent post (within 24 h)','Liked / authored hashtags','Popular post / popular hashtag','Popular + liked-tag combination'],green)+box(538,305,430,220,'New-user signals',['Similar user: score ≥ 0.5','Liked-post overlap: ratio ≥ 0.7','Explicit rule contributions','Candidate score + reasons'],gold)+
 t(32,576,'Discovery guard: exclude self and friend authors.',22)+t(32,614,'Separate friends-feed rule: exclude blocked authors.',22,muted))
await save('moderation-timeline','Temporal policy: more than five reports in 24 hours','Illustrative event times — not a recorded user incident',
 group(32,125,936,245,'TRAILING WINDOW AT EVALUATION TIME')+`<path d="M80 270H920" stroke="${blue}" stroke-width="3"/>`+
 [0,1,2,3,4,5].map((i)=>`<circle cx="${140+i*140}" cy="270" r="8" fill="${gold}"/>${t(110+i*140,237,`${23-i*4} h ago`,19)}${t(122+i*140,312,`R${i+1}`,20)}`).join('')+
 t(80,351,'24 hours ago',19,muted)+t(852,351,'Now',19,muted)+arrow('M500 370V420')+
 box(125,430,750,115,'6 matching events > 5 → posting restricted for 24 h',['Output includes a reason, posting scope and expiry time.'],green)+t(100,600,'Five events do not trigger this rule. Other policies may activate independently.',21,muted))
await save('rasa-pipeline','Rasa NLU and sentiment-conditioned dialogue','Component order follows config.yml; the action consumes intent and emotion',
 group(32,115,575,470,'CONFIGURED NLU SEQUENCE')+box(52,165,535,90,'WhitespaceTokenizer → SpellChecker',['Dictionary substitution updates message text'])+arrow('M320 255V280')+
 box(52,287,535,90,'EmotionAnalyzer: fine-tuned BERT',['Binary sentiment → message.emotion'],green)+arrow('M320 377V402')+
 box(52,410,535,140,'CountVectors → DIET → ResponseSelector',['DIET provides the intent classification','FallbackClassifier follows in the pipeline'],blue)+
 box(682,240,285,125,'Custom action',['Read intent + emotion','Choose response key'],gold)+arrow('M587 332H675')+arrow('M587 480H640V330H675')+
 box(682,435,285,115,'Predefined reply',['utter_<intent>_','positive / negative'],gold)+arrow('M825 365V428')+
 t(32,633,'BERT classifies sentiment; it does not generate the reply.',23,muted),670)
console.log('Generated 9 source-grounded diagrams; original illustrations retained.')
// Covers use the same verified structure at a scale readable on overview cards.
await save('actor-cover','Federated Actor Learning','Custom actor runtime + two coordination designs',
 group(32,120,450,380,'COORDINATED')+group(518,120,450,380,'GOSSIP')+
 box(60,190,394,100,'Provider → Workers',['Round-based local training'])+arrow('M257 290V340')+box(60,350,394,100,'Weighted aggregation',['FedAvg + evaluation'],gold)+
 box(546,190,394,100,'Autonomous peers',['Independent local training'],green)+arrow('M743 290V340')+box(546,350,394,100,'Replicated state',['LWWMap + asynchronous exchange'],gold),540)
await save('bunhub-cover','BunHub system overview','Full-stack application with asynchronous integrations',
 box(32,155,260,130,'Angular',['HTTP interface','Real-time chat'])+box(370,155,260,130,'Spring Boot',['Domain services','JWT authentication'],green)+box(708,155,260,130,'PostgreSQL',['Application state','Messages + members'],gold)+arrow('M292 220H364')+arrow('M630 220H702')+
 box(370,365,260,120,'RabbitMQ',['Care locations','Promotions'],gold)+arrow('M500 285V358')+t(32,550,'Caching, transactions, background jobs and Micrometer instrumentation',24,muted),600)
