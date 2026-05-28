import { useEffect, useRef, useState } from 'react'
import aiNews from './data/ai-news.json'

const CATEGORIES = ['All', 'Writing', 'Image', 'Video', 'Coding', 'Productivity', 'Automation', 'Research']

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://www.aitoolscenter.in').replace(/\/$/, '')
const ADS_APPROVED = String(import.meta.env.VITE_ADS_APPROVED || '').toLowerCase() === 'true'

const TOOLS = [
  {
    name: 'ChatGPT',
    category: 'Writing',
    tagline: 'Conversational AI for writing, research, and coding help.',
    link: 'https://chat.openai.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['GPT-4o', 'Chatbot', 'Writing'],
  },
  {
    name: 'Claude',
    category: 'Writing',
    tagline: 'Long-context AI assistant great for analysis and documents.',
    link: 'https://claude.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Anthropic', 'Analysis', 'Documents'],
  },
  {
    name: 'Gemini',
    category: 'Research',
    tagline: 'Google AI that connects with Search, Docs, and Gmail.',
    link: 'https://gemini.google.com',
    badge: 'Free',
    rating: 4,
    tags: ['Google', 'Search', 'Multimodal'],
  },
  {
    name: 'Midjourney',
    category: 'Image',
    tagline: 'World-class AI image generation via Discord or web.',
    link: 'https://midjourney.com',
    badge: 'Paid',
    rating: 5,
    tags: ['Art', 'Creative', 'Design'],
  },
  {
    name: 'DALL·E 3',
    category: 'Image',
    tagline: 'OpenAI image generator integrated directly into ChatGPT.',
    link: 'https://openai.com/dall-e-3',
    badge: 'Pro',
    rating: 4,
    tags: ['OpenAI', 'Illustrations', 'Prompting'],
  },
  {
    name: 'Stable Diffusion',
    category: 'Image',
    tagline: 'Open-source model for local or cloud image generation.',
    link: 'https://stability.ai',
    badge: 'Free',
    rating: 4,
    tags: ['Open Source', 'Local', 'Custom'],
  },
  {
    name: 'GitHub Copilot',
    category: 'Coding',
    tagline: 'AI pair programmer inside VS Code, JetBrains, and more.',
    link: 'https://github.com/features/copilot',
    badge: 'Paid',
    rating: 5,
    tags: ['Coding', 'IDE', 'Autocomplete'],
    affiliateProgram: 'https://github.com/features/copilot',
  },
  {
    name: 'Cursor',
    category: 'Coding',
    tagline: 'AI-first code editor built for fast, context-aware development.',
    link: 'https://cursor.sh',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Editor', 'AI', 'Codebase'],
  },
  {
    name: 'Tabnine',
    category: 'Coding',
    tagline: 'Privacy-focused AI code completion for any IDE.',
    link: 'https://tabnine.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Autocomplete', 'Privacy', 'IDE'],
    affiliateProgram: 'https://tabnine.com/affiliates',
  },
  {
    name: 'Runway',
    category: 'Video',
    tagline: 'AI video generation, editing, and motion tools in the browser.',
    link: 'https://runwayml.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Video Gen', 'Editing', 'Motion'],
    affiliateProgram: 'https://runwayml.com/affiliates',
  },
  {
    name: 'Sora',
    category: 'Video',
    tagline: "OpenAI's text-to-video model for cinematic AI clips.",
    link: 'https://sora.com',
    badge: 'Pro',
    rating: 5,
    tags: ['Text-to-Video', 'OpenAI', 'Cinematic'],
  },
  {
    name: 'Notion AI',
    category: 'Productivity',
    tagline: 'AI writing and summarization built into Notion workspaces.',
    link: 'https://notion.so/product/ai',
    badge: 'Add-on',
    rating: 4,
    tags: ['Notes', 'Summary', 'Writing'],
    affiliateProgram: 'https://affiliate.notion.so/',
  },
  {
    name: 'Zapier AI',
    category: 'Automation',
    tagline: 'No-code AI automations that connect 6,000+ apps.',
    link: 'https://zapier.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['No-Code', 'Workflows', 'Integrations'],
    affiliateProgram: 'https://zapier.com/affiliate',
  },
  {
    name: 'Make (Integromat)',
    category: 'Automation',
    tagline: 'Visual drag-and-drop automation with advanced AI steps.',
    link: 'https://make.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Visual', 'Workflows', 'No-Code'],
    affiliateProgram: 'https://www.make.com/en/affiliate-program',
  },
  {
    name: 'Perplexity',
    category: 'Research',
    tagline: 'AI search engine that cites real-time web sources.',
    link: 'https://perplexity.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Search', 'Citations', 'Real-Time'],
    affiliateProgram: 'https://perplexity.ai/pro',
  },
  {
    name: 'Microsoft Copilot',
    category: 'Productivity',
    tagline: 'Assistant integrated with Microsoft apps for writing and planning.',
    link: 'https://copilot.microsoft.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Microsoft', 'Assistant', 'Office'],
  },
  {
    name: 'Jasper',
    category: 'Writing',
    tagline: 'Brand-focused AI writing platform for teams and marketers.',
    link: 'https://www.jasper.ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Marketing', 'Copywriting', 'Brand Voice'],
  },
  {
    name: 'Writesonic',
    category: 'Writing',
    tagline: 'AI writer for blogs, landing pages, and SEO content drafts.',
    link: 'https://writesonic.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['SEO', 'Blogs', 'Copywriting'],
  },
  {
    name: 'Copy.ai',
    category: 'Writing',
    tagline: 'Go-to-market writing and workflow automation for sales content.',
    link: 'https://www.copy.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Sales', 'Content', 'Automation'],
  },
  {
    name: 'Grammarly',
    category: 'Writing',
    tagline: 'Writing assistant for grammar, clarity, and tone improvement.',
    link: 'https://www.grammarly.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Grammar', 'Editing', 'Tone'],
  },
  {
    name: 'QuillBot',
    category: 'Writing',
    tagline: 'Paraphrasing and rewriting assistant for faster edits.',
    link: 'https://quillbot.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Paraphrase', 'Rewrite', 'Academic'],
  },
  {
    name: 'Wordtune',
    category: 'Writing',
    tagline: 'Sentence-level rewrite suggestions for cleaner communication.',
    link: 'https://www.wordtune.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Rewrite', 'Clarity', 'Email'],
  },
  {
    name: 'Canva AI',
    category: 'Image',
    tagline: 'Design assistant with AI image generation and layout support.',
    link: 'https://www.canva.com/ai-image-generator/',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Design', 'Templates', 'Image Gen'],
  },
  {
    name: 'Adobe Firefly',
    category: 'Image',
    tagline: 'Creative generative AI for text-to-image and visual edits.',
    link: 'https://firefly.adobe.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Adobe', 'Image Gen', 'Creative'],
  },
  {
    name: 'Leonardo AI',
    category: 'Image',
    tagline: 'Image generation platform for concepts, assets, and game art.',
    link: 'https://leonardo.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Art', 'Assets', 'Generation'],
  },
  {
    name: 'Ideogram',
    category: 'Image',
    tagline: 'Text-forward image model known for high-quality typography.',
    link: 'https://ideogram.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Typography', 'Posters', 'Image Gen'],
  },
  {
    name: 'Playground AI',
    category: 'Image',
    tagline: 'AI image creation and editing workspace for social creatives.',
    link: 'https://playground.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Editing', 'Social', 'Image Gen'],
  },
  {
    name: 'Pixlr AI',
    category: 'Image',
    tagline: 'Browser-based photo tools with AI enhancements and effects.',
    link: 'https://pixlr.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Photo', 'Editing', 'Browser'],
  },
  {
    name: 'Remove.bg',
    category: 'Image',
    tagline: 'One-click background removal for ecommerce and design workflows.',
    link: 'https://www.remove.bg',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Background', 'Photos', 'Ecommerce'],
  },
  {
    name: 'Pika',
    category: 'Video',
    tagline: 'Prompt-driven video generation and stylized clip editing.',
    link: 'https://pika.art',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Editing', 'Prompt'],
  },
  {
    name: 'Luma Dream Machine',
    category: 'Video',
    tagline: 'Fast AI video model for cinematic motion and scenes.',
    link: 'https://lumalabs.ai/dream-machine',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Cinematic', 'Luma'],
  },
  {
    name: 'Synthesia',
    category: 'Video',
    tagline: 'Avatar-based video generation for training and explainers.',
    link: 'https://www.synthesia.io',
    badge: 'Paid',
    rating: 4,
    tags: ['Avatars', 'Training', 'Voiceover'],
  },
  {
    name: 'InVideo AI',
    category: 'Video',
    tagline: 'Text-to-video workflows for social media and marketing teams.',
    link: 'https://invideo.io/ai/',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Text-to-Video', 'Marketing', 'Social'],
  },
  {
    name: 'Descript',
    category: 'Video',
    tagline: 'Edit video and podcasts by editing text transcripts.',
    link: 'https://www.descript.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Podcast', 'Editing', 'Transcription'],
  },
  {
    name: 'VEED',
    category: 'Video',
    tagline: 'Online video editor with AI subtitling and repurposing tools.',
    link: 'https://www.veed.io',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Subtitles', 'Editing', 'Shorts'],
  },
  {
    name: 'CapCut',
    category: 'Video',
    tagline: 'AI-assisted video editor popular for short-form content.',
    link: 'https://www.capcut.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Short Video', 'Editing', 'Creators'],
  },
  {
    name: 'Codeium',
    category: 'Coding',
    tagline: 'AI coding assistant with autocomplete and chat in popular IDEs.',
    link: 'https://codeium.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Autocomplete', 'IDE', 'Chat'],
  },
  {
    name: 'Replit AI',
    category: 'Coding',
    tagline: 'Cloud coding workspace with integrated AI assistance.',
    link: 'https://replit.com/ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Cloud IDE', 'Assistant', 'Code'],
  },
  {
    name: 'Amazon CodeWhisperer',
    category: 'Coding',
    tagline: 'AWS coding assistant for secure code suggestions.',
    link: 'https://aws.amazon.com/codewhisperer/',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['AWS', 'Security', 'Coding'],
  },
  {
    name: 'Sourcegraph Cody',
    category: 'Coding',
    tagline: 'Codebase-aware AI assistant for enterprise development teams.',
    link: 'https://sourcegraph.com/cody',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Codebase', 'Enterprise', 'Assistant'],
  },
  {
    name: 'Phind',
    category: 'Coding',
    tagline: 'Developer search and answer engine for technical questions.',
    link: 'https://www.phind.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Search', 'Developers', 'Answers'],
  },
  {
    name: 'ClickUp Brain',
    category: 'Productivity',
    tagline: 'AI assistant for tasks, docs, and team planning workflows.',
    link: 'https://clickup.com/ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Tasks', 'Planning', 'Teams'],
  },
  {
    name: 'Otter.ai',
    category: 'Productivity',
    tagline: 'Meeting transcription with AI summaries and action items.',
    link: 'https://otter.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Meetings', 'Transcription', 'Notes'],
  },
  {
    name: 'Tome',
    category: 'Productivity',
    tagline: 'AI storytelling and presentation builder for fast decks.',
    link: 'https://tome.app',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Presentations', 'Storytelling', 'Slides'],
  },
  {
    name: 'Gamma',
    category: 'Productivity',
    tagline: 'AI-first docs and presentations with modern layouts.',
    link: 'https://gamma.app',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Docs', 'Presentations', 'AI'],
  },
  {
    name: 'HubSpot AI',
    category: 'Productivity',
    tagline: 'CRM-integrated AI for sales, support, and marketing tasks.',
    link: 'https://www.hubspot.com/products/ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['CRM', 'Sales', 'Marketing'],
  },
  {
    name: 'Elicit',
    category: 'Research',
    tagline: 'Research assistant for literature review and evidence finding.',
    link: 'https://elicit.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Papers', 'Evidence', 'Research'],
  },
  {
    name: 'Consensus',
    category: 'Research',
    tagline: 'Search engine for scientific papers with AI summaries.',
    link: 'https://consensus.app',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Science', 'Search', 'Summaries'],
  },
  {
    name: 'scite',
    category: 'Research',
    tagline: 'Citation analysis platform for stronger evidence-based writing.',
    link: 'https://scite.ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Citations', 'Evidence', 'Academic'],
  },
  {
    name: 'NotebookLM',
    category: 'Research',
    tagline: 'Google research notebook assistant grounded in your sources.',
    link: 'https://notebooklm.google.com',
    badge: 'Free',
    rating: 4,
    tags: ['Sources', 'Notes', 'Google'],
  },
  {
    name: 'n8n',
    category: 'Automation',
    tagline: 'Workflow automation platform with self-host and cloud options.',
    link: 'https://n8n.io',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Workflows', 'Integrations', 'No-Code'],
  },
  {
    name: 'Bardeen',
    category: 'Automation',
    tagline: 'Browser automation for repetitive tasks and lead workflows.',
    link: 'https://www.bardeen.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Browser', 'Automations', 'Productivity'],
  },
  {
    name: 'Airtable AI',
    category: 'Automation',
    tagline: 'Database workflows with embedded AI fields and automations.',
    link: 'https://www.airtable.com/product/ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Database', 'Automation', 'Ops'],
  },
  {
    name: 'Flowise',
    category: 'Automation',
    tagline: 'Visual builder for LLM apps, chains, and AI workflows.',
    link: 'https://flowiseai.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['LLM', 'Workflow', 'Builder'],
  },
  {
    name: 'LangChain',
    category: 'Automation',
    tagline: 'Framework and tooling for building AI agents and pipelines.',
    link: 'https://www.langchain.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Agents', 'Framework', 'Pipelines'],
  },
  {
    name: 'ElevenLabs',
    category: 'Productivity',
    tagline: 'AI voice generation and text-to-speech for natural audio creation.',
    link: 'https://elevenlabs.io',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Text-to-Speech', 'Voice', 'Audio'],
  },
  {
    name: 'Replit AI',
    category: 'Coding',
    tagline: 'AI-powered IDE for writing, debugging, and deploying code instantly.',
    link: 'https://replit.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['IDE', 'Code Editor', 'Deployment'],
  },
  {
    name: 'Leonardo AI',
    category: 'Image',
    tagline: 'Professional AI image generation platform for creators and designers.',
    link: 'https://leonardo.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Image Gen', 'Art', 'Design'],
  },
  {
    name: 'Hugging Face',
    category: 'Research',
    tagline: 'Open-source hub for machine learning models and collaborative AI development.',
    link: 'https://huggingface.co',
    badge: 'Free',
    rating: 5,
    tags: ['Models', 'Open Source', 'ML'],
  },
  {
    name: 'Synthesia',
    category: 'Video',
    tagline: 'Create professional AI videos with avatar presenters in minutes.',
    link: 'https://www.synthesia.io',
    badge: 'Paid',
    rating: 4,
    tags: ['Video Gen', 'Avatar', 'Marketing'],
  },
  {
    name: 'Descript',
    category: 'Video',
    tagline: 'AI-powered video and audio editor that works like a document editor.',
    link: 'https://www.descript.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Video Edit', 'Podcast', 'Captions'],
  },
  {
    name: 'n8n',
    category: 'Automation',
    tagline: 'Fair-code workflow automation platform with unlimited customization.',
    link: 'https://n8n.io',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Workflow', 'Open Source', 'Integration'],
  },
  {
    name: 'Consensus',
    category: 'Research',
    tagline: 'Search peer-reviewed research with AI-powered synthesis and citations.',
    link: 'https://consensus.app',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Research', 'Academic', 'Studies'],
  },
  {
    name: 'HeyGen',
    category: 'Video',
    tagline: 'Create engaging videos with AI avatars and realistic voice synthesis.',
    link: 'https://www.heygen.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Avatar', 'Voices'],
  },
  {
    name: 'Pixlr',
    category: 'Image',
    tagline: 'AI-powered photo editor for quick professional image enhancements.',
    link: 'https://pixlr.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Photo Edit', 'Design', 'Effects'],
  },
  {
    name: 'Ideogram',
    category: 'Image',
    tagline: 'AI image generator specializing in text rendering and graphic design.',
    link: 'https://www.ideogram.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Image Gen', 'Text', 'Design'],
  },
  {
    name: 'Upscayl',
    category: 'Image',
    tagline: 'Open-source AI image upscaler for enhancing low-resolution images.',
    link: 'https://www.upscayl.org',
    badge: 'Free',
    rating: 4,
    tags: ['Upscaler', 'Open Source', 'Image'],
  },
  {
    name: 'Jasper AI',
    category: 'Writing',
    tagline: 'AI copywriting tool for marketing, sales, and content creation.',
    link: 'https://www.jasper.ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Copywriting', 'Marketing', 'Content'],
  },
  {
    name: 'QuillBot',
    category: 'Writing',
    tagline: 'AI paraphrasing and grammar checking for better writing.',
    link: 'https://quillbot.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Paraphrasing', 'Grammar', 'Writing'],
  },
  {
    name: 'Hemingway Editor',
    category: 'Writing',
    tagline: 'AI editor that makes your writing bold and clear.',
    link: 'https://hemingwayapp.com',
    badge: 'Freemium',
    rating: 4,
    tags: ['Writing', 'Editing', 'Style'],
  },
  {
    name: 'Rytr',
    category: 'Writing',
    tagline: 'AI writing assistant for content, emails, and social media.',
    link: 'https://rytr.me',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Content', 'Email', 'Social Media'],
  },
  {
    name: 'Beautiful.ai',
    category: 'Productivity',
    tagline: 'AI-powered presentation maker with smart design assistance.',
    link: 'https://www.beautiful.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Presentations', 'Design', 'Slides'],
  },
  {
    name: 'Tome',
    category: 'Productivity',
    tagline: 'AI storyteller for creating beautiful presentations and documents.',
    link: 'https://tome.app',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Presentations', 'Stories', 'Documents'],
  },
  {
    name: 'Gamma.app',
    category: 'Productivity',
    tagline: 'Create beautiful presentations, doc and webpages with AI.',
    link: 'https://gamma.app',
    badge: 'Freemium',
    rating: 4,
    tags: ['Presentations', 'Docs', 'Webpages'],
  },
  {
    name: 'ChatSonic',
    category: 'Writing',
    tagline: 'AI chatbot powered by ChatGPT with real-time information.',
    link: 'https://www.chatsonic.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Chatbot', 'Writing', 'Content'],
  },
  {
    name: 'Copy.ai',
    category: 'Writing',
    tagline: 'AI copywriting for marketing, emails, and ads.',
    link: 'https://copy.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Copywriting', 'Marketing', 'Ads'],
  },
  {
    name: 'Pika',
    category: 'Video',
    tagline: 'AI video generator for creating animation and text-to-video.',
    link: 'https://pika.art',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Animation', 'Text-to-Video'],
  },
  {
    name: 'CapCut',
    category: 'Video',
    tagline: 'Free video editor with AI features for cutting, effects, and music.',
    link: 'https://www.capcut.com',
    badge: 'Free',
    rating: 4,
    tags: ['Video Edit', 'Effects', 'Music'],
  },
  {
    name: 'Filmora',
    category: 'Video',
    tagline: 'AI-powered video editor with effects and automation tools.',
    link: 'https://filmora.wondershare.com',
    badge: 'Freemium',
    rating: 4,
    tags: ['Video Edit', 'Effects', 'AI Tools'],
  },
  {
    name: 'InVideo',
    category: 'Video',
    tagline: 'AI video creation tool for YouTube, TikTok, and social media.',
    link: 'https://invideo.io',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Social Media', 'YouTube'],
  },
  {
    name: 'Synthesia',
    category: 'Video',
    tagline: 'Create AI videos with virtual presenters without cameras.',
    link: 'https://www.synthesia.io',
    badge: 'Paid',
    rating: 4,
    tags: ['Video Gen', 'Avatar', 'Presenters'],
  },
  {
    name: 'Stability AI',
    category: 'Image',
    tagline: 'Open-source AI image generation for unlimited creativity.',
    link: 'https://stability.ai',
    badge: 'Free',
    rating: 4,
    tags: ['Image Gen', 'Open Source', 'Creative'],
  },
  {
    name: 'DreamStudio',
    category: 'Image',
    tagline: 'Web UI for AI image generation powered by Stable Diffusion.',
    link: 'https://dreamstudio.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Image Gen', 'Art', 'Creative'],
  },
  {
    name: 'Artflow',
    category: 'Image',
    tagline: 'AI art generator for creating digital artwork quickly.',
    link: 'https://www.artflow.ai',
    badge: 'Free + Premium',
    rating: 4,
    tags: ['Art', 'Image Gen', 'Creative'],
  },
  {
    name: 'Remove.bg',
    category: 'Image',
    tagline: 'AI background remover for photos with one click.',
    link: 'https://www.remove.bg',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Image Edit', 'Background', 'Photos'],
  },
  {
    name: 'Photoshop Generative Fill',
    category: 'Image',
    tagline: 'Adobe Photoshop with AI-powered generative fill capabilities.',
    link: 'https://www.adobe.com/products/photoshop.html',
    badge: 'Paid',
    rating: 5,
    tags: ['Image Edit', 'AI', 'Professional'],
  },
  {
    name: 'Runway Gen-2',
    category: 'Video',
    tagline: 'Text-to-video AI generator with professional quality output.',
    link: 'https://runwayml.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', '3D', 'Creative'],
  },
  {
    name: 'Pika 1.0',
    category: 'Video',
    tagline: 'Real-time video generation from prompts and images.',
    link: 'https://pika.art',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Text-to-Video', 'Real-time'],
  },
  {
    name: 'Fliki',
    category: 'Video',
    tagline: 'AI video creator with realistic voices and subtitles.',
    link: 'https://fliki.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Voice', 'Subtitles'],
  },
  {
    name: 'D-ID',
    category: 'Video',
    tagline: 'Create talking head videos from images with AI.',
    link: 'https://www.d-id.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Video Gen', 'Avatar', 'Talking Head'],
  },
  {
    name: 'Tabby',
    category: 'Coding',
    tagline: 'Self-hosted alternative to GitHub Copilot for code completion.',
    link: 'https://www.tabbyml.com',
    badge: 'Free',
    rating: 4,
    tags: ['Coding', 'Code Complete', 'Open Source'],
  },
  {
    name: 'CodeWhisperer',
    category: 'Coding',
    tagline: 'AWS CodeWhisperer for ML-powered code generation.',
    link: 'https://aws.amazon.com/codewhisperer/',
    badge: 'Free',
    rating: 4,
    tags: ['Coding', 'AWS', 'Code Gen'],
  },
  {
    name: 'Codium AI',
    category: 'Coding',
    tagline: 'AI-powered code testing and analysis tool.',
    link: 'https://www.codium.ai',
    badge: 'Free',
    rating: 4,
    tags: ['Testing', 'Code Analysis', 'QA'],
  },
  {
    name: 'Sourcegrade',
    category: 'Coding',
    tagline: 'AI code review and analysis for software teams.',
    link: 'https://sourcegrade.com',
    badge: 'Paid',
    rating: 4,
    tags: ['Code Review', 'Analysis', 'Teams'],
  },
  {
    name: 'Phind',
    category: 'Research',
    tagline: 'AI search engine for developers and technical research.',
    link: 'https://www.phind.com',
    badge: 'Free',
    rating: 4,
    tags: ['Search', 'Research', 'Coding'],
  },
  {
    name: 'Elicit',
    category: 'Research',
    tagline: 'AI research assistant for literature review and synthesis.',
    link: 'https://elicit.org',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Research', 'Literature Review', 'Academic'],
  },
  {
    name: 'Scite',
    category: 'Research',
    tagline: 'AI-powered platform for discovering research papers intelligently.',
    link: 'https://scite.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Research', 'Papers', 'Academic'],
  },
  {
    name: 'SciSpace',
    category: 'Research',
    tagline: 'AI copilot for research paper reading and understanding.',
    link: 'https://typeset.io',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Research', 'Papers', 'Reading'],
  },
  {
    name: 'Wolfram Alpha',
    category: 'Research',
    tagline: 'Computational intelligence engine for factual queries.',
    link: 'https://www.wolframalpha.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Search', 'Math', 'Facts'],
  },
  {
    name: 'Bardeen AI',
    category: 'Automation',
    tagline: 'No-code automation platform for browser tasks.',
    link: 'https://www.bardeen.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Automation', 'No-code', 'Browser'],
  },
  {
    name: 'RPA Express',
    category: 'Automation',
    tagline: 'Robotic process automation with AI capabilities.',
    link: 'https://www.rpa-express.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['RPA', 'Automation', 'Business'],
  },
  {
    name: 'Process Street',
    category: 'Automation',
    tagline: 'Workflow management platform with AI assistance.',
    link: 'https://www.process.st',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Workflow', 'Automation', 'Processes'],
  },
  {
    name: 'Airtable AI',
    category: 'Productivity',
    tagline: 'Airtable with AI features for database automation.',
    link: 'https://airtable.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Database', 'AI', 'Automation'],
  },
  {
    name: 'Sheet+',
    category: 'Productivity',
    tagline: 'AI-powered Google Sheets extension for formulas and data.',
    link: 'https://www.sheetplus.ai',
    badge: 'Freemium',
    rating: 4,
    tags: ['Sheets', 'AI', 'Productivity'],
  },
  {
    name: 'Otter Voice Notes',
    category: 'Productivity',
    tagline: 'AI transcription and meeting notes for meetings and calls.',
    link: 'https://otter.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Transcription', 'Notes', 'Meetings'],
  },
  {
    name: 'Notta',
    category: 'Productivity',
    tagline: 'AI meeting transcription and summary tool.',
    link: 'https://www.notta.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Transcription', 'Meetings', 'AI'],
  },
  {
    name: 'Read&Write',
    category: 'Productivity',
    tagline: 'AI reading and writing support for accessibility.',
    link: 'https://www.texthelp.com/en-us/products/read-write',
    badge: 'Paid',
    rating: 4,
    tags: ['Accessibility', 'Reading', 'Writing'],
  },
  {
    name: 'Dyslexia-friendly Font',
    category: 'Productivity',
    tagline: 'AI-powered reading assistance for dyslexia support.',
    link: 'https://www.opendyslexic.org',
    badge: 'Free',
    rating: 4,
    tags: ['Accessibility', 'Font', 'Dyslexia'],
  },
  {
    name: 'MeetGeek',
    category: 'Productivity',
    tagline: 'AI meeting assistant that records, transcribes, and summarizes.',
    link: 'https://www.meetgeek.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Meetings', 'Transcription', 'AI'],
  },
  {
    name: 'Mem',
    category: 'Productivity',
    tagline: 'AI-powered note-taking and knowledge manager.',
    link: 'https://mem.ai',
    badge: 'Free + Premium',
    rating: 4,
    tags: ['Notes', 'Knowledge', 'AI'],
  },
  {
    name: 'Sudowrite',
    category: 'Writing',
    tagline: 'AI creative writing tool for novels and stories.',
    link: 'https://www.sudowrite.com',
    badge: 'Paid',
    rating: 4,
    tags: ['Writing', 'Creative', 'Fiction'],
  },
  {
    name: 'Jasper Stories',
    category: 'Writing',
    tagline: 'AI storytelling assistant for content creators.',
    link: 'https://www.jasper.ai',
    badge: 'Paid',
    rating: 4,
    tags: ['Writing', 'Stories', 'Content'],
  },
  {
    name: 'Booking.ai',
    category: 'Productivity',
    tagline: 'AI chatbot for booking appointments and scheduling.',
    link: 'https://booking.ai',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Chatbot', 'Booking', 'Scheduling'],
  },
  {
    name: 'HubSpot AI',
    category: 'Productivity',
    tagline: 'AI-powered CRM content assistant for marketing and sales.',
    link: 'https://www.hubspot.com',
    badge: 'Free + Paid',
    rating: 4,
    tags: ['CRM', 'Marketing', 'Sales'],
  },
  {
    name: 'Salesforce Einstein',
    category: 'Productivity',
    tagline: 'AI assistant for Salesforce CRM and business intelligence.',
    link: 'https://www.salesforce.com/products/ai/einstein-generative-ai-features/',
    badge: 'Paid',
    rating: 4,
    tags: ['CRM', 'AI', 'Business'],
  },
]

