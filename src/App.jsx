import { useEffect, useRef, useState } from 'react'
import aiNews from './data/ai-news.json'

const CATEGORIES = ['All', 'Writing', 'Image', 'Video', 'Coding', 'Productivity', 'Automation', 'Research']

const CATEGORY_ICONS = {
  All: '🌐',
  Writing: '✍️',
  Image: '🎨',
  Video: '🎬',
  Coding: '💻',
  Productivity: '⚡',
  Automation: '🤖',
  Research: '🔬',
}

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
  },
  {
    name: 'Runway',
    category: 'Video',
    tagline: 'AI video generation, editing, and motion tools in the browser.',
    link: 'https://runwayml.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Video Gen', 'Editing', 'Motion'],
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
  },
  {
    name: 'Zapier AI',
    category: 'Automation',
    tagline: 'No-code AI automations that connect 6,000+ apps.',
    link: 'https://zapier.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['No-Code', 'Workflows', 'Integrations'],
  },
  {
    name: 'Make (Integromat)',
    category: 'Automation',
    tagline: 'Visual drag-and-drop automation with advanced AI steps.',
    link: 'https://make.com',
    badge: 'Free + Pro',
    rating: 4,
    tags: ['Visual', 'Workflows', 'No-Code'],
  },
  {
    name: 'Perplexity',
    category: 'Research',
    tagline: 'AI search engine that cites real-time web sources.',
    link: 'https://perplexity.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Search', 'Citations', 'Real-Time'],
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

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'clicks', label: 'Most clicked' },
  { value: 'name', label: 'A to Z' },
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

const COMPARISON_PAGES = [
  {
    slug: 'chatgpt-vs-claude',
    title: 'ChatGPT vs Claude',
    description: 'Compare ChatGPT and Claude for writing, coding, long-context analysis, and business workflows.',
    tools: ['ChatGPT', 'Claude'],
    rows: [
      { feature: 'Free Plan', values: ['Yes', 'Yes'] },
      { feature: 'Coding Quality', values: ['Excellent', 'Excellent'] },
      { feature: 'Context Length', values: ['Medium', 'Very High'] },
      { feature: 'Best For', values: ['General workflows', 'Long documents and analysis'] },
    ],
  },
  {
    slug: 'midjourney-vs-dall-e-3',
    title: 'Midjourney vs DALL·E 3',
    description: 'See which image model is better for quality, prompt simplicity, and production-ready visuals.',
    tools: ['Midjourney', 'DALL·E 3'],
    rows: [
      { feature: 'Free Plan', values: ['No', 'Via ChatGPT plans'] },
      { feature: 'Image Style Quality', values: ['Outstanding', 'Very Good'] },
      { feature: 'Ease of Use', values: ['Intermediate', 'Beginner-friendly'] },
      { feature: 'Best For', values: ['Creative direction', 'Fast image drafting'] },
    ],
  },
  {
    slug: 'cursor-vs-github-copilot',
    title: 'Cursor vs GitHub Copilot',
    description: 'Compare modern AI coding assistants for speed, codebase awareness, and day-to-day development.',
    tools: ['Cursor', 'GitHub Copilot'],
    rows: [
      { feature: 'Free Plan', values: ['Yes', 'Trial'] },
      { feature: 'IDE Integration', values: ['Editor-first', 'Broad IDE ecosystem'] },
      { feature: 'Codebase Chat', values: ['Strong', 'Improving'] },
      { feature: 'Best For', values: ['AI-native coding flow', 'Inline coding assistance'] },
    ],
  },
]

const LOCAL_FAVORITES_KEY = 'aitoolscenter-favorites'
const LOCAL_VISITS_KEY = 'aitoolscenter-local-visits'
const LOCAL_RATINGS_KEY = 'aitoolscenter-user-ratings'
const LOCAL_TOOL_CLICKS_KEY = 'aitoolscenter-tool-clicks'
const LOCAL_AMAZON_CLICKS_KEY = 'aitoolscenter-amazon-clicks'
const LOCAL_HELPFUL_VOTES_KEY = 'aitoolscenter-helpful-votes'
const LOCAL_WEEKLY_TREND_SNAPSHOTS_KEY = 'aitoolscenter-weekly-trend-snapshots'
const LOCAL_EXIT_INTENT_DISMISSED_KEY = 'aitoolscenter-exit-intent-dismissed'
const SESSION_VISIT_KEY = 'aitoolscenter-session-visited'
const LOCAL_GLOBAL_VISIT_DATE_KEY = 'aitoolscenter-global-visit-date'
const PAGE_VIEWS_API = '/api/page-views'
const NEWSLETTER_ENDPOINT = '/api/newsletter'

const AI_NEWS = aiNews

const AMAZON_ROTATION_SIZE = 3

const AMAZON_PRODUCT_POOL = [
  {
    name: 'Echo Dot (5th Gen)',
    category: 'Productivity',
    priceHint: 'Smart speaker',
    tagline: 'Voice assistant for reminders, timers, smart-home controls, and quick daily tasks.',
    searchQuery: 'Echo Dot 5th Gen',
  },
  {
    name: 'Kindle Paperwhite (16 GB)',
    category: 'Research',
    priceHint: 'E-reader',
    tagline: 'Distraction-free reading for founders and creators who read long-form books and docs.',
    searchQuery: 'Kindle Paperwhite 16GB',
  },
  {
    name: 'Logitech MX Master 3S',
    category: 'Coding',
    priceHint: 'Productivity mouse',
    tagline: 'High-precision mouse with app-specific controls for coding, design, and editing workflows.',
    searchQuery: 'Logitech MX Master 3S',
  },
  {
    name: 'Dell 27-inch QHD Monitor',
    category: 'Productivity',
    priceHint: 'Monitor',
    tagline: 'Sharp text and larger workspace for prompting, dashboards, and multitasking.',
    searchQuery: 'Dell 27 inch QHD monitor',
  },
  {
    name: 'Blue Yeti USB Microphone',
    category: 'Research',
    priceHint: 'Microphone',
    tagline: 'Clean voice capture for AI voice notes, podcasts, and video explainers.',
    searchQuery: 'Blue Yeti USB microphone',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Productivity',
    priceHint: 'Noise-canceling',
    tagline: 'Focused deep-work sessions with excellent noise cancellation and call quality.',
    searchQuery: 'Sony WH-1000XM5',
  },
  {
    name: 'Samsung T7 Portable SSD',
    category: 'Coding',
    priceHint: 'Storage',
    tagline: 'Fast external storage for model assets, videos, and project backups.',
    searchQuery: 'Samsung T7 portable SSD',
  },
  {
    name: 'Apple Magic Keyboard',
    category: 'Coding',
    priceHint: 'Keyboard',
    tagline: 'Reliable low-profile keyboard for long writing and coding sessions.',
    searchQuery: 'Apple Magic Keyboard',
  },
  {
    name: 'BenQ ScreenBar Monitor Lamp',
    category: 'Productivity',
    priceHint: 'Desk light',
    tagline: 'Desk lighting that reduces glare and eye strain during late-night work.',
    searchQuery: 'BenQ ScreenBar monitor light',
  },
  {
    name: 'Anker 100W USB-C Charger',
    category: 'Automation',
    priceHint: 'Power adapter',
    tagline: 'Single compact charger for laptop, phone, and creator accessories.',
    searchQuery: 'Anker 100W USB C charger',
  },
  {
    name: 'Elgato Stream Deck MK.2',
    category: 'Automation',
    priceHint: 'Macro pad',
    tagline: 'Trigger repetitive production and workflow actions with one tap.',
    searchQuery: 'Elgato Stream Deck MK.2',
  },
  {
    name: 'TP-Link Archer AX73 Router',
    category: 'Research',
    priceHint: 'Wi-Fi router',
    tagline: 'Stable high-speed internet for cloud AI tools, meetings, and uploads.',
    searchQuery: 'TP Link Archer AX73',
  },
]

