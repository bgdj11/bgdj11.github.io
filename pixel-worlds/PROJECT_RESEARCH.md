# Project content audit

Reviewed 18 October 2026. Public source snapshots were inspected locally; project code was not executed, model training was not rerun, and stored metrics are not presented as newly reproduced measurements. The downloadable thesis and notebook figures are original repository material. The latest consolidated brief supersedes the earlier deferral of the two labs: they now appear as reserved ongoing coursework collections, without invented work or links.

## Visual Scene Understanding

Repository: https://github.com/bgdj11/neurosymbolic-vqa
Snapshot: `c5ff2d867fe3f9ebc17fd11adbe4a3fafb69b31e`

Inspected the thesis PDF, English one-page summary, both presentation XML contents, `results/thesis_reported.json`, `dsl/executor.py`, `dsl/operators.py`, `examples/reasoning_demo.py`, `nl2dsl/infer.py`, `perception/attribute_extractor.py`, configuration and perception/scene-graph notebooks.

- The final thesis separates reference scene graphs (GT) from graphs reconstructed from images (E2E). CLEVR: 99.9% GT versus 79.0% E2E. CoGenT B: 99.7% versus 79.0%. CLEVR-Humans after RL: 57.1% versus 45.6%.
- CLEVR evaluations have different subset sizes: 1,000 GT questions and 10,000 E2E questions over 1,000 images. This is a diagnostic contrast, not a paired per-question ablation.
- Human-question adaptation improves GT by 15.7 percentage points and E2E by 12.9 points. It does not establish general-purpose real-world VQA performance.
- Results JSON explicitly says figures were transcribed from the thesis; original per-question Kaggle outputs are unavailable. The site labels these as thesis-reported results.
- Figures include scene, detections, instance masks, inverse depth, scene graph, architecture and training curves. CLEVR attribution is preserved in media sources.
- Documents: Serbian thesis PDF; English one-page PDF; English and Serbian PPTX presentations and their verified PowerPoint PDF exports. The initial English PPTX thumbnail was stale/Serbian; the current preview is rendered from the converted English PDF, not the embedded thumbnail or reconstructed title artwork. Earlier thumbnails remain as source references.

## Federated Actor Learning

Repository: https://github.com/bgdj11/federated-actor-learning
Snapshot: `6042860bc0c0167eb88237f288006ca5d722a2ce`

Inspected runtime/message/supervision code; Provider, Worker, Aggregator, Evaluator, GossipPeer and CRDT implementation; `fl/model.py`; SQLite persistence; feature extraction and split scripts; stored visualization notebook; integration test assertions.

- Coordinated rounds and autonomous peer gossip are both implemented. Aggregation weights each model by sample count. Reporter observes rather than orchestrates.
- EuroSAT features come from pretrained ResNet18. Regional transformations operate on feature vectors, not on photographs; visualizations must not imply rendered satellite weather effects.
- Stored notebook: A 11,500 samples; B 7,000; C 8,500; D 27,000. PCA/t-SNE use 500 samples per region. Real saved plots exist, so invented convergence curves are unnecessary.
- Region D uses all classes from the same feature source and is not a separately held-out geographic dataset. No production/generalization accuracy claim is made.
- Supervision restarts actors inside a surviving process. The custom transport uses pickle; optional TLS is not a complete production trust model.
- Tests show model exchange/merge assertions; their presence is not reported as tests rerun for this portfolio.

## Botanica Algorithmica

Repository: https://github.com/bgdj11/botanica-algorithmica
Snapshot: `f252b9a70ace6d2262f70842660d10924a8a803c`

Inspected `scripts/Botanica.py`, `scripts/App.py`, weighted grammar presets, leaf/fruit presets and saved plant images. Downloaded three original README GIFs.

- Weighted rewrite rules, stack-based branch drawing, random angle/appearance variations, growth controls and PNG export are implemented.
- This is a 2D procedural drawing tool; do not describe it as 3D or biologically validated simulation.
- README mentions loading saved creations, but no corresponding load interface was established from the inspected implementation. Describe exporting PNGs only.
- Gallery uses six real saved plants and three actual app recordings, not newly generated replacements.