// Curated YouTube tutorials for AI tools
const YOUTUBE_TUTORIALS = [
  {
    id: 'chatgpt-beginner',
    title: 'ChatGPT for Beginners - Complete Guide',
    channel: 'TechWithTim',
    tools: ['ChatGPT'],
    category: 'Getting Started',
    description: 'Complete introduction to ChatGPT covering prompting techniques, use cases, and productivity hacks.',
    videoId: '2BxqYCAEJrY',
    duration: '15:42',
  },
  {
    id: 'chatgpt-advanced',
    title: 'Advanced ChatGPT Prompting Techniques',
    channel: 'DataScience',
    tools: ['ChatGPT'],
    category: 'Advanced',
    description: 'Learn system prompts, chain-of-thought reasoning, and professional ChatGPT workflows.',
    videoId: 'RYwj0n9_hfI',
    duration: '22:15',
  },
  {
    id: 'midjourney-intro',
    title: 'Midjourney AI Art Guide - Zero to Hero',
    channel: 'ArtByAI',
    tools: ['Midjourney'],
    category: 'Image Generation',
    description: 'Step-by-step tutorial on using Midjourney to create stunning AI artwork from text prompts.',
    videoId: '5H0L-3Kqk3I',
    duration: '28:00',
  },
  {
    id: 'midjourney-advanced',
    title: 'Professional Midjourney Techniques',
    channel: 'DesignThinking',
    tools: ['Midjourney'],
    category: 'Image Generation',
    description: 'Advanced composition, style, and quality parameters for production-ready Midjourney images.',
    videoId: 'JKLtOvpT8rU',
    duration: '31:45',
  },
  {
    id: 'dalle3-tutorial',
    title: 'DALL-E 3 Complete Tutorial',
    channel: 'CreativeAI',
    tools: ['DALL·E 3'],
    category: 'Image Generation',
    description: 'Learn to generate high-quality images with DALL-E 3 inside ChatGPT Pro.',
    videoId: 'Lc5TnpIqL4s',
    duration: '18:30',
  },
  {
    id: 'github-copilot-basics',
    title: 'GitHub Copilot Tutorial - Code Faster',
    channel: 'WebDev',
    tools: ['GitHub Copilot'],
    category: 'Coding',
    description: 'Introduction to GitHub Copilot for VS Code, including setup and practical coding examples.',
    videoId: 'bphIXmpqPXg',
    duration: '16:22',
  },
  {
    id: 'github-copilot-advanced',
    title: 'Advanced GitHub Copilot Workflows',
    channel: 'DevOpsDaily',
    tools: ['GitHub Copilot'],
    category: 'Coding',
    description: 'Multi-file context, chat features, and enterprise GitHub Copilot setup.',
    videoId: 'XW1Qo1FVXzQ',
    duration: '24:18',
  },
  {
    id: 'cursor-editor',
    title: 'Cursor AI Editor - The Future of Coding',
    channel: 'CodeWithCursor',
    tools: ['Cursor'],
    category: 'Coding',
    description: 'Deep dive into Cursor editor features, composer mode, and AI-first development workflow.',
    videoId: 'WxY4J8d0RBE',
    duration: '26:40',
  },
  {
    id: 'claude-writing',
    title: 'Claude 3 for Professional Writing',
    channel: 'WritingAssistant',
    tools: ['Claude'],
    category: 'Writing',
    description: 'Using Claude for long-form writing, editing, and complex analysis tasks.',
    videoId: 'o1XvBiTBJEw',
    duration: '19:50',
  },
  {
    id: 'gemini-productivity',
    title: 'Google Gemini for Productivity',
    channel: 'GoogleAI',
    tools: ['Gemini'],
    category: 'Productivity',
    description: 'Integration with Google Workspace, search, and collaborative workflows.',
    videoId: 'i-tLrPuFMYE',
    duration: '15:45',
  },
  {
    id: 'runway-video-ai',
    title: 'Runway AI - Create Videos with AI',
    channel: 'VideoAI',
    tools: ['Runway'],
    category: 'Video Generation',
    description: 'Complete Runway tutorial covering generation, editing, and motion synthesis tools.',
    videoId: 'gdbFGlBh_oE',
    duration: '32:10',
  },
  {
    id: 'perplexity-search',
    title: 'Perplexity AI Search - Find Answers Faster',
    channel: 'ResearchTools',
    tools: ['Perplexity'],
    category: 'Research',
    description: 'Using Perplexity for researched answers with citations and sources.',
    videoId: '3XvZ1SfvDh4',
    duration: '12:30',
  },
  {
    id: 'notion-ai',
    title: 'Notion AI - Supercharge Your Workspace',
    channel: 'NotionCentral',
    tools: ['Notion AI'],
    category: 'Productivity',
    description: 'Notion AI features including writing, summarization, and workflow automation.',
    videoId: 'GeLZHpPkE7o',
    duration: '21:15',
  },
  {
    id: 'zapier-automation',
    title: 'Zapier AI Automation - No Code Workflows',
    channel: 'AutomationHQ',
    tools: ['Zapier AI'],
    category: 'Automation',
    description: 'Build AI-powered automations connecting 6000+ apps without code.',
    videoId: 'LrJqXKxNY4U',
    duration: '25:35',
  },
  {
    id: 'grammarly-writing',
    title: 'Grammarly AI Writing Assistant',
    channel: 'WritingTips',
    tools: ['Grammarly'],
    category: 'Writing',
    description: 'Setup, style guide, and professional grammar checking with Grammarly.',
    videoId: '2P9xVb0o8Yc',
    duration: '11:20',
  },
  {
    id: 'otter-meetings',
    title: 'Otter.ai - AI Meeting Transcription',
    channel: 'ProductivityHacks',
    tools: ['Otter.ai'],
    category: 'Productivity',
    description: 'Automatic meeting transcription, summaries, and action item extraction.',
    videoId: 'H3T8kj7Hd1Y',
    duration: '14:45',
  },
  {
    id: 'canva-design',
    title: 'Canva AI - Design Like a Pro',
    channel: 'DesignBasics',
    tools: ['Canva AI'],
    category: 'Image Generation',
    description: 'Using Canva AI features for quick design mockups and marketing materials.',
    videoId: 'jhGTe1kE8Zk',
    duration: '17:55',
  },
  {
    id: 'elevenlabs-voices',
    title: 'ElevenLabs AI Voice Generator',
    channel: 'AudioTech',
    tools: ['ElevenLabs'],
    category: 'Audio & Voice',
    description: 'Create natural-sounding AI voices for podcasts, videos, and apps.',
    videoId: '0CKlvPT-DQY',
    duration: '13:20',
  },
  {
    id: 'replit-ai-coding',
    title: 'Replit AI - Code, Collaborate, Deploy',
    channel: 'ReplitCoding',
    tools: ['Replit AI'],
    category: 'Coding',
    description: 'Complete guide to Replit AI environment for solo and team coding projects.',
    videoId: 'Hl7p2qJZS0Y',
    duration: '20:15',
  },
  {
    id: 'leonardo-ai-design',
    title: 'Leonardo AI - Professional Image Generation',
    channel: 'DesignStudio',
    tools: ['Leonardo AI'],
    category: 'Image Generation',
    description: 'Advanced prompting and style control for production-quality AI images.',
    videoId: 'oJRcFKMWGc0',
    duration: '24:50',
  },
  {
    id: 'hugging-face-models',
    title: 'Hugging Face for AI Developers',
    channel: 'AI Research',
    tools: ['Hugging Face'],
    category: 'Research & Development',
    description: 'Access and fine-tune open-source AI models from Hugging Face.',
    videoId: '83dGYPw5wMs',
    duration: '28:40',
  },
  {
    id: 'synthesia-videos',
    title: 'Synthesia - AI Avatar Video Creation',
    channel: 'VideoProduction',
    tools: ['Synthesia'],
    category: 'Video Generation',
    description: 'Create professional videos with AI avatars without cameras or studios.',
    videoId: '0jVNvMJGWMU',
    duration: '19:25',
  },
  {
    id: 'descript-podcast',
    title: 'Descript - Edit Podcasts Like Text',
    channel: 'PodcastPro',
    tools: ['Descript'],
    category: 'Video & Audio',
    description: 'Edit podcasts and videos by editing text transcripts with Descript.',
    videoId: 'mQNXbmH5aEE',
    duration: '16:10',
  },
  {
    id: 'make-automation',
    title: 'Make - Automate Everything Without Code',
    channel: 'AutomationExperts',
    tools: ['Make'],
    category: 'Automation',
    description: 'Build complex workflows connecting apps like Slack, Google Sheets, and CRM.',
    videoId: 'QBZY_8EY_jI',
    duration: '27:30',
  },
  {
    id: 'n8n-workflows',
    title: 'n8n - Open Source Workflow Automation',
    channel: 'OpenSourceAI',
    tools: ['n8n'],
    category: 'Automation',
    description: 'Self-hosted alternative to Zapier with unlimited customization.',
    videoId: '-7yrT1-lARg',
    duration: '22:45',
  },
  {
    id: 'consensus-research',
    title: 'Consensus - AI-Powered Research Search',
    channel: 'ResearchGeek',
    tools: ['Consensus'],
    category: 'Research',
    description: 'Find peer-reviewed research papers with AI-synthesized answers.',
    videoId: 'B-Xe8VYE18A',
    duration: '12:55',
  },
  {
    id: 'heygen-avatars',
    title: 'HeyGen - AI Avatar Video Generator',
    channel: 'VideoMaker',
    tools: ['HeyGen'],
    category: 'Video Generation',
    description: 'Create videos with realistic AI avatars without acting or filming.',
    videoId: 'Jl5x7nWIRdI',
    duration: '15:35',
  },
  {
    id: 'pixlr-editing',
    title: 'Pixlr - AI Photo Editing Made Easy',
    channel: 'PhotoEditTips',
    tools: ['Pixlr'],
    category: 'Image Editing',
    description: 'Quick AI-powered photo enhancements and professional editing tools.',
    videoId: '8aSkJhyJbvg',
    duration: '11:40',
  },
  {
    id: 'ideogram-text-images',
    title: 'Ideogram - Text-to-Image with Perfect Text',
    channel: 'DesignAI',
    tools: ['Ideogram'],
    category: 'Image Generation',
    description: 'Generate images with readable text and graphic design elements.',
    videoId: 'pzH4Gw3bQME',
    duration: '14:20',
  },
  {
    id: 'upscayl-upscaling',
    title: 'Upscayl - Free AI Image Upscaler',
    channel: 'ImageEnhance',
    tools: ['Upscayl'],
    category: 'Image Enhancement',
    description: 'Upscale and enhance low-resolution images with open-source AI.',
    videoId: 'E7RqWjR0cC0',
    duration: '10:25',
  },
]