const buildAmazonSearchLink = (query) => `https://www.amazon.in/s?k=${encodeURIComponent(query)}`

const getDailyAmazonRecommendations = (pool, size) => {
  const dayKey = new Date().toISOString().slice(0, 10)
  const seedBase = Array.from(dayKey).reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const ranked = pool
    .map((item, index) => {
      const score = (seedBase * (index + 11) + index * 97) % 997
      return { item, score }
    })
    .sort((left, right) => left.score - right.score)

  return ranked.slice(0, size).map(({ item }) => ({
    ...item,
    affiliateLink: buildAmazonSearchLink(item.searchQuery),
  }))
}

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
          'Basic analytics cookies may be used to measure site traffic and user interaction patterns.',
        ],
      },
      {
        heading: 'Google AdSense and Advertising Cookies',
        items: [
          'This site uses Google AdSense to display advertisements. Google uses cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this site and other sites on the web.',
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

const SUBMIT_TOOL_ENDPOINT = '/api/submit-tool'
const TOOL_CATEGORIES = CATEGORIES.filter((category) => category !== 'All')
const PRICING_OPTIONS = ['Free', 'Freemium', 'Paid', 'Enterprise']
const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-2770089511325323'
const AMAZON_ASSOCIATE_TAG = (import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || 'aitoolscenter-21').trim()

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

const buildAutoComparison = (toolA, toolB) => ({
  slug: `${slugifyToolName(toolA.name)}-vs-${slugifyToolName(toolB.name)}`,
  title: `${toolA.name} vs ${toolB.name}`,
  description: `Compare ${toolA.name} and ${toolB.name} across pricing, ratings, fit, and primary use cases.`,
  tools: [toolA.name, toolB.name],
  rows: [
    { feature: 'Free Plan', values: [normalizeFreePlanLabel(toolA.badge), normalizeFreePlanLabel(toolB.badge)] },
    { feature: 'Category', values: [toolA.category, toolB.category] },
    { feature: 'Community Rating', values: [`${toolA.rating}/5`, `${toolB.rating}/5`] },
    { feature: 'Best For', values: [toolA.tags[0] || toolA.category, toolB.tags[0] || toolB.category] },
  ],
  autoGenerated: true,
})

const AMAZON_HOST_REGEX = /(^|\.)amazon\.[a-z.]+$/i

const isAmazonUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    return AMAZON_HOST_REGEX.test(parsedUrl.hostname)
  } catch {
    return false
  }
}

const isAffiliateTool = (tool) => Boolean(tool.affiliateLink) || isAmazonUrl(tool.link || '')

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

const getToolOutboundUrl = (tool) => appendAmazonAssociateTag(tool.affiliateLink || tool.link)
const getToolAnchorRel = (tool) => (
  isAffiliateTool(tool) ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer'
)

const getToolBySlug = (slug) => TOOLS.find((tool) => slugifyToolName(tool.name) === slug)
const getCategoryBySlug = (slug) => TOOL_CATEGORIES.find((category) => slugifyCategoryName(category) === slug) || null
const getLegalPage = (pathname) => LEGAL_PAGES[pathname] || null
const getUseCaseBySlug = (slug) => USE_CASE_PAGES.find((page) => page.slug === slug) || null
const getComparisonBySlug = (slug) => {
  const editorialComparison = COMPARISON_PAGES.find((page) => page.slug === slug)
  if (editorialComparison) {
    return editorialComparison
  }

  for (let index = 0; index < TOOLS.length; index += 1) {
    for (let nestedIndex = index + 1; nestedIndex < TOOLS.length; nestedIndex += 1) {
      const left = TOOLS[index]
      const right = TOOLS[nestedIndex]
      const forwardSlug = `${slugifyToolName(left.name)}-vs-${slugifyToolName(right.name)}`
      const reverseSlug = `${slugifyToolName(right.name)}-vs-${slugifyToolName(left.name)}`
      if (slug === forwardSlug || slug === reverseSlug) {
        return buildAutoComparison(left, right)
      }
    }
  }

  return null
}
const getAlternativeToolBySlug = (slug) => TOOLS.find((tool) => slugifyToolName(tool.name) === slug) || null

const getToolSlugFromPath = (pathname) => (pathname.startsWith('/tools/') ? pathname.replace('/tools/', '') : null)
const getCategorySlugFromPath = (pathname) => (pathname.startsWith('/categories/') ? pathname.replace('/categories/', '') : null)
const getUseCaseSlugFromPath = (pathname) => (pathname.startsWith('/best-ai-tools-for/') ? pathname.replace('/best-ai-tools-for/', '') : null)
const getComparisonSlugFromPath = (pathname) => (pathname.startsWith('/compare/') ? pathname.replace('/compare/', '') : null)
const getAlternativeSlugFromPath = (pathname) => (pathname.startsWith('/alternatives-to-') ? pathname.replace('/alternatives-to-', '') : null)

const isCompareHubPath = (pathname) => pathname === '/compare-hub'
const isWeeklyTrendingPath = (pathname) => pathname === '/trending-ai-tools-this-week'

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

