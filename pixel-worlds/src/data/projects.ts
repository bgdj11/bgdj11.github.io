import { publicAsset } from './assets'
import { animationLab } from './animation-lab'
import type { Project } from './portfolio'

// Content verified against pinned repository snapshots; see PROJECT_RESEARCH.md.
const rawProjects: Project[] = [
  {
    "id": "visual-reasoning",
    "title": "Visual Scene Understanding",
    "category": "Vision",
    "featured": true,
    "summary": "A modular visual question answering system that turns images into scene graphs and questions into executable symbolic programs.",
    "contribution": "Bachelor thesis",
    "technologies": [
      "Python",
      "PyTorch",
      "T5",
      "YOLO",
      "CLIP",
      "Symbolic reasoning"
    ],
    "media": {
      "id": "visual-reasoning-scene",
      "src": "/media/projects/visual-reasoning/scene.webp",
      "poster": "/media/projects/visual-reasoning/scene-thumb.webp",
      "alt": "CLEVR scene with colored objects of different shapes and materials",
      "placeholder": "CLEVR scene with colored objects of different shapes and materials",
      "fit": "contain",
      "shape": "landscape"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/neurosymbolic-vqa"
      }
    ],
    "caseStudy": [
      {
        "heading": "Neuro-Symbolic Architecture",
        "paragraphs": [
          "The thesis investigates visual question answering through explicit intermediate representations. A perception pipeline builds a relational scene graph; a T5 parser maps the question to a typed domain-specific language (DSL). A validator checks the program before a deterministic executor evaluates it against the graph.",
          "Separating these stages supports error attribution: a wrong answer can originate in object perception, graph relations, question parsing or an unsupported operation. The architecture below is the original thesis figure in English."
        ],
        "media": [
          {
            "id": "visual-reasoning-thesis_architecture_en",
            "src": "/media/projects/visual-reasoning/architecture-en.svg",
            "poster": "/media/projects/visual-reasoning/architecture-en.svg",
            "alt": "Architecture linking image perception, a scene graph, a question-to-program model and a symbolic executor",
            "caption": "System architecture from the thesis, with English labels.",
            "placeholder": "Architecture linking image perception, a scene graph, a question-to-program model and a symbolic executor",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "navLabel": "Architecture"
      },
      {
        "heading": "Detection, Attributes & Scene Graphs",
        "paragraphs": [
          "YOLOv8m supplies object candidates and FastSAM-s supplies instance masks. MiDaS estimates relative depth; CLIP-assisted attribute classification contributes color, shape and material, alongside size estimation. These properties and spatial relations form the scene graph used by the executor.",
          "The original figures below expose the intermediate outputs. Depth is a relative cue, not a metric reconstruction; mistakes in object counts or spatial ordering propagate into downstream reasoning."
        ],
        "media": [
          {
            "id": "visual-reasoning-scene",
            "src": "/media/projects/visual-reasoning/scene.webp",
            "poster": "/media/projects/visual-reasoning/scene-thumb.webp",
            "alt": "Original CLEVR example scene",
            "caption": "The original synthetic scene used in the thesis pipeline figure.",
            "placeholder": "Original CLEVR example scene",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "visual-reasoning-detection",
            "src": "/media/projects/visual-reasoning/detection-en.svg",
            "poster": "/media/projects/visual-reasoning/detection-en.svg",
            "alt": "Detected objects with bounding boxes and labels",
            "caption": "Object detections with the original confidence values and English labels.",
            "placeholder": "Detected objects with bounding boxes and labels",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "visual-reasoning-masks",
            "src": "/media/projects/visual-reasoning/masks.webp",
            "poster": "/media/projects/visual-reasoning/masks-thumb.webp",
            "alt": "Instance masks separating the objects",
            "caption": "Instance masks isolate object regions before attribute estimation.",
            "placeholder": "Instance masks separating the objects",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "visual-reasoning-depth",
            "src": "/media/projects/visual-reasoning/depth.webp",
            "poster": "/media/projects/visual-reasoning/depth-thumb.webp",
            "alt": "Inverse depth estimate of the same scene",
            "caption": "Depth provides a cue for front/behind relationships; it is also a source of uncertainty.",
            "placeholder": "Inverse depth estimate of the same scene",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "visual-reasoning-scene_graph",
            "src": "/media/projects/visual-reasoning/scene-graph-en.svg",
            "poster": "/media/projects/visual-reasoning/scene-graph-en.svg",
            "alt": "Graph representation of objects and spatial relations",
            "caption": "The original scene graph with object names and spatial labels translated into English.",
            "placeholder": "Graph representation of objects and spatial relations",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "source": {
          "label": "Perception figure notebook",
          "url": "https://github.com/bgdj11/neurosymbolic-vqa/blob/c5ff2d867fe3f9ebc17fd11adbe4a3fafb69b31e/report/figure_4_1_materials.ipynb"
        },
        "navLabel": "Perception"
      },
      {
        "heading": "Language to Executable Programs",
        "paragraphs": [
          "The parser produces a small sequence of typed operations rather than an unconstrained textual answer. Validation checks that the operators and argument types are usable; the executor then filters objects, traverses relations and queries attributes.",
          "The repository’s reasoning demo asks “What color is the cube behind the cyan sphere?” Its symbolic trace selects the cyan sphere, finds objects behind it, restricts the set to cubes, and queries color. The example answers blue. This is a source example, not an additional evaluated sample from the thesis."
        ],
        "navLabel": "DSL & execution",
        "code": "scene\nfilter_color cyan\nfilter_shape sphere\nunique\nrelate behind\nfilter_shape cube\nunique\nquery_color\n\nExecuted answer: blue",
        "source": {
          "label": "Question and symbolic reasoning example",
          "url": "https://github.com/bgdj11/neurosymbolic-vqa/blob/c5ff2d867fe3f9ebc17fd11adbe4a3fafb69b31e/examples/reasoning_demo.py"
        }
      },
      {
        "heading": "CLEVR-Humans Language Adaptation",
        "paragraphs": [
          "Supervised question–program training initializes the T5 parser. Adaptation to CLEVR-Humans then uses REINFORCE with execution-based rewards and KL regularization, without target-domain program annotations. The method samples candidate programs and rewards programs whose executed answer matches the target.",
          "Reference-graph accuracy improves from 41.4% to 57.1%; full-system accuracy improves from 32.7% to 45.6%. Execution errors fall from 25.5% to 0.6%. These are the thesis results, not a new portfolio experiment. The DSL still cannot express every human question, including some “between” relations and superlatives."
        ],
        "media": [
          {
            "id": "visual-reasoning-thesis_training_en",
            "src": "/media/projects/visual-reasoning/thesis_training_en.webp",
            "poster": "/media/projects/visual-reasoning/thesis_training_en-thumb.webp",
            "alt": "Training curves from the thesis with English axis labels",
            "caption": "Original thesis training curves with translated labels; not a newly simulated training run.",
            "placeholder": "Training curves from the thesis with English axis labels",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "navLabel": "Language adaptation"
      },
      {
        "heading": "Evaluation & Error Analysis",
        "paragraphs": [
          "With annotated scene graphs, the system answers almost all evaluated CLEVR questions correctly. Reconstructing those graphs from images introduces a substantial gap. That contrast is the central result: reliable symbolic execution still depends on the quality of the visual representation it receives.",
          "Human-written questions are a different challenge. Reward-based adaptation improves answer accuracy without requiring target-domain program annotations, but leaves room for richer language coverage."
        ],
        "chart": {
          "label": "Answer accuracy reported in the bachelor thesis",
          "unit": "%",
          "max": 100,
          "series": [
            "Reference scene graph",
            "Reconstructed from image"
          ],
          "rows": [
            {
              "label": "CLEVR",
              "values": [
                99.9,
                79
              ]
            },
            {
              "label": "CoGenT B",
              "values": [
                99.7,
                79
              ]
            },
            {
              "label": "CLEVR-Humans · before RL",
              "values": [
                41.4,
                32.7
              ]
            },
            {
              "label": "CLEVR-Humans · after RL",
              "values": [
                57.1,
                45.6
              ]
            }
          ],
          "note": "Thesis-reported results, not a new evaluation. CLEVR uses 1,000 questions for reference graphs and 10,000 questions across 1,000 images for the complete system, so these are not paired per-question comparisons. CoGenT GT uses 5,000 questions; CLEVR-Humans uses 7,202 validation questions."
        },
        "source": {
          "label": "Result values and evaluation provenance",
          "url": "https://github.com/bgdj11/neurosymbolic-vqa/blob/c5ff2d867fe3f9ebc17fd11adbe4a3fafb69b31e/results/thesis_reported.json"
        },
        "navLabel": "Evaluation"
      },
      {
        "heading": "Perception Limitations",
        "paragraphs": [
          "On 1,000 perception-test images, object recall reaches 97.5%, yet the exact object count is correct in only 53.0% of scenes. Extra detections, imperfect colors and depth-based relationships can all change the result of an otherwise valid reasoning program.",
          "The “behind” relation reaches 44.3% accuracy, making spatial perception an especially clear improvement target. The project leaves a modular research platform: better perception or a broader reasoning language can be investigated without replacing the entire system."
        ],
        "source": {
          "label": "English research summary",
          "url": "https://github.com/bgdj11/neurosymbolic-vqa/blob/c5ff2d867fe3f9ebc17fd11adbe4a3fafb69b31e/docs/one-page-summary.pdf"
        },
        "navLabel": "Limitations"
      }
    ],
    "documents": [
      {
        "title": "Research at a glance",
        "description": "English one-page summary of the method, findings and limitations.",
        "url": "/media/projects/visual-reasoning/one-page-summary.pdf",
        "preview": "/media/projects/visual-reasoning/summary-preview.webp",
        "format": "PDF · English"
      },
      {
        "title": "Bachelor thesis",
        "description": "The complete research, experimental analysis and references.",
        "url": "/media/projects/visual-reasoning/bachelor-thesis-sr.pdf",
        "preview": "/media/projects/visual-reasoning/thesis-preview.webp",
        "format": "PDF · Serbian"
      },
      {
        "title": "Presentation in English",
        "description": "Slides covering the architecture, experiments and main conclusions.",
        "url": "/media/projects/visual-reasoning/presentation-en.pdf",
        "preview": "/media/projects/visual-reasoning/presentation-en-slide-1.webp",
        "format": "PDF slides — English",
        "original": "/media/projects/visual-reasoning/presentation-en.pptx",
        "slides": true
      },
      {
        "title": "Serbian original presentation",
        "description": "The original Serbian defense slides.",
        "url": "/media/projects/visual-reasoning/presentation-sr.pdf",
        "preview": "/media/projects/visual-reasoning/presentation-sr-slide-1.webp",
        "format": "PDF slides — Serbian original",
        "original": "/media/projects/visual-reasoning/presentation-sr.pptx",
        "slides": true
      }
    ]
  },
  {
    "id": "federated-actor-learning",
    "title": "Federated Actor Learning",
    "category": "AI",
    "featured": true,
    "summary": "A custom actor runtime for federated learning, comparing centrally coordinated aggregation with decentralized CRDT-based gossip.",
    "technologies": [
      "Python",
      "Asyncio",
      "NumPy",
      "PyTorch",
      "SQLite",
      "CRDTs"
    ],
    "media": {
      "id": "actor-comparison",
      "src": "/media/projects/diagrams/actor-comparison.svg",
      "alt": "Coordinated actor roles compared with decentralized gossip peers",
      "placeholder": "Coordinated actor roles compared with decentralized gossip peers",
      "caption": "Architecture comparison based on the implementation.",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/federated-actor-learning"
      }
    ],
    "caseStudy": [
      {
        "heading": "Custom Actor Runtime",
        "paragraphs": [
          "The main deliverable is an asynchronous actor system and two federated coordination designs built on it. Actors own isolated behavior and receive messages through mailboxes; actor references hide whether the recipient is local or reached over TCP.",
          "The runtime implements serialization and message framing, middleware, optional TLS and supervision. Supervision can restart actor instances inside a live process; it does not restart a failed operating-system process. Pickle-based transport assumes trusted participants and is not a production security boundary."
        ],
        "navLabel": "Actor runtime",
        "source": {
          "label": "Remote messaging tests",
          "url": "https://github.com/bgdj11/federated-actor-learning/blob/6042860bc0c0167eb88237f288006ca5d722a2ce/tests/test_remote_messaging.py"
        }
      },
      {
        "heading": "Coordinated Training",
        "paragraphs": [
          "A Provider starts a round and distributes the model to Workers. Each Worker trains on its local feature partition and returns a model update with its sample count. The Aggregator computes sample-weighted FedAvg; an Evaluator assesses the aggregate before another round.",
          "Round state makes the expected participants and completed updates explicit. This design gives the experiment one orchestration point and a coherent round boundary, at the cost of dependence on that coordinating path."
        ],
        "navLabel": "Coordinated training",
        "media": [
          {
            "id": "federated-coordinated",
            "src": "/media/projects/diagrams/coordinated-runtime.svg",
            "alt": "Coordinated training topology with provider, workers, aggregator and evaluator",
            "caption": "Coordinated mode: explicit rounds and a dedicated aggregation role. Explanatory diagram based on the source.",
            "placeholder": "Coordinated training topology with provider, workers, aggregator and evaluator",
            "fit": "contain",
            "width": 1000,
            "height": 560
          }
        ]
      },
      {
        "heading": "Asynchronous Gossip & CRDT State",
        "paragraphs": [
          "Autonomous peers train and exchange state without a central round barrier. Configured seed peers bootstrap connectivity; join messages and peer information propagated through gossip expand each local membership view. Peers may temporarily know different models or participants.",
          "Each peer publishes its model under a peer-specific key in an LWWMap and recomputes an aggregate from its current view. Lamport timestamps and replica identifiers resolve conflicting writes; tombstones retain deletions during merges. A PNCounter tracks replicated increments and decrements. State convergence is a property of the merge protocol, not evidence that the learned model converges."
        ],
        "navLabel": "Gossip & CRDTs",
        "media": [
          {
            "id": "federated-gossip",
            "src": "/media/projects/diagrams/gossip-runtime.svg",
            "alt": "Three peers exchanging model state without a central coordinator",
            "caption": "Gossip mode: peers merge state and maintain local aggregates. Explanatory diagram, not a runtime trace.",
            "placeholder": "Three peers exchanging model state without a central coordinator",
            "fit": "contain",
            "width": 1000,
            "height": 560
          }
        ],
        "source": {
          "label": "Peer training and state exchange",
          "url": "https://github.com/bgdj11/federated-actor-learning/blob/6042860bc0c0167eb88237f288006ca5d722a2ce/fl/gossip_peer.py"
        }
      },
      {
        "heading": "Persistence & Recovery",
        "paragraphs": [
          "SQLite stores coordinated round records and gossip snapshots. A restarting peer restores its LWWMap and PNCounter snapshot before continuing training and exchange. WAL-backed storage separates durable checkpoints from transient mailbox traffic.",
          "A snapshot restores recorded progress, not every message that may have been in flight. Experiments must distinguish actor restart, process restart, lost updates and eventual state reconciliation."
        ],
        "navLabel": "Recovery",
        "source": {
          "label": "Persistence test cases",
          "url": "https://github.com/bgdj11/federated-actor-learning/blob/6042860bc0c0167eb88237f288006ca5d722a2ce/tests/test_persistence.py"
        }
      },
      {
        "heading": "Verification & Coordination Trade-offs",
        "paragraphs": [
          "The repository contains tests for local actors, remote messaging, middleware, TLS, supervision, CRDT merging, persistence and cross-process gossip integration. These are inspected test cases; the portfolio does not present a newly executed test run or a throughput benchmark.",
          "Coordinated rounds simplify aggregation and evaluation. Gossip removes the shared round barrier but introduces stale local views and more complex recovery semantics. No archived convergence history supports a claim that either design is faster, more accurate or more scalable."
        ],
        "navLabel": "Verification",
        "source": {
          "label": "Gossip integration test",
          "url": "https://github.com/bgdj11/federated-actor-learning/blob/6042860bc0c0167eb88237f288006ca5d722a2ce/tests/test_gossip_integration.py"
        }
      },
      {
        "heading": "Experimental Workload: Non-IID Features",
        "paragraphs": [
          "The workload is a linear softmax classifier over 512-dimensional ResNet18 features from EuroSAT. Sample-weighted aggregation and optional FedProx exercise the runtime with local learning, rather than serving as a new learning-algorithm claim.",
          "Regional partitions combine class selection with feature-vector transformations: A has 11,500 samples, B 7,000 and C 8,500. The 27,000-sample D control reuses the underlying feature source, so it is not an independent geographic holdout. “Haze”, “color shift” and “high contrast” describe feature transformations, not edits to satellite photographs.",
          "The authentic PCA and t-SNE figures use 500 samples per region. They visualize the setup; they are not accuracy or convergence measurements."
        ],
        "navLabel": "Non-IID workload",
        "media": [
          {
            "id": "federated-actor-learning-pca",
            "src": "/media/projects/federated-actor-learning/pca.webp",
            "poster": "/media/projects/federated-actor-learning/pca-thumb.webp",
            "alt": "PCA projection of four regional feature groups",
            "caption": "Saved notebook PCA projection: 2,000 samples across four regions.",
            "placeholder": "PCA projection of four regional feature groups",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "federated-actor-learning-tsne",
            "src": "/media/projects/federated-actor-learning/tsne.webp",
            "poster": "/media/projects/federated-actor-learning/tsne-thumb.webp",
            "alt": "t-SNE projection of the same sampled regional features",
            "caption": "t-SNE offers a second view of local neighborhood structure; distances are not an accuracy score.",
            "placeholder": "t-SNE projection of the same sampled regional features",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "federated-actor-learning-feature-magnitude",
            "src": "/media/projects/federated-actor-learning/feature-magnitude.webp",
            "poster": "/media/projects/federated-actor-learning/feature-magnitude-thumb.webp",
            "alt": "Feature magnitude distributions by region",
            "caption": "The transformations also change the distribution of feature-vector magnitudes.",
            "placeholder": "Feature magnitude distributions by region",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "federated-actor-learning-similarity",
            "src": "/media/projects/federated-actor-learning/similarity.webp",
            "poster": "/media/projects/federated-actor-learning/similarity-thumb.webp",
            "alt": "Cosine similarity between regional feature centroids",
            "caption": "Centroid similarity summarizes regional differences while hiding variation within each group.",
            "placeholder": "Cosine similarity between regional feature centroids",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "source": {
          "label": "Original visualization notebook",
          "url": "https://github.com/bgdj11/federated-actor-learning/blob/6042860bc0c0167eb88237f288006ca5d722a2ce/notebooks/visualize_domain_shift.ipynb"
        }
      }
    ],
    "cardMedia": {
      "id": "actor-comparison",
      "src": "/media/projects/diagrams/actor-cover.svg",
      "alt": "Coordinated actor roles compared with decentralized gossip peers",
      "placeholder": "Coordinated actor roles compared with decentralized gossip peers",
      "caption": "Architecture comparison based on the implementation.",
      "fit": "contain"
    }
  },
  {
    "id": "botanica",
    "title": "Botanica Algorithmica",
    "category": "Graphics",
    "collection": "Graphics & Computer Vision",
    "featured": false,
    "summary": "Interactive 2D plant generation using stochastic L-systems, procedural branching and adjustable growth and appearance.",
    "technologies": [
      "Python",
      "Pygame",
      "L-systems",
      "NumPy"
    ],
    "media": {
      "id": "botanica-regenerate",
      "src": "/media/projects/botanica/regenerate.gif",
      "poster": "/media/projects/botanica/regenerate-poster.webp",
      "kind": "gif",
      "alt": "Recording of new plants being generated in the original Botanica application",
      "caption": "Original application recording: stochastic rewriting produces different plant forms.",
      "placeholder": "Recording of new plants being generated in the original Botanica application",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/botanica-algorithmica"
      }
    ],
    "caseStudy": [
      {
        "heading": "Stochastic L-System Rewriting",
        "paragraphs": [
          "Each plant starts from an axiom and a preset collection of production rules. At every development iteration, the generator replaces each matching symbol using roulette selection over the rule probabilities. Unmatched symbols remain unchanged.",
          "Preset 1 begins with F. Two F productions are equally likely: F[+F]F[-F]G and F[+F]G. Subsequent rewriting of F, G and Z grows the sentence into a branching structure; repeated generation can change the shape even with the same preset."
        ],
        "navLabel": "L-system",
        "code": "Preset 1 — first rewrite\nAxiom: F\nF → F[+F]F[-F]G   probability 0.5\nF → F[+F]G        probability 0.5",
        "source": {
          "label": "Original axioms and weighted productions",
          "url": "https://github.com/bgdj11/botanica-algorithmica/blob/f252b9a70ace6d2262f70842660d10924a8a803c/scripts/presets/Presets.py"
        }
      },
      {
        "heading": "From Symbols to 2D Geometry",
        "paragraphs": [
          "The interpreter advances through the rewritten sentence, drawing stem segments and turning the heading. Opening brackets push the current drawing state onto a stack; closing brackets restore it, allowing branches to emerge from a shared point.",
          "A geometry pass estimates bounds to fit the result into the drawing area. Leaves, flowers and fruit decorate the structure using preset shapes and variations in scale and color. The algorithm generates a drawing from a grammar rather than reconstructing a particular real plant."
        ],
        "navLabel": "Geometry",
        "source": {
          "label": "Growth and drawing implementation",
          "url": "https://github.com/bgdj11/botanica-algorithmica/blob/f252b9a70ace6d2262f70842660d10924a8a803c/scripts/Botanica.py"
        }
      },
      {
        "heading": "Growth & Appearance Controls",
        "paragraphs": [
          "The development slider controls rewrite iterations; the growth control adjusts segment geometry. Leaf presets and stem, foliage, flower and fruit colors change the appearance without replacing the branching grammar. These recordings are from the original Pygame interface."
        ],
        "media": [
          {
            "id": "botanica-development",
            "src": "/media/projects/botanica/development.gif",
            "poster": "/media/projects/botanica/development-poster.webp",
            "kind": "gif",
            "alt": "The plant development control changing a generated plant",
            "caption": "Exploring development stages.",
            "placeholder": "The plant development control changing a generated plant",
            "fit": "contain"
          },
          {
            "id": "botanica-leaves",
            "src": "/media/projects/botanica/leaves.gif",
            "poster": "/media/projects/botanica/leaves-poster.webp",
            "kind": "gif",
            "alt": "Changing leaf presets in the plant application",
            "caption": "Changing foliage while exploring the generated structure.",
            "placeholder": "Changing leaf presets in the plant application",
            "fit": "contain"
          }
        ],
        "navLabel": "Controls"
      },
      {
        "heading": "Gallery of Generated Plants",
        "paragraphs": [
          "Saved outputs from the application show different branching structures and decorative presets. Their individual seed and slider settings were not archived, so these are examples of generated forms rather than a controlled parameter comparison."
        ],
        "media": [
          {
            "id": "botanica-arched",
            "src": "/media/projects/botanica/arched.webp",
            "poster": "/media/projects/botanica/arched-thumb.webp",
            "alt": "Generated tree with a strongly arched trunk",
            "caption": "An asymmetric, arched silhouette.",
            "placeholder": "Generated tree with a strongly arched trunk",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          },
          {
            "id": "botanica-branching",
            "src": "/media/projects/botanica/branching.webp",
            "poster": "/media/projects/botanica/branching-thumb.webp",
            "alt": "Generated branching leafy plant",
            "caption": "A more open branching structure.",
            "placeholder": "Generated branching leafy plant",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          },
          {
            "id": "botanica-flowers",
            "src": "/media/projects/botanica/flowers.webp",
            "poster": "/media/projects/botanica/flowers-thumb.webp",
            "alt": "Generated plant with purple flowers",
            "caption": "Flower shapes layered over the branch structure.",
            "placeholder": "Generated plant with purple flowers",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          },
          {
            "id": "botanica-fruit",
            "src": "/media/projects/botanica/fruit.webp",
            "poster": "/media/projects/botanica/fruit-thumb.webp",
            "alt": "Generated plant with bright fruit",
            "caption": "Fruit changes the visual rhythm without replacing the grammar.",
            "placeholder": "Generated plant with bright fruit",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          },
          {
            "id": "botanica-slender",
            "src": "/media/projects/botanica/slender.webp",
            "poster": "/media/projects/botanica/slender-thumb.webp",
            "alt": "A thin upright generated plant",
            "caption": "A slender alternative from the same drawing system.",
            "placeholder": "A thin upright generated plant",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          },
          {
            "id": "botanica-canopy",
            "src": "/media/projects/botanica/canopy.webp",
            "poster": "/media/projects/botanica/canopy-thumb.webp",
            "alt": "Generated tree with a broad canopy",
            "caption": "Broad canopy and dense foliage.",
            "placeholder": "Generated tree with a broad canopy",
            "fit": "contain",
            "shape": "landscape",
            "background": "#ddd8c8"
          }
        ],
        "navLabel": "Plant outputs"
      },
      {
        "heading": "Implementation & Limits",
        "paragraphs": [
          "The implementation uses Python, Pygame and NumPy for rewriting, geometry and drawing. Weighted productions and angle/color variation create repeatable structural motifs with local randomness. The application saves rendered plants as PNG files.",
          "This is 2D procedural art, not a physical growth or biological simulation. More rewrite iterations expand the command sequence rapidly; a useful improvement would be explicit generation budgets and stored seeds for reproducible comparisons."
        ],
        "source": {
          "label": "Growth and drawing implementation",
          "url": "https://github.com/bgdj11/botanica-algorithmica/blob/f252b9a70ace6d2262f70842660d10924a8a803c/scripts/Botanica.py"
        },
        "navLabel": "Limits"
      }
    ],
    "cardMedia": {
      "id": "botanica-canopy",
      "src": "/media/projects/botanica/canopy.webp",
      "poster": "/media/projects/botanica/canopy-thumb.webp",
      "alt": "Generated tree with a broad canopy",
      "caption": "Broad canopy and dense foliage.",
      "placeholder": "Generated tree with a broad canopy",
      "fit": "contain",
      "shape": "landscape",
      "background": "#ddd8c8"
    }
  },
  {
    "id": "vision-studies",
    "title": "Classical Computer Vision",
    "category": "Vision",
    "collection": "Graphics & Computer Vision",
    "featured": false,
    "summary": "Classical OpenCV pipelines for counting objects in images and tracking boundary crossings in video, with inspectable intermediate results.",
    "technologies": [
      "Python",
      "OpenCV",
      "NumPy",
      "Matplotlib",
      "Jupyter"
    ],
    "media": {
      "id": "classical-vision-duck-results",
      "src": "/media/projects/classical-vision/duck-edge-results.webp",
      "poster": "/media/projects/classical-vision/duck-edge-results-thumb.webp",
      "alt": "Ten duck-counting examples with detected contours highlighted in magenta",
      "placeholder": "Duck-counting results with detected contours",
      "fit": "contain",
      "shape": "landscape"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/soft-computing-vision-projects"
      }
    ],
    "caseStudy": [
      {
        "heading": "Two Classical Counting Pipelines",
        "paragraphs": [
          "These experiments solve two concrete counting problems with classical image processing. One counts illustrated ducks in still images; the other follows moving Buzzy Beetles and counts boundary crossings in game footage.",
          "Because the pipeline is explicit, its decisions can be inspected at every step: edges, masks, contours, tracked objects and the final count. The figures here are extracted from the executed notebooks."
        ],
        "navLabel": "Problems"
      },
      {
        "heading": "Duck Counting: Canny vs Otsu",
        "paragraphs": [
          "The edge-based pipeline crops/preprocesses the image, applies Gaussian blur and Canny edges, then uses morphology to build candidate contours. Contour area and a region of interest reject background structure. The alternative uses Otsu global thresholding, inversion, morphology and contour hierarchy before spatial filtering.",
          "Both methods assume a constrained image layout and separable object regions. Canny can retain background edges; thresholding can merge adjacent ducks or retain large background regions. The notebook figures show the intermediate representations and the final annotated counts."
        ],
        "media": [
          {
            "id": "classical-vision-duck-contours",
            "src": "/media/projects/classical-vision/duck-contours.webp",
            "poster": "/media/projects/classical-vision/duck-contours-thumb.webp",
            "alt": "Duck candidates selected from contours",
            "caption": "Selected contours after filtering. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Duck candidates selected from contours",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-duck-threshold-contours",
            "src": "/media/projects/classical-vision/duck-threshold-contours.webp",
            "poster": "/media/projects/classical-vision/duck-threshold-contours-thumb.webp",
            "alt": "Threshold-based duck detections within a region of interest",
            "caption": "Threshold-based detections and the region used for filtering. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Threshold-based duck detections within a region of interest",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-duck-edge-results",
            "src": "/media/projects/classical-vision/duck-edge-results.webp",
            "poster": "/media/projects/classical-vision/duck-edge-results-thumb.webp",
            "alt": "Results of edge-based counting across all ten images",
            "caption": "Edge-based results across the complete image set. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Results of edge-based counting across all ten images",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-duck-threshold-results",
            "src": "/media/projects/classical-vision/duck-threshold-results.webp",
            "poster": "/media/projects/classical-vision/duck-threshold-results-thumb.webp",
            "alt": "Threshold-based counting across all ten images",
            "caption": "Threshold-based results across the same ten images. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Threshold-based counting across all ten images",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "source": {
          "label": "Thresholding experiment notebook",
          "url": "https://github.com/bgdj11/soft-computing-vision-projects/blob/ea455f1ba54bb01db668930946afbf377923805b/duck_counter_method2_visualization.ipynb"
        },
        "navLabel": "Image counting",
        "comparison": [
          {
            "label": "Canny edges",
            "media": {
              "id": "classical-vision-duck-edges",
              "src": "/media/projects/classical-vision/duck-edges.webp",
              "poster": "/media/projects/classical-vision/duck-edges-thumb.webp",
              "alt": "Canny edge output for an illustrated duck-counting image",
              "caption": "Method 1: edges preserve outlines but also include background detail. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
              "placeholder": "Canny edge output for an illustrated duck-counting image",
              "fit": "contain",
              "shape": "landscape"
            }
          },
          {
            "label": "Otsu threshold",
            "media": {
              "id": "classical-vision-duck-threshold",
              "src": "/media/projects/classical-vision/duck-threshold.webp",
              "poster": "/media/projects/classical-vision/duck-threshold-thumb.webp",
              "alt": "Otsu binary threshold output",
              "caption": "Method 2: binary regions offer a different separation of ducks and background. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
              "placeholder": "Otsu binary threshold output",
              "fit": "contain",
              "shape": "landscape"
            }
          }
        ]
      },
      {
        "heading": "Small-Set Counting Errors",
        "chart": {
          "label": "Duck-counting errors on ten images",
          "unit": "",
          "max": 2.5,
          "series": [
            "MAE (objects/image)",
            "MSE (objects²/image)"
          ],
          "rows": [
            {
              "label": "Edges + morphology",
              "values": [
                0.8,
                2.2
              ]
            },
            {
              "label": "Threshold + contours",
              "values": [
                0.4,
                0.6
              ]
            }
          ],
          "note": "Lower is better. Values are saved notebook outputs for the same ten images. MAE is average count error; MSE penalizes larger misses more strongly. These are not percentages.",
          "display": "table"
        },
        "source": {
          "label": "Edge-based experiment and results",
          "url": "https://github.com/bgdj11/soft-computing-vision-projects/blob/ea455f1ba54bb01db668930946afbf377923805b/duck_counter_method1_visualization.ipynb"
        },
        "navLabel": "Measured errors"
      },
      {
        "heading": "Video Tracking: MOG2 + HSV",
        "paragraphs": [
          "For Buzzy Beetle video, MOG2 estimates the moving foreground. An HSV mask selects blue regions; intersecting the masks and filtering contours produces candidate detections. Distance-based association carries object identities between frames, and a vertical-boundary crossing increments the count once for each tracked identity.",
          "The sequence below separates masks, detections and counted crossings. Saved notebook results show 8 of 10 exact video counts, MAE 0.2 objects/video and MSE 0.2 objects²/video. These are measurements on the ten supplied videos, not a general tracking benchmark."
        ],
        "media": [
          {
            "id": "classical-vision-beetle-foreground",
            "src": "/media/projects/classical-vision/beetle-foreground.webp",
            "poster": "/media/projects/classical-vision/beetle-foreground-thumb.webp",
            "alt": "Foreground subtraction masks for four video frames",
            "caption": "Foreground subtraction isolates movement but retains some artifacts. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Foreground subtraction masks for four video frames",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-beetle-color",
            "src": "/media/projects/classical-vision/beetle-color.webp",
            "poster": "/media/projects/classical-vision/beetle-color-thumb.webp",
            "alt": "Blue-color masks for game video frames",
            "caption": "Color masking provides a second cue, including some unwanted background regions. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Blue-color masks for game video frames",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-beetle-detection",
            "src": "/media/projects/classical-vision/beetle-detection.webp",
            "poster": "/media/projects/classical-vision/beetle-detection-thumb.webp",
            "alt": "Detected beetles with boxes across video frames",
            "caption": "Detections after combining masks and filtering contours. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Detected beetles with boxes across video frames",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-beetle-crossings",
            "src": "/media/projects/classical-vision/beetle-crossings.webp",
            "poster": "/media/projects/classical-vision/beetle-crossings-thumb.webp",
            "alt": "Tracked beetles at boundary crossing events",
            "caption": "Selected crossing events from the notebook. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "Tracked beetles at boundary crossing events",
            "fit": "contain",
            "shape": "landscape"
          },
          {
            "id": "classical-vision-beetle-counts",
            "src": "/media/projects/classical-vision/beetle-counts.webp",
            "poster": "/media/projects/classical-vision/beetle-counts-thumb.webp",
            "alt": "True and predicted counts for ten Buzzy Beetle videos",
            "caption": "Saved per-video comparison: eight exact predictions, two misses of one object. Original notebook output; Where Serbian labels appear, “detektovano” means detected, “predikcija” predicted, and “stvarno” actual.",
            "placeholder": "True and predicted counts for ten Buzzy Beetle videos",
            "fit": "contain",
            "shape": "landscape"
          }
        ],
        "source": {
          "label": "Tracking notebook and evaluation",
          "url": "https://github.com/bgdj11/soft-computing-vision-projects/blob/ea455f1ba54bb01db668930946afbf377923805b/buzzy_beetle_counter_visualization.ipynb"
        },
        "navLabel": "Video tracking"
      },
      {
        "heading": "Assumptions & Failure Modes",
        "paragraphs": [
          "Simple methods can work well when their assumptions match the scene. They also make mistakes easy to locate: merged contours, background edges, unsuitable color thresholds or imperfect association between frames.",
          "The regions of interest, thresholds and matching rules are tuned to these examples. Applying the same pipeline to new scenes would require revisiting those assumptions, rather than treating the reported errors as a general object-counting benchmark."
        ],
        "navLabel": "Limitations"
      }
    ]
  },
  {
    "id": "checkmate",
    "title": "CheckMate",
    "category": "AI",
    "collection": "AI & Other Projects",
    "featured": false,
    "summary": "A hackathon prototype combining web-page signals, semantic retrieval of community discussions and LLM-assisted risk analysis.",
    "contribution": "Backend and AI development lead in a 36-hour team hackathon",
    "technologies": [
      "Python",
      "FastAPI",
      "FAISS",
      "Embeddings",
      "LLMs",
      "Vue",
      "Browser extension"
    ],
    "media": {
      "id": "checkmate-pipeline",
      "src": "/media/projects/diagrams/checkmate-pipeline.svg",
      "alt": "Evidence indexing, retrieval, page analysis and API integration",
      "placeholder": "Evidence indexing, retrieval, page analysis and API integration",
      "caption": "Architecture illustration, not an observed risk score.",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/YandexAI-hackathon"
      }
    ],
    "caseStudy": [
      {
        "heading": "Problem & Contribution",
        "paragraphs": [
          "Built during the 36-hour AI Nation hackathon by Reputeo and Yandex, CheckMate combines discussion evidence with web-page content to support scam-risk investigation. I led backend and AI development within the team.",
          "The backend implements data preparation, embedding search and contextual analysis. The web interface and extension are integration surfaces with different completion states; the extension’s current service worker uses mock responses."
        ],
        "navLabel": "Contribution",
        "media": [
          {
            "id": "checkmate-logo",
            "src": "/media/projects/checkmate/logo.webp",
            "alt": "Original CheckMate logo",
            "placeholder": "CheckMate logo",
            "caption": "Original hackathon project identity.",
            "fit": "contain",
            "width": 500,
            "height": 200
          }
        ]
      },
      {
        "heading": "Evidence Index & Semantic Retrieval",
        "paragraphs": [
          "Preprocessing filters Reddit discussions and assembles posts with relevant comments into documents. The embedding pipeline uses text-embedding-3-large and a FAISS index; query embeddings retrieve semantically related discussion context rather than requiring exact keyword matches.",
          "Retrieved records are assembled into the analysis context. This is useful when a website or seller is discussed under varied wording, but retrieval quality still depends on filtering, document construction and coverage of the source discussions."
        ],
        "navLabel": "Retrieval",
        "source": {
          "label": "Semantic retrieval implementation",
          "url": "https://github.com/bgdj11/YandexAI-hackathon/blob/7e40f3bbba7e59d25e35c4944d009fcb92b3e50b/backend/embedding/search_embeddings.py"
        }
      },
      {
        "heading": "Page Signals & LLM Analysis",
        "paragraphs": [
          "HTML analysis extracts page text and metadata and applies heuristic signals alongside contextual LLM reasoning. The analysis function sends the query and retrieved evidence to a configured OpenAI-compatible model and requests structured output.",
          "The function name retained from an earlier implementation mentions Grok; that name alone does not establish the model used by the current configuration. A generated risk assessment is a reasoned prototype output, not a verified fraud label."
        ],
        "navLabel": "Analysis",
        "source": {
          "label": "Context construction and structured analysis",
          "url": "https://github.com/bgdj11/YandexAI-hackathon/blob/7e40f3bbba7e59d25e35c4944d009fcb92b3e50b/backend/embedding/llm_analysis.py"
        }
      },
      {
        "heading": "API, Web & Extension Integration",
        "paragraphs": [
          "FastAPI exposes the retrieval and analysis services; Vue supplies the query/results interface. The Manifest V3 extension collects page content and includes popup/content-script messaging.",
          "In the reviewed service worker, handleAnalyzeUrl calls generateMockAnalyzeHtmlResponse. The real /analyze-html request is commented out. The portfolio therefore treats the extension as an integration prototype, not a deployed live detector."
        ],
        "navLabel": "Integration",
        "source": {
          "label": "Extension mock mode and pending API call",
          "url": "https://github.com/bgdj11/YandexAI-hackathon/blob/7e40f3bbba7e59d25e35c4944d009fcb92b3e50b/scam-checker-extension/background/service-worker.js"
        }
      },
      {
        "heading": "Limitations",
        "paragraphs": [
          "No labeled detection benchmark or production deployment is demonstrated by the archived materials. Community discussions can be incomplete or unreliable, page heuristics are not definitive, and retrieved context can still lead to unsupported LLM judgments.",
          "A next evaluation would compare retrieval relevance and risk judgments against a labeled set, separately from connecting the extension to the live API. No generated UI mockup or fabricated risk-score measurement is presented here."
        ],
        "navLabel": "Limits"
      }
    ],
    "cardMedia": {
      "id": "checkmate-logo",
      "src": "/media/projects/checkmate/logo.webp",
      "alt": "Original CheckMate logo",
      "placeholder": "CheckMate logo",
      "caption": "Original hackathon project identity.",
      "fit": "contain",
      "width": 500,
      "height": 200
    }
  },
  {
    "id": "social-moderation",
    "title": "Rule-Based Social Moderation",
    "category": "AI",
    "collection": "AI & Other Projects",
    "featured": false,
    "summary": "A Drools rule engine for explainable feed recommendations and temporal moderation based on user events.",
    "technologies": [
      "Java",
      "Drools",
      "Spring Boot",
      "Angular"
    ],
    "media": {
      "id": "drools-engine",
      "src": "/media/projects/diagrams/drools-engine.svg",
      "alt": "Application facts enter Drools working memory; agenda groups produce restrictions and recommendations",
      "placeholder": "Application facts enter Drools working memory; agenda groups produce restrictions and recommendations",
      "caption": "Rule-engine architecture derived from the Spring services and KJAR.",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/social-moderation-platform"
      }
    ],
    "caseStudy": [
      {
        "heading": "Facts, Working Memory & Agenda Groups",
        "paragraphs": [
          "Java/Spring services assemble user profiles, ReportEvent and BlockEvent objects, feed context and candidate posts. The .drl rule sets are packaged in a KJAR and evaluated in a KIE session: inserted facts enter working memory, matching conditions activate rules, and fired rules produce restrictions or scored recommendations.",
          "Moderation focuses user-moderation. FeedService places recommendation agenda groups on the focus stack in reverse order, so validation runs before routing, scoring and output. The friends feed has a separate feed-friends-select path."
        ],
        "navLabel": "Drools engine",
        "source": {
          "label": "Fact insertion and agenda execution",
          "url": "https://github.com/bgdj11/social-moderation-platform/blob/2c5628fb28d2dc6f367458535149121ca5eda9b2/kjar-example/drools-spring-app/src/main/java/sbnz/integracija/example/service/FeedService.java"
        }
      },
      {
        "heading": "Temporal Moderation Policies",
        "paragraphs": [
          "Report and block facts are timestamped events. Sliding windows and accumulate expressions count matching events over a defined interval; rules create posting or login restrictions with explicit expiry times. The inequalities below follow the executable rules."
        ],
        "navLabel": "Temporal policies",
        "table": {
          "caption": "Implemented restrictions",
          "columns": [
            "Events in window",
            "Restriction",
            "Duration"
          ],
          "rows": [
            [
              "> 5 reports / 24 h",
              "Posting",
              "24 h"
            ],
            [
              "> 8 reports / 48 h",
              "Posting",
              "48 h"
            ],
            [
              "> 4 blocks / 24 h",
              "Posting",
              "24 h"
            ],
            [
              "> 2 blocks / 48 h AND > 4 reports / 24 h",
              "Login",
              "48 h"
            ],
            [
              "> 3 blocks / 6 h",
              "Posting",
              "12 h"
            ],
            [
              "> 12 reports / 7 d",
              "Login",
              "72 h"
            ]
          ]
        },
        "source": {
          "label": "Moderation rules and thresholds",
          "url": "https://github.com/bgdj11/social-moderation-platform/blob/2c5628fb28d2dc6f367458535149121ca5eda9b2/kjar-example/drools-spring-kjar/src/main/resources/sbnz/integracija/user-moderation-rules.drl"
        }
      },
      {
        "heading": "Recommendation Routing & Scoring",
        "paragraphs": [
          "The router selects BASE when a user has friends or authored posts; otherwise it selects NEW. BASE adds explicit one-point contributions for recency, liked/authored hashtags, popular posts, popular hashtags and a popularity/liked-tag combination.",
          "NEW uses similar-user and liked-post-overlap conditions, including similarity thresholds of 0.5 and 0.7. Rules accumulate transparent reasons, not a learned ranking score. Discovery excludes self/friend authors; the separate friends-feed path excludes blocked authors. These guards should not be conflated."
        ],
        "navLabel": "Recommendations",
        "media": [
          {
            "id": "drools-recommendations",
            "src": "/media/projects/diagrams/drools-recommendations.svg",
            "alt": "Existing-user and new-user recommendation branches and their scoring factors",
            "placeholder": "Existing-user and new-user recommendation branches and their scoring factors",
            "caption": "Recommendation rule map. Conditions and one-point contributions come from feed-recommend-rules.drl.",
            "fit": "contain"
          }
        ],
        "source": {
          "label": "Recommendation scoring rules",
          "url": "https://github.com/bgdj11/social-moderation-platform/blob/2c5628fb28d2dc6f367458535149121ca5eda9b2/kjar-example/drools-spring-kjar/src/main/resources/sbnz/integracija/feed-recommend-rules.drl"
        }
      },
      {
        "heading": "Illustrative Rule Walkthrough",
        "paragraphs": [
          "Consider six report events inside the trailing 24-hour window. The strict “more than five” threshold is satisfied, so the matching rule can impose a 24-hour posting restriction with a reason and expiry. Five matching events would not trigger that rule.",
          "The timeline is an illustration of this policy, not a recorded moderation incident. Other rules may also activate when their own conditions are met."
        ],
        "navLabel": "Policy example",
        "media": [
          {
            "id": "moderation-timeline",
            "src": "/media/projects/diagrams/moderation-timeline.svg",
            "alt": "Six example reports inside a 24-hour window trigger the greater-than-five rule",
            "placeholder": "Six example reports inside a 24-hour window trigger the greater-than-five rule",
            "caption": "Illustrative timestamps for an actual implemented rule; no real users or production events.",
            "fit": "contain"
          }
        ]
      },
      {
        "heading": "Integration & Limitations",
        "paragraphs": [
          "The project demonstrates rule authoring, temporal inference and Spring integration; archived tests exercise moderation policies. Explicit rules make decisions inspectable, but do not establish moderation fairness or recommendation quality.",
          "Thresholds can be exploited by coordinated reports and require policy review. There are no real-traffic experiments or relevance judgments here to justify performance or quality claims."
        ],
        "navLabel": "Limits"
      }
    ]
  },
  {
    "id": "sentiment-chatbot",
    "title": "Sentiment-Aware Chatbot",
    "category": "AI",
    "collection": "AI & Other Projects",
    "featured": false,
    "summary": "A custom Rasa NLU pipeline combining spelling correction, fine-tuned BERT sentiment classification and rule-conditioned dialogue actions.",
    "technologies": [
      "Python",
      "Rasa",
      "BERT",
      "PyTorch",
      "Transformers"
    ],
    "media": {
      "id": "rasa-pipeline",
      "src": "/media/projects/diagrams/rasa-pipeline.svg",
      "alt": "Actual Rasa configuration order with BERT sentiment and intent inputs feeding response selection",
      "placeholder": "Actual Rasa configuration order with BERT sentiment and intent inputs feeding response selection",
      "caption": "Pipeline illustration based on config.yml and the custom action.",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/rasa-sentiment-chatbot"
      }
    ],
    "caseStudy": [
      {
        "heading": "Custom Rasa NLU Pipeline",
        "paragraphs": [
          "The configured sequence is WhitespaceTokenizer → SpellCheckerComponent → EmotionAnalyzer → CountVectorsFeaturizer → DIETClassifier → ResponseSelector → FallbackClassifier. The spell component replaces words using a corrections.txt dictionary and updates message text; it is not a learned spelling model.",
          "EmotionAnalyzer applies a fine-tuned bert-base-uncased classifier and attaches positive or negative to message.emotion. DIET separately classifies intent. The spelling component occurs after tokenization and does not explicitly rebuild tokens, an integration detail worth correcting before broader evaluation."
        ],
        "navLabel": "NLU pipeline",
        "source": {
          "label": "Actual component and dialogue-policy configuration",
          "url": "https://github.com/bgdj11/rasa-sentiment-chatbot/blob/8bc1bb417c42cdae446647878da6073fae92732c/chatbot/config.yml"
        }
      },
      {
        "heading": "BERT Sentiment Fine-Tuning",
        "paragraphs": [
          "The notebook uses a 20,000-text sample from Sentiment140, split 80/20, and fine-tunes bert-base-uncased for three epochs. The saved evaluation is on 4,000 held-out texts.",
          "These figures describe positive/negative text classification. They do not measure how helpful, natural or emotionally appropriate a whole conversation is."
        ],
        "chart": {
          "label": "Saved sentiment-classifier evaluation",
          "unit": "%",
          "max": 100,
          "series": [
            "Score"
          ],
          "rows": [
            {
              "label": "Accuracy",
              "values": [
                75.475
              ]
            },
            {
              "label": "Weighted precision",
              "values": [
                75.5875
              ]
            },
            {
              "label": "Weighted recall",
              "values": [
                75.475
              ]
            },
            {
              "label": "Weighted F1",
              "values": [
                75.4316
              ]
            }
          ],
          "note": "Converted to percentages from the notebook’s stored evaluation output. No retraining was performed for this portfolio. Precision, recall and F1 use weighted averaging.",
          "display": "table"
        },
        "source": {
          "label": "Training notebook and saved metrics",
          "url": "https://github.com/bgdj11/rasa-sentiment-chatbot/blob/8bc1bb417c42cdae446647878da6073fae92732c/src/emotions.ipynb"
        },
        "navLabel": "Fine-tuning"
      },
      {
        "heading": "Sentiment-Aware Action Selection",
        "paragraphs": [
          "The custom action reads the latest intent and emotion and selects utter_<intent>_positive or utter_<intent>_negative from the domain. BERT supplies a classification label; it does not generate the reply.",
          "The action’s non-positive branch includes missing/neutral emotion, so it falls back to a negative response variant. Dialogue behavior remains controlled by predefined responses and Rasa policies."
        ],
        "navLabel": "Actions",
        "source": {
          "label": "Sentiment-conditioned response action",
          "url": "https://github.com/bgdj11/rasa-sentiment-chatbot/blob/8bc1bb417c42cdae446647878da6073fae92732c/chatbot/actions/actions.py"
        }
      },
      {
        "heading": "Example Interaction & Limitations",
        "paragraphs": [
          "The original terminal capture records an imperfect response: “hello” receives “Hi there, friend. Sorry if things aren’t great.” That is evidence of tone mismatch, not of emotional understanding.",
          "Two labels cannot represent neutral, mixed or changing sentiment. The saved classification metrics describe held-out Sentiment140 texts, not conversational usefulness. Evaluating complete dialogue turns and handling neutral/uncertain inputs would be separate next steps."
        ],
        "navLabel": "Conversation",
        "media": [
          {
            "id": "sentiment-chatbot-conversation",
            "src": "/media/projects/sentiment-chatbot/conversation.webp",
            "poster": "/media/projects/sentiment-chatbot/conversation-thumb.webp",
            "alt": "Recorded chatbot terminal session with different responses",
            "caption": "Original repository screenshot. It also shows imperfect tone selection, an important boundary of the approach.",
            "placeholder": "Recorded chatbot terminal session with different responses",
            "fit": "contain",
            "shape": "landscape"
          }
        ]
      }
    ]
  },
  {
    "id": "bunhub",
    "title": "BunHub",
    "category": "Other",
    "collection": "AI & Other Projects",
    "featured": false,
    "summary": "A full-stack social platform exploring real-time messaging, asynchronous services, caching, concurrency and monitoring.",
    "technologies": [
      "Java",
      "Spring Boot",
      "Angular",
      "PostgreSQL",
      "RabbitMQ",
      "WebSockets"
    ],
    "media": {
      "id": "bunhub-system",
      "src": "/media/projects/diagrams/bunhub-system.svg",
      "alt": "Angular, Spring application services, PostgreSQL, RabbitMQ and observability with actual connections",
      "placeholder": "Angular, Spring application services, PostgreSQL, RabbitMQ and observability with actual connections",
      "caption": "System architecture illustration. The custom in-memory queue is distinct from RabbitMQ.",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/bun-hub"
      }
    ],
    "caseStudy": [
      {
        "heading": "Application & System Architecture",
        "paragraphs": [
          "Angular provides the social interface and Spring Boot organizes authentication, posts, follows, chat, care-location and maintenance services over PostgreSQL. Photos, geolocation and conversations provide the application context for studying concurrency and asynchronous work.",
          "The architecture above separates HTTP application calls, live WebSocket delivery, broker-backed integrations and process-local caches. The repository also contains an educational queue service; it is not interchangeable with RabbitMQ."
        ],
        "navLabel": "Architecture"
      },
      {
        "heading": "Real-Time Messaging & Access Boundaries",
        "paragraphs": [
          "A POST to /api/messages checks that the submitted sender ID belongs to the group, persists the message, maps it to a DTO and invokes WebSocket broadcast. The handshake validates a JWT and stores the user email. Membership records include join times for recent-history behavior.",
          "The reviewed broadcast method sends to every open WebSocket session, not only group participants. In addition, checking a sender ID supplied in the request is not equivalent to binding that sender to the authenticated principal. Per-recipient delivery and server-side authorization of history/member operations are necessary follow-up work; this is not presented as private production messaging."
        ],
        "navLabel": "Real-time chat",
        "media": [
          {
            "id": "bunhub-chat",
            "src": "/media/projects/diagrams/bunhub-chat.svg",
            "alt": "POST membership check and persistence followed by broadcast to all open WebSocket sessions",
            "placeholder": "POST membership check and persistence followed by broadcast to all open WebSocket sessions",
            "caption": "Actual message flow, including the broadcast limitation. It is not a diagram of an idealized secure implementation.",
            "fit": "contain"
          }
        ],
        "source": {
          "label": "Message submission, membership check and broadcast",
          "url": "https://github.com/bgdj11/bun-hub/blob/f73fccdc60c122f96beb7e9e161ee927677244e0/only-buns-be/src/main/java/com/example/onlybunsbe/controller/ChatController.java"
        }
      },
      {
        "heading": "Asynchronous Processing & Background Work",
        "paragraphs": [
          "RabbitMQ delivers rabbit_locations messages to a care-location listener, while a publisher sends promotional messages to demonstration advertising applications. These integrations are separate from the primary request/response path.",
          "The custom queue stores named FIFO queues using ConcurrentHashMap and ConcurrentLinkedDeque; polling removes available messages without blocking. It is in-memory and has no durable broker semantics. A scheduled location poller demonstrates consuming that separate service.",
          "Scheduled tasks also compress old images and notify inactive accounts. The daily image-maintenance task targets images older than 30 days. These are implemented background workflows, not measured latency improvements."
        ],
        "navLabel": "Async work",
        "source": {
          "label": "Custom queue implementation",
          "url": "https://github.com/bgdj11/bun-hub/blob/f73fccdc60c122f96beb7e9e161ee927677244e0/queue-service/src/main/java/com/queue_service/queue_service/customqueue/InMemoryMessageQueue.java"
        }
      },
      {
        "heading": "Transactions, Caching & Request Controls",
        "paragraphs": [
          "FollowService wraps duplicate checking and insertion in a SERIALIZABLE transaction, after a per-user rate-limit check. This addresses the check-then-insert race rather than relying on a client-side disabled button. Group creation also persists the group and admin membership transactionally.",
          "TrendsService caches summaries, top posts and top likers; post, comment and like mutations invalidate those trend caches. Hibernate/Ehcache annotations cover selected entities. A normalized-username Bloom filter gives a probabilistic availability precheck, with a snapshot and database-backed initialization; a possible match still needs verification.",
          "These mechanisms solve distinct problems: transactions protect data changes, cache invalidation refreshes derived views, and rate limits bound repeated actions. The implementation does not demonstrate production-grade security merely by including JWT authentication."
        ],
        "navLabel": "Consistency & caching",
        "source": {
          "label": "Follow transactions and rate limiting",
          "url": "https://github.com/bgdj11/bun-hub/blob/f73fccdc60c122f96beb7e9e161ee927677244e0/only-buns-be/src/main/java/com/example/onlybunsbe/service/FollowService.java"
        }
      },
      {
        "heading": "Observability, Tests & Limitations",
        "paragraphs": [
          "Micrometer registers an active_users gauge over recent authenticated activity; a scheduled cleanup removes inactive entries. A Prometheus endpoint and monitoring configuration support inspection. No recorded traffic, uptime or benchmark result is claimed.",
          "The archived FollowServiceTest starts concurrent requests but finishes by reading rows without asserting the final invariant. It is a concurrency exercise, not proof that the race is resolved. Authentication tests and application-context tests are also present; none were rerun for this portfolio.",
          "The next verification step is an asserted database concurrency test together with chat authorization tests and recipient-scoped delivery. The architecture demonstrates a broad academic systems project, while these limits keep the claims tied to what the source actually establishes."
        ],
        "navLabel": "Verification",
        "source": {
          "label": "Archived concurrency test and its assertion gap",
          "url": "https://github.com/bgdj11/bun-hub/blob/f73fccdc60c122f96beb7e9e161ee927677244e0/only-buns-be/src/test/java/com/example/onlybunsbe/FollowServiceTest.java"
        }
      }
    ],
    "contribution": "Academic team project. Individual module ownership is not assigned here pending confirmation.",
    "cardMedia": {
      "id": "bunhub-system",
      "src": "/media/projects/diagrams/bunhub-cover.svg",
      "alt": "Angular, Spring application services, PostgreSQL, RabbitMQ and observability with actual connections",
      "placeholder": "Angular, Spring application services, PostgreSQL, RabbitMQ and observability with actual connections",
      "caption": "System architecture illustration. The custom in-memory queue is distinct from RabbitMQ.",
      "fit": "contain"
    }
  },
  {
    "id": "space-shooter",
    "title": "Space Shooter",
    "category": "Games",
    "collection": "Graphics & Computer Vision",
    "featured": false,
    "summary": "A C++/SFML arcade shooter with a custom game loop, sprite animations, collision handling, enemy waves and particle effects.",
    "technologies": [
      "C++",
      "SFML",
      "Sprite animation",
      "Collision detection"
    ],
    "media": {
      "id": "space-shooter-cover",
      "src": "/media/projects/space-shooter/gameplay-poster.webp",
      "kind": "image",
      "alt": "Screenshot captured from the original Space Shooter game",
      "placeholder": "Space Shooter screenshot",
      "fit": "contain"
    },
    "details": [],
    "links": [
      {
        "label": "Source on GitHub",
        "url": "https://github.com/bgdj11/space-shooter"
      }
    ],
    "caseStudy": [
      {
        "heading": "Game Loop & Entity Updates",
        "paragraphs": [
          "SFML supplies the window, events, textures and drawing primitives. The C++ gameplay code implements a hand-written event/update/draw loop, updates entities and weapon timers, and renders a fixed logical view that preserves the play area as the window changes.",
          "Objects update and draw explicitly. Cached textures and sprite-sheet animation avoid duplicating image loading, while expired projectiles and effects are removed from their active collections."
        ],
        "navLabel": "Game loop",
        "source": {
          "label": "Game loop and rendering source",
          "url": "https://github.com/bgdj11/space-shooter/blob/066265014d20f28104ee271a4e8f0d12f05cbc56/SpaceShooter/Main.cpp"
        }
      },
      {
        "heading": "Gameplay",
        "paragraphs": [
          "Axis-aligned rectangle intersections connect projectiles, enemies and the player. Bullets, a laser, rockets and a timed shield have different durations and cooldowns; wave logic introduces regular enemies, bosses and asteroids.",
          "Sprite animation and particles expose impacts and destruction visually. Both recordings on this page are original game captures, not a browser recreation."
        ],
        "navLabel": "Gameplay",
        "media": [
          {
            "id": "space-shooter-gameplay",
            "src": "/media/projects/space-shooter/gameplay.webp",
            "poster": "/media/projects/space-shooter/gameplay-poster.webp",
            "kind": "gif",
            "alt": "Original Space Shooter gameplay with waves and weapon effects",
            "placeholder": "Original Space Shooter gameplay with waves and weapon effects",
            "fit": "contain",
            "caption": "Original gameplay recording: enemy waves and weapon effects."
          },
          {
            "id": "space-shooter-combat",
            "src": "/media/projects/space-shooter/combat.webp",
            "poster": "/media/projects/space-shooter/combat-poster.webp",
            "kind": "gif",
            "alt": "Space Shooter combat recording showing projectiles and effects",
            "caption": "Original second gameplay recording, optimized as animated WebP. Enemy waves, projectiles and impact effects are rendered by the desktop game.",
            "placeholder": "Space Shooter combat recording showing projectiles and effects",
            "fit": "contain"
          }
        ],
        "source": {
          "label": "Player controls and abilities",
          "url": "https://github.com/bgdj11/space-shooter/blob/066265014d20f28104ee271a4e8f0d12f05cbc56/SpaceShooter/Player.cpp"
        }
      },
      {
        "heading": "Scope & Implementation Limits",
        "paragraphs": [
          "This is a compact desktop game systems project, not a flagship research result. Bounding-box collisions trade precision for simplicity, and the entity loop is tailored to this game rather than a reusable engine.",
          "Controls: Left/J and Right/L move; Z/Y fires, C uses the laser, X launches a rocket and A activates the shield. The repository contains the Visual Studio project; no browser build or measured frame-rate benchmark is claimed."
        ],
        "navLabel": "Scope"
      }
    ],
    "cardMedia": {
      "id": "space-shooter-cover",
      "src": "/media/projects/space-shooter/gameplay-poster.webp",
      "kind": "image",
      "alt": "Screenshot captured from the original Space Shooter game",
      "placeholder": "Space Shooter screenshot",
      "fit": "contain"
    }
  }
]

function withDeploymentBase<T>(value: T): T {
  if (typeof value === 'string' && value.startsWith('/')) return publicAsset(value) as T
  if (Array.isArray(value)) return value.map(withDeploymentBase) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, withDeploymentBase(item)])) as T
  }
  return value
}

export const projects: Project[] = [...rawProjects, animationLab].map(withDeploymentBase)