const FAQS = [
  {
    q: 'What is an AI tool?',
    a: 'An AI tool is software powered by artificial intelligence that automates or assists with tasks like writing, coding, creating images, analyzing data, or managing workflows—usually via a web browser or app with no technical knowledge needed.',
  },
  {
    q: 'Are these tools free to use?',
    a: 'Most tools listed here offer a free tier or trial. Some require paid subscriptions for advanced features. Each card shows whether a tool is Free, Paid, or Free + Pro.',
  },
  {
    q: 'Which AI tool is best for beginners?',
    a: 'ChatGPT and Gemini are the best starting points. They work via simple chat, require no setup, and can help with writing, answering questions, summarizing content, and more.',
  },
  {
    q: 'Can I earn money using AI tools?',
    a: 'Yes. People use AI tools to offer freelance services (writing, design, coding), build automated businesses, create content, and build products much faster than before.',
  },
  {
    q: 'Which AI tool is best for making images?',
    a: 'Midjourney produces the highest quality artistic images. DALL·E 3 is easiest for beginners since it is built into ChatGPT. Stable Diffusion is best for free local use.',
  },
]

const PROGRAMMATIC_PROFESSIONS = [
  {
    slug: 'lawyers',
    title: 'Best AI Tools for Lawyers',
    intro: 'Find AI tools for legal research, contract drafting support, and faster document review workflows.',
    toolNames: ['Claude', 'ChatGPT', 'Perplexity', 'Notion AI'],
  },
  {
    slug: 'accountants',
    title: 'Best AI Tools for Accountants',
    intro: 'Discover AI tools for financial summaries, reporting drafts, and repetitive workflow automation.',
    toolNames: ['ChatGPT', 'Claude', 'Notion AI', 'Zapier AI'],
  },
  {
    slug: 'recruiters',
    title: 'Best AI Tools for Recruiters',
    intro: 'Use AI tools for outreach copy, candidate screening support, and interview prep workflows.',
    toolNames: ['ChatGPT', 'Gemini', 'Notion AI', 'Zapier AI'],
  },
  {
    slug: 'sales-teams',
    title: 'Best AI Tools for Sales Teams',
    intro: 'Use AI to write outreach, personalize follow-ups, and automate CRM support work at scale.',
    toolNames: ['ChatGPT', 'Claude', 'Zapier AI', 'Make (Integromat)'],
  },
  {
    slug: 'marketers',
    title: 'Best AI Tools for Marketers',
    intro: 'Use AI for campaign ideation, copywriting, and analytics-ready reporting workflows.',
    toolNames: ['ChatGPT', 'Claude', 'Notion AI', 'Perplexity'],
  },
  {
    slug: 'freelancers',
    title: 'Best AI Tools for Freelancers',
    intro: 'Speed up client delivery with AI tools for writing, research, and admin automation.',
    toolNames: ['ChatGPT', 'Gemini', 'Notion AI', 'Zapier AI'],
  },
  {
    slug: 'customer-support-teams',
    title: 'Best AI Tools for Customer Support Teams',
    intro: 'Handle repetitive responses, summarize tickets, and improve support consistency with AI.',
    toolNames: ['Claude', 'ChatGPT', 'Notion AI', 'Zapier AI'],
  },
  {
    slug: 'hr-managers',
    title: 'Best AI Tools for HR Managers',
    intro: 'Draft policies, onboarding docs, and hiring communication faster with AI-assisted workflows.',
    toolNames: ['ChatGPT', 'Gemini', 'Notion AI', 'Make (Integromat)'],
  },
  {
    slug: 'project-managers',
    title: 'Best AI Tools for Project Managers',
    intro: 'Use AI for standup summaries, project updates, and execution planning across teams.',
    toolNames: ['Claude', 'ChatGPT', 'Notion AI', 'Perplexity'],
  },
  {
    slug: 'founders',
    title: 'Best AI Tools for Founders',
    intro: 'Move faster on strategy, hiring, and content execution with practical AI stacks.',
    toolNames: ['ChatGPT', 'Claude', 'Perplexity', 'Zapier AI'],
  },
  {
    slug: 'ecommerce-sellers',
    title: 'Best AI Tools for Ecommerce Sellers',
    intro: 'Create product copy, ad creatives, and automated operations for ecommerce growth.',
    toolNames: ['ChatGPT', 'Midjourney', 'DALL·E 3', 'Zapier AI'],
  },
  {
    slug: 'real-estate-agents',
    title: 'Best AI Tools for Real Estate Agents',
    intro: 'Generate listing copy, outreach messaging, and client communication faster with AI.',
    toolNames: ['ChatGPT', 'Claude', 'Canva AI', 'Notion AI'],
  },
  {
    slug: 'consultants',
    title: 'Best AI Tools for Consultants',
    intro: 'Use AI for proposal drafting, research synthesis, and client-ready deliverables.',
    toolNames: ['Claude', 'ChatGPT', 'Perplexity', 'Notion AI'],
  },
  {
    slug: 'operations-managers',
    title: 'Best AI Tools for Operations Managers',
    intro: 'Automate SOP tasks, reporting, and process improvements with AI-driven workflows.',
    toolNames: ['ChatGPT', 'Zapier AI', 'Make (Integromat)', 'Notion AI'],
  },
]

const OUTCOME_BLOCKS = [
  {
    title: 'AI Tools for Students',
    outcome: 'Study faster and write better assignments in less time.',
    category: 'Research',
    slug: 'students',
    tools: ['ChatGPT', 'Gemini', 'Perplexity'],
  },
  {
    title: 'AI Tools for Small Business',
    outcome: 'Launch content, automate admin work, and reduce tool costs.',
    category: 'Automation',
    slug: 'small-businesses',
    tools: ['ChatGPT', 'Zapier AI', 'Notion AI'],
  },
  {
    title: 'AI Tools for Developers',
    outcome: 'Ship code faster with better context and fewer repetitive tasks.',
    category: 'Coding',
    slug: 'developers',
    tools: ['GitHub Copilot', 'Cursor', 'Claude'],
  },
  {
    title: 'AI Tools for Teachers',
    outcome: 'Prepare lessons and classroom material in minutes, not hours.',
    category: 'Writing',
    slug: 'teachers',
    tools: ['ChatGPT', 'Gemini', 'Notion AI'],
  },
  {
    title: 'AI Tools for Content Creators',
    outcome: 'Create scripts, visuals, and short videos from one workflow.',
    category: 'Video',
    slug: 'content-creators',
    tools: ['Runway', 'Midjourney', 'DALL·E 3'],
  },
]

const USE_CASE_PLAYBOOKS = {
  students: {
    summary: 'Students usually need three capabilities in one stack: concept explanation, fast drafting, and citation-aware research. The best workflow starts with understanding, then converts notes into revision material and practice tests.',
    steps: [
      'Use a chat model to break down difficult topics into plain language and analogies.',
      'Turn class notes into concise revision sheets and flashcards.',
      'Validate important claims using a citation-capable research tool before final submission.',
      'Use a writing assistant to improve clarity, grammar, and structure in your final draft.',
    ],
    watchouts: [
      'Do not copy AI output directly for graded submissions.',
      'Always verify numerical facts, citations, and policy-sensitive content.',
      'Keep your personal data and institution data out of prompts.',
    ],
  },
  teachers: {
    summary: 'Teachers benefit most when AI is used for preparation, differentiation, and feedback support. A practical stack reduces repetitive planning work while preserving instructor judgment.',
    steps: [
      'Generate lesson outlines and adapt them by grade level and time constraints.',
      'Draft worksheet variants for mixed-ability classrooms.',
      'Create feedback rubrics and parent communication drafts.',
      'Review all outputs for curriculum fit, local policy, and factual quality.',
    ],
    watchouts: [
      'Avoid sharing student-identifiable data in prompts.',
      'Review tone and factual claims before sharing with learners.',
      'Keep human assessment as the final grading authority.',
    ],
  },
  developers: {
    summary: 'Developers get the most value from AI when it is connected to editor workflows, tests, and code review habits. Fast output is helpful only when quality gates remain strong.',
    steps: [
      'Use an editor-native assistant for boilerplate, tests, and repetitive implementation tasks.',
      'Use long-context assistants for architecture exploration and refactor plans.',
      'Prompt with repo constraints, style rules, and edge cases to improve output quality.',
      'Run linting, tests, and human review before merge.',
    ],
    watchouts: [
      'Do not accept generated code without validation and tests.',
      'Verify dependency and license assumptions when code snippets are suggested.',
      'Watch for subtle logic regressions in generated refactors.',
    ],
  },
  'content-creators': {
    summary: 'Creators typically need script ideation, visual generation, and editing workflows to work together. The best stack keeps concept, production, and publishing aligned across channels.',
    steps: [
      'Use a writing model for hooks, outlines, and script drafts.',
      'Generate thumbnails and visual concepts for stronger click-through potential.',
      'Use video tools for rough cuts, short-form edits, and experimentation.',
      'Keep a repeatable prompt library for each format to improve consistency.',
    ],
    watchouts: [
      'Avoid publishing unverified claims from generated scripts.',
      'Check image and music usage rights before monetized use.',
      'Keep brand voice review as a final editorial step.',
    ],
  },
}

const getUseCasePlaybook = (page) => {
  const fromMap = USE_CASE_PLAYBOOKS[page.slug]
  if (fromMap) {
    return fromMap
  }

  return {
    summary: `${page.title} pages perform best when you evaluate tools by workflow fit, output quality, and onboarding speed instead of feature checklists alone. Start with one primary outcome and test two tools side by side for a week.`,
    steps: [
      'Define one measurable outcome you want to improve this month.',
      'Select two tools from this page and run the same task in both.',
      'Track quality, speed, and team adoption friction before upgrading to paid plans.',
      'Standardize prompts and documentation once one stack wins.',
    ],
    watchouts: [
      'Do not optimize for novelty if reliability is your primary goal.',
      'Re-check pricing and limits before committing to annual plans.',
      'Keep human review for final decisions in customer-facing workflows.',
    ],
  }
}