## Classical Computer Vision Experiments

Repository: https://github.com/bgdj11/soft-computing-vision-projects
Snapshot: `ea455f1ba54bb01db668930946afbf377923805b`

Inspected all three notebooks, their code, embedded figures and textual evaluation output, plus true-count CSV files.

- Duck edge method: MAE 0.8 / MSE 2.2 on ten images. Threshold method: MAE 0.4 / MSE 0.6 on the same ten images.
- Buzzy Beetle tracking: MAE/MSE 0.2 on ten videos; eight exact counts. Figures show intermediate masks and counted crossings.
- Parameters, color and regions of interest are task-specific. These small examples are not a benchmark for arbitrary wildlife/video tracking.
- Exported saved notebook outputs directly; no training or video inference was rerun. Some source images are stylized illustrations: do not call them camera photographs.

## Space Shooter

Repository: https://github.com/bgdj11/space-shooter
Snapshot: `066265014d20f28104ee271a4e8f0d12f05cbc56`

Inspected Main, Player, EnemyManager, Collider, Animator and particle implementation, and both gameplay GIFs.

- C++/SFML game with direct update/draw loop, horizontal movement, bursts, shield, laser and rocket; enemy/boss/rock waves and particles.
- Recorded demos are shown as opt-in animation. No browser-play or downloadable-build link is invented.
- Artwork appears inside original project recordings; do not imply all sprite artwork was personally drawn by the portfolio owner.

## CheckMate

Repository: https://github.com/bgdj11/YandexAI-hackathon
Snapshot: `7e40f3bbba7e59d25e35c4944d009fcb92b3e50b`

Inspected FastAPI routes, embedding construction/search, LLM context/JSON analysis, HTML analysis, preprocessing, Vue Home/Stats views, browser extension manifest and popup.

- README is an outdated pipeline skeleton. Actual code includes semantic retrieval, contextual model analysis, website content checks, Vue interface and a Manifest V3 extension.
- Code uses an OpenAI-compatible client; an old `analyze_with_grok` function name is not evidence of the currently configured model provider.
- User previously supplied 36-hour AI Nation hackathon context and leadership of backend/AI work. Do not claim sole authorship of the team product.
- Risk estimates assist investigation; no measured scam-detection accuracy, dataset ingestion volume, award or deployed production service was established.
- Use the actual project logo and an explicitly explanatory workflow, without fabricated risk-score screenshots.

## Rule-Based Social Moderation

Repository: https://github.com/bgdj11/social-moderation-platform
Snapshot: `2c5628fb28d2dc6f367458535149121ca5eda9b2`

Inspected moderation/recommendation/friends-feed DRL rules, facts and Spring integration.

- Rules emit reason, scope and expiry. Example: more than five reports in 24h gives a 24h posting restriction; more than twelve in 7d gives a 72h login restriction.
- README says combined threshold is at least four reports; executable DRL actually checks **more than four** together with more than two blocks. Code is authoritative.
- Recommendation candidates accumulate explicit +1 reasons; self/friend candidates are removed from discovery feed, and friends feed separately excludes blocked authors.
- No moderation quality or fairness benchmark is supplied. Illustrations represent rule behavior, not measured traffic.

## Sentiment-Aware Chatbot

Repository: https://github.com/bgdj11/rasa-sentiment-chatbot
Snapshot: `8bc1bb417c42cdae446647878da6073fae92732c`

Inspected BERT training notebook/outputs, Rasa config/domain, custom EmotionAnalyzer and action response selection. Original terminal screenshot retained.

- Notebook samples 20,000 Sentiment140 texts, splits 80/20, fine-tunes for three epochs. Stored held-out accuracy 0.75475; weighted F1 0.7543156.
- Binary positive/negative sentiment, not an emotion taxonomy. Intent + sentiment select predefined replies, not unconstrained LLM generation.
- Neutral/default action falls into the negative branch. Training and inference preprocessing differ; avoid claims of robust emotional understanding.
- Sentiment classifier evaluation is separate from end-to-end conversation quality. Screenshot demonstrates both adaptation and imperfect tone selection.