function ToolCard({ tool, isFavorite, isCompared, userRating, clickCount, helpfulVote, onToggleFavorite, onToggleCompare, onTagClick, onRate, onVisit, onHelpfulVote }) {
  const tiltHandlers = useInteractiveTilt({ tilt: 7, shift: 8 })
  const [reported, setReported] = useState(false)
  const similarTools = TOOLS
    .filter((t) => t.category === tool.category && t.name !== tool.name)
    .slice(0, 2)

  return (
    <article
      className="tool-card"
      ref={tiltHandlers.elementRef}
      onMouseMove={tiltHandlers.onMouseMove}
      onMouseLeave={tiltHandlers.onMouseLeave}
    >
      <div className="tool-card-top">
        <span className="tool-badge">{tool.badge}</span>
        {isAffiliateTool(tool) ? <span className="tool-affiliate-pill">Affiliate</span> : null}
        <a className="tool-category" href={`/categories/${slugifyCategoryName(tool.category)}`}>{CATEGORY_ICONS[tool.category] || ''} {tool.category}</a>
      </div>
      <div className="tool-card-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.7rem' }}>
          <div className="tool-icon-initial" aria-hidden="true">{tool.name.charAt(0)}</div>
          <div>
          <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
          <Stars count={tool.rating} />
          <span className="community-label"> community</span>
          </div>
        </div>
        <button
          type="button"
          className={`favorite-btn${isFavorite ? ' active' : ''}`}
          aria-label={isFavorite ? `Remove ${tool.name} from favorites` : `Save ${tool.name} to favorites`}
          onClick={() => onToggleFavorite(tool.name)}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <p>{tool.tagline}</p>
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
      <InteractiveStars toolName={tool.name} currentRating={userRating || 0} onRate={onRate} />
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
          Visit Tool →
        </a>
        <button
          type="button"
          className={`btn btn-secondary compare-btn${isCompared ? ' active' : ''}`}
          onClick={() => onToggleCompare(tool.name)}
        >
          {isCompared ? 'Added to Compare' : 'Compare'}
        </button>
      </div>
      {isAffiliateTool(tool) ? (
        <p className="affiliate-disclosure">Affiliate disclosure: We may earn a commission from eligible purchases, at no extra cost to you.</p>
      ) : null}
      <span className="tool-click-count">
        {clickCount} visitor click{clickCount === 1 ? '' : 's'}
      </span>
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

function ComparisonCard({ tool, onRemove }) {
  return (
    <article className="comparison-card">
      <div className="comparison-card-top">
        <div>
          <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
          <p>{tool.tagline}</p>
        </div>
        <button type="button" className="comparison-remove" onClick={() => onRemove(tool.name)}>
          Remove
        </button>
      </div>
      <div className="comparison-meta">
        <span>{tool.category}</span>
        <span>{tool.badge}</span>
        <span><Stars count={tool.rating} /></span>
      </div>
      <div className="tool-tags">
        {tool.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <a className="comparison-link" href={getToolOutboundUrl(tool)} target="_blank" rel={getToolAnchorRel(tool)}>
        Open {tool.name}
      </a>
      {isAffiliateTool(tool) ? (
        <p className="affiliate-disclosure">Affiliate disclosure: We may earn a commission from eligible purchases, at no extra cost to you.</p>
      ) : null}
    </article>
  )
}

function AmazonPickCard({ item, clickCount, onVisit }) {
  return (
    <article className="amazon-pick-card">
      <div className="tool-card-top">
        <span className="tool-badge">{item.priceHint}</span>
        <span className="tool-affiliate-pill">Amazon Pick</span>
      </div>
      <h3>{item.name}</h3>
      <p>{item.tagline}</p>
      <div className="tool-tags">
        <span className="tag">{item.category}</span>
        <span className="tag">Amazon.in</span>
      </div>
      <div className="tool-actions-row">
        <a
          className="btn btn-primary tool-btn"
          href={getToolOutboundUrl(item)}
          target="_blank"
          rel={getToolAnchorRel(item)}
          onClick={() => onVisit(item.name)}
        >
          View on Amazon
        </a>
      </div>
      <span className="tool-click-count">
        {clickCount} Amazon click{clickCount === 1 ? '' : 's'}
      </span>
      <p className="affiliate-disclosure">Affiliate disclosure: As an Amazon Associate, we may earn from qualifying purchases.</p>
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

function AdUnit({ slot, className = '' }) {
  useEffect(() => {
    if (!ADSENSE_CLIENT_ID || import.meta.env.DEV) {
      return
    }

    const timeout = setTimeout(() => {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {
        // Ignore ad-render errors so page UX is never blocked.
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [])

  if (!ADSENSE_CLIENT_ID || import.meta.env.DEV) {
    return null
  }

  return (
    <aside className={`ad-unit ${className}`} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}

const LOCAL_THEME_KEY = 'aitoolscenter-theme'

function SiteNav({ theme: themeProp, onToggleTheme: toggleProp }) {
  const [localTheme, setLocalTheme] = useState(
    () => document.documentElement.getAttribute('data-theme') || localStorage.getItem(LOCAL_THEME_KEY) || 'dark'
  )
  const theme = themeProp !== undefined ? themeProp : localTheme
  const onToggleTheme = toggleProp || (() => {
    const next = localTheme === 'dark' ? 'light' : 'dark'
    setLocalTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(LOCAL_THEME_KEY, next)
  })
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">⚡ AIToolsCenter.in</a>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/#use-cases">Use Cases</a>
        <a href="/#tools">Tools</a>
        <a href="/#trending">Trending</a>
        <a href="/trending-ai-tools-this-week">Weekly Trends</a>
        <a href="/#amazon-picks">Amazon Picks</a>
        <a href="/compare-hub">Compare Hub</a>
        <a href="/#finder-quiz">Tool Finder</a>
        <a href="/#ai-news">AI News</a>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <a href="/#newsletter" className="btn btn-primary nav-cta">Get Weekly Picks</a>
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
      <div className="footer-links">
        <a href="/about">About</a>
        <a href="/privacy-policy">Privacy</a>
        <a href="/terms-and-conditions">Terms</a>
        <a href="/contact">Contact</a>
      </div>
      <p>© 2026 AIToolsCenter.in · Built to help you navigate the AI landscape.</p>
      <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
        Some links are affiliate links. As an Amazon Associate, we may earn from qualifying purchases at no extra cost to you.
      </p>
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
      <SiteFooter />
    </div>
  )
}

function ToolDetailPage({ tool }) {
  const categoryTools = TOOLS
    .filter((item) => item.category === tool.category && item.name !== tool.name)
    .slice(0, 3)
  const relatedUseCases = OUTCOME_BLOCKS
    .filter((item) => item.tools.includes(tool.name) || item.category === tool.category)
    .slice(0, 3)

  return (
    <div className="page">
      <SiteNav />
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
              <ul className="policy-list">
                <li>Best for: teams and creators who need reliable {tool.category.toLowerCase()} support.</li>
                <li>Pricing model: {tool.badge}.</li>
                <li>Community rating: {tool.rating}/5 based on editorial scoring.</li>
              </ul>
              <a className="btn btn-primary" href={getToolOutboundUrl(tool)} target="_blank" rel={getToolAnchorRel(tool)}>Visit {tool.name}</a>
              {isAffiliateTool(tool) ? (
                <p className="affiliate-disclosure">Affiliate disclosure: We may earn a commission from eligible purchases, at no extra cost to you.</p>
              ) : null}
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
                {COMPARISON_PAGES.filter((page) => page.tools.includes(tool.name)).map((page) => (
                  <li key={page.slug}>
                    <a href={`/compare/${page.slug}`}>{page.title}</a>
                  </li>
                ))}
              </ul>
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
      </main>
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function ComparisonTable({ comparison }) {
  const comparisonTools = comparison.tools
    .map((name) => TOOLS.find((tool) => tool.name === name))
    .filter(Boolean)

  return (
    <div className="comparison-table-wrap">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Feature</th>
            {comparison.tools.map((name) => (
              <th key={name}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.feature}>
              <td>{row.feature}</td>
              {row.values.map((value, index) => (
                <td key={`${row.feature}-${index}`}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="comparison-table-links">
        {comparisonTools.map((tool) => (
          <a key={tool.name} href={`/tools/${slugifyToolName(tool.name)}`} className="btn btn-secondary">
            Read {tool.name} review
          </a>
        ))}
      </div>
    </div>
  )
}

function UseCaseLandingPage({ page }) {
  const tools = page.toolNames
    .map((name) => TOOLS.find((tool) => tool.name === name))
    .filter(Boolean)

  return (
    <div className="page">
      <SiteNav />
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
              <h2>Comparison shortcuts</h2>
              <ul className="policy-list">
                {COMPARISON_PAGES.map((comparison) => (
                  <li key={comparison.slug}>
                    <a href={`/compare/${comparison.slug}`}>{comparison.title}</a>
                  </li>
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
      <SiteFooter />
    </div>
  )
}

function ComparisonLandingPage({ comparison }) {
  return (
    <div className="page">
      <SiteNav />
      <main className="content-page">
        <section className="content-hero">
          <p className="eyebrow">AI TOOL COMPARISON</p>
          <h1>{comparison.title}</h1>
          <p className="subtext">{comparison.description}</p>
        </section>

        <section className="content-shell">
          <div className="content-stack">
            <article className="content-card policy-card">
              <h2>Side-by-side comparison table</h2>
              <ComparisonTable comparison={comparison} />
            </article>

            <article className="content-card policy-card">
              <h2>FAQs</h2>
              <div className="faq-list">
                <FaqItem q={`Which is better: ${comparison.tools[0]} or ${comparison.tools[1]}?`} a={`The right choice depends on your workflow. Use the comparison table above, then test both free plans if available.`} />
                <FaqItem q={`Are ${comparison.tools[0]} and ${comparison.tools[1]} good for beginners?`} a={`Yes, but onboarding effort varies by product. Choose the one that matches your primary outcome and existing workflow.`} />
              </div>
            </article>
          </div>
        </section>
      </main>
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
              <h2>Direct comparisons</h2>
              <ul className="policy-list">
                {alternatives.map((item) => (
                  <li key={`${tool.name}-${item.name}`}>
                    <a href={`/compare/${slugifyToolName(tool.name)}-vs-${slugifyToolName(item.name)}`}>{tool.name} vs {item.name}</a>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function CompareHubPage() {
  const [category, setCategory] = useState('All')
  const [useCase, setUseCase] = useState('All')

  const useCaseOptions = ['All', ...OUTCOME_BLOCKS.map((entry) => entry.title)]
  const useCaseToolSet = useCase === 'All'
    ? null
    : new Set(OUTCOME_BLOCKS.find((entry) => entry.title === useCase)?.tools || [])

  const filteredTools = TOOLS.filter((tool) => {
    const byCategory = category === 'All' || tool.category === category
    const byUseCase = !useCaseToolSet || useCaseToolSet.has(tool.name)
    return byCategory && byUseCase
  })

  const pairs = []
  for (let index = 0; index < filteredTools.length; index += 1) {
    for (let nestedIndex = index + 1; nestedIndex < filteredTools.length; nestedIndex += 1) {
      const left = filteredTools[index]
      const right = filteredTools[nestedIndex]
      pairs.push({
        left,
        right,
        slug: `${slugifyToolName(left.name)}-vs-${slugifyToolName(right.name)}`,
      })
    }
  }

  return (
    <div className="page">
      <SiteNav />
      <main className="content-page">
        <section className="content-hero">
          <p className="eyebrow">COMPARISON HUB</p>
          <h1>AI Comparison Matrix Hub</h1>
          <p className="subtext">Filter by category or use case and jump into pairwise tool comparisons.</p>
        </section>

        <section className="content-shell">
          <div className="content-stack">
            <article className="content-card policy-card">
              <h2>Filter comparisons</h2>
              <div className="compare-hub-filters">
                <label className="toolbar-field">
                  <span>Category</span>
                  <select value={category} onChange={(event) => setCategory(event.target.value)}>
                    {CATEGORIES.map((entry) => (
                      <option key={entry} value={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
                <label className="toolbar-field">
                  <span>Use Case</span>
                  <select value={useCase} onChange={(event) => setUseCase(event.target.value)}>
                    {useCaseOptions.map((entry) => (
                      <option key={entry} value={entry}>{entry}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="section-copy">{pairs.length} pairwise comparisons available</p>
            </article>

            <article className="content-card policy-card">
              <h2>All pairwise comparison links</h2>
              <div className="compare-hub-links">
                {pairs.map((pair) => (
                  <a key={pair.slug} href={`/compare/${pair.slug}`} className="landing-link-card">
                    <strong>{pair.left.name} vs {pair.right.name}</strong>
                    <span>{pair.left.category} vs {pair.right.category}</span>
                  </a>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
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

  return (
    <div className="page">
      <SiteNav />
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
                <p className="section-copy">No weekly click data yet. Interactions will populate this page over time.</p>
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/'
  const legalPage = getLegalPage(normalizedPath)
  const toolSlug = getToolSlugFromPath(normalizedPath)
  const categorySlug = getCategorySlugFromPath(normalizedPath)
  const useCaseSlug = getUseCaseSlugFromPath(normalizedPath)
  const comparisonSlug = getComparisonSlugFromPath(normalizedPath)
  const alternativeSlug = getAlternativeSlugFromPath(normalizedPath)
  const toolPage = toolSlug ? getToolBySlug(toolSlug) : null
  const categoryPage = categorySlug ? getCategoryBySlug(categorySlug) : null
  const useCasePage = useCaseSlug ? getUseCaseBySlug(useCaseSlug) : null
  const comparisonPage = comparisonSlug ? getComparisonBySlug(comparisonSlug) : null
  const alternativePage = alternativeSlug ? getAlternativeToolBySlug(alternativeSlug) : null
  const compareHubPage = isCompareHubPath(normalizedPath)
  const weeklyTrendingPage = isWeeklyTrendingPath(normalizedPath)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [compareList, setCompareList] = useState([])
  const [localVisits, setLocalVisits] = useState(1)
  const [websiteVisitors, setWebsiteVisitors] = useState(null)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState({ type: 'idle', message: '' })
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [toolSubmission, setToolSubmission] = useState({
    name: '',
    url: '',
    category: 'Writing',
    pricing: 'Freemium',
    contactEmail: '',
    description: '',
  })
  const [userRatings, setUserRatings] = useState({})
  const [toolErrors, setToolErrors] = useState({})
  const [toolSubmitStatus, setToolSubmitStatus] = useState({ type: 'idle', message: '' })
  const [isSubmittingTool, setIsSubmittingTool] = useState(false)
  const [toolClicks, setToolClicks] = useState({})
  const [amazonClicks, setAmazonClicks] = useState({})
  const [helpfulVotes, setHelpfulVotes] = useState({})
  const [weeklyTrendSnapshots, setWeeklyTrendSnapshots] = useState({})
  const [quizGoal, setQuizGoal] = useState('write content')
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [exitIntentEmail, setExitIntentEmail] = useState('')
  const [exitIntentStatus, setExitIntentStatus] = useState({ type: 'idle', message: '' })
  const [theme, setTheme] = useState(() => localStorage.getItem(LOCAL_THEME_KEY) || 'dark')
  const heroTiltHandlers = useInteractiveTilt({ tilt: 9, shift: 12 })
  const skipInitialHashScrollRef = useRef(false)

  useEffect(() => {
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

    const savedAmazonClicks = localStorage.getItem(LOCAL_AMAZON_CLICKS_KEY)
    if (savedAmazonClicks) {
      try {
        setAmazonClicks(JSON.parse(savedAmazonClicks))
      } catch {
        setAmazonClicks({})
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
    localStorage.setItem(LOCAL_AMAZON_CLICKS_KEY, JSON.stringify(amazonClicks))
  }, [amazonClicks])

  useEffect(() => {
    localStorage.setItem(LOCAL_HELPFUL_VOTES_KEY, JSON.stringify(helpfulVotes))
  }, [helpfulVotes])

  useEffect(() => {
    if (normalizedPath !== '/' || localStorage.getItem(LOCAL_EXIT_INTENT_DISMISSED_KEY) === 'true') {
      return
    }

    const onMouseOut = (event) => {
      if (event.clientY <= 0) {
        setShowExitIntent(true)
      }
    }

    window.addEventListener('mouseout', onMouseOut)
    return () => window.removeEventListener('mouseout', onMouseOut)
  }, [normalizedPath])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(LOCAL_THEME_KEY, theme)
  }, [theme])

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
    const baseUrl = 'https://aitoolscenter.in'
    const matched = toolSlug ? getToolBySlug(toolSlug) : null
    const matchedCategory = categorySlug ? getCategoryBySlug(categorySlug) : null
    const matchedUseCase = useCaseSlug ? getUseCaseBySlug(useCaseSlug) : null
    const matchedComparison = comparisonSlug ? getComparisonBySlug(comparisonSlug) : null
    const matchedAlternative = alternativeSlug ? getAlternativeToolBySlug(alternativeSlug) : null
    const matchedLegalPage = getLegalPage(normalizedPath)

    if (matched) {
      setSearch((current) => current || matched.name)
    }

    const title = matched
      ? `${matched.name} Review, Pricing & Alternatives | AIToolsCenter.in`
      : matchedCategory
        ? `${matchedCategory} AI Tools, Reviews & Alternatives | AIToolsCenter.in`
      : matchedUseCase
        ? `${matchedUseCase.title} | AIToolsCenter.in`
      : matchedComparison
        ? `${matchedComparison.title} | AIToolsCenter.in`
      : matchedAlternative
        ? `${matchedAlternative.name} Alternatives | AIToolsCenter.in`
      : compareHubPage
        ? 'AI Comparison Matrix Hub | AIToolsCenter.in'
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
      : matchedComparison
        ? matchedComparison.description
      : matchedAlternative
        ? `Explore top alternatives to ${matchedAlternative.name} and compare options by use case, pricing, and category.`
      : compareHubPage
        ? 'Filter AI tools and open pairwise comparisons from one matrix hub page.'
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
      : matchedComparison
        ? `${baseUrl}/compare/${matchedComparison.slug}`
      : matchedAlternative
        ? `${baseUrl}/alternatives-to-${slugifyToolName(matchedAlternative.name)}`
      : compareHubPage
        ? `${baseUrl}/compare-hub`
      : weeklyTrendingPage
        ? `${baseUrl}/trending-ai-tools-this-week`
      : matchedLegalPage
        ? `${baseUrl}${normalizedPath}`
        : `${baseUrl}/`

    document.title = title
    upsertMeta({ attr: 'name', key: 'description', content: description })
    upsertMeta({ attr: 'property', key: 'og:title', content: title })
    upsertMeta({ attr: 'property', key: 'og:description', content: description })
    upsertMeta({ attr: 'property', key: 'og:url', content: canonicalUrl })
    upsertMeta({ attr: 'name', key: 'twitter:title', content: title })
    upsertMeta({ attr: 'name', key: 'twitter:description', content: description })
    upsertCanonical(canonicalUrl)

    const listSchema = {
      '@context': 'https://schema.org',
      '@graph': [
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
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
            matchedCategory
              ? { '@type': 'ListItem', position: 2, name: matchedCategory, item: `${baseUrl}/categories/${slugifyCategoryName(matchedCategory)}` }
              : matched
                ? { '@type': 'ListItem', position: 2, name: matched.name, item: `${baseUrl}/tools/${slugifyToolName(matched.name)}` }
                : matchedUseCase
                  ? { '@type': 'ListItem', position: 2, name: matchedUseCase.title, item: `${baseUrl}/best-ai-tools-for/${matchedUseCase.slug}` }
                  : matchedComparison
                    ? { '@type': 'ListItem', position: 2, name: matchedComparison.title, item: `${baseUrl}/compare/${matchedComparison.slug}` }
                    : matchedAlternative
                      ? { '@type': 'ListItem', position: 2, name: `${matchedAlternative.name} alternatives`, item: `${baseUrl}/alternatives-to-${slugifyToolName(matchedAlternative.name)}` }
                      : compareHubPage
                        ? { '@type': 'ListItem', position: 2, name: 'Comparison Hub', item: `${baseUrl}/compare-hub` }
                        : weeklyTrendingPage
                          ? { '@type': 'ListItem', position: 2, name: 'Weekly Trends', item: `${baseUrl}/trending-ai-tools-this-week` }
                    : { '@type': 'ListItem', position: 2, name: 'Directory', item: `${baseUrl}/` },
          ],
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
      ],
    }

    const toolSchema = matched
      ? {
          '@context': 'https://schema.org',
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
          review: {
            '@type': 'Review',
            reviewRating: {
              '@type': 'Rating',
              ratingValue: String(matched.rating),
              bestRating: '5',
            },
            author: {
              '@type': 'Organization',
              name: 'AIToolsCenter.in',
            },
            reviewBody: TOOL_DETAIL_WRITEUPS[matched.name] || matched.tagline,
          },
        }
      : matchedCategory
        ? {
            '@context': 'https://schema.org',
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
          }
      : matchedUseCase
        ? {
            '@context': 'https://schema.org',
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
          }
      : matchedComparison
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: matchedComparison.title,
            description,
            url: canonicalUrl,
          }
      : matchedAlternative
        ? {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${matchedAlternative.name} alternatives`,
            description,
            url: canonicalUrl,
          }
      : compareHubPage
        ? {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'AI Comparison Matrix Hub',
            description,
            url: canonicalUrl,
          }
      : weeklyTrendingPage
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Trending AI Tools This Week',
            description,
            url: canonicalUrl,
          }
      : matchedLegalPage
        ? {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: matchedLegalPage.title,
            description: matchedLegalPage.description,
            url: canonicalUrl,
            isPartOf: {
              '@type': 'WebSite',
              name: 'AIToolsCenter.in',
              url: `${baseUrl}/`,
            },
          }
      : listSchema

    upsertJsonLd(toolSchema)
  }, [normalizedPath, toolSlug, categorySlug, useCaseSlug, comparisonSlug, alternativeSlug, compareHubPage, weeklyTrendingPage])

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

  const toggleCompare = (toolName) => {
    setCompareList((current) => {
      if (current.includes(toolName)) {
        return current.filter((name) => name !== toolName)
      }

      if (current.length >= 3) {
        return [...current.slice(1), toolName]
      }

      return [...current, toolName]
    })
  }

  const trackToolClick = (toolName) => {
    setToolClicks((current) => ({
      ...current,
      [toolName]: (current[toolName] || 0) + 1,
    }))
  }

  const trackAmazonClick = (itemName) => {
    setAmazonClicks((current) => ({
      ...current,
      [itemName]: (current[itemName] || 0) + 1,
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
  }).sort((left, right) => {
    if (sortBy === 'rating') {
      return right.rating - left.rating || left.name.localeCompare(right.name)
    }

    if (sortBy === 'clicks') {
      const rightClicks = toolClicks[right.name] || 0
      const leftClicks = toolClicks[left.name] || 0
      return rightClicks - leftClicks || right.rating - left.rating || left.name.localeCompare(right.name)
    }

    if (sortBy === 'name') {
      return left.name.localeCompare(right.name)
    }

    return 0
  })

  const comparisonTools = compareList
    .map((name) => TOOLS.find((tool) => tool.name === name))
    .filter(Boolean)

  const topPicks = [...TOOLS]
    .sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name))
    .slice(0, 3)

  const dailyAmazonRecommendations = getDailyAmazonRecommendations(AMAZON_PRODUCT_POOL, AMAZON_ROTATION_SIZE)
  const trendingTools = [...TOOLS]
    .sort((left, right) => {
      const rightClicks = toolClicks[right.name] || 0
      const leftClicks = toolClicks[left.name] || 0
      return rightClicks - leftClicks || right.rating - left.rating
    })
    .slice(0, 5)

  const quizMatches = (() => {
    const goal = quizGoal.toLowerCase()
    const byGoal = TOOLS.filter((tool) => (
      tool.category.toLowerCase().includes(goal)
      || tool.tagline.toLowerCase().includes(goal)
      || tool.tags.some((tag) => tag.toLowerCase().includes(goal))
    ))
    return (byGoal.length > 0 ? byGoal : TOOLS).slice(0, 3)
  })()
  const alternativeTargets = topPicks.slice(0, 3)
  const weeklyTrendTop = (() => {
    const weekKey = getCurrentWeekKey()
    const weekData = weeklyTrendSnapshots[weekKey] || {}
    const entries = Object.entries(weekData)
    return entries.sort((left, right) => right[1] - left[1]).slice(0, 5)
  })()

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
  }, [filtered.length, comparisonTools.length, activeCategory, sortBy, favoritesOnly, search, toolClicks])

  const submitNewsletterEmail = async (email, source) => {
    if (import.meta.env.DEV) {
      return {
        ok: true,
        message: 'Thanks for subscribing. (Demo mode — email not sent in local dev.)',
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

  const handleExitIntentSubmit = async (event) => {
    event.preventDefault()
    setExitIntentStatus({ type: 'idle', message: '' })

    try {
      const result = await submitNewsletterEmail(exitIntentEmail, 'aitoolscenter-lead-magnet')
      if (!result.ok) {
        setExitIntentStatus({ type: 'error', message: result.message })
        return
      }

      setExitIntentEmail('')
      setExitIntentStatus({ type: 'success', message: result.message })
    } catch {
      setExitIntentStatus({ type: 'error', message: 'Subscription failed. Please try again in a moment.' })
    }
  }

  const dismissExitIntent = () => {
    localStorage.setItem(LOCAL_EXIT_INTENT_DISMISSED_KEY, 'true')
    setShowExitIntent(false)
  }

  const validateToolSubmission = (payload) => {
    const errors = {}

    if (!payload.name.trim()) {
      errors.name = 'Tool name is required.'
    }

    if (!payload.url.trim()) {
      errors.url = 'Tool website URL is required.'
    } else {
      try {
        const parsedUrl = new URL(payload.url)
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          errors.url = 'URL must start with http:// or https://.'
        }
      } catch {
        errors.url = 'Enter a valid website URL.'
      }
    }

    if (!payload.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required.'
    }

    if (!payload.description.trim() || payload.description.trim().length < 30) {
      errors.description = 'Description must be at least 30 characters.'
    }

    return errors
  }

  const handleToolInputChange = (event) => {
    const { name, value } = event.target
    setToolSubmission((current) => ({ ...current, [name]: value }))
    setToolErrors((current) => ({ ...current, [name]: '' }))
  }

  const handleToolSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      name: toolSubmission.name.trim(),
      url: toolSubmission.url.trim(),
      category: toolSubmission.category,
      pricing: toolSubmission.pricing,
      contactEmail: toolSubmission.contactEmail.trim(),
      description: toolSubmission.description.trim(),
    }

    const errors = validateToolSubmission(payload)
    setToolErrors(errors)

    if (Object.keys(errors).length > 0) {
      setToolSubmitStatus({ type: 'error', message: 'Please fix the highlighted fields and submit again.' })
      return
    }

    setIsSubmittingTool(true)
    setToolSubmitStatus({ type: 'idle', message: '' })

    try {
      const response = await fetch(SUBMIT_TOOL_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payload,
          source: 'aitoolscenter-submit-tool',
          submittedAt: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to submit at this time.')
      }

      setToolSubmission({
        name: '',
        url: '',
        category: 'Writing',
        pricing: 'Freemium',
        contactEmail: '',
        description: '',
      })
      setToolErrors({})
      setToolSubmitStatus({
        type: 'success',
        message: 'Thanks. Your tool submission was received and will be reviewed shortly.',
      })
    } catch {
      setToolSubmitStatus({
        type: 'error',
        message: 'Submission failed. Please try again in a few minutes.',
      })
    } finally {
      setIsSubmittingTool(false)
    }
  }

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

  if (comparisonPage) {
    return <ComparisonLandingPage comparison={comparisonPage} />
  }

  if (alternativePage) {
    return <AlternativesLandingPage tool={alternativePage} />
  }

  if (compareHubPage) {
    return <CompareHubPage />
  }

  if (weeklyTrendingPage) {
    return <WeeklyTrendingPage snapshots={weeklyTrendSnapshots} />
  }

  return (
    <div className="page">
      <SiteNav theme={theme} onToggleTheme={toggleTheme} />

      <header className="hero">
        <div className="hero-grid">
          <div className="hero-main">
            <p className="eyebrow">UPDATED MAY 2026 • 15+ TOOLS REVIEWED</p>
            <h1>Find the right <span className="gradient-text">AI tool</span> in 60 seconds</h1>
            <p className="subtext">
              Skip the hype. Start with your outcome, then get practical tool recommendations for studying,
              teaching, coding, content creation, and business growth.
            </p>
            <div className="hero-cta-row">
              <a href="#use-cases" className="btn btn-primary">Find by Outcome</a>
              <a href="#compare" className="btn btn-secondary">Compare Top Tools</a>
            </div>
            <div className="search-bar">
              <input
                type="search"
                placeholder="Search tools, e.g. 'image generation', 'code', 'free'…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search AI tools"
              />
            </div>
            <div className="hero-stats">
              <span>🎯 Outcome-first recommendations</span>
              <span>✅ 15+ Tools Reviewed</span>
              <span>★ {favorites.length} Saved Favorites</span>
              <span>👥 {websiteVisitors === null ? 'Live' : websiteVisitors.toLocaleString()} Website Visits</span>
              <span>↺ {localVisits} Visits From This Browser</span>
              <span>🛡️ Manually Curated Listings</span>
            </div>
          </div>

          <aside className="hero-visual" aria-hidden="true">
            <div
              className="orbital-shell"
              ref={heroTiltHandlers.elementRef}
              onMouseMove={heroTiltHandlers.onMouseMove}
              onMouseLeave={heroTiltHandlers.onMouseLeave}
            >
              <div className="ring ring-a"></div>
              <div className="ring ring-b"></div>
              <div className="ring ring-c"></div>

              <article className="core-card">
                <p>AI Command Deck</p>
                <strong>{filtered.length} discoverable tools</strong>
                <span>Category: {activeCategory}</span>
                <div className="core-bars">
                  <i style={{ width: '82%' }}></i>
                  <i style={{ width: '63%' }}></i>
                  <i style={{ width: '48%' }}></i>
                </div>
              </article>

              <div className="float-panel panel-a">
                <small>Live signal</small>
                <strong>Trending tags</strong>
              </div>
              <div className="float-panel panel-b">
                <small>Top category</small>
                <strong>{topPicks[0]?.category || 'Writing'}</strong>
              </div>
            </div>
          </aside>
        </div>
      </header>

      <main>
        <section className="section" id="use-cases">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Start with your goal, not a giant list</h2>
              <p className="section-copy">Problem → solution → recommended tools. Pick the use case and jump to curated options.</p>
            </div>
            <div className="results-chip">Outcome-driven discovery</div>
          </div>
          <div className="outcome-grid">
            {OUTCOME_BLOCKS.map((block, index) => (
              <article
                key={block.slug}
                className={`outcome-card scroll-reveal reveal-elastic ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ '--reveal-delay': `${Math.min(index * 50, 220)}ms` }}
                data-scroll-reveal
              >
                <span className="tag">{CATEGORY_ICONS[block.category]} {block.category}</span>
                <h3>{block.title}</h3>
                <p>{block.outcome}</p>
                <div className="tool-tags">
                  {block.tools.map((name) => (
                    <a key={name} className="tag" href={`/tools/${slugifyToolName(name)}`}>{name}</a>
                  ))}
                </div>
                <a href={`/best-ai-tools-for/${block.slug}`} className="btn btn-secondary">View this guide</a>
              </article>
            ))}
          </div>
        </section>

        <AdUnit slot="3951802461" className="ad-unit-inline" />

        <section className="section" id="trending">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Trending AI Tools Today</h2>
              <p className="section-copy">Most visited tools this week based on live click behavior in this directory.</p>
            </div>
            <a href="/trending-ai-tools-this-week" className="results-chip">Weekly snapshot page</a>
          </div>
          <div className="trending-grid">
            {trendingTools.map((tool, index) => (
              <article key={tool.name} className="trend-card" data-scroll-reveal>
                <small>#{index + 1}</small>
                <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
                <p>{tool.tagline}</p>
                <span className="tool-click-count">{toolClicks[tool.name] || 0} clicks</span>
              </article>
            ))}
          </div>
        </section>

        <AdUnit slot="6729415088" className="ad-unit-inline" />

        <section className="section" id="alternatives">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Alternatives pages for high-intent search</h2>
              <p className="section-copy">Browse “alternatives to” pages for the most searched AI products.</p>
            </div>
          </div>
          <div className="landing-links-grid">
            {alternativeTargets.map((tool) => (
              <a key={tool.name} href={`/alternatives-to-${slugifyToolName(tool.name)}`} className="landing-link-card">
                <strong>{tool.name} alternatives</strong>
                <span>Compare alternatives, pricing styles, and direct matchups for {tool.name}.</span>
              </a>
            ))}
          </div>
        </section>

        <section className="section" id="landing-pages">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Best AI Tools for specific professions</h2>
              <p className="section-copy">Programmatic landing pages targeting high-intent “best for X” searches.</p>
            </div>
          </div>
          <div className="landing-links-grid">
            {USE_CASE_PAGES.map((page) => (
              <a key={page.slug} href={`/best-ai-tools-for/${page.slug}`} className="landing-link-card">
                <strong>{page.title}</strong>
                <span>{page.intro}</span>
              </a>
            ))}
          </div>
        </section>

        <AdUnit slot="9301754426" className="ad-unit-inline" />

        <section className="section" id="tools">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Browse AI Tools by Category</h2>
              <p className="section-copy">Filter the directory, save favorites, and compare up to three tools side by side.</p>
            </div>
            <div className="results-chip">{filtered.length} results</div>
          </div>

          <div className="category-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`filter-btn${activeCategory === category ? ' active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                <span style={{ fontSize: '0.9em' }}>{CATEGORY_ICONS[category]}</span> {category}
              </button>
            ))}
          </div>

          <div className="tool-toolbar">
            <label className="toolbar-field">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="checkbox-pill">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(event) => setFavoritesOnly(event.target.checked)}
              />
              <span>Favorites only</span>
            </label>
            <button
              type="button"
              className="btn btn-secondary toolbar-button"
              onClick={() => {
                setActiveCategory('All')
                setSearch('')
                setFavoritesOnly(false)
              }}
            >
              Reset Filters
            </button>
            <button type="button" className="btn btn-secondary toolbar-button" onClick={() => setCompareList([])}>
              Clear Compare
            </button>
          </div>

          <AdUnit slot="8014623952" className="ad-unit-inline" />

          {filtered.length === 0 ? (
            <p className="empty-state">No tools match your current filters. Try a different keyword or turn off favorites only.</p>
          ) : (
            <div className="tools-grid">
              {filtered.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`scroll-reveal reveal-subtle ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                  style={{ '--reveal-delay': `${Math.min(index * 32, 260)}ms` }}
                  data-scroll-reveal
                >
                  <ToolCard
                    tool={tool}
                    isFavorite={favorites.includes(tool.name)}
                    isCompared={compareList.includes(tool.name)}
                    userRating={userRatings[tool.name] || 0}
                    clickCount={toolClicks[tool.name] || 0}
                    helpfulVote={helpfulVotes[tool.name] || null}
                    onToggleFavorite={toggleFavorite}
                    onToggleCompare={toggleCompare}
                    onTagClick={(tag) => setSearch(tag)}
                    onRate={rateTool}
                    onVisit={trackToolClick}
                    onHelpfulVote={handleHelpfulVote}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section amazon-section" id="amazon-picks">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Amazon Picks for AI Creators</h2>
              <p className="section-copy">Hardware and accessories we recommend for faster AI workflows, research, and productivity.</p>
            </div>
            <div className="results-chip">{dailyAmazonRecommendations.length} picks • rotates daily</div>
          </div>
          <div className="amazon-grid">
            {dailyAmazonRecommendations.map((item, index) => (
              <div
                key={item.name}
                className={`scroll-reveal reveal-subtle ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ '--reveal-delay': `${Math.min(index * 65, 180)}ms` }}
                data-scroll-reveal
              >
                <AmazonPickCard
                  item={item}
                  clickCount={amazonClicks[item.name] || 0}
                  onVisit={trackAmazonClick}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="comparison-pages">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>ChatGPT vs Claude, Midjourney vs DALL·E, and more</h2>
              <p className="section-copy">Comparison pages are built for high-intent search and faster buying decisions.</p>
            </div>
          </div>
          <article className="compare-table-shell">
            <h3>{COMPARISON_PAGES[0].title}</h3>
            <ComparisonTable comparison={COMPARISON_PAGES[0]} />
          </article>
          <div className="landing-links-grid">
            {COMPARISON_PAGES.map((page) => (
              <a key={page.slug} href={`/compare/${page.slug}`} className="landing-link-card">
                <strong>{page.title}</strong>
                <span>{page.description}</span>
              </a>
            ))}
          </div>
          <div className="hero-cta-row" style={{ marginTop: '1rem' }}>
            <a href="/compare-hub" className="btn btn-secondary">Open Comparison Matrix Hub</a>
          </div>
        </section>

        <AdUnit slot="5543871290" className="ad-unit-inline" />

        <section className="section compare-section" id="compare">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Compare Tools Side by Side</h2>
              <p className="section-copy">Add up to three tools from the directory to compare pricing, category, rating, and use cases.</p>
            </div>
            <div className="results-chip">{comparisonTools.length}/3 selected</div>
          </div>
          {comparisonTools.length === 0 ? (
            <p className="empty-state">No tools selected yet. Use the Compare button on any card to build a shortlist.</p>
          ) : (
            <div className="comparison-grid">
              {comparisonTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`scroll-reveal reveal-subtle ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                  style={{ '--reveal-delay': `${Math.min(index * 80, 240)}ms` }}
                  data-scroll-reveal
                >
                  <ComparisonCard tool={tool} onRemove={toggleCompare} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section info-section" id="how-ai-works">
          <div className="info-grid">
            <div>
              <h2>How AI Tools Actually Work</h2>
              <p>
                Most modern AI tools are powered by <strong>Large Language Models (LLMs)</strong> —
                neural networks trained on vast amounts of text, code, and images. They predict the
                best next output given your input (called a prompt).
              </p>
              <p>
                When you type a question into ChatGPT or describe an image to Midjourney, the model
                processes your words, understands context, and generates a response — all in seconds.
              </p>
              <p>
                Newer models are <strong>multimodal</strong>, meaning they can understand and generate
                text, images, audio, and video in a single conversation.
              </p>
            </div>
            <div className="info-cards">
              {[
                { icon: '🧠', title: 'LLMs', desc: 'Large Language Models predict outputs from your text prompts.' },
                { icon: '🎨', title: 'Diffusion Models', desc: 'Generate images by progressively refining noise into visuals.' },
                { icon: '⚙️', title: 'Agents', desc: 'AI agents take multi-step actions to complete complex goals.' },
                { icon: '🔗', title: 'RAG', desc: 'Retrieval-Augmented Generation grounds AI answers in real data.' },
              ].map((card) => (
                <div key={card.title} className="info-card">
                  <span className="info-icon">{card.icon}</span>
                  <div>
                    <strong>{card.title}</strong>
                    <p>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <h2>What You Can Do with AI Tools</h2>
          <div className="use-cases-grid">
            {[
              { icon: '✍️', title: 'Write content faster', desc: 'Blogs, emails, social posts, ad copy, and more in minutes.' },
              { icon: '💻', title: 'Build software', desc: 'Generate, explain, and debug code without deep expertise.' },
              { icon: '🖼️', title: 'Create visuals', desc: 'Design logos, illustrations, and marketing images from text.' },
              { icon: '🎬', title: 'Produce videos', desc: 'Generate cinematic short-form videos from a text description.' },
              { icon: '📊', title: 'Analyze data', desc: 'Summarize reports, extract insights, and build dashboards.' },
              { icon: '🤖', title: 'Automate workflows', desc: 'Connect apps and eliminate repetitive manual tasks.' },
            ].map((useCase, index) => (
              <div
                key={useCase.title}
                className={`use-case-card scroll-reveal reveal-elastic ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ '--reveal-delay': `${Math.min(index * 45, 220)}ms` }}
                data-scroll-reveal
              >
                <span className="use-icon">{useCase.icon}</span>
                <h3>{useCase.title}</h3>
                <p>{useCase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section news-section" id="ai-news">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>AI News &amp; Updates</h2>
              <p className="section-copy">The latest launches, model releases, and product updates from the AI world.</p>
            </div>
            <span className="results-chip">Updated May 2026</span>
          </div>
          <div className="news-grid">
            {AI_NEWS.map((item, index) => (
              <div
                key={item.title}
                className={`news-card scroll-reveal reveal-elastic ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ '--reveal-delay': `${Math.min(index * 48, 260)}ms` }}
                data-scroll-reveal
              >
                <div className="news-card-top">
                  <span className="news-tag">{item.tag}</span>
                  <span className="news-date">{item.date}</span>
                </div>
                <h3 className="news-title">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="news-title-link">
                    {item.title}
                  </a>
                </h3>
                <p className="news-summary">{item.summary}</p>
              </div>
            ))}
          </div>
          <AdUnit slot="1826409753" className="ad-unit-inline" />
        </section>

        <section className="section" id="faq">
          <div className="section-divider"></div>
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <FaqItem
                key={faq.q}
                q={faq.q}
                a={faq.a}
                className={`scroll-reveal reveal-subtle ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'}`}
                style={{ '--reveal-delay': `${Math.min(index * 48, 220)}ms` }}
              />
            ))}
          </div>
        </section>

        <section className="section submit-tool-section" id="submit-tool">
          <h2>Submit Your Tool</h2>
          <p className="section-copy">
            Building an AI product? Share your tool for review and potential listing in AIToolsCenter.
          </p>
          <form className="submit-tool-form" onSubmit={handleToolSubmit} noValidate>
            <label className="field-group">
              <span>Tool name</span>
              <input
                name="name"
                type="text"
                value={toolSubmission.name}
                onChange={handleToolInputChange}
                placeholder="Example: PromptPilot"
                aria-invalid={Boolean(toolErrors.name)}
                required
              />
              {toolErrors.name ? <small className="field-error">{toolErrors.name}</small> : null}
            </label>

            <label className="field-group">
              <span>Website URL</span>
              <input
                name="url"
                type="url"
                value={toolSubmission.url}
                onChange={handleToolInputChange}
                placeholder="https://yourtool.com"
                aria-invalid={Boolean(toolErrors.url)}
                required
              />
              {toolErrors.url ? <small className="field-error">{toolErrors.url}</small> : null}
            </label>

            <label className="field-group">
              <span>Category</span>
              <select
                name="category"
                value={toolSubmission.category}
                onChange={handleToolInputChange}
              >
                {TOOL_CATEGORIES.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Pricing</span>
              <select
                name="pricing"
                value={toolSubmission.pricing}
                onChange={handleToolInputChange}
              >
                {PRICING_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="field-group field-group-full">
              <span>Contact email</span>
              <input
                name="contactEmail"
                type="email"
                value={toolSubmission.contactEmail}
                onChange={handleToolInputChange}
                placeholder="founder@yourtool.com"
                aria-invalid={Boolean(toolErrors.contactEmail)}
                required
              />
              {toolErrors.contactEmail ? <small className="field-error">{toolErrors.contactEmail}</small> : null}
            </label>

            <label className="field-group field-group-full">
              <span>What does your tool do?</span>
              <textarea
                name="description"
                value={toolSubmission.description}
                onChange={handleToolInputChange}
                rows={5}
                placeholder="Describe use case, who it's for, and what makes it different."
                aria-invalid={Boolean(toolErrors.description)}
                required
              />
              {toolErrors.description ? <small className="field-error">{toolErrors.description}</small> : null}
            </label>

            <div className="field-group-full submit-tool-actions">
              <button type="submit" className="btn btn-primary" disabled={isSubmittingTool}>
                {isSubmittingTool ? 'Submitting...' : 'Submit Tool'}
              </button>
              {toolSubmitStatus.message ? (
                <p className={`submit-tool-status ${toolSubmitStatus.type === 'error' ? 'is-error' : 'is-success'}`}>
                  {toolSubmitStatus.message}
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <section className="section finder-section" id="finder-quiz">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>AI Tool Finder Quiz</h2>
              <p className="section-copy">What do you want to do with AI? Choose one goal to get instant recommendations.</p>
            </div>
          </div>
          <div className="quiz-shell">
            <label className="toolbar-field">
              <span>Primary Goal</span>
              <select value={quizGoal} onChange={(event) => setQuizGoal(event.target.value)}>
                <option value="write content">Write content</option>
                <option value="video">Make videos</option>
                <option value="coding">Code</option>
                <option value="research">Research</option>
                <option value="study">Study</option>
                <option value="business">Start business</option>
              </select>
            </label>
            <div className="quiz-results">
              {quizMatches.map((tool) => (
                <article key={tool.name} className="quiz-result-card">
                  <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
                  <p>{tool.tagline}</p>
                  <a className="btn btn-secondary" href={getToolOutboundUrl(tool)} target="_blank" rel={getToolAnchorRel(tool)}>Try {tool.name}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <AdUnit slot="7482196035" className="ad-unit-inline" />

        <section className="section newsletter" id="newsletter">
          <h2>Get Weekly AI Tool Picks in Your Inbox</h2>
          <p>Get 5 new AI tools every week: trending picks, free tools, prompts, and practical AI business ideas.</p>
          <div className="lead-magnet-row">
            <a className="btn btn-secondary" href="/ai-workflow-kit.txt" target="_blank" rel="noopener noreferrer">Download Free AI Workflow Kit</a>
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

      {showExitIntent ? (
        <section className="exit-intent-modal" role="dialog" aria-label="Free AI workflow kit" aria-live="polite">
          <div className="exit-intent-card">
            <button type="button" className="exit-intent-close" onClick={dismissExitIntent} aria-label="Close">
              ×
            </button>
            <h3>Before you go: grab the free AI Workflow Kit</h3>
            <p>Get practical prompts and repeatable AI workflows, plus 5 new AI tools each week.</p>
            <form className="exit-intent-form" onSubmit={handleExitIntentSubmit}>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={exitIntentEmail}
                onChange={(event) => setExitIntentEmail(event.target.value)}
                aria-label="Email for workflow kit"
              />
              <button type="submit" className="btn btn-primary">Get the Kit</button>
            </form>
            {exitIntentStatus.message ? (
              <p className={`newsletter-status ${exitIntentStatus.type === 'error' ? 'is-error' : 'is-success'}`}>
                {exitIntentStatus.message}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      <SiteFooter />
    </div>
  )
}

export default App