const USE_CASE_PAGES = [
  {
    slug: 'students',
    title: 'Best AI Tools for Students',
    intro: 'Find AI tools that help students summarize complex topics, draft assignments, and speed up revision.',
    toolNames: ['ChatGPT', 'Gemini', 'Perplexity', 'Notion AI'],
    faqs: [
      { q: 'What is the best free AI tool for students?', a: 'Gemini and ChatGPT are the easiest free starting points for study support and writing help.' },
      { q: 'Can AI help with exam preparation?', a: 'Yes. AI tools can generate quizzes, explain difficult topics, and summarize notes into revision-ready formats.' },
    ],
  },
  {
    slug: 'teachers',
    title: 'Best AI Tools for Teachers',
    intro: 'Discover AI tools for lesson planning, worksheet drafting, and classroom communication.',
    toolNames: ['ChatGPT', 'Gemini', 'Notion AI', 'Claude'],
    faqs: [
      { q: 'How can teachers use AI safely?', a: 'Teachers should review AI outputs, avoid sharing student-sensitive data, and use AI as an assistant, not an authority.' },
      { q: 'Which AI tool is best for lesson plans?', a: 'ChatGPT and Claude are strong options for lesson structure, examples, and differentiated instruction ideas.' },
    ],
  },
  {
    slug: 'developers',
    title: 'Best AI Tools for Developers',
    intro: 'Compare AI tools for coding, refactoring, debugging, and shipping software faster.',
    toolNames: ['GitHub Copilot', 'Cursor', 'Claude', 'ChatGPT'],
    faqs: [
      { q: 'Which AI coding tool is best for day-to-day development?', a: 'GitHub Copilot and Cursor are both strong choices; select based on your editor workflow and collaboration needs.' },
      { q: 'Can AI tools help with debugging and refactoring?', a: 'Yes. Modern AI coding assistants can explain code, suggest fixes, and accelerate refactors when paired with tests and code review.' },
    ],
  },
  {
    slug: 'content-creators',
    title: 'Best AI Tools for Content Creators',
    intro: 'Find practical AI tools for scripts, visuals, thumbnails, and video production workflows.',
    toolNames: ['ChatGPT', 'Runway', 'Midjourney', 'DALL·E 3'],
    faqs: [
      { q: 'What AI tools are best for creators?', a: 'A common creator stack is ChatGPT for scripts, Midjourney or DALL·E for visuals, and Runway for video production.' },
      { q: 'Can AI speed up short-form video workflows?', a: 'Yes. AI tools can reduce scripting, ideation, and rough-cut time significantly for reels and short videos.' },
    ],
  },
  {
    slug: 'sql-developers',
    title: 'Best AI Tools for SQL Developers',
    intro: 'Use AI to write better queries, optimize SQL logic, and explain complex joins faster.',
    toolNames: ['ChatGPT', 'Claude', 'GitHub Copilot', 'Perplexity'],
    faqs: [
      { q: 'Can AI optimize SQL queries?', a: 'Yes. AI can suggest indexing ideas, query rewrites, and execution-plan-oriented improvements when prompted correctly.' },
      { q: 'Which AI tool is best for database work?', a: 'ChatGPT and Claude are strong for explanation-heavy SQL tasks; Copilot helps when SQL is embedded in code.' },
    ],
  },
  {
    slug: 'small-businesses',
    title: 'Best AI Tools for Small Businesses',
    intro: 'Find tools for marketing, customer communication, and workflow automation without a big team.',
    toolNames: ['ChatGPT', 'Zapier AI', 'Make (Integromat)', 'Notion AI'],
    faqs: [
      { q: 'What is the best AI stack for a small business?', a: 'A common stack is ChatGPT for content, Notion AI for documentation, and Zapier AI for automations.' },
      { q: 'Do small businesses need paid AI plans?', a: 'Many can start on free plans and upgrade only after they validate recurring usage and ROI.' },
    ],
  },
  {
    slug: 'youtube-automation',
    title: 'Best AI Tools for YouTube Automation',
    intro: 'Build a faster YouTube workflow with tools for scripting, thumbnails, and video generation.',
    toolNames: ['ChatGPT', 'Runway', 'DALL·E 3', 'Midjourney'],
    faqs: [
      { q: 'Can AI create YouTube scripts?', a: 'Yes. AI is effective for hook ideas, outlines, and first drafts that creators then refine with their voice.' },
      { q: 'Which AI tool is best for AI video creation?', a: 'Runway is a strong choice for rapid concept videos and short-form visual production.' },
    ],
  },
  ...PROGRAMMATIC_PROFESSIONS.map((entry) => ({
    ...entry,
    faqs: [
      { q: `What are the best AI tools for ${entry.slug.replace(/-/g, ' ')}?`, a: `${entry.toolNames.slice(0, 2).join(' and ')} are practical starting points, then add automation tools based on your workflow volume.` },
      { q: `Can ${entry.slug.replace(/-/g, ' ')} use AI safely?`, a: 'Yes, with human review and clear data/privacy controls. Use AI for drafting and analysis support, not unsupervised final decisions.' },
    ],
  })),
]



const LOCAL_FAVORITES_KEY = 'aitoolscenter-favorites'
const LOCAL_VISITS_KEY = 'aitoolscenter-local-visits'
const LOCAL_RATINGS_KEY = 'aitoolscenter-user-ratings'
const LOCAL_TOOL_CLICKS_KEY = 'aitoolscenter-tool-clicks'
const LOCAL_HELPFUL_VOTES_KEY = 'aitoolscenter-helpful-votes'
const LOCAL_WEEKLY_TREND_SNAPSHOTS_KEY = 'aitoolscenter-weekly-trend-snapshots'
const SESSION_VISIT_KEY = 'aitoolscenter-session-visited'
const LOCAL_GLOBAL_VISIT_DATE_KEY = 'aitoolscenter-global-visit-date'
const PAGE_VIEWS_API = '/api/page-views'
const NEWSLETTER_ENDPOINT = '/api/newsletter'

const LEGAL_PAGES = {
  '/about': {
    title: 'About AIToolsCenter',
    description: 'Learn how AIToolsCenter reviews, curates, and updates AI tools for readers.',
    intro: 'AIToolsCenter is an editorial AI tools directory built to help people discover practical, trustworthy tools faster.',
    sections: [
      {
        heading: 'How We Review',
        items: [
          'We evaluate tools by category fit, ease of use, and feature depth.',
          'Listings are manually curated and updated based on product changes.',
          'We prioritize clear descriptions and practical use cases for readers.',
        ],
      },
      {
        heading: 'Editorial Independence',
        items: [
          'Sponsored placement, if any, is labeled clearly.',
          'Affiliate relationships do not change core ranking methodology.',
          'We regularly remove outdated or low-quality tools from the list.',
        ],
      },
    ],
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    description: 'Read how AIToolsCenter handles newsletter subscriptions, tool submissions, cookies, and limited user data.',
    intro: 'We collect minimal data needed to run this site, handle submissions, and improve user experience. Last updated: May 15, 2026.',
    sections: [
      {
        heading: 'What We Collect',
        items: [
          'Newsletter subscriptions store email address and subscription source.',
          'Tool submissions store details provided through the submission form.',
          'Google AdSense and associated ad technologies use cookies and web beacons to serve personalized ads based on your visits to this and other websites.',
          'Meta (Facebook) Pixel may be used for conversion tracking and campaign attribution when advertising consent is granted.',
          'Basic analytics cookies may be used to measure site traffic and user interaction patterns.',
        ],
      },
      {
        heading: 'Google AdSense and Advertising Cookies',
        items: [
          'This site uses Google AdSense to display advertisements. Google uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this site and other sites on the web.',
          'We may also use Meta Pixel to measure campaign outcomes and improve ad targeting on Facebook and Instagram when consent is granted.',
          'You can opt out of personalized advertising by visiting Google Ad Settings at https://adssettings.google.com.',
          'You can also opt out of third-party vendor cookies for personalized advertising by visiting www.aboutads.info.',
          'We have implemented Google Consent Mode v2. If you decline non-essential cookies via our consent banner, personalized ads and analytics will not be activated.',
        ],
      },
      {
        heading: 'How We Use Data',
        items: [
          'We use submitted information to respond to requests, review tool listings, and improve site content.',
          'We do not sell personal data to third parties.',
          'You can request removal of your submitted personal data by contacting us at support@aitoolscenter.in.',
          'You may update your cookie preferences at any time using the consent banner in the site footer.',
        ],
      },
    ],
  },
  '/terms-and-conditions': {
    title: 'Terms and Conditions',
    description: 'Review the terms that govern your use of AIToolsCenter and its third-party listings.',
    intro: 'By using AIToolsCenter, you agree to the terms below and all applicable laws.',
    sections: [
      {
        heading: 'Use of the Site',
        items: [
          'All content is provided for informational purposes only.',
          'Tool pricing, availability, and features can change without notice.',
          'Users are responsible for evaluating third-party tools before use.',
        ],
      },
      {
        heading: 'Restrictions',
        items: [
          'Unauthorized scraping, abuse, or harmful automated use of this site is prohibited.',
          'We may update these terms as the site evolves.',
          'Continued use of the site constitutes acceptance of updated terms.',
        ],
      },
    ],
  },
  '/contact': {
    title: 'Contact AIToolsCenter',
    description: 'Get in touch with AIToolsCenter for support, corrections, privacy requests, and partnerships.',
    intro: 'For support, corrections, legal/privacy requests, or partnership inquiries, contact us using the details below.',
    sections: [
      {
        heading: 'Primary Contact',
        items: [
          'Email: support@aitoolscenter.in',
          'Typical response time: 2 to 5 business days.',
          'Use this address for support, privacy requests, and business inquiries.',
        ],
      },
    ],
  },
}

const TOOL_CATEGORIES = CATEGORIES.filter((category) => category !== 'All')
const AMAZON_ASSOCIATE_TAG = (import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || 'aitoolscenter-21').trim()
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || '').trim()

// Affiliate tracking links — set these in Vercel environment variables after signing up.
const AFFILIATE_LINKS = {
  'Notion AI':       (import.meta.env.VITE_AFFILIATE_NOTION       || '').trim() || 'https://affiliate.notion.so/',
  'Runway':          (import.meta.env.VITE_AFFILIATE_RUNWAY        || '').trim() || 'https://runwayml.com/affiliates',
  'Cursor':          (import.meta.env.VITE_AFFILIATE_CURSOR        || '').trim() || 'https://cursor.sh',
  'Tabnine':         (import.meta.env.VITE_AFFILIATE_TABNINE       || '').trim() || 'https://tabnine.com/affiliates',
  'Perplexity':      (import.meta.env.VITE_AFFILIATE_PERPLEXITY    || '').trim() || 'https://perplexity.ai/pro?utm_source=aitoolscenter',
  'Make (Integromat)':(import.meta.env.VITE_AFFILIATE_MAKE        || '').trim() || 'https://www.make.com/en/register?pc=aitoolscenter',
  'Zapier AI':       (import.meta.env.VITE_AFFILIATE_ZAPIER        || '').trim() || 'https://sponsored-content.zapier.app/sign-up',
  'GitHub Copilot':  (import.meta.env.VITE_AFFILIATE_COPILOT       || '').trim() || 'https://github.com/features/copilot',
}

const CATEGORY_SEO = {
  Writing: {
    headline: 'Best AI Writing Tools in 2026',
    description: 'Discover the best AI writing tools for blogs, emails, scripts, and long-form content.',
  },
  Image: {
    headline: 'Top AI Image Generation Tools',
    description: 'Compare image-focused AI tools for art, design, product mockups, and visual ideation.',
  },
  Video: {
    headline: 'Top AI Video Tools',
    description: 'Explore AI video tools for generation, editing, short clips, and cinematic visuals.',
  },
  Coding: {
    headline: 'Best AI Coding Assistants',
    description: 'Find AI coding tools for autocomplete, debugging, refactoring, and codebase chat.',
  },
  Productivity: {
    headline: 'AI Productivity Tools',
    description: 'Discover AI assistants that speed up notes, docs, planning, and everyday workflows.',
  },
  Automation: {
    headline: 'AI Automation Platforms',
    description: 'Compare no-code and low-code automation tools that connect apps and reduce manual work.',
  },
  Research: {
    headline: 'Best AI Research Tools',
    description: 'Find AI search and research tools with citations, summaries, and real-time web context.',
  },
}

const TOOL_DETAIL_WRITEUPS = {
  ChatGPT: 'ChatGPT is strong for daily knowledge work because it handles ideation, drafting, summarization, and light coding in one flow. Teams often use it to turn rough notes into publishable copy, generate first-pass support responses, and speed up research with structured prompts. It is especially useful when you need a fast assistant for mixed tasks rather than a single specialized workflow.',
  Claude: 'Claude is a practical choice for long-form reasoning and document-heavy analysis. It performs well on policy review, synthesis of multiple sources, and rewriting dense text into clearer business language. Many users prefer Claude when they need more deliberate outputs, careful tone control, and consistent handling of long context windows.',
  Gemini: 'Gemini works best when your workflow already lives in the Google ecosystem. It can accelerate research, summarize threads, and help convert ideas into presentations or drafts with less copy-paste friction. For users switching between search, docs, and communication tools all day, Gemini can reduce context switching overhead significantly.',
  Midjourney: 'Midjourney is favored by designers and creators who need striking visual direction quickly. It excels at mood exploration, style iteration, and concept art that can later be refined in design tools. The main strength is image quality and creative range, making it a strong option for campaigns, storytelling boards, and brand experimentation.',
  'DALL·E 3': 'DALL·E 3 is often the easiest entry point for image generation because it is tightly integrated with conversational prompting workflows. It helps users move from plain-language ideas to usable visual drafts without learning complex syntax. This is useful for marketers, educators, and founders who need quick visuals for communication and testing.',
  'Stable Diffusion': 'Stable Diffusion is ideal when control and flexibility matter more than convenience. Because it is open-source and widely customizable, teams can tune models, run private deployments, and integrate image generation into internal pipelines. It is a strong fit for advanced users who want ownership over prompts, model behavior, and cost structure.',
  'GitHub Copilot': 'GitHub Copilot improves coding throughput by generating context-aware suggestions directly inside the editor. It is particularly effective for repetitive patterns, boilerplate, tests, and first drafts of unfamiliar APIs. Development teams typically benefit most when Copilot is paired with clear code review standards and strong linting/test gates.',
  Cursor: 'Cursor is built for developers who want deeper AI integration across the entire codebase rather than single-line completion. It helps with refactors, implementation planning, and navigating large repositories through conversational commands. The biggest advantage is reducing time spent jumping between docs, files, and external chat tools.',
  Tabnine: 'Tabnine is a practical option for organizations that prioritize controlled AI usage and IDE flexibility. It supports code completion workflows while emphasizing privacy-oriented deployment models. Teams using strict compliance requirements often consider Tabnine when they need AI assistance without heavily changing existing tooling habits.',
  Runway: 'Runway is useful for teams producing short-form videos, ad concepts, and creative experiments under tight timelines. It combines generation and editing features that can shorten production cycles from days to hours. Its strongest use case is rapid visual prototyping for marketing and creative direction before full production investment.',
}

const REVIEW_EDITOR_NAME = 'AIToolsCenter Editorial Team'
const REVIEW_LAST_UPDATED_ISO = '2026-05-28'

const TOOL_EDITORIAL_NOTES = {
  ChatGPT: {
    bestFor: 'general-purpose drafting, brainstorming, and cross-functional assistant tasks',
    watchouts: 'citation quality can vary, so claims should be validated before publishing',
    verdict: 'Best default option for mixed workflows when speed and flexibility both matter.',
  },
  Claude: {
    bestFor: 'long-context reasoning, policy analysis, and high-volume document rewriting',
    watchouts: 'final outputs still need factual checks on technical or legal claims',
    verdict: 'Strong fit for document-heavy teams that need coherent long-form outputs.',
  },
  Gemini: {
    bestFor: 'Google Workspace-connected research, summaries, and productivity tasks',
    watchouts: 'quality can vary by prompt specificity and account capabilities',
    verdict: 'Most useful for users deeply integrated into Google tools and workflows.',
  },
  Midjourney: {
    bestFor: 'creative concepting, style exploration, and campaign visual direction',
    watchouts: 'commercial rights and brand consistency should be reviewed per project',
    verdict: 'Excellent for high-impact creative iteration when visual quality is the goal.',
  },
  'DALL·E 3': {
    bestFor: 'quick visual ideation directly from plain-language prompts',
    watchouts: 'design teams may still need post-editing for production-grade assets',
    verdict: 'Great entry point for teams that need image generation without complex setup.',
  },
  'Stable Diffusion': {
    bestFor: 'advanced teams needing control, customization, and private deployments',
    watchouts: 'setup and quality tuning can require technical overhead',
    verdict: 'Best for power users who value flexibility over convenience.',
  },
  'GitHub Copilot': {
    bestFor: 'boilerplate generation, test scaffolding, and in-editor coding acceleration',
    watchouts: 'generated code must pass normal review, linting, and security checks',
    verdict: 'High productivity gain when paired with disciplined engineering quality gates.',
  },
  Cursor: {
    bestFor: 'codebase-aware implementation, refactors, and repo-scale navigation',
    watchouts: 'large automated edits require careful diff review before merge',
    verdict: 'Strong for developers who want deeper AI assistance across whole repositories.',
  },
  Tabnine: {
    bestFor: 'privacy-oriented completion workflows across multiple IDE environments',
    watchouts: 'suggestion quality depends on language context and project setup',
    verdict: 'Useful for teams balancing AI completion with tighter governance requirements.',
  },
  Runway: {
    bestFor: 'rapid short-form video ideation and creative editing experiments',
    watchouts: 'production outputs may still need manual polish and brand review',
    verdict: 'Effective for creative teams optimizing turnaround time for concept videos.',
  },
  Sora: {
    bestFor: 'cinematic-style text-to-video exploration and concept validation',
    watchouts: 'teams should validate visual consistency and content suitability before release',
    verdict: 'Promising option for early-stage cinematic ideation and storyboarding.',
  },
  'Notion AI': {
    bestFor: 'workspace-native notes, summaries, and documentation drafting',
    watchouts: 'complex workflows may need external automation or model support',
    verdict: 'Practical for knowledge teams that already operate inside Notion.',
  },
  'Zapier AI': {
    bestFor: 'no-code workflow automation and cross-app execution at scale',
    watchouts: 'automation reliability depends on source app APIs and trigger design',
    verdict: 'Solid choice for operational automation without custom engineering.',
  },
  'Make (Integromat)': {
    bestFor: 'visual automation with advanced branching and scenario logic',
    watchouts: 'complex scenarios require maintenance discipline and monitoring',
    verdict: 'Great for teams needing flexible no-code orchestration flows.',
  },
  Perplexity: {
    bestFor: 'fast research with source-cited responses and discovery workflows',
    watchouts: 'source quality still needs manual verification for critical decisions',
    verdict: 'Very useful for research-first workflows where citation visibility matters.',
  },
}

const getToolEditorialNotes = (tool) => {
  const mapped = TOOL_EDITORIAL_NOTES[tool.name]
  if (mapped) {
    return mapped
  }

  return {
    bestFor: `${tool.category.toLowerCase()} workflows where first-draft speed is important`,
    watchouts: 'outputs should be reviewed for factual accuracy, quality, and fit',
    verdict: `A practical option for teams evaluating ${tool.category.toLowerCase()} assistants.`,
  }
}

const CONSENT_STORAGE_KEY = 'aitoolscenter-consent-v1'