## BunHub

Repository: https://github.com/bgdj11/bun-hub
Snapshot: `f73fccdc60c122f96beb7e9e161ee927677244e0`

Inspected Angular templates/routes, Spring services/controllers, chat, likes/follows, scheduled image maintenance, username Bloom service, RabbitMQ integration and custom queue.

- Rabbit-themed social platform: posts, social interactions, map-based discovery and chat. Engineering aspects include transactions, cache invalidation, background work and asynchronous integrations.
- Custom queue is an in-memory ConcurrentLinkedDeque implementation, not durable broker storage. Present it as an educational counterpart to RabbitMQ.
- README's enterprise/scalability wording is not backed by public load measurements. No uptime, users or throughput claims.
- No repository product screenshots were found. Use a labeled functional architecture diagram, not invented populated UI screenshots.

## Rendering and provenance

Project copy focuses on verified methods, implementation, outputs and boundaries. Source links are pinned to the reviewed commits. Authentic media remain local; animations autoplay only while visible and respect reduced motion. Both original slide decks were exported with installed PowerPoint to static 18-page PDFs, then rendered and inspected using PDF.js. The English deck is the default. Original PDF/PPTX artifacts remain available.

## Consolidated review corrections — 18 October 2026

- **CheckMate:** `scam-checker-extension/background/service-worker.js` actively calls `generateMockAnalyzeHtmlResponse`; the real API call is commented out. The case study explicitly distinguishes backend implementation from the extension mock. No live deployed detector is claimed.
- **BunHub:** `ChatController.sendMessage` checks submitted sender/group membership and saves before calling `WebSocketHandler.broadcastMessage`, which broadcasts to all open sessions. JWT handshake authentication does not establish recipient isolation or bind the submitted sender to the principal. The case study and message-flow illustration expose those limits. `FollowServiceTest` launches concurrent calls but lacks a final invariant assertion; it is not evidence of correctness or scale. `ActiveUserTracker` registers `active_users`; trends cache eviction, normalized username Bloom filtering, SERIALIZABLE follows and scheduled work are verified in implementation.
- **Rasa:** actual config order is tokenizer, spelling dictionary, sentiment component, CountVectors, DIET, ResponseSelector, fallback. The spelling component updates text after tokenization without explicitly rebuilding tokens. BERT attaches binary `emotion`; the action uses intent + emotion to choose a predefined utterance. Weighted metrics retain the saved notebook values, now in a table.
- **Drools:** `FeedService` sets focus in reverse execution order: output, score, router, validate. Runtime flow is validate → route → score → output. BASE/NEW routes, +1 scoring conditions and friend/self guards are verified against the DRL; blocked-author exclusion belongs to the separate friends-feed path. Policy table uses strict inequalities from the active moderation rules.
- **Botanica:** first preset starts with `F`, with equal-probability `F[+F]F[-F]G` and `F[+F]G` rewrites. Saved plant seeds/settings were not archived; the gallery is not presented as a controlled parameter experiment.
- **Federated:** seed endpoints and propagated peer information bootstrap gossip. LWWMap ordering is `(logical_time, replica_id)` with tombstones; PNCounter and SQLite snapshots are present. Test files were inspected, not executed as a new research validation.
- **VQA:** thesis numbers and source research files are unchanged. The source reasoning demo supplies the cyan sphere/cube question, DSL trace and blue answer. Reference-graph and full-system evaluation sampling remain explicitly distinguished.
- **CV:** Canny/Otsu intermediate images and MOG2/HSV tracking outputs remain authentic. MAE and MSE are separate table columns, not bars sharing a misleading scale. Original raster labels are retained with English caption guidance where applicable.
- **Space Shooter:** two original GIFs are preserved byte-for-byte; smaller animated WebP derivatives display the same captured footage. No browser game build or measured frame rate is claimed.

See `PROJECT_REVIEW.md` for implementation files, responsive/browser QA and remaining evidence limits. New diagrams are reproducible with `scripts/generate-case-study-diagrams.mjs`; original explanatory SVGs remain alongside them.
