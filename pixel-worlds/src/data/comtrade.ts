import type { DetailBlock } from './portfolio'

export const comtradeDetails: DetailBlock[] = [
  { heading: 'About the Role', paragraphs: [
    'At Comtrade System Integration, I developed AI solutions spanning automated document processing, retrieval-augmented generation, real-time conversational agents and intelligent meeting assistants.',
    'A central part of my work was building an automated pipeline for processing documents in different formats, including PDF, Word, TXT and Markdown. It combined format-specific text extraction, Docling and OCR to prepare their contents for search and AI applications. I also worked on initial prototypes, LLM and speech model evaluation, conversation analytics and cloud deployment.',
  ] },
  { heading: 'No-Code Conversational AI Platform', paragraphs: [
    'Enterprise Voice Agent Platform for Contact Centers',
    'Worked in a four-person engineering team on a no-code platform designed to help large contact centers build, configure, and manage AI-powered voice agents without requiring programming knowledge.',
    "Following the team's initial concept discussions, I developed the first working prototype, helping transform the idea into a functional system and providing a starting point for further development.",
    'The platform allows non-technical users to visually construct conversation scenarios through reusable building blocks, connect knowledge bases, configure agent behavior, and analyze completed calls.',
    'Built around a modular architecture, it supports interchangeable Large Language Models (LLMs), Speech-to-Text (STT), and Text-to-Speech (TTS) providers, alongside real-time communication through LiveKit. This allows agents to be adapted to different use cases, languages, and infrastructure requirements.',
  ], subsections: [
    { heading: 'Initial Prototyping', paragraphs: ["Developed the first functional prototype, translating the team's initial concept into an interactive system and exploring its technical feasibility."] },
    { heading: 'Automated Knowledge Bases', paragraphs: ['Worked on document ingestion and knowledge-base functionality, enabling users to upload documents and make their contents accessible to conversational agents without manually configuring retrieval pipelines.'] },
    { heading: 'Conversation Analytics', paragraphs: ['Designed and developed comprehensive call analytics functionality, providing insights into completed conversations and allowing users to review interactions, analyze agent behavior, and evaluate performance. This was one of my main areas of responsibility throughout the project.'] },
    { heading: 'Serbian-Language Voice AI', paragraphs: ['Worked on adapting conversational agents for Serbian-speaking users, researching and evaluating STT and TTS solutions, including smaller and locally hosted speech models, custom voice options, and voice cloning capabilities.'] },
    { heading: 'Agent Configuration & Guardrails', paragraphs: ['Implemented configurable restrictions and behavioral controls to help agents follow predefined conversation scenarios, respect operational boundaries, and handle unexpected situations.'] },
    { heading: 'Visual Agent Builder', paragraphs: ['Contributed to the React-based interface that allows users to construct conversation scenarios and configure agents through visual building blocks.'] },
    { heading: 'Platform Capabilities', items: [
      'No-code creation and configuration of conversational AI agents',
      'Visual scenario and conversation flow building',
      'Provider-agnostic integration of LLM, STT, and TTS services',
      'Real-time voice communication using LiveKit',
      'Automated document-based knowledge bases',
      'Serbian-language speech support and voice customization',
      'Configurable agent behavior and operational restrictions',
      'Detailed conversation history, analytics, and performance insights',
      'Azure-based cloud infrastructure',
    ] },
    { heading: 'Technologies', paragraphs: ['Python, React, Microsoft Azure, Docker, LiveKit, LLMs, RAG, STT, TTS, Voice Cloning'] },
  ] },
  { heading: 'Automated Document Processing & RAG', paragraphs: [
    'From PDF, Word, TXT and Markdown to Searchable Knowledge',
    'Built an automated document-processing pipeline that combined different text-extraction approaches for different file formats. Docling, format-specific parsing and OCR made document content available for indexing and retrieval.',
    'These systems were developed for document-heavy environments, including legal, HR, military, and regulatory domains, where retrieval accuracy, data security, and reliable responses are especially important.',
    'My work connected document ingestion and extraction with preprocessing, chunking, indexing and retrieval. I also evaluated language and embedding models and improved search relevance through hybrid retrieval and semantic reranking.',
  ], subsections: [
    { heading: 'Automated Document Processing', paragraphs: ['Developed a pipeline for heterogeneous documents, including PDF, Word, plain text and Markdown. Combined format-specific text extraction, Docling document parsing and OCR for scanned content, preparing extracted text for downstream indexing and retrieval.'] },
    { heading: 'End-to-End RAG Architecture', paragraphs: ['Architected retrieval pipelines spanning document ingestion, preprocessing, indexing, retrieval, response generation, and observability, supporting both Azure-hosted and on-premises environments.'] },
    { heading: 'Advanced Information Retrieval', paragraphs: ['Improved retrieval quality through hybrid search, semantic reranking, and semantic chunking, adapting retrieval strategies to complex, domain-specific document collections.'] },
    { heading: 'Grounding & Hallucination Prevention', paragraphs: ['Designed guardrails using context grounding, confidence-based routing, and structured fallback strategies to improve response reliability and reduce unsupported answers.'] },
    { heading: 'Model Evaluation & Benchmarking', paragraphs: ['Evaluated LLMs and embedding models on multilingual and domain-specific datasets, including Serbian-language retrieval benchmarks, to select models suited to production requirements.'] },
    { heading: 'Cloud & On-Premises Deployment', paragraphs: ['Worked with containerized AI services using Docker and Azure infrastructure, including Azure Container Apps, App Service, and Functions.'] },
    { heading: 'Technologies', paragraphs: ['Python, Docling, OCR, Azure AI Services, RAG, LLMs, Embedding Models, Hybrid Search, Semantic Reranking, Docker'] },
  ] },
  { heading: 'Microsoft Teams AI Meeting Assistant', paragraphs: [
    'Internal Project — Context-Aware Meeting Intelligence',
    'Contributed to the development of an internal AI assistant designed to participate in Microsoft Teams meetings, follow conversations, and help participants stay aligned with their planned discussion topics.',
    'Unlike a conventional transcription tool, the assistant could use a predefined meeting agenda to track which subjects had been covered and identify topics that might have been overlooked.',
    'Participants could interact with the assistant during an ongoing meeting, asking questions about the conversation, checking whether specific topics had been discussed, or requesting a summary of missing agenda items.',
    'The project explored how language models could move beyond passive transcription toward more interactive, context-aware meeting assistance.',
  ], subsections: [
    { heading: 'Key Features', items: ['Automatic meeting attendance and conversation transcription', 'Agenda-aware tracking of discussed and skipped topics', 'Interactive questions about an ongoing meeting', 'LLM-based interpretation of conversation context', 'Contextual assistance for keeping meetings focused and organized'] },
    { heading: 'Technologies', paragraphs: ['Python, LLMs, Speech-to-Text, Microsoft Teams Integration'] },
  ] },
  { heading: 'Technologies & Tools', subsections: [
    { heading: 'Languages & Development', items: ['Python', 'C#', 'Angular', 'React'] },
    { heading: 'Artificial Intelligence & Document Processing', items: ['Large Language Models (LLMs)', 'Retrieval-Augmented Generation (RAG)', 'Embedding Models', 'Hybrid Search & Semantic Reranking', 'Automated Document Processing', 'Docling', 'OCR', 'Model Evaluation & Benchmarking'] },
    { heading: 'Conversational & Speech AI', items: ['LiveKit', 'Speech-to-Text (STT)', 'Text-to-Speech (TTS)', 'Voice Cloning', 'Real-Time Conversational AI'] },
    { heading: 'Cloud & Infrastructure', items: ['Microsoft Azure', 'Azure Container Apps', 'Azure App Service', 'Azure Functions', 'Docker'] },
  ] },
]