const CONSENT_DEFAULTS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
}

const CONSENT_ACCEPT_ALL = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
  functionality_storage: 'granted',
  personalization_storage: 'granted',
  security_storage: 'granted',
}

const isAdConsentGranted = (consentSettings = {}) => (
  consentSettings.ad_storage === 'granted'
  && consentSettings.ad_user_data === 'granted'
  && consentSettings.ad_personalization === 'granted'
)

const syncAdDisplayState = (consentSettings = CONSENT_DEFAULTS) => {
  if (typeof document === 'undefined') {
    return
  }

  const consentGranted = isAdConsentGranted(consentSettings)
  const adsReady = ADS_APPROVED && consentGranted

  document.documentElement.setAttribute('data-ads-approved', ADS_APPROVED ? 'true' : 'false')
  document.documentElement.setAttribute('data-ad-consent', consentGranted ? 'granted' : 'denied')
  document.documentElement.setAttribute('data-ads-ready', adsReady ? 'true' : 'false')
}

const ensureMetaPixelInitialized = (consentSettings = {}) => {
  if (typeof window === 'undefined' || !META_PIXEL_ID || !isAdConsentGranted(consentSettings)) {
    return
  }

  if (typeof window.fbq !== 'function') {
    window.fbq = function fbq() {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments)
    }
    window.fbq.push = window.fbq
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq.queue = []

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }

  if (!window.__metaPixelInitialized) {
    window.fbq('init', META_PIXEL_ID)
    window.__metaPixelInitialized = true
  }

  window.fbq('consent', 'grant')
}

const trackMetaPageView = (pathname) => {
  if (typeof window === 'undefined' || !META_PIXEL_ID || typeof window.fbq !== 'function') {
    return
  }

  window.fbq('track', 'PageView')
  window.fbq('trackCustom', 'RouteView', { path: pathname })
}

const getStoredConsentSettings = () => {
  if (typeof window === 'undefined') {
    return CONSENT_DEFAULTS
  }

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) {
      return CONSENT_DEFAULTS
    }

    const parsed = JSON.parse(raw)
    return parsed?.consent || CONSENT_DEFAULTS
  } catch {
    return CONSENT_DEFAULTS
  }
}

const applyConsentUpdate = (consentSettings) => {
  if (typeof window === 'undefined') {
    return
  }

  const payload = { ...CONSENT_DEFAULTS, ...consentSettings }

  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }

  window.gtag('consent', 'update', payload)

  if (typeof window.fbq === 'function') {
    window.fbq('consent', isAdConsentGranted(payload) ? 'grant' : 'revoke')
  }

  ensureMetaPixelInitialized(payload)
  syncAdDisplayState(payload)
}

const slugifyToolName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const slugifyCategoryName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const getCurrentWeekKey = () => {
  const now = new Date()
  const utcDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  const dayNum = utcDate.getUTCDay() || 7
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7)
  return `${utcDate.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

const normalizeFreePlanLabel = (badge) => (
  badge.toLowerCase().includes('free') ? 'Yes' : 'No'
)



const AMAZON_HOST_REGEX = /(^|\.)amazon\.[a-z.]+$/i

const isAmazonUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    return AMAZON_HOST_REGEX.test(parsedUrl.hostname)
  } catch {
    return false
  }
}

const isAffiliateTool = (tool) => Boolean(tool.affiliateLink) || Boolean(tool.affiliateProgram) || isAmazonUrl(tool.link || '')

const appendAmazonAssociateTag = (url) => {
  if (!AMAZON_ASSOCIATE_TAG) {
    return url
  }

  try {
    const parsedUrl = new URL(url)
    if (!AMAZON_HOST_REGEX.test(parsedUrl.hostname)) {
      return url
    }

    if (!parsedUrl.searchParams.has('tag')) {
      parsedUrl.searchParams.set('tag', AMAZON_ASSOCIATE_TAG)
    }

    return parsedUrl.toString()
  } catch {
    return url
  }
}

const getToolOutboundUrl = (tool) => {
  if (tool.affiliateLink) return appendAmazonAssociateTag(tool.affiliateLink)
  if (tool.affiliateProgram && AFFILIATE_LINKS[tool.name]) return AFFILIATE_LINKS[tool.name]
  return appendAmazonAssociateTag(tool.link)
}
const getToolAnchorRel = (tool) => (
  isAffiliateTool(tool) ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'
)

const getToolBySlug = (slug) => TOOLS.find((tool) => slugifyToolName(tool.name) === slug)
const getCategoryBySlug = (slug) => TOOL_CATEGORIES.find((category) => slugifyCategoryName(category) === slug) || null
const getLegalPage = (pathname) => LEGAL_PAGES[pathname] || null
const getUseCaseBySlug = (slug) => USE_CASE_PAGES.find((page) => page.slug === slug) || null

const getAlternativeToolBySlug = (slug) => TOOLS.find((tool) => slugifyToolName(tool.name) === slug) || null

const getToolSlugFromPath = (pathname) => (pathname.startsWith('/tools/') ? pathname.replace('/tools/', '') : null)
const getCategorySlugFromPath = (pathname) => (pathname.startsWith('/categories/') ? pathname.replace('/categories/', '') : null)
const getUseCaseSlugFromPath = (pathname) => (pathname.startsWith('/best-ai-tools-for/') ? pathname.replace('/best-ai-tools-for/', '') : null)

const getAlternativeSlugFromPath = (pathname) => (pathname.startsWith('/alternatives-to-') ? pathname.replace('/alternatives-to-', '') : null)


const isWeeklyTrendingPath = (pathname) => pathname === '/trending-ai-tools-this-week'
const isNewsPath = (pathname) => pathname === '/news'
const isTutorialsPath = (pathname) => pathname === '/tutorials'
const isContactPath = (pathname) => pathname === '/contact'
const NEWS_PAGE_SIZE = 9

const getSafeNewsPageNumber = (search) => {
  const value = Number(new URLSearchParams(search || '').get('page') || '1')
  if (!Number.isFinite(value)) {
    return 1
  }

  return Math.max(1, Math.floor(value))
}

const getIsoDateOrUndefined = (input) => {
  const parsed = Date.parse(input)
  if (Number.isNaN(parsed)) {
    return undefined
  }

  return new Date(parsed).toISOString()
}

const upsertMeta = ({ attr, key, content }) => {
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const upsertCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

const upsertJsonLd = (payload) => {
  let tag = document.head.querySelector('script[data-schema="dynamic"]')
  if (!tag) {
    tag = document.createElement('script')
    tag.setAttribute('type', 'application/ld+json')
    tag.setAttribute('data-schema', 'dynamic')
    document.head.appendChild(tag)
  }
  tag.textContent = JSON.stringify(payload)
}

const canUseInteractiveTilt = () => (
  typeof window !== 'undefined'
  && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
)

function useInteractiveTilt({ tilt = 8, shift = 10 } = {}) {
  const elementRef = useRef(null)

  const updateTiltFromMouse = (event) => {
    if (!canUseInteractiveTilt() || !elementRef.current) {
      return
    }

    const bounds = elementRef.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    const xRatio = (x - 0.5) * 2
    const yRatio = (y - 0.5) * 2

    elementRef.current.classList.add('is-tilting')
    elementRef.current.style.setProperty('--tilt-x', `${-yRatio * tilt}deg`)
    elementRef.current.style.setProperty('--tilt-y', `${xRatio * tilt}deg`)
    elementRef.current.style.setProperty('--shift-x', `${xRatio * shift}px`)
    elementRef.current.style.setProperty('--shift-y', `${yRatio * shift}px`)
    elementRef.current.style.setProperty('--glow-x', `${x * 100}%`)
    elementRef.current.style.setProperty('--glow-y', `${y * 100}%`)
  }

  const resetTilt = () => {
    if (!elementRef.current) {
      return
    }

    elementRef.current.classList.remove('is-tilting')
    elementRef.current.style.setProperty('--tilt-x', '0deg')
    elementRef.current.style.setProperty('--tilt-y', '0deg')
    elementRef.current.style.setProperty('--shift-x', '0px')
    elementRef.current.style.setProperty('--shift-y', '0px')
    elementRef.current.style.setProperty('--glow-x', '50%')
    elementRef.current.style.setProperty('--glow-y', '50%')
  }

  return {
    elementRef,
    onMouseMove: updateTiltFromMouse,
    onMouseLeave: resetTilt,
  }
}

function Stars({ count }) {
  return (
    <span aria-label={`${count} out of 5 stars`} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function InteractiveStars({ toolName, currentRating, onRate }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="user-rating-row">
      <span className="user-rating-label">Your rating:</span>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-btn${(hover || currentRating) >= star ? ' lit' : ''}`}
          aria-label={`Rate ${toolName} ${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onRate(toolName, star === currentRating ? 0 : star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          {(hover || currentRating) >= star ? '★' : '☆'}
        </button>
      ))}
      {currentRating > 0 && (
        <span className="user-rated-badge">You rated {currentRating}/5</span>
      )}
    </div>
  )
}



function ToolCard({ tool, rank, isFavorite, userRating, helpfulVote, onToggleFavorite, onTagClick, onRate, onVisit, onHelpfulVote }) {
  const tiltHandlers = useInteractiveTilt({ tilt: 7, shift: 8 })
  const [reported, setReported] = useState(false)
  const similarTools = TOOLS
    .filter((t) => t.category === tool.category && t.name !== tool.name)
    .slice(0, 2)
  const relatedUseCase = OUTCOME_BLOCKS.find((entry) => entry.tools.includes(tool.name))

  return (
    <article
      className="tool-card"
      ref={tiltHandlers.elementRef}
      onMouseMove={tiltHandlers.onMouseMove}
      onMouseLeave={tiltHandlers.onMouseLeave}
    >
      <div className="tool-card-top">
        <span className="tool-rank">{rank}</span>
        <span className="tool-featured-label">FEATURED</span>
        <span className="tool-ribbon">TOP</span>
      </div>
      <div className="tool-card-hero">
        <div className="tool-card-icon" aria-hidden="true">
          {tool.name.charAt(0)}
        </div>
        <div className="tool-card-title-block">
          <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
          <div className="tool-card-accent" />
          <p>{tool.tagline}</p>
        </div>
      </div>
      <div className="tool-meta-row tool-meta-row-center">
        <a className="tool-category-chip" href={`/categories/${slugifyCategoryName(tool.category)}`}>{tool.category}</a>
        <span className="tool-rating"><Stars count={tool.rating} /></span>
        <span className="tool-rating-count">{tool.rating}/5</span>
      </div>
      <div className="tool-tags">
        {tool.tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="tag tag-btn"
            onClick={() => onTagClick(tag)}
            title={`Filter by ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="internal-link-widget">
        <a href={`/categories/${slugifyCategoryName(tool.category)}`}>Category guide</a>
        {relatedUseCase ? <a href={`/best-ai-tools-for/${relatedUseCase.slug}`}>Use-case page</a> : null}
      </div>
      {similarTools.length > 0 && (
        <p className="similar-tools">
          Also try:{' '}
          {similarTools.map((s, i) => (
            <span key={s.name}>
              <button type="button" className="similar-link" onClick={() => onTagClick(s.name)}>{s.name}</button>
              {i < similarTools.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      )}
      <div className="tool-actions-row">
        <a
          className="btn btn-primary tool-btn"
          href={getToolOutboundUrl(tool)}
          target="_blank"
          rel={getToolAnchorRel(tool)}
          onClick={() => onVisit(tool.name)}
        >
          Visit
        </a>
      </div>
      <InteractiveStars toolName={tool.name} currentRating={userRating || 0} onRate={onRate} />
      <div className="helpful-row">
        <span>Was this helpful?</span>
        <button
          type="button"
          className={`helpful-btn${helpfulVote === 'up' ? ' active' : ''}`}
          onClick={() => onHelpfulVote(tool.name, helpfulVote === 'up' ? null : 'up')}
          aria-label={`Mark ${tool.name} as helpful`}
        >
          👍
        </button>
        <button
          type="button"
          className={`helpful-btn${helpfulVote === 'down' ? ' active' : ''}`}
          onClick={() => onHelpfulVote(tool.name, helpfulVote === 'down' ? null : 'down')}
          aria-label={`Mark ${tool.name} as not helpful`}
        >
          👎
        </button>
      </div>
      <button
        type="button"
        className={`report-link${reported ? ' reported' : ''}`}
        onClick={() => setReported(true)}
        disabled={reported}
      >
        {reported ? '✓ Thanks for reporting' : 'Report broken link'}
      </button>
    </article>
  )
}

function FaqItem({ q, a, className = '', style = undefined }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`faq-item ${className}`.trim()} style={style} data-scroll-reveal>
      <button className="faq-question" onClick={() => setOpen(!open)} aria-expanded={open}>
        {q}
        <span className="faq-icon">{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  )
}


const LOCAL_THEME_KEY = 'aitoolscenter-theme'

function SiteNav({ theme: themeProp, onToggleTheme: toggleProp }) {
  const [localTheme, setLocalTheme] = useState('dark')

  useEffect(() => {
    // Initialize theme on mount
    const stored = localStorage.getItem(LOCAL_THEME_KEY) || 'dark'
    const htmlTheme = document.documentElement.getAttribute('data-theme') || stored
    
    setLocalTheme(htmlTheme)
    document.documentElement.setAttribute('data-theme', htmlTheme)
    localStorage.setItem(LOCAL_THEME_KEY, htmlTheme)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const scrolled = document.querySelector('.nav')
      if (window.scrollY > 14) {
        scrolled?.classList.add('nav-scrolled')
      } else {
        scrolled?.classList.remove('nav-scrolled')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const theme = themeProp !== undefined ? themeProp : localTheme
  const onToggleTheme = toggleProp || (() => {
    const next = localTheme === 'dark' ? 'light' : 'dark'
    setLocalTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(LOCAL_THEME_KEY, next)
  })
  
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">AIToolsCenter.in</a>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/#tools">Tools</a>
        <a href="/tutorials">Tutorials</a>
        <a href="/news">News</a>
        <a href="/contact">Contact</a>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  )
}

function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) {
    return null
  }

  return (
    <button
      type="button"
      className="back-to-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      title="Back to top"
    >
      Top ↑
    </button>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-section footer-submission">
        <div className="footer-submission-content">
          <h3>Recommend an AI Tool</h3>
          <p>Know a great AI tool we're missing? Submit it to our directory.</p>
          <a href="/contact" className="btn btn-secondary">Submit Tool</a>
        </div>
      </div>
      
      <div className="footer-grid">
        <div className="footer-brand">
          <a href="/" className="footer-logo">AIToolsCenter.in</a>
          <p>The independent AI tools directory for 2026. Hand-curated reviews, practical comparisons, and outcome-first recommendations.</p>
          <div className="footer-social">
            <a href="/about" title="About us">About</a>
            <a href="/contact" title="Contact">Contact</a>
            <a href="/news" title="Latest AI News">News</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="/#tools">Browse All Tools</a></li>
            <li><a href="/tutorials">AI Tutorials</a></li>
            <li><a href="/news">AI News & Updates</a></li>
            <li><a href="/trending-ai-tools-this-week">Trending This Week</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><a href="/#newsletter">Weekly Newsletter</a></li>
            <li><a href="/ai-workflow-kit.pdf">AI Workflow Kit (PDF)</a></li>
            <li><a href="/ai-workflow-kit.txt">AI Workflow Kit (Text)</a></li>
            <li><a href="/best-ai-tools-for/students">Use Case Guides</a></li>
            <li><a href="/contact">Submit a Tool</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li><a href="/about">About AIToolsCenter</a></li>
            <li><a href="/about">How We Review</a></li>
            <li><a href="/contact">Get in Touch</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-and-conditions">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 AIToolsCenter.in · All rights reserved.</span>
        <span className="footer-disclosure">Some links may be affiliate links. We earn a small commission at no cost to you.</span>
      </div>
      <ConsentBanner />
      <BackToTopButton />
    </footer>
  )
}

function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [choices, setChoices] = useState({
    analytics: false,
    adStorage: false,
    adPersonalization: false,
    adUserData: false,
    personalization: false,
    functionality: false,
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
      if (!stored) {
        setVisible(true)
        return
      }

      const parsed = JSON.parse(stored)
      if (parsed?.consent) {
        applyConsentUpdate(parsed.consent)
      } else {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }
  }, [])

  const persistAndApply = (consent, source) => {
    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ consent, source, updatedAt: new Date().toISOString() })
      )
    } catch {
      // Ignore localStorage failures and still apply in-session consent update.
    }
    applyConsentUpdate(consent)
    setVisible(false)
    setShowCustomize(false)
  }

  const saveCustomConsent = () => {
    const customConsent = {
      ad_storage: choices.adStorage ? 'granted' : 'denied',
      ad_user_data: choices.adUserData ? 'granted' : 'denied',
      ad_personalization: choices.adPersonalization ? 'granted' : 'denied',
      analytics_storage: choices.analytics ? 'granted' : 'denied',
      functionality_storage: choices.functionality ? 'granted' : 'denied',
      personalization_storage: choices.personalization ? 'granted' : 'denied',
      security_storage: 'granted',
    }
    persistAndApply(customConsent, 'custom')
  }

  if (!visible) {
    return null
  }

  return (
    <section className="consent-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <p>
        We use cookies and ad technology to improve performance, measure usage, and show relevant ads.
        Choose your preferences. See <a href="/privacy-policy">Privacy Policy</a>.
      </p>
      <div className="consent-actions">
        <button type="button" className="btn btn-primary" onClick={() => persistAndApply(CONSENT_ACCEPT_ALL, 'accept-all')}>
          Accept All
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => persistAndApply(CONSENT_DEFAULTS, 'reject')}>
          Reject Non-Essential
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setShowCustomize((value) => !value)}>
          {showCustomize ? 'Hide Customization' : 'Customize'}
        </button>
      </div>

      {showCustomize ? (
        <div className="consent-customize">
          <label><input type="checkbox" checked={choices.analytics} onChange={(e) => setChoices((v) => ({ ...v, analytics: e.target.checked }))} /> Analytics cookies</label>
          <label><input type="checkbox" checked={choices.adStorage} onChange={(e) => setChoices((v) => ({ ...v, adStorage: e.target.checked }))} /> Ad storage</label>
          <label><input type="checkbox" checked={choices.adPersonalization} onChange={(e) => setChoices((v) => ({ ...v, adPersonalization: e.target.checked }))} /> Ad personalization</label>
          <label><input type="checkbox" checked={choices.adUserData} onChange={(e) => setChoices((v) => ({ ...v, adUserData: e.target.checked }))} /> Ad user data</label>
          <label><input type="checkbox" checked={choices.personalization} onChange={(e) => setChoices((v) => ({ ...v, personalization: e.target.checked }))} /> Personalization storage</label>
          <label><input type="checkbox" checked={choices.functionality} onChange={(e) => setChoices((v) => ({ ...v, functionality: e.target.checked }))} /> Functionality storage</label>
          <button type="button" className="btn btn-primary consent-save" onClick={saveCustomConsent}>Save Choices</button>
        </div>
      ) : null}
    </section>
  )
}

function LegalPage({ page }) {
  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">SITE INFORMATION</p>
            <h1>{page.title}</h1>
            <p className="subtext">{page.intro}</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              {page.sections.map((section) => (
                <article key={section.heading} className="policy-card content-card">
                  <h2>{section.heading}</h2>
                  {section.heading === 'Primary Contact' ? (
                    <ul className="policy-list">
                      <li>
                        Email: <a href="mailto:support@aitoolscenter.in">support@aitoolscenter.in</a>
                      </li>
                      <li>Typical response time: 2 to 5 business days.</li>
                      <li>Use this address for support, privacy requests, and business inquiries.</li>
                    </ul>
                  ) : (
                    <ul className="policy-list">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function ToolDetailPage({ tool }) {
  const editorialNotes = getToolEditorialNotes(tool)
  const reviewedOn = new Date(`${REVIEW_LAST_UPDATED_ISO}T00:00:00Z`).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
  const categoryTools = TOOLS
    .filter((item) => item.category === tool.category && item.name !== tool.name)
    .slice(0, 3)
  const relatedUseCases = OUTCOME_BLOCKS
    .filter((item) => item.tools.includes(tool.name) || item.category === tool.category)
    .slice(0, 3)
  const shouldAvoid = tool.category === 'Coding'
    ? 'your team cannot enforce code review, testing, and security checks on generated code'
    : tool.category === 'Image' || tool.category === 'Video'
      ? 'you need strict rights-managed assets with full provenance for every output'
      : 'you need guaranteed deterministic output with no need for iterative review'

  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">TOOL PROFILE</p>
            <h1>{tool.name}</h1>
            <p className="subtext">{tool.tagline}</p>
            <div className="tool-detail-chips">
              <span className="tag">Category: <a href={`/categories/${slugifyCategoryName(tool.category)}`}>{tool.category}</a></span>
              <span className="tag">Pricing: {tool.badge}</span>
              <span className="tag"><Stars count={tool.rating} /></span>
            </div>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>Why use {tool.name}</h2>
                <p>{TOOL_DETAIL_WRITEUPS[tool.name] || `${tool.name} helps with ${tool.category.toLowerCase()} workflows and is commonly used for faster execution with AI-assisted output.`}</p>
                <p className="section-copy">Reviewed by {REVIEW_EDITOR_NAME} | Last reviewed: {reviewedOn}</p>
                <p>
                  In most teams, {tool.name} works best as an acceleration layer instead of a complete replacement for existing workflows.
                  The strongest results come from repeatable prompts, clear review standards, and explicit quality checks before final publishing.
                </p>
                <ul className="policy-list">
                  <li>Best for: teams and creators who need reliable {tool.category.toLowerCase()} support.</li>
                  <li>Pricing model: {tool.badge}.</li>
                  <li>Community rating: {tool.rating}/5 based on editorial scoring.</li>
                  <li>Editorial verdict: {editorialNotes.verdict}</li>
                </ul>
                <a className="btn btn-primary" href={getToolOutboundUrl(tool)} target="_blank" rel={getToolAnchorRel(tool)}>Visit {tool.name}</a>
              </article>

              <article className="content-card policy-card">
                <h2>Hands-on evaluation summary</h2>
                <p>
                  This profile is based on repeatable editorial checks across onboarding, output quality, and day-to-day workflow fit.
                  We compare tools using similar tasks to reduce selection bias.
                </p>
                <ul className="policy-list">
                  <li>Best for: {editorialNotes.bestFor}.</li>
                  <li>Watchouts: {editorialNotes.watchouts}.</li>
                  <li>Method used: prompt consistency checks, output review, and comparison against same-category tools.</li>
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>When to choose (and skip) {tool.name}</h2>
                <p>
                  Choose {tool.name} if your priority is faster execution with acceptable first-draft quality and room for human refinement.
                  For most teams, it is a strong fit when turnaround speed matters more than perfect zero-edit output.
                </p>
                <ul className="policy-list">
                  <li>Choose it when: you need dependable first drafts and clear iterative improvement loops.</li>
                  <li>Skip it when: {shouldAvoid}.</li>
                  <li>Operational tip: create a prompt and QA checklist so output quality remains consistent across teammates.</li>
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>Popular features</h2>
                <div className="tool-tags">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </article>

              {categoryTools.length > 0 && (
                <article className="content-card policy-card">
                  <h2>Alternatives to {tool.name}</h2>
                  <ul className="policy-list">
                    {categoryTools.map((item) => (
                      <li key={item.name}>
                        <a href={`/tools/${slugifyToolName(item.name)}`}>{item.name}</a> - {item.tagline}
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              <article className="content-card policy-card">
                <h2>Related guides and use cases</h2>
                <ul className="policy-list">
                  <li><a href={`/categories/${slugifyCategoryName(tool.category)}`}>Best {tool.category} AI tools</a></li>
                  <li><a href={`/alternatives-to-${slugifyToolName(tool.name)}`}>{tool.name} alternatives</a></li>
                  {relatedUseCases.map((item) => (
                    <li key={item.slug}>
                      <a href={`/best-ai-tools-for/${item.slug}`}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>Explore more inside AIToolsCenter</h2>
                <div className="landing-links-grid">
                  <a href={`/categories/${slugifyCategoryName(tool.category)}`} className="landing-link-card">
                    <strong>{tool.category} category page</strong>
                    <span>Browse all curated tools in this category.</span>
                  </a>
                  <a href="/trending-ai-tools-this-week" className="landing-link-card">
                    <strong>Weekly leaderboard</strong>
                    <span>See which tools are currently drawing attention.</span>
                  </a>
                </div>
              </article>

              <article className="content-card policy-card">
                <h2>{tool.name} FAQs</h2>
                <div className="faq-list">
                  <FaqItem q={`Is ${tool.name} free?`} a={`${tool.name} is listed as ${tool.badge}. Check the official pricing page for the latest plan details.`} />
                  <FaqItem q={`What is ${tool.name} best for?`} a={`${tool.name} is best for ${tool.category.toLowerCase()} workflows where speed and output consistency matter.`} />
                  <FaqItem q={`What are alternatives to ${tool.name}?`} a={`Popular alternatives include ${categoryTools.map((item) => item.name).join(', ') || 'similar tools in this category'}.`} />
                </div>
              </article>
            </div>
          </section>

          {categoryTools.length > 0 && (
            <section className="related-tools-section content-page">
              <h2>Other {tool.category} tools to consider</h2>
              <div className="related-tools-grid">
                {categoryTools.map((item) => (
                  <a key={item.name} href={`/tools/${slugifyToolName(item.name)}`} className="related-tool-card">
                    <strong>{item.name}</strong>
                    <span>{item.tagline}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--accent2)', fontWeight: 700 }}>{item.badge} · ★ {item.rating}</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function CategoryPage({ category }) {
  const categoryTools = TOOLS.filter((tool) => tool.category === category)
  const categorySeo = CATEGORY_SEO[category]

  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">CATEGORY GUIDE</p>
            <h1>{categorySeo?.headline || `${category} AI Tools`}</h1>
            <p className="subtext">{categorySeo?.description || `Compare top ${category.toLowerCase()} AI tools, pricing, and use cases.`}</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>Top {category} tools</h2>
                <ul className="policy-list">
                  {categoryTools.map((tool) => (
                    <li key={tool.name}>
                      <a href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a> - {tool.tagline}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>How to choose a {category.toLowerCase()} tool</h2>
                <ul className="policy-list">
                  <li>Start with your primary use case and required output quality.</li>
                  <li>Compare free tier limits against paid feature unlocks.</li>
                  <li>Prefer tools with consistent updates and strong user adoption.</li>
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>Related links</h2>
                <div className="landing-links-grid">
                  <a href="/trending-ai-tools-this-week" className="landing-link-card">
                    <strong>Weekly AI trends</strong>
                    <span>Track the latest movement in tool discovery.</span>
                  </a>
                  <a href="/#newsletter" className="landing-link-card">
                    <strong>Get weekly picks</strong>
                    <span>Subscribe for practical tool updates every week.</span>
                  </a>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}



function UseCaseLandingPage({ page }) {
  const tools = page.toolNames
    .map((name) => TOOLS.find((tool) => tool.name === name))
    .filter(Boolean)
  const playbook = getUseCasePlaybook(page)
  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">OUTCOME GUIDE</p>
            <h1>{page.title}</h1>
            <p className="subtext">{page.intro}</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>Top picks for this use case</h2>
                <ul className="policy-list">
                  {tools.map((tool) => (
                    <li key={tool.name}>
                      <a href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a> - {tool.tagline}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>How to use this stack effectively</h2>
                <p>{playbook.summary}</p>
                <ol className="policy-list">
                  {playbook.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>

              <article className="content-card policy-card">
                <h2>Common mistakes to avoid</h2>
                <ul className="policy-list">
                  {playbook.watchouts.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>



              <article className="content-card policy-card">
                <h2>FAQs</h2>
                <div className="faq-list">
                  {page.faqs.map((faq) => (
                    <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                  ))}
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}



function AlternativesLandingPage({ tool }) {
  const alternatives = TOOLS
    .filter((item) => item.category === tool.category && item.name !== tool.name)
    .slice(0, 6)
  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">ALTERNATIVES GUIDE</p>
            <h1>{tool.name} alternatives</h1>
            <p className="subtext">Compare alternatives to {tool.name} for pricing, quality, and workflow fit.</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>Top alternatives</h2>
                <ul className="policy-list">
                  {alternatives.map((item) => (
                    <li key={item.name}>
                      <a href={`/tools/${slugifyToolName(item.name)}`}>{item.name}</a> - {item.tagline}
                    </li>
                  ))}
                </ul>
              </article>

              <article className="content-card policy-card">
                <h2>How to evaluate alternatives</h2>
                <p>
                  If you are switching from {tool.name}, evaluate alternatives using the same task set and review criteria.
                  This prevents biased decisions based on interface preference alone and gives you a clearer performance signal.
                </p>
                <ul className="policy-list">
                  <li>Compare onboarding effort and team learning curve.</li>
                  <li>Measure output quality over at least 5 similar tasks.</li>
                  <li>Check pricing limits against your expected monthly usage.</li>
                  <li>Verify integrations you need for production workflows.</li>
                </ul>
              </article>


            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}



function WeeklyTrendingPage({ snapshots }) {
  const weeks = Object.keys(snapshots).sort().reverse()
  const activeWeek = weeks[0]
  const activeEntries = activeWeek
    ? Object.entries(snapshots[activeWeek]).sort((left, right) => right[1] - left[1]).slice(0, 10)
    : []
  const benchmarkEntries = TOOLS
    .slice()
    .sort((left, right) => right.rating - left.rating)
    .slice(0, 5)
  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">WEEKLY TRENDS</p>
            <h1>Trending AI Tools This Week</h1>
            <p className="subtext">Weekly snapshot of the most clicked tools in this directory.</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>{activeWeek || 'Current week'} leaderboard</h2>
                {activeEntries.length === 0 ? (
                  <div>
                    <p className="section-copy">No weekly click data yet. Interactions will populate this page over time.</p>
                    <p className="section-copy">Until then, start with these high-interest picks from the current directory:</p>
                    <ol className="policy-list">
                      {benchmarkEntries.map((tool) => (
                        <li key={tool.name}>
                          <a href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a> - {tool.tagline}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <ol className="policy-list">
                    {activeEntries.map(([name, clicks]) => (
                      <li key={name}>
                        <a href={`/tools/${slugifyToolName(name)}`}>{name}</a> - {clicks} clicks
                      </li>
                    ))}
                  </ol>
                )}
              </article>

              <article className="content-card policy-card">
                <h2>How this leaderboard works</h2>
                <p>
                  Rankings are based on in-directory click activity aggregated by week. The chart updates automatically as visitors open tool pages,
                  comparison pages, and outbound links from this site.
                </p>
                <ul className="policy-list">
                  <li>Data window: ISO week snapshot (UTC).</li>
                  <li>Signal source: click interactions captured in this directory.</li>
                  <li>Goal: help readers quickly identify tools that are currently attracting attention.</li>
                </ul>
              </article>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function NewsPage({ entries, currentPage = 1, pageSize = NEWS_PAGE_SIZE }) {
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize))
  const safePage = Math.min(Math.max(currentPage, 1), totalPages)
  const start = (safePage - 1) * pageSize
  const pageEntries = entries.slice(start, start + pageSize)
  const pageWindowStart = Math.max(1, safePage - 2)
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + 4)
  const visiblePages = []

  for (let page = pageWindowStart; page <= pageWindowEnd; page += 1) {
    visiblePages.push(page)
  }

  const buildNewsHref = (page) => (page <= 1 ? '/news' : `/news?page=${page}`)

  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">AI NEWS</p>
            <h1>Latest AI News and Product Updates</h1>
            <p className="subtext">Fresh AI headlines from trusted sources. This feed is updated automatically every day.</p>
          </section>

          <section className="content-shell">
            <div className="content-stack">
              <article className="content-card policy-card">
                <h2>Daily AI news feed</h2>
                <div className="news-grid">
                  {pageEntries.map((item, index) => (
                    <article key={`${item.title}-${safePage}-${index}`} className="news-card">
                      <div className="news-card-top">
                        <span className="news-tag">{item.tag || 'AI News'}</span>
                        <span className="news-date">{item.date}</span>
                      </div>
                      <h3 className="news-title">
                        <a className="news-title-link" href={item.link} target="_blank" rel="noopener noreferrer nofollow">{item.title}</a>
                      </h3>
                      <p className="news-summary">{item.summary}</p>
                    </article>
                  ))}
                </div>

                <nav className="news-pagination" aria-label="News pages">
                  <a
                    href={buildNewsHref(safePage - 1)}
                    className={`news-page-link${safePage === 1 ? ' disabled' : ''}`}
                    aria-disabled={safePage === 1}
                  >
                    Previous
                  </a>

                  <div className="news-page-numbers">
                    {visiblePages.map((page) => (
                      <a
                        key={page}
                        href={buildNewsHref(page)}
                        className={`news-page-link${page === safePage ? ' active' : ''}`}
                        aria-current={page === safePage ? 'page' : undefined}
                      >
                        {page}
                      </a>
                    ))}
                  </div>

                  <a
                    href={buildNewsHref(safePage + 1)}
                    className={`news-page-link${safePage === totalPages ? ' disabled' : ''}`}
                    aria-disabled={safePage === totalPages}
                  >
                    Next
                  </a>
                </nav>
              </article>

              <article className="content-card policy-card">
                <h2>More discovery paths</h2>
                <div className="landing-links-grid">
                  <a href="/#tools" className="landing-link-card">
                    <strong>Browse AI Tools by Category</strong>
                    <span>Find tools by use case, category, and rating.</span>
                  </a>
                  <a href="/trending-ai-tools-this-week" className="landing-link-card">
                    <strong>Weekly leaderboard</strong>
                    <span>See which tools are getting the most attention this week.</span>
                  </a>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function TutorialsPage({ videos }) {
  return (
    <div className="page">
      <SiteNav />
      <div className="page-body">
        <main className="content-page">
          <section className="content-hero">
            <p className="eyebrow">LEARN AI TOOLS</p>
            <h1>AI Tutorials & Guides</h1>
            <p className="subtext">Curated YouTube tutorials and guides for learning AI tools featured in our directory.</p>
          </section>

          <section className="content-shell">
            <div className="tutorials-grid">
              {videos.map((video) => (
                <div key={video.id} className="tutorial-card">
                  <div className="video-thumbnail">
                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="thumbnail-link">
                      <img src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`} alt={video.title} />
                      <div className="play-button">▶</div>
                      <div className="duration">{video.duration}</div>
                    </a>
                  </div>
                  <div className="tutorial-content">
                    <h3><a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">{video.title}</a></h3>
                    <p className="channel">{video.channel}</p>
                    <p className="description">{video.description}</p>
                    <div className="tutorial-meta">
                      <span className="category-badge">{video.category}</span>
                      <div className="tools-tags">
                        {video.tools.map((tool) => (
                          <span key={tool} className="tool-tag">{tool}</span>
                        ))}
                      </div>
                    </div>
                    <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="watch-btn">
                      Watch on YouTube →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="content-shell">
            <article className="content-card policy-card">
              <h2>How to Get the Most From AI Tool Tutorials</h2>
              <ul className="policy-list">
                <li><strong>Start with basics:</strong> If you're new to AI, begin with beginner-friendly ChatGPT or Gemini guides before diving into specialized tools.</li>
                <li><strong>Practice along:</strong> Don't just watch. Follow along with the tutorials and try the techniques in parallel.</li>
                <li><strong>Take notes:</strong> Write down key prompts, settings, and workflows you want to remember.</li>
                <li><strong>Experiment:</strong> After following tutorials, spend time experimenting with variations and different use cases.</li>
                <li><strong>Join communities:</strong> Connect with other learners on Discord, Reddit, or dedicated AI tool communities.</li>
              </ul>
            </article>
          </section>
        </main>
      </div>
      <SiteFooter />
    </div>
  )
}

function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'submit-tool',
    message: ''
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="page-contact-wrapper">
      <div className="page-body page-body-contact">
        <main className="contact-main">
          <section className="contact-hero">
            <div className="contact-hero-content">
              <h1>Contact Us</h1>
              <p>Have a question or want to collaborate?</p>
            </div>
          </section>
          <div className="contact-container">
            <p>Contact form coming soon</p>
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/'
  const normalizedSearch = window.location.search || ''
  const legalPage = getLegalPage(normalizedPath)
  const toolSlug = getToolSlugFromPath(normalizedPath)
  const categorySlug = getCategorySlugFromPath(normalizedPath)
  const useCaseSlug = getUseCaseSlugFromPath(normalizedPath)

  const alternativeSlug = getAlternativeSlugFromPath(normalizedPath)
  const toolPage = toolSlug ? getToolBySlug(toolSlug) : null
  const categoryPage = categorySlug ? getCategoryBySlug(categorySlug) : null
  const useCasePage = useCaseSlug ? getUseCaseBySlug(useCaseSlug) : null

  const alternativePage = alternativeSlug ? getAlternativeToolBySlug(alternativeSlug) : null

  const weeklyTrendingPage = isWeeklyTrendingPath(normalizedPath)
  const newsPage = isNewsPath(normalizedPath)
  const newsPageNumber = getSafeNewsPageNumber(normalizedSearch)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [favorites, setFavorites] = useState([])

  const [localVisits, setLocalVisits] = useState(1)
  const [websiteVisitors, setWebsiteVisitors] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('aitoolscenter-unique-visitors')
      return stored ? parseInt(stored, 10) : 1
    }
    return 1
  })
  const [isNewVisitor, setIsNewVisitor] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState({ type: 'idle', message: '' })
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [userRatings, setUserRatings] = useState({})
  const [toolClicks, setToolClicks] = useState({})
  const [helpfulVotes, setHelpfulVotes] = useState({})
  const [weeklyTrendSnapshots, setWeeklyTrendSnapshots] = useState({})
  const [theme, setTheme] = useState(() => localStorage.getItem(LOCAL_THEME_KEY) || 'dark')
  const skipInitialHashScrollRef = useRef(false)

  useEffect(() => {
    // Track unique visitors on first load
    if (typeof window !== 'undefined') {
      const visitorId = localStorage.getItem('aitoolscenter-visitor-id')
      if (!visitorId) {
        const newId = 'visitor-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('aitoolscenter-visitor-id', newId)
        const newCount = websiteVisitors + 1
        setWebsiteVisitors(newCount)
        localStorage.setItem('aitoolscenter-unique-visitors', newCount.toString())
        setIsNewVisitor(true)
      }
    }
    const savedFavorites = localStorage.getItem(LOCAL_FAVORITES_KEY)
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch {
        setFavorites([])
      }
    }

    const savedRatings = localStorage.getItem(LOCAL_RATINGS_KEY)
    if (savedRatings) {
      try {
        setUserRatings(JSON.parse(savedRatings))
      } catch {
        setUserRatings({})
      }
    }

    const savedClicks = localStorage.getItem(LOCAL_TOOL_CLICKS_KEY)
    if (savedClicks) {
      try {
        setToolClicks(JSON.parse(savedClicks))
      } catch {
        setToolClicks({})
      }
    }

    const savedHelpfulVotes = localStorage.getItem(LOCAL_HELPFUL_VOTES_KEY)
    if (savedHelpfulVotes) {
      try {
        setHelpfulVotes(JSON.parse(savedHelpfulVotes))
      } catch {
        setHelpfulVotes({})
      }
    }

    const savedTrendSnapshots = localStorage.getItem(LOCAL_WEEKLY_TREND_SNAPSHOTS_KEY)
    if (savedTrendSnapshots) {
      try {
        setWeeklyTrendSnapshots(JSON.parse(savedTrendSnapshots))
      } catch {
        setWeeklyTrendSnapshots({})
      }
    }

    const storedVisits = Number(localStorage.getItem(LOCAL_VISITS_KEY) || '0')
    const alreadyCounted = sessionStorage.getItem(SESSION_VISIT_KEY)
    const nextVisits = alreadyCounted ? Math.max(storedVisits, 1) : storedVisits + 1

    if (!alreadyCounted) {
      localStorage.setItem(LOCAL_VISITS_KEY, String(nextVisits))
      sessionStorage.setItem(SESSION_VISIT_KEY, 'true')
    }

    setLocalVisits(nextVisits)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadWebsiteVisitorCount = async () => {
      const today = new Date().toISOString().slice(0, 10)
      const lastCountedDate = localStorage.getItem(LOCAL_GLOBAL_VISIT_DATE_KEY)
      const method = lastCountedDate === today ? 'GET' : 'POST'

      try {
        const response = await fetch(PAGE_VIEWS_API, { method })
        if (!response.ok) throw new Error('Visitor count request failed')

        const result = await response.json()
        const count = Number(result.count)
        if (!cancelled && Number.isFinite(count)) {
          setWebsiteVisitors(count)
          if (method === 'POST') {
            localStorage.setItem(LOCAL_GLOBAL_VISIT_DATE_KEY, today)
          }
        }
      } catch {
        // Fallback to current count without incrementing if POST fails.
        try {
          const fallbackResponse = await fetch(PAGE_VIEWS_API, { method: 'GET' })
          if (!fallbackResponse.ok) throw new Error('Visitor count fallback failed')

          const fallbackResult = await fallbackResponse.json()
          const fallbackCount = Number(fallbackResult.count)
          if (!cancelled && Number.isFinite(fallbackCount)) {
            setWebsiteVisitors(fallbackCount)
          }
        } catch {
          if (!cancelled) {
            setWebsiteVisitors(null)
          }
        }
      }
    }

    loadWebsiteVisitorCount()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(userRatings))
  }, [userRatings])

  useEffect(() => {
    localStorage.setItem(LOCAL_TOOL_CLICKS_KEY, JSON.stringify(toolClicks))

    const weekKey = getCurrentWeekKey()
    setWeeklyTrendSnapshots((current) => {
      const next = {
        ...current,
        [weekKey]: {
          ...(current[weekKey] || {}),
          ...toolClicks,
        },
      }
      localStorage.setItem(LOCAL_WEEKLY_TREND_SNAPSHOTS_KEY, JSON.stringify(next))
      return next
    })
  }, [toolClicks])

  useEffect(() => {
    localStorage.setItem(LOCAL_HELPFUL_VOTES_KEY, JSON.stringify(helpfulVotes))
  }, [helpfulVotes])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(LOCAL_THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    const syncFromStorage = () => {
      syncAdDisplayState(getStoredConsentSettings())
    }

    syncFromStorage()
    window.addEventListener('storage', syncFromStorage)

    return () => window.removeEventListener('storage', syncFromStorage)
  }, [])

  useEffect(() => {
    const consent = getStoredConsentSettings()
    if (!isAdConsentGranted(consent)) {
      return
    }

    ensureMetaPixelInitialized(consent)
    trackMetaPageView(normalizedPath)
  }, [normalizedPath])

  useEffect(() => {
    if (typeof window === 'undefined' || normalizedPath !== '/') {
      return
    }

    const navigationEntries = performance.getEntriesByType?.('navigation')
    const isReloadNavigation = navigationEntries?.[0]?.type === 'reload'

    if (!isReloadNavigation) {
      return
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      skipInitialHashScrollRef.current = true
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [normalizedPath])

  useEffect(() => {
    const scrollToHashTarget = () => {
      const hash = window.location.hash
      if (!hash) {
        return
      }

      if (skipInitialHashScrollRef.current) {
        skipInitialHashScrollRef.current = false
        return
      }

      const targetId = decodeURIComponent(hash.slice(1))
      const target = document.getElementById(targetId)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const timeout = setTimeout(scrollToHashTarget, 90)
    window.addEventListener('hashchange', scrollToHashTarget)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('hashchange', scrollToHashTarget)
    }
  }, [normalizedPath])

  useEffect(() => {
    const baseUrl = SITE_ORIGIN
    const matched = toolSlug ? getToolBySlug(toolSlug) : null
    const matchedCategory = categorySlug ? getCategoryBySlug(categorySlug) : null
    const matchedUseCase = useCaseSlug ? getUseCaseBySlug(useCaseSlug) : null

    const matchedAlternative = alternativeSlug ? getAlternativeToolBySlug(alternativeSlug) : null
    const matchedLegalPage = getLegalPage(normalizedPath)
    const newsListingPage = isNewsPath(normalizedPath)
    const totalNewsPages = Math.max(1, Math.ceil(aiNews.length / NEWS_PAGE_SIZE))
    const safeNewsPage = Math.min(Math.max(newsPageNumber, 1), totalNewsPages)
    const paginatedNews = aiNews.slice((safeNewsPage - 1) * NEWS_PAGE_SIZE, safeNewsPage * NEWS_PAGE_SIZE)

    if (matched) {
      setSearch((current) => current || matched.name)
    }

    const title = matched
      ? `${matched.name} Review, Pricing & Alternatives | AIToolsCenter.in`
      : matchedCategory
        ? `${matchedCategory} AI Tools, Reviews & Alternatives | AIToolsCenter.in`
      : matchedUseCase
        ? `${matchedUseCase.title} | AIToolsCenter.in`
      : matchedAlternative
        ? `${matchedAlternative.name} Alternatives | AIToolsCenter.in`
      : newsListingPage
        ? safeNewsPage > 1
          ? `AI News - Page ${safeNewsPage} | AIToolsCenter.in`
          : 'AI News | AIToolsCenter.in'
      : weeklyTrendingPage
        ? 'Trending AI Tools This Week | AIToolsCenter.in'
      : matchedLegalPage
        ? `${matchedLegalPage.title} | AIToolsCenter.in`
        : 'AIToolsCenter.in - Best AI Tools Directory for 2026'

    const description = matched
      ? `${matched.name}: ${matched.tagline} Explore pricing, use cases, categories, and alternatives on AIToolsCenter.in.`
      : matchedCategory
        ? (CATEGORY_SEO[matchedCategory]?.description || `Explore top ${matchedCategory} AI tools with reviews and alternatives.`)
      : matchedUseCase
        ? matchedUseCase.intro
      : matchedAlternative
        ? `Explore top alternatives to ${matchedAlternative.name} and compare options by use case, pricing, and category.`
      : newsListingPage
        ? 'Daily AI news feed with product launches, model updates, and industry headlines.'
      : weeklyTrendingPage
        ? 'Weekly snapshot of trending AI tools based on user click activity and directory engagement.'
      : matchedLegalPage
        ? matchedLegalPage.description
        : 'Discover and compare top AI tools for writing, coding, images, video, automation, and productivity.'

    const canonicalUrl = matched
      ? `${baseUrl}/tools/${slugifyToolName(matched.name)}`
      : matchedCategory
        ? `${baseUrl}/categories/${slugifyCategoryName(matchedCategory)}`
      : matchedUseCase
        ? `${baseUrl}/best-ai-tools-for/${matchedUseCase.slug}`
      : matchedAlternative
        ? `${baseUrl}/alternatives-to-${slugifyToolName(matchedAlternative.name)}`
      : newsListingPage
        ? safeNewsPage > 1
          ? `${baseUrl}/news?page=${safeNewsPage}`
          : `${baseUrl}/news`
      : weeklyTrendingPage
        ? `${baseUrl}/trending-ai-tools-this-week`
      : matchedLegalPage
        ? `${baseUrl}${normalizedPath}`
        : `${baseUrl}/`

    const robotsDirective = matchedAlternative ? 'noindex, follow' : 'index, follow'

    document.title = title
    upsertMeta({ attr: 'name', key: 'description', content: description })
    upsertMeta({ attr: 'name', key: 'robots', content: robotsDirective })
    upsertMeta({ attr: 'name', key: 'googlebot', content: robotsDirective })
    upsertMeta({ attr: 'property', key: 'og:title', content: title })
    upsertMeta({ attr: 'property', key: 'og:description', content: description })
    upsertMeta({ attr: 'property', key: 'og:url', content: canonicalUrl })
    upsertMeta({ attr: 'name', key: 'twitter:title', content: title })
    upsertMeta({ attr: 'name', key: 'twitter:description', content: description })
    upsertCanonical(canonicalUrl)

    const breadcrumbSecondItem = matchedCategory
      ? { '@type': 'ListItem', position: 2, name: matchedCategory, item: `${baseUrl}/categories/${slugifyCategoryName(matchedCategory)}` }
      : matched
        ? { '@type': 'ListItem', position: 2, name: matched.name, item: `${baseUrl}/tools/${slugifyToolName(matched.name)}` }
        : matchedUseCase
          ? { '@type': 'ListItem', position: 2, name: matchedUseCase.title, item: `${baseUrl}/best-ai-tools-for/${matchedUseCase.slug}` }
          : matchedAlternative
            ? { '@type': 'ListItem', position: 2, name: `${matchedAlternative.name} alternatives`, item: `${baseUrl}/alternatives-to-${slugifyToolName(matchedAlternative.name)}` }
            : newsListingPage
              ? { '@type': 'ListItem', position: 2, name: 'AI News', item: safeNewsPage > 1 ? `${baseUrl}/news?page=${safeNewsPage}` : `${baseUrl}/news` }
            : weeklyTrendingPage
              ? { '@type': 'ListItem', position: 2, name: 'Weekly Trends', item: `${baseUrl}/trending-ai-tools-this-week` }
              : matchedLegalPage
                ? { '@type': 'ListItem', position: 2, name: matchedLegalPage.title, item: canonicalUrl }
                : { '@type': 'ListItem', position: 2, name: 'Directory', item: `${baseUrl}/` }

    const schemaGraph = [
      {
        '@type': 'Organization',
        name: 'AIToolsCenter.in',
        url: `${baseUrl}/`,
        logo: `${baseUrl}/BingSiteAuth.xml`,
      },
      {
        '@type': 'WebSite',
        name: 'AIToolsCenter.in',
        url: `${baseUrl}/`,
        description: 'AI tools directory for comparisons, reviews, and discovery.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${baseUrl}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        name: title,
        description,
        url: canonicalUrl,
        isPartOf: { '@type': 'WebSite', name: 'AIToolsCenter.in', url: `${baseUrl}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          breadcrumbSecondItem,
        ],
      },
    ]

    if (matched) {
      schemaGraph.push({
        '@type': 'SoftwareApplication',
        name: matched.name,
        applicationCategory: matched.category,
        operatingSystem: 'Web',
        description: matched.tagline,
        url: matched.link,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          category: matched.badge,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(matched.rating),
          bestRating: '5',
          ratingCount: '1',
        },
      })
    } else if (matchedCategory) {
      schemaGraph.push({
        '@type': 'CollectionPage',
        name: `${matchedCategory} AI Tools`,
        description,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: TOOLS
            .filter((tool) => tool.category === matchedCategory)
            .map((tool, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: tool.name,
              url: `${baseUrl}/tools/${slugifyToolName(tool.name)}`,
            })),
        },
      })
    } else if (matchedUseCase) {
      schemaGraph.push(
        {
          '@type': 'CollectionPage',
          name: matchedUseCase.title,
          description,
          url: canonicalUrl,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: matchedUseCase.toolNames.map((name, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name,
              url: `${baseUrl}/tools/${slugifyToolName(name)}`,
            })),
          },
        },
        {
          '@type': 'FAQPage',
          mainEntity: (matchedUseCase.faqs || []).map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      )
    } else if (newsListingPage) {
      schemaGraph.push({
        '@type': 'CollectionPage',
        name: safeNewsPage > 1 ? `AI News - Page ${safeNewsPage}` : 'AI News',
        description,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: paginatedNews.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            url: item.link,
          })),
        },
      })

      paginatedNews.forEach((item) => {
        const datePublished = getIsoDateOrUndefined(item.date)
        const articleSchema = {
          '@type': 'NewsArticle',
          headline: item.title,
          description: item.summary,
          url: item.link,
          isPartOf: {
            '@type': 'CollectionPage',
            name: 'AI News',
            url: `${baseUrl}/news`,
          },
          publisher: {
            '@type': 'Organization',
            name: 'AIToolsCenter.in',
            url: `${baseUrl}/`,
          },
        }

        if (datePublished) {
          articleSchema.datePublished = datePublished
        }

        schemaGraph.push(articleSchema)
      })
    } else if (!matchedLegalPage && !matchedAlternative && !weeklyTrendingPage) {
      schemaGraph.push(
        {
          '@type': 'ItemList',
          name: 'AI Tools Directory',
          itemListElement: TOOLS.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${baseUrl}/tools/${slugifyToolName(tool.name)}`,
            name: tool.name,
          })),
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQS.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        },
        {
          '@type': 'ItemList',
          name: 'Latest AI News',
          itemListElement: aiNews.slice(0, 6).map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: item.link,
            name: item.title,
          })),
        }
      )
    }

    upsertJsonLd({ '@context': 'https://schema.org', '@graph': schemaGraph })
  }, [normalizedPath, normalizedSearch, newsPageNumber, toolSlug, categorySlug, useCaseSlug, alternativeSlug, weeklyTrendingPage])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  const rateTool = (toolName, star) => {
    setUserRatings((current) => {
      if (star === 0) {
        const next = { ...current }
        delete next[toolName]
        return next
      }
      return { ...current, [toolName]: star }
    })
  }

  const toggleFavorite = (toolName) => {
    setFavorites((current) => (
      current.includes(toolName)
        ? current.filter((name) => name !== toolName)
        : [...current, toolName]
    ))
  }

  const trackToolClick = (toolName) => {
    setToolClicks((current) => ({
      ...current,
      [toolName]: (current[toolName] || 0) + 1,
    }))
  }

  const handleHelpfulVote = (toolName, vote) => {
    setHelpfulVotes((current) => {
      if (!vote) {
        const next = { ...current }
        delete next[toolName]
        return next
      }
      return {
        ...current,
        [toolName]: vote,
      }
    })
  }

  const submitNewsletterEmail = async (email, source) => {
    if (import.meta.env.DEV) {
      return {
        ok: true,
        message: 'Thanks for subscribing. (Demo mode - email not sent in local dev.)',
      }
    }

    const response = await fetch(NEWSLETTER_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, source }),
    })

    if (!response.ok) {
      return { ok: false, message: 'Subscription failed. Please try again in a moment.' }
    }

    const result = await response.json()
    return {
      ok: true,
      message: result.confirmationSent
        ? 'Thanks for subscribing. Check your inbox for confirmation.'
        : 'Thanks for subscribing. Your email has been added to the newsletter list.',
    }
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    setIsSubmittingNewsletter(true)
    setNewsletterStatus({ type: 'idle', message: '' })

    try {
      const result = await submitNewsletterEmail(newsletterEmail, 'aitoolscenter-newsletter')
      if (!result.ok) {
        setNewsletterStatus({ type: 'error', message: result.message })
        return
      }

      setNewsletterEmail('')
      setNewsletterStatus({ type: 'success', message: result.message })
    } catch {
      setNewsletterStatus({ type: 'error', message: 'Subscription failed. Please try again in a moment.' })
    } finally {
      setIsSubmittingNewsletter(false)
    }
  }

  const filtered = TOOLS.filter((tool) => {
    const matchCategory = activeCategory === 'All' || tool.category === activeCategory
    const query = search.toLowerCase().trim()
    const matchSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.tagline.toLowerCase().includes(query) ||
      tool.badge.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query))
    const matchFavorites = !favoritesOnly || favorites.includes(tool.name)

    return matchCategory && matchSearch && matchFavorites
  })

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const landingTools = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const rankedTools = [...TOOLS].sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name))
  const aiNewsItems = aiNews.slice(0, 8)
  const trendingCategories = CATEGORIES.filter((category) => category !== 'All')
    .map((category) => {
      const toolsInCategory = TOOLS.filter((tool) => tool.category === category)
      return {
        category,
        count: toolsInCategory.length,
        tools: toolsInCategory.slice(0, 3),
      }
    })
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category))
    .slice(0, 4)

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, search, favoritesOnly])

  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  const homePanels = [
    {
      title: 'Latest AI',
      eyebrow: 'Latest AI',
      icon: '✦',
      items: aiNewsItems.map((item) => ({
        label: item.title,
        href: item.link,
        meta: item.tag || item.date,
        external: true,
      })),
      footerLabel: `More new AI (${aiNews.length})`,
      footerHref: '/news',
    },
    {
      title: 'Editor Picks',
      eyebrow: 'Selection',
      icon: 'AI',
      items: rankedTools.slice(0, 8).map((tool) => ({
        label: tool.name,
        href: `/tools/${slugifyToolName(tool.name)}`,
        meta: tool.tagline,
      })),
      footerLabel: `See all tools (${TOOLS.length})`,
      footerHref: '/#tools',
    },
    {
      title: 'SuperTools',
      eyebrow: 'SuperTools',
      icon: '◆',
      items: [...TOOLS]
        .filter((tool) => ['Image', 'Video', 'Coding', 'Productivity'].includes(tool.category))
        .sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name))
        .slice(0, 8)
        .map((tool) => ({
          label: tool.name,
          href: `/tools/${slugifyToolName(tool.name)}`,
          meta: tool.category,
        })),
      footerLabel: 'Browse categories',
      footerHref: '/categories/writing',
    },
    {
      title: 'AI Chat & Assistant',
      eyebrow: 'Chat',
      icon: '◌',
      items: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Microsoft Copilot', 'Notion AI', 'Grammarly', 'Otter.ai']
        .map((name) => TOOLS.find((tool) => tool.name === name))
        .filter(Boolean)
        .map((tool) => ({
          label: tool.name,
          href: `/tools/${slugifyToolName(tool.name)}`,
          meta: tool.tagline,
        })),
      footerLabel: 'Browse all tools',
      footerHref: '/#tools',
    },
  ]

  const discoverCards = [
    {
      title: 'AI News',
      description: 'Daily headlines, launches, and model updates in one place.',
      href: '/news',
      icon: '▦',
    },
    {
      title: 'GPTs List',
      description: 'Browse assistant-style tools and specialized workflows.',
      href: '/categories/productivity',
      icon: '＋',
    },
    {
      title: 'YouTube AI',
      description: 'Video tools, repurposing tools, and creator workflows.',
      href: '/categories/video',
      icon: '▶',
    },
  ]

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const revealNodes = Array.from(document.querySelectorAll('[data-scroll-reveal]'))
    if (revealNodes.length === 0) {
      return
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealNodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.16,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    revealNodes.forEach((node) => {
      if (!node.classList.contains('is-visible')) {
        observer.observe(node)
      }
    })

    return () => observer.disconnect()
  }, [filtered.length, activeCategory, favoritesOnly, search, toolClicks])

  if (legalPage) {
    return <LegalPage page={legalPage} />
  }

  if (toolPage) {
    return <ToolDetailPage tool={toolPage} />
  }

  if (categoryPage) {
    return <CategoryPage category={categoryPage} />
  }

  if (useCasePage) {
    return <UseCaseLandingPage page={useCasePage} />
  }

  if (alternativePage) {
    return <AlternativesLandingPage tool={alternativePage} />
  }

  if (newsPage) {
    return <NewsPage entries={aiNews} currentPage={newsPageNumber} pageSize={NEWS_PAGE_SIZE} />
  }

  if (weeklyTrendingPage) {
    return <WeeklyTrendingPage snapshots={weeklyTrendSnapshots} />
  }

  if (isTutorialsPath(normalizedPath)) {
    return <TutorialsPage videos={YOUTUBE_TUTORIALS} />
  }

  if (isContactPath(normalizedPath)) {
    return (
      <div className="page">
        <SiteNav />
        <ContactPage />
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="page page-apple-home page-simple-home">
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />
      <div className="page-body page-body-home">
        <main className="landing-tools-main">
          

          <header className="hero hero-simple">
            <div className="hero-main">
              <h1>🚀 The World's Best AI Tools</h1>
              <p className="subtext">{TOOLS.length}+ hand-curated AI tools. Find the perfect tool for your needs quickly.</p>
            </div>
          </header>

          <section className="landing-tools-list" id="tools">
            <div className="search-category-bar" role="search" aria-label="Search and filter tools">
              <div className="search-category-row">
                <div className="search-bar search-bar-inline">
                  <input
                    type="search"
                    placeholder="Search for AI tools..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    aria-label="Search AI tools"
                  />
                </div>

                <label className="toolbar-field category-select-field">
                  <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value)}>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category === 'All' ? 'All categories' : category}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="filter-pills" role="group" aria-label="Quick filters">
                <button type="button" className={`filter-pill${favoritesOnly ? ' active' : ''}`} onClick={() => setFavoritesOnly((current) => !current)}>
                  <span className="pill-icon">✓</span>
                  Verified
                </button>
                <button type="button" className="filter-pill" onClick={() => setActiveCategory('All') || setSearch('free')}>Free</button>
                <button type="button" className="filter-pill" onClick={() => setActiveCategory('All') || setSearch('freemium')}>Freemium</button>
                <button type="button" className="filter-pill" onClick={() => setActiveCategory('All') || setSearch('paid')}>Paid</button>
              </div>

              <div className="filter-meta">
                <span>📊 {filtered.length} tools</span>
                <span>🔄 Updated daily</span>
                <span>✅ 100% verified</span>
              </div>
            </div>

            <div className="featured-categories-section" id="categories">
              <div className="section-header">
                <h2>Browse by Category</h2>
                <p>Explore AI tools organized by function and use case</p>
              </div>
              <div className="categories-grid">
                {CATEGORIES.map((category) => {
                  if (category === 'All') return null
                  const categoryTools = TOOLS.filter(t => t.category === category)
                  const categoryEmojis = {
                    Writing: '✍️',
                    Image: '🎨',
                    Video: '🎬',
                    Coding: '💻',
                    Productivity: '⚡',
                    Automation: '🤖',
                    Research: '🔍'
                  }
                  return (
                    <button
                      key={category}
                      className="category-card"
                      onClick={() => {
                        setActiveCategory(category)
                        setCurrentPage(1)
                      }}
                    >
                      <span className="category-emoji">{categoryEmojis[category] || '📌'}</span>
                      <h3>{category}</h3>
                      <p className="category-count">{categoryTools.length} tools</p>
                      <span className="explore-arrow">→</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="all-tools-section" id="all-tools">
              <div className="tools-section-header">
                <h2>Browse All AI Tools ({filtered.length})</h2>
              </div>

              <div className="pagination-strip" aria-label="Tool pagination">
                <button
                  type="button"
                  className="btn btn-secondary pagination-button"
                  onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={`pagination-page${pageNumber === currentPage ? ' active' : ''}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary pagination-button"
                  onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <p>No AI tools found matching your search.</p>
                </div>
              ) : (
                <div className="tools-grid">
                  {landingTools.map((tool, index) => (
                    <div key={tool.name} className="tool-card-wrapper">
                      <ToolCard
                        tool={tool}
                        rank={index + 1 + (currentPage - 1) * pageSize}
                        isFavorite={favorites.includes(tool.name)}
                        userRating={userRatings[tool.name] || 0}
                        helpfulVote={helpfulVotes[tool.name] || null}
                        onToggleFavorite={toggleFavorite}
                        onTagClick={(tag) => setSearch(tag)}
                        onRate={rateTool}
                        onVisit={trackToolClick}
                        onHelpfulVote={handleHelpfulVote}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pagination-strip" aria-label="Tool pagination">
                <button
                  type="button"
                  className="btn btn-secondary pagination-button"
                  onClick={() => setCurrentPage((current) => Math.max(1, current - 1))}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1
                    return (
                      <button
                        key={pageNumber}
                        type="button"
                        className={`pagination-page${pageNumber === currentPage ? ' active' : ''}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        aria-current={pageNumber === currentPage ? 'page' : undefined}
                      >
                        {pageNumber}
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  className="btn btn-secondary pagination-button"
                  onClick={() => setCurrentPage((current) => Math.min(totalPages, current + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>

              <div className="tools-footer">
                <span className="tools-count">Showing {landingTools.length} of {filtered.length} tools</span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('')
                    setFavoritesOnly(false)
                    setCurrentPage(1)
                  }}
                >
                  Clear all filters
                </button>
              </div>
            </div>

            <div className="platforms-section">
              <p className="platforms-label">🏢 POPULAR AI PLATFORMS & PUBLISHERS</p>
              <div className="platforms-grid">
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('Google')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by Google"
                >
                  <span className="platform-icon">🔵</span>
                  Google AI
                  <span className="platform-link-icon">→</span>
                </button>
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('OpenAI')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by OpenAI"
                >
                  <span className="platform-icon">🔴</span>
                  OpenAI
                  <span className="platform-link-icon">→</span>
                </button>
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('Meta')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by Meta"
                >
                  <span className="platform-icon">👥</span>
                  Meta AI
                  <span className="platform-link-icon">→</span>
                </button>
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('Microsoft')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by Microsoft"
                >
                  <span className="platform-icon">🪟</span>
                  Microsoft AI
                  <span className="platform-link-icon">→</span>
                </button>
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('Anthropic')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by Anthropic"
                >
                  <span className="platform-icon">🤖</span>
                  Anthropic
                  <span className="platform-link-icon">→</span>
                </button>
                <button
                  type="button"
                  className="platform-card"
                  onClick={() => {
                    setActiveCategory('All')
                    setSearch('DeepMind')
                    setCurrentPage(1)
                  }}
                  title="Filter tools by DeepMind"
                >
                  <span className="platform-icon">🧠</span>
                  DeepMind
                  <span className="platform-link-icon">→</span>
                </button>
              </div>
            </div>
          </section>

          <section className="section themed-sections-grid" aria-labelledby="explore-title">
            <h2 id="explore-title">Explore More Resources</h2>
            <div className="themed-cards">
              <a href="/news" className="themed-card">
                <span className="themed-icon">📰</span>
                <strong>AI News Today</strong>
                <p>Latest AI news and updates in real time</p>
              </a>
              <button
                type="button"
                className="themed-card"
                onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                  setCurrentPage(1)
                  window.location.hash = '#tools'
                }}
              >
                <span className="themed-icon">🏆</span>
                <strong>Browse All {TOOLS.length} AI Tools</strong>
                <p>All hand-curated AI tools in one place</p>
              </button>
              <a href="/contact" className="themed-card">
                <span className="themed-icon">➕</span>
                <strong>Submit an AI</strong>
                <p>Contribute new AI tools to the directory</p>
              </a>
            </div>
          </section>

          <section className="section newsletter" id="newsletter">
            <h2>Get the latest AI tools delivered weekly</h2>
            <p>5 curated tools each week, no spam.</p>
            <div className="lead-magnet-row">
              <a className="btn btn-secondary" href="/ai-workflow-kit.pdf" target="_blank" rel="noopener noreferrer">Download Free AI Workflow Kit</a>
            </div>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Enter your email address"
                required
                aria-label="Email address"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
              />
              <button type="submit" className="btn btn-primary" disabled={isSubmittingNewsletter}>
                {isSubmittingNewsletter ? 'Subscribing...' : 'Subscribe Free'}
              </button>
            </form>
            {newsletterStatus.message ? (
              <p className={`newsletter-status ${newsletterStatus.type === 'error' ? 'is-error' : 'is-success'}`}>
                {newsletterStatus.message}
              </p>
            ) : null}
            <p className="trust">No spam. Unsubscribe anytime. 100% free.</p>
          </section>
        </main>
      </div>

      <div className="visitors-stats-section">
        <div className="visitors-counter-container">
          <div className="visitor-stat">
            <span className="stat-emoji">👥</span>
            <div className="stat-text">
              <p className="stat-label">Unique Visitors</p>
              <p className="stat-number">{(websiteVisitors || 1).toLocaleString()}</p>
            </div>
          </div>
          <div className="visitor-stat">
            <span className="stat-emoji">📊</span>
            <div className="stat-text">
              <p className="stat-label">Total AI Tools</p>
              <p className="stat-number">{TOOLS.length}</p>
            </div>
          </div>
          <div className="visitor-stat">
            <span className="stat-emoji">🎓</span>
            <div className="stat-text">
              <p className="stat-label">Tutorial Videos</p>
              <p className="stat-number">{YOUTUBE_TUTORIALS.length}</p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  )
}

export default App

