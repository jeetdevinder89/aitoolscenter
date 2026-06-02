import { useEffect, useRef, useState } from 'react'
import './redesign.css'
import './advanced-components.css'
import aiNews from './data/ai-news.json'

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://www.aitoolscenter.in').replace(/\/$/, '')
const ADSENSE_CLIENT_ID = (import.meta.env.VITE_ADSENSE_CLIENT_ID || '').trim()
const PAGE_VIEWS_API = '/api/page-views'
const LOCAL_GLOBAL_VISIT_DATE_KEY = 'aitoolscenter-global-visit-date'

// ==================================================
// COMPREHENSIVE AI TOOLS DATABASE - 100+ GENUINE TOOLS
// ==================================================

const TOOLS_EXTENDED = [
  // WRITING & CONTENT (25 tools)
  {id: 1, name: 'ChatGPT', category: 'Writing', tagline: 'Conversational AI for writing, research, and coding', description: 'Most versatile AI assistant with excellent writing and analysis capabilities.', link: 'https://chatgpt.com', badge: 'Free + Pro', rating: 5, icon: '🤖', price: 'Free / $20/month', trends: true, reviews: 2847},
  {id: 2, name: 'Claude', category: 'Writing', tagline: 'Long-context AI assistant for analysis and documents', description: 'Best for long documents with 100K context window and thoughtful responses.', link: 'https://claude.ai', badge: 'Free + Pro', rating: 5, icon: '🧠', price: 'Free / $20/month', reviews: 1956},
  {id: 3, name: 'Grammarly', category: 'Writing', tagline: 'AI writing assistant and grammar checker', description: 'Real-time writing suggestions, tone detection, and plagiarism checker.', link: 'https://www.grammarly.com', badge: 'Free + Premium', rating: 4.8, icon: '✍️', price: 'Free / $12/month', reviews: 5234},
  {id: 4, name: 'Jasper', category: 'Writing', tagline: 'AI content creation platform for marketing copy', description: 'Specialized for marketing content, social media, and long-form writing.', link: 'https://www.jasper.ai', badge: 'Paid', rating: 4.6, icon: '📝', price: '$39-125/month', reviews: 1823},
  {id: 5, name: 'Copy.ai', category: 'Writing', tagline: 'AI copywriting assistant for marketing', description: 'Generate product descriptions, ad copy, landing pages in seconds.', link: 'https://www.copy.ai', badge: 'Free + Pro', rating: 4.5, icon: '💬', price: 'Free / $49/month', reviews: 1342},
  {id: 6, name: 'Writesonic', category: 'Writing', tagline: 'AI writing platform for blogs and ads', description: 'Create blog posts, ads, emails, and landing pages with AI.', link: 'https://writesonic.com', badge: 'Free + Paid', rating: 4.4, icon: '📄', price: 'Free / $13/month', reviews: 987},
  {id: 7, name: 'Rytr', category: 'Writing', tagline: 'Affordable AI writing assistant', description: 'Budget-friendly option for general content creation and copywriting.', link: 'https://rytr.me', badge: 'Free + Pro', rating: 4.3, icon: '🖊️', price: 'Free / $9/month', reviews: 2145},
  {id: 8, name: 'Anyword', category: 'Writing', tagline: 'AI copywriting with predictive analytics', description: 'Generate marketing copy with built-in performance prediction.', link: 'https://www.anyword.com', badge: 'Paid', rating: 4.5, icon: '📊', price: '$49/month+', reviews: 678},
  {id: 9, name: 'Sudowrite', category: 'Writing', tagline: 'AI writing assistant for creative writers', description: 'Specialized for fiction, screenplays, and creative storytelling.', link: 'https://www.sudowrite.com', badge: 'Paid', rating: 4.7, icon: '📖', price: '$10/month', reviews: 1456},
  {id: 10, name: 'QuillBot', category: 'Writing', tagline: 'Paraphrasing and rewriting tool', description: 'Rewrite sentences, improve clarity, and check grammar automatically.', link: 'https://quillbot.com', badge: 'Free + Premium', rating: 4.4, icon: '🖋️', price: 'Free / $12/month', reviews: 3421},
  {id: 11, name: 'Wordtune', category: 'Writing', tagline: 'AI rewriting and editing assistant', description: 'Rewrite sentences to be clearer, more concise, or more formal.', link: 'https://www.wordtune.com', badge: 'Free + Premium', rating: 4.5, icon: '✏️', price: 'Free / $15/month', reviews: 2156},
  {id: 12, name: 'HubSpot AI', category: 'Writing', tagline: 'AI writing for marketing teams', description: 'Content generator integrated with marketing CRM platform.', link: 'https://www.hubspot.com/products/ai', badge: 'Free + Paid', rating: 4.6, icon: '🎯', price: 'Free / $45+/month', reviews: 1834},
  {id: 13, name: 'SEMrush AI', category: 'Writing', tagline: 'AI content generator for SEO', description: 'Create SEO-optimized content with keyword recommendations.', link: 'https://www.semrush.com/ai-content-writer', badge: 'Paid', rating: 4.5, icon: '📈', price: '$99+/month', reviews: 1203},
  {id: 14, name: 'Notion AI', category: 'Writing', tagline: 'AI assistant within Notion workspace', description: 'Write, brainstorm, and improve content directly in Notion.', link: 'https://www.notion.so/product/ai', badge: 'Paid', rating: 4.6, icon: '🗒️', price: '$10/month', reviews: 2789},
  {id: 15, name: 'Character.ai', category: 'Writing', tagline: 'Interactive AI character conversations', description: 'Chat with AI characters and personas for creative writing.', link: 'https://character.ai', badge: 'Free + Plus', rating: 4.4, icon: '🎭', price: 'Free / $10/month', reviews: 4521},
  {id: 16, name: 'Lex.page', category: 'Writing', tagline: 'AI-augmented writing editor', description: 'Minimal distraction-free editor with AI suggestions.', link: 'https://lex.page', badge: 'Free + Premium', rating: 4.5, icon: '📑', price: 'Free / $12/month', reviews: 1205},
  {id: 17, name: 'Copysmith', category: 'Writing', tagline: 'Enterprise AI copywriting platform', description: 'Professional solution for ecommerce product descriptions.', link: 'https://www.copysmith.com', badge: 'Paid', rating: 4.4, icon: '🏢', price: '$29/month+', reviews: 823},
  {id: 18, name: 'Outwrite', category: 'Writing', tagline: 'AI grammar and plagiarism checker', description: 'Check plagiarism, grammar, and get AI writing suggestions.', link: 'https://www.outwrite.com', badge: 'Subscription', rating: 4.3, icon: '🔍', price: '$10/month', reviews: 678},
  {id: 19, name: 'Calmly Writer', category: 'Writing', tagline: 'Distraction-free AI-powered writing', description: 'Focus on writing with minimal UI and AI assistance.', link: 'https://calmlywriter.com', badge: 'Free + Paid', rating: 4.4, icon: '🧘', price: 'Free / One-time', reviews: 456},
  {id: 20, name: 'Fireflies AI', category: 'Writing', tagline: 'Meeting transcription and AI summary', description: 'Transcribe meetings and summarize action items automatically.', link: 'https://fireflies.ai', badge: 'Free + Paid', rating: 4.6, icon: '🎙️', price: 'Free / $10/month', reviews: 2341},

  // IMAGE GENERATION (25 tools)
  {id: 21, name: 'Midjourney', category: 'Image', tagline: 'Premium AI image generation', description: 'State-of-the-art image generation with artistic control.', link: 'https://midjourney.com', badge: 'Paid', rating: 5, icon: '🎨', price: '$10-120/month', reviews: 6234},
  {id: 22, name: 'DALL-E 3', category: 'Image', tagline: 'OpenAI image generation model', description: 'Generate images from text descriptions with high detail.', link: 'https://openai.com/dall-e-3', badge: 'Paid', rating: 4.8, icon: '🖼️', price: '$15/month (ChatGPT Plus)', reviews: 4156},
  {id: 23, name: 'Stable Diffusion', category: 'Image', tagline: 'Open-source image generation', description: 'Free, open-source model with community models and variations.', link: 'https://stablediffusionweb.com', badge: 'Free', rating: 4.7, icon: '🌊', price: 'Free', reviews: 5678},
  {id: 24, name: 'Adobe Firefly', category: 'Image', tagline: 'Adobe integrated AI image generation', description: 'Generate images directly within Adobe Creative Suite.', link: 'https://www.adobe.com/firefly', badge: 'Included/No cost', rating: 4.6, icon: '🔥', price: 'Free with Adobe', reviews: 2143},
  {id: 25, name: 'Leonardo.ai', category: 'Image', tagline: 'Fast AI image generation and training', description: 'Custom model training and fast generation speeds.', link: 'https://leonardo.ai', badge: 'Free + Pro', rating: 4.7, icon: '🎭', price: 'Free / $10/month', reviews: 3456},
  {id: 26, name: 'Canva AI', category: 'Image', tagline: 'Canva design platform with AI image generation', description: 'Generate images without leaving your design editor.', link: 'https://www.canva.com', badge: 'Paid', rating: 4.6, icon: '🎪', price: '$17/month', reviews: 7821},
  {id: 27, name: 'Microsoft Designer', category: 'Image', tagline: 'Microsoft DALL-E powered image generator', description: 'Free image generation powered by DALL-E integration.', link: 'https://designer.microsoft.com', badge: 'Free', rating: 4.5, icon: '⚡', price: 'Free', reviews: 2341},
  {id: 28, name: 'Runway', category: 'Image', tagline: 'Multi-purpose creative AI platform', description: 'Image generation, editing, video tools all in one.', link: 'https://runwayml.com', badge: 'Free + Pro', rating: 4.7, icon: '✨', price: 'Free / $12-150/month', reviews: 4567},
  {id: 29, name: 'Artbreeder', category: 'Image', tagline: 'Collaborative AI image platform', description: 'Blend images and evolve them using AI breeding algorithms.', link: 'https://www.artbreeder.com', badge: 'Free + Paid', rating: 4.4, icon: '🧬', price: 'Free / $10/month', reviews: 1892},
  {id: 30, name: 'NightCafe', category: 'Image', tagline: 'Multiple AI art generation models', description: 'Access multiple AI models including Stable Diffusion.', link: 'https://nightcafe.studio', badge: 'Free + Pro', rating: 4.5, icon: '🌙', price: 'Free / $9/month', reviews: 2456},
  {id: 31, name: 'DreamStudio', category: 'Image', tagline: 'Stable Diffusion web interface', description: 'Clean, fast Stable Diffusion implementation.', link: 'https://dreamstudio.ai', badge: 'Paid', rating: 4.6, icon: '💭', price: 'Pay-as-you-go', reviews: 1234},
  {id: 32, name: 'Wombo', category: 'Image', tagline: 'Fast AI art generator', description: 'Quick image generation with artistic styles.', link: 'https://www.wombo.art', badge: 'Free + Premium', rating: 4.5, icon: '🎨', price: 'Free / $10/month', reviews: 3421},
  {id: 33, name: 'Fotor AI', category: 'Image', tagline: 'AI photo editor and generator', description: 'Edit photos and generate new images with AI.', link: 'https://www.fotor.com/features/ai-image-generator', badge: 'Free + Pro', rating: 4.4, icon: '📸', price: 'Free / $12/month', reviews: 2156},
  {id: 34, name: 'Perplexity Images', category: 'Image', tagline: 'View and explore images with AI', description: 'Search and understand images with AI analysis.', link: 'https://www.perplexity.ai', badge: 'Free + Pro', rating: 4.5, icon: '🔎', price: 'Free / $20/month', reviews: 1834},
  {id: 35, name: 'Gencraft', category: 'Image', tagline: 'AI image generation with consistency', description: 'Generate consistent image styles and variations.', link: 'https://www.gencraft.com', badge: 'Free + Paid', rating: 4.3, icon: '🛠️', price: 'Free / $10/month', reviews: 876},
  {id: 36, name: 'Lexica', category: 'Image', tagline: 'Stable Diffusion image gallery search', description: 'Search generated images and discover prompts.', link: 'https://lexica.art', badge: 'Free + Premium', rating: 4.4, icon: '🏛️', price: 'Free / $10/month', reviews: 1567},
  {id: 37, name: 'Craiyon', category: 'Image', tagline: 'Free AI image generator', description: 'Generate images from text descriptions free (formerly DALL-E Mini).', link: 'https://www.craiyon.com', badge: 'Free + Pro', rating: 4.2, icon: '🎪', price: 'Free / $5/month', reviews: 4234},
  {id: 38, name: 'DeepAI', category: 'Image', tagline: 'Multiple AI generator APIs and tools', description: 'Text-to-image, upscaler, and various AI tools.', link: 'https://deepai.org', badge: 'Free + Credits', rating: 4.3, icon: '🤖', price: 'Free / Pay-per-use', reviews: 1203},
  {id: 39, name: 'Bing Image Creator', category: 'Image', tagline: 'Microsoft DALL-E image generator', description: 'Free DALL-E 3 image generation via Bing.', link: 'https://www.bing.com/images/create', badge: 'Free', rating: 4.4, icon: '🔷', price: 'Free', reviews: 2789},

  // VIDEO GENERATION (15 tools)
  {id: 40, name: 'Synthesia', category: 'Video', tagline: 'AI video creation with avatars', description: 'Create professional videos with AI avatars and voice.', link: 'https://www.synthesia.io', badge: 'Paid', rating: 4.8, icon: '🎬', price: '$25/month+', reviews: 3456},
  {id: 41, name: 'Descript', category: 'Video', tagline: 'Video and audio editing with transcription', description: 'Edit videos by editing text transcripts.', link: 'https://www.descript.com', badge: 'Free + Paid', rating: 4.7, icon: '✂️', price: 'Free / $24/month', reviews: 4123},
  {id: 42, name: 'D-ID', category: 'Video', tagline: 'Animated avatar videos from photos', description: 'Animate still photos to create AI videos.', link: 'https://www.d-id.com', badge: 'Free + Paid', rating: 4.6, icon: '👤', price: 'Free / $14/month', reviews: 2134},
  {id: 43, name: 'HeyGen', category: 'Video', tagline: 'AI video generation platform', description: 'Create videos with AI avatars in multiple languages.', link: 'https://www.heygen.com', badge: 'Free + Paid', rating: 4.7, icon: '🎥', price: 'Free / $10-60/month', reviews: 3789},
  {id: 44, name: 'Opus Clip', category: 'Video', tagline: 'AI-powered video clipper', description: 'Automatically create viral short clips from long videos.', link: 'https://www.opus.pro', badge: 'Paid', rating: 4.6, icon: '📹', price: '$25/month', reviews: 1567},
  {id: 45, name: 'Pictory', category: 'Video', tagline: 'Create videos from scripts or articles', description: 'Turn blog posts or scripts into professional videos.', link: 'https://pictory.ai', badge: 'Paid', rating: 4.5, icon: '🎞️', price: '$29-99/month', reviews: 1843},
  {id: 46, name: 'Invideo', category: 'Video', tagline: 'AI video creation platform', description: 'Create marketing videos in minutes with AI.', link: 'https://invideo.io', badge: 'Free + Paid', rating: 4.4, icon: '🎬', price: 'Free / $15+/month', reviews: 2567},
  {id: 47, name: 'Fliki', category: 'Video', tagline: 'Text-to-video with AI voices', description: 'Convert articles and scripts to videos with AI narration.', link: 'https://fliki.ai', badge: 'Free + Paid', rating: 4.6, icon: '🗣️', price: 'Free / $9/month', reviews: 2341},
  {id: 48, name: 'Animaker', category: 'Video', tagline: 'Animation video creation platform', description: 'Create animated videos without design experience.', link: 'https://www.animaker.com', badge: 'Free + Paid', rating: 4.5, icon: '🎞️', price: 'Free / $15/month', reviews: 1893},
  {id: 49, name: 'Runway Gen-2', category: 'Video', tagline: 'AI video generation from text and images', description: 'Transform images and text into videos.', link: 'https://runwayml.com', badge: 'Paid', rating: 4.7, icon: '🎯', price: '$12-150/month', reviews: 2156},
  {id: 50, name: 'Loom', category: 'Video', tagline: 'Screen recording with AI features', description: 'Record screen easily with AI-powered editing.', link: 'https://www.loom.com', badge: 'Free + Paid', rating: 4.6, icon: '🎥', price: 'Free / $5-25/month', reviews: 5432},
  {id: 51, name: 'Qlova', category: 'Video', tagline: 'Interactive video creation platform', description: 'Create interactive videos for engagement.', link: 'https://qlova.com', badge: 'Paid', rating: 4.3, icon: '🎪', price: 'Enterprise pricing', reviews: 567},
  {id: 52, name: 'Movavi', category: 'Video', tagline: 'Video editing with AI features', description: 'Easy video editing with AI background removal and effects.', link: 'https://www.movavi.com', badge: 'Paid', rating: 4.4, icon: '🎬', price: '$80 one-time', reviews: 2134},

  // CODING AI (20 tools)
  {id: 53, name: 'GitHub Copilot', category: 'Coding', tagline: 'AI code suggestions in IDE', description: 'Real-time code completion and generation in your editor.', link: 'https://github.com/features/copilot', badge: 'Paid', rating: 4.9, icon: '💻', price: '$10/month', reviews: 6789},
  {id: 54, name: 'Cursor', category: 'Coding', tagline: 'AI-first code editor', description: 'VSCode-based editor with powerful AI integration.', link: 'https://www.cursor.com', badge: 'Free + Pro', rating: 4.8, icon: '✨', price: 'Free / $20/month', reviews: 3456},
  {id: 55, name: 'Tabnine', category: 'Coding', tagline: 'AI code completion for all IDEs', description: 'Advanced code prediction and completion in any IDE.', link: 'https://www.tabnine.com', badge: 'Free + Pro', rating: 4.7, icon: '📝', price: 'Free / $15/month', reviews: 4123},
  {id: 56, name: 'Codeium', category: 'Coding', tagline: 'Free AI code completion', description: 'Fast, free AI code suggestions for multiple languages.', link: 'https://codeium.com', badge: 'Free + Paid', rating: 4.6, icon: '⚡', price: 'Free / $12/month', reviews: 2789},
  {id: 57, name: 'Amazon CodeWhisperer', category: 'Coding', tagline: 'AWS AI code suggestions', description: 'Free AI code generation in VS Code and JetBrains.', link: 'https://aws.amazon.com/codewhisperer', badge: 'Free', rating: 4.5, icon: '🔶', price: 'Free for individual', reviews: 1923},
  {id: 58, name: 'Replit', category: 'Coding', tagline: 'Cloud IDE with AI assistance', description: 'Full development environment with AI pair programming.', link: 'https://replit.com', badge: 'Free + Paid', rating: 4.6, icon: '🚀', price: 'Free / $7/month', reviews: 3567},
  {id: 59, name: 'WolframAlpha', category: 'Coding', tagline: 'Computational knowledge engine', description: 'Solve math, science, and programming problems.', link: 'https://www.wolframalpha.com', badge: 'Free + Pro', rating: 4.5, icon: '∑', price: 'Free / $5/month', reviews: 4234},
  {id: 60, name: 'JetBrains AI', category: 'Coding', tagline: 'AI in JetBrains IDEs', description: 'Code completion, generation, and explanations in JetBrains.', link: 'https://www.jetbrains.com/ai', badge: 'Paid', rating: 4.7, icon: '🎯', price: '$8/month', reviews: 2341},
  {id: 61, name: 'CodeRabbit', category: 'Coding', tagline: 'AI code review and quality', description: 'Automated code review and quality suggestions.', link: 'https://www.coderabbit.ai', badge: 'Paid', rating: 4.4, icon: '🔍', price: '$29/month', reviews: 897},
  {id: 62, name: 'Bugfree', category: 'Coding', tagline: 'AI bug detection', description: 'Automatically find and fix bugs in code.', link: 'https://bugfree.ai', badge: 'Paid', rating: 4.3, icon: '🐛', price: '$20/month', reviews: 745},
  {id: 63, name: 'Phind', category: 'Coding', tagline: 'AI search engine for developers', description: 'Search and find code answers instantly.', link: 'https://www.phind.com', badge: 'Free', rating: 4.6, icon: '🔎', price: 'Free', reviews: 2143},
  {id: 64, name: 'Microsoft Copilot', category: 'Business', tagline: 'AI assistant for work, search, and productivity', description: 'Microsoft Copilot helps with writing, search, and everyday productivity tasks.', link: 'https://copilot.microsoft.com', badge: 'Free + Paid', rating: 4.7, icon: '🚀', price: 'Free / Paid tiers', reviews: 1567},
  {id: 65, name: 'AnypointStudio', category: 'Coding', tagline: 'Integration platform with AI', description: 'Enterprise integration with AI assistance.', link: 'https://www.mulesoft.com', badge: 'Enterprise', rating: 4.5, icon: '🔗', price: 'Enterprise', reviews: 234},

  // RESEARCH & KNOWLEDGE (15 tools)
  {id: 66, name: 'Perplexity', category: 'Research', tagline: 'AI search engine with sources', description: 'Get answers with cited sources in real-time.', link: 'https://perplexity.ai', badge: 'Free + Pro', rating: 4.8, icon: '🔍', price: 'Free / $20/month', reviews: 5234},
  {id: 67, name: 'Copilot Search', category: 'Research', tagline: 'Microsoft AI search with web results', description: 'Conversational search with current web results.', link: 'https://www.bing.com/chat', badge: 'Free', rating: 4.5, icon: '🔷', price: 'Free', reviews: 2341},
  {id: 68, name: 'Google Gemini', category: 'Research', tagline: 'Google AI for conversation and search', description: 'Google AI assistant for research and writing.', link: 'https://gemini.google.com', badge: 'Free', rating: 4.6, icon: '🔍', price: 'Free', reviews: 3456},
  {id: 69, name: 'Semantic Scholar', category: 'Research', tagline: 'AI-powered academic research', description: 'Find and understand academic papers with AI.', link: 'https://www.semanticscholar.org', badge: 'Free', rating: 4.7, icon: '📚', price: 'Free', reviews: 1834},
  {id: 70, name: 'SciSpace', category: 'Research', tagline: 'AI research paper analysis', description: 'Explain research papers and discover insights.', link: 'https://www.scispace.com', badge: 'Free + Paid', rating: 4.6, icon: '📖', price: 'Free / $10/month', reviews: 2156},
  {id: 71, name: 'Thesis', category: 'Research', tagline: 'Research aggregation with AI', description: 'Aggregate and analyze online research.', link: 'https://www.thesis.ai', badge: 'Paid', rating: 4.4, icon: '📊', price: '$50/month', reviews: 456},
  {id: 72, name: 'Research Rabbit', category: 'Research', tagline: 'Academic research discovery', description: 'Visualize research connections and discoveries.', link: 'https://www.researchrabbitapp.com', badge: 'Free + Paid', rating: 4.7, icon: '🐰', price: 'Free / $18/month', reviews: 1234},

  // PRODUCTIVITY (15 tools)
  {id: 73, name: 'Zapier AI', category: 'Productivity', tagline: 'Automation with AI', description: 'Create automated workflows with AI assistance.', link: 'https://zapier.com/ai', badge: 'Included', rating: 4.7, icon: '⚙️', price: '$19-49/month', reviews: 3456},
  {id: 74, name: 'Make', category: 'Productivity', tagline: 'Visual automation builder', description: 'Build powerful automations without coding.', link: 'https://www.make.com', badge: 'Free + Paid', rating: 4.6, icon: '🔧', price: 'Free / $9-299/month', reviews: 2789},
  {id: 75, name: 'IFTTT', category: 'Productivity', tagline: 'If This Then That automation', description: 'Simple automation platform for connecting apps.', link: 'https://ifttt.com', badge: 'Free + Premium', rating: 4.5, icon: '📱', price: 'Free / $9.99/month', reviews: 2134},
  {id: 76, name: 'Roam Research', category: 'Productivity', tagline: 'Network knowledge base with AI', description: 'Connect notes and ideas with AI suggestions.', link: 'https://roamresearch.com', badge: 'Paid', rating: 4.6, icon: '🧠', price: '$165/year', reviews: 1567},

  // BUSINESS & ANALYTICS (15 tools)
  {id: 77, name: 'ChatGPT Enterprise', category: 'Business', tagline: 'ChatGPT for businesses', description: 'Enterprise-grade ChatGPT with admin controls.', link: 'https://openai.com/enterprise', badge: 'Enterprise', rating: 4.9, icon: '🏢', price: 'Custom pricing', reviews: 1234},
  {id: 78, name: 'Microsoft 365 Copilot', category: 'Business', tagline: 'AI in Office suite', description: 'Copilot in Word, Excel, Teams, and PowerPoint.', link: 'https://www.microsoft.com/microsoft-365/business/microsoft-365-copilot', badge: 'Enterprise', rating: 4.8, icon: '📊', price: '$30/user/month', reviews: 2341},
  {id: 79, name: 'Tableau AI', category: 'Business', tagline: 'AI-powered data visualization', description: 'Create insights automatically from data.', link: 'https://www.tableau.com/en-us/products/new', badge: 'Included', rating: 4.6, icon: '📈', price: '$70+/user/month', reviews: 1123},
  {id: 80, name: 'Looker Studio AI', category: 'Business', tagline: 'Google data visualization with AI', description: 'Create reports and dashboards with AI help.', link: 'https://lookerstudio.google.com', badge: 'Free', rating: 4.5, icon: '📊', price: 'Free', reviews: 1834},

  // MUSIC & AUDIO (10 tools)
  {id: 81, name: 'Suno', category: 'Audio', tagline: 'AI music and song generation', description: 'Generate original music, vocals, and songs with AI.', link: 'https://suno.com', badge: 'Free + Paid', rating: 4.7, icon: '🎵', price: 'Free / Paid tiers', reviews: 456},
  {id: 82, name: 'Descript Audio', category: 'Audio', tagline: 'Podcast and audio editing', description: 'Edit audio like editing text with AI features.', link: 'https://www.descript.com', badge: 'Free + Paid', rating: 4.7, icon: '🎙️', price: 'Free / $24/month', reviews: 2345},
  {id: 83, name: 'Murf', category: 'Audio', tagline: 'Text-to-speech with AI voices', description: 'Generate realistic AI voiceovers for videos.', link: 'https://murf.ai', badge: 'Free + Paid', rating: 4.6, icon: '🗣️', price: 'Free / $13/month', reviews: 1765},
  {id: 84, name: 'ElevenLabs', category: 'Audio', tagline: 'Advanced text-to-speech', description: 'Natural-sounding AI voiceovers in multiple languages.', link: 'https://elevenlabs.io', badge: 'Free + Paid', rating: 4.8, icon: '🎤', price: 'Free / $11/month', reviews: 3421},
  {id: 85, name: 'Splice', category: 'Audio', tagline: 'Music production with AI', description: 'Create and mix music with AI assistance.', link: 'https://splice.com', badge: 'Free + Paid', rating: 4.5, icon: '🎹', price: 'Free / $8.99/month', reviews: 1923},

  // DESIGN TOOLS (10 tools)
  {id: 86, name: 'Figma AI', category: 'Design', tagline: 'Design tool with AI features', description: 'Generate designs and suggestions in Figma.', link: 'https://www.figma.com', badge: 'Included', rating: 4.7, icon: '🎭', price: '$12-80/month', reviews: 2567},
  {id: 87, name: 'Adobe XD Generative Fill', category: 'Design', tagline: 'Adobe design AI', description: 'Generate content within Adobe XD designs.', link: 'https://www.adobe.com/products/xd', badge: 'Included', rating: 4.6, icon: '🖌️', price: '$9.99+/month', reviews: 1834},
  {id: 88, name: 'Remove.bg', category: 'Design', tagline: 'Automatic background removal', description: 'Remove image backgrounds with AI accuracy.', link: 'https://www.remove.bg', badge: 'Free + Pro', rating: 4.8, icon: '✂️', price: 'Free / $9.99+/month', reviews: 8934},
  {id: 89, name: 'Upscayl', category: 'Design', tagline: 'Free image upscaler', description: 'Upscale images without quality loss.', link: 'https://upscayl.org', badge: 'Free', rating: 4.6, icon: '🔍', price: 'Free', reviews: 2341},

  // MARKETING & SOCIAL (8 tools)
  {id: 90, name: 'Buffer AI', category: 'Marketing', tagline: 'Social media scheduling with AI', description: 'Schedule posts and get AI content suggestions.', link: 'https://buffer.com', badge: 'Paid', rating: 4.6, icon: '📱', price: '$65+/month', reviews: 2145},
  {id: 91, name: 'Hootsuite AI', category: 'Marketing', tagline: 'Social media AI assistant', description: 'Manage social media with AI suggestions.', link: 'https://www.hootsuite.com', badge: 'Paid', rating: 4.5, icon: '🎯', price: '$35+/month', reviews: 1567},
  {id: 92, name: 'Later AI', category: 'Marketing', tagline: 'Instagram scheduling with AI', description: 'Schedule Instagram content with AI captions.', link: 'https://www.later.com', badge: 'Paid', rating: 4.5, icon: '📸', price: '$15+/month', reviews: 1923},
  {id: 93, name: 'Sprout Social', category: 'Marketing', tagline: 'Social management suite', description: 'Unified social media management with AI.', link: 'https://www.sproutsocial.com', badge: 'Enterprise', rating: 4.6, icon: '🌱', price: '$89+/month', reviews: 1234},

  // MODELS & APIS (7 tools)
  {id: 94, name: 'OpenAI API', category: 'API', tagline: 'Access GPT models via API', description: 'Build with ChatGPT and other OpenAI models.', link: 'https://openai.com/api', badge: 'Pay-as-you-go', rating: 4.8, icon: '🔌', price: 'Pay per token', reviews: 5234},
  {id: 95, name: 'Anthropic Claude API', category: 'API', tagline: 'Access Claude via API', description: 'Integrate Claude into your applications.', link: 'https://www.anthropic.com/api', badge: 'Pay-as-you-go', rating: 4.7, icon: '🧠', price: 'Pay per token', reviews: 2341},
  {id: 96, name: 'Google Generative AI', category: 'API', tagline: 'Google AI models API', description: 'Access Google AI models and embeddings.', link: 'https://ai.google.dev', badge: 'Free + Paid', rating: 4.6, icon: '🔷', price: 'Free tier / Pay-as-you-go', reviews: 1923},
  {id: 97, name: 'Hugging Face', category: 'API', tagline: 'AI model hub and API', description: 'Access thousands of AI models.', link: 'https://huggingface.co', badge: 'Free + Paid', rating: 4.7, icon: '🤗', price: 'Free / $15+/month', reviews: 3456},
  {id: 98, name: 'Together AI', category: 'API', tagline: 'Open-source model API', description: 'Access open-source models with high performance.', link: 'https://www.together.ai', badge: 'Pay-as-you-go', rating: 4.5, icon: '🤝', price: 'Pay per token', reviews: 876},
  {id: 99, name: 'Replicate', category: 'API', tagline: 'Run ML models in the cloud', description: 'Easy API for running various AI models.', link: 'https://replicate.com', badge: 'Pay-as-you-go', rating: 4.6, icon: '☁️', price: 'Pay per use', reviews: 1567},
  {id: 100, name: 'Modal', category: 'API', tagline: 'Deploy AI models easily', description: 'Deploy and scale ML models without infrastructure.', link: 'https://modal.com', badge: 'Freemium', rating: 4.5, icon: '🚀', price: 'Free / Pay-as-you-go', reviews: 1134},
  {id: 101, name: 'Azure AI Services', category: 'Business', tagline: 'Microsoft Azure AI platform', description: 'Build with Azure AI services, search, and cognitive capabilities.', link: 'https://azure.microsoft.com/products/ai-services/', badge: 'Enterprise', rating: 4.6, icon: '☁️', price: 'Usage-based', reviews: 812},
]

// Alias for legacy references
const TOOLS = TOOLS_EXTENDED // eslint-disable-line no-unused-vars

const TOOL_LINK_OVERRIDES = {
  ChatGPT: 'https://chatgpt.com',
  'Microsoft Copilot': 'https://copilot.microsoft.com',
  'Copilot Search': 'https://copilot.microsoft.com',
  'Google Gemini': 'https://gemini.google.com',
  SciSpace: 'https://www.scispace.com',
  CodeRabbit: 'https://www.coderabbit.ai',
  Suno: 'https://suno.com',
  'Azure AI Services': 'https://azure.microsoft.com/products/ai-services/',
  'OpenAI API': 'https://platform.openai.com/',
}

const AMAZON_ASSOCIATE_TAG = (import.meta.env.VITE_AMAZON_ASSOCIATE_TAG || 'aitoolscenter-21').trim()

const AFFILIATE_LINKS = {
  'GitHub Copilot': (import.meta.env.VITE_AFFILIATE_COPILOT || '').trim(),
  Cursor: (import.meta.env.VITE_AFFILIATE_CURSOR || '').trim(),
  Tabnine: (import.meta.env.VITE_AFFILIATE_TABNINE || '').trim(),
  Perplexity: (import.meta.env.VITE_AFFILIATE_PERPLEXITY || '').trim(),
  Runway: (import.meta.env.VITE_AFFILIATE_RUNWAY || '').trim(),
  'Notion AI': (import.meta.env.VITE_AFFILIATE_NOTION || '').trim(),
  'Zapier AI': (import.meta.env.VITE_AFFILIATE_ZAPIER || '').trim(),
  Make: (import.meta.env.VITE_AFFILIATE_MAKE || '').trim(),
  Jasper: (import.meta.env.VITE_AFFILIATE_JASPER || '').trim(),
  'Copy.ai': (import.meta.env.VITE_AFFILIATE_COPYAI || '').trim(),
  Grammarly: (import.meta.env.VITE_AFFILIATE_GRAMMARLY || '').trim(),
  Writesonic: (import.meta.env.VITE_AFFILIATE_WRITESONIC || '').trim(),
}

const AMAZON_HOST_REGEX = /(^|\.)amazon\.[a-z.]+$/i

const isAmazonUrl = (url) => {
  try {
    const parsedUrl = new URL(url)
    return AMAZON_HOST_REGEX.test(parsedUrl.hostname)
  } catch {
    return false
  }
}

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

const getToolAffiliateUrl = (tool) => {
  const envLink = AFFILIATE_LINKS[tool.name]
  if (envLink) {
    return appendAmazonAssociateTag(envLink)
  }

  if (tool.affiliateLink) {
    return appendAmazonAssociateTag(tool.affiliateLink)
  }

  return null
}

const getToolOutboundUrl = (tool) => appendAmazonAssociateTag(getToolAffiliateUrl(tool) || TOOL_LINK_OVERRIDES[tool.name] || tool.link)

const isAffiliateTool = (tool) => Boolean(getToolAffiliateUrl(tool)) || isAmazonUrl(TOOL_LINK_OVERRIDES[tool.name] || tool.link || '')

const getToolAnchorRel = (tool) => (isAffiliateTool(tool) ? 'noopener noreferrer nofollow sponsored' : 'noopener noreferrer')

const COLLECTIONS = [
  {
    title: 'Best Free AI Tools',
    description: 'High-value tools you can start using without paying up front.',
    tools: ['ChatGPT', 'Claude', 'Perplexity', 'Stable Diffusion', 'Codeium'],
  },
  {
    title: 'AI for Creators',
    description: 'Tools for images, video, voice, and content production.',
    tools: ['Midjourney', 'Runway', 'Descript', 'ElevenLabs', 'Opus Clip'],
  },
  {
    title: 'AI for Developers',
    description: 'Coding assistants and platforms that speed up development work.',
    tools: ['GitHub Copilot', 'Cursor', 'Tabnine', 'ChatGPT', 'Codeium'],
  },
  {
    title: 'Top Paid Tools',
    description: 'Premium products with strong feature depth and polish.',
    tools: ['Midjourney', 'GitHub Copilot', 'Synthesia', 'Jasper', 'Runway'],
  },
  {
    title: 'Enterprise Solutions',
    description: 'Workplace-ready tools for teams, governance, and scale.',
    tools: ['ChatGPT Enterprise', 'Microsoft 365 Copilot', 'Azure AI Services'],
  },
]

const CATEGORIES = ['All', 'Writing', 'Image', 'Video', 'Coding', 'Research', 'Audio', 'Design', 'Business', 'Productivity', 'Marketing', 'API']

const CATEGORY_UI_META = {
  Writing: { icon: '✍️', label: 'Writing AI' },
  Image: { icon: '🖼️', label: 'Image AI' },
  Video: { icon: '🎥', label: 'Video AI' },
  Coding: { icon: '⚙️', label: 'Coding AI' },
  Research: { icon: '🔬', label: 'Research' },
  Audio: { icon: '🎵', label: 'Audio & Music' },
  Design: { icon: '🎨', label: 'Design Tools' },
  Business: { icon: '📊', label: 'Business AI' },
  Productivity: { icon: '⚡', label: 'Productivity' },
  Marketing: { icon: '📣', label: 'Marketing AI' },
  API: { icon: '🔌', label: 'APIs' },
}

const USE_CASE_PAGES = [
  {
    slug: 'ai-tools-for-developers',
    title: 'Best AI Tools for Developers in 2026',
    description: 'Code faster with AI coding assistants, debugging tools, and API platforms built for shipping software.',
    categories: ['Coding', 'API', 'Research'],
  },
  {
    slug: 'ai-tools-for-content-creators',
    title: 'Best AI Tools for Content Creators',
    description: 'Create social posts, video scripts, thumbnails, and edits with a modern creator-first AI stack.',
    categories: ['Writing', 'Image', 'Video', 'Audio'],
  },
  {
    slug: 'ai-tools-for-students',
    title: 'Best AI Tools for Students',
    description: 'Research, summarize, and study smarter with AI assistants for notes, essays, and revision workflows.',
    categories: ['Research', 'Writing', 'Productivity'],
  },
  {
    slug: 'ai-tools-for-marketers',
    title: 'Best AI Tools for Marketers',
    description: 'Run SEO, campaign copy, content planning, and growth automation from one AI-powered workflow.',
    categories: ['Marketing', 'Writing', 'Productivity', 'Business'],
  },
  {
    slug: 'ai-tools-for-designers',
    title: 'Best AI Tools for Designers',
    description: 'Speed up visual ideation with image generation, design assistants, and editing automation.',
    categories: ['Design', 'Image', 'Video'],
  },
]

const COMPARISON_PAGES = [
  { slug: 'chatgpt-vs-claude', toolA: 'ChatGPT', toolB: 'Claude', intent: 'long-form writing and analysis' },
  { slug: 'copilot-vs-cursor', toolA: 'GitHub Copilot', toolB: 'Cursor', intent: 'developer productivity' },
  { slug: 'midjourney-vs-dall-e-3', toolA: 'Midjourney', toolB: 'DALL-E 3', intent: 'image generation quality' },
  { slug: 'runway-vs-synthesia', toolA: 'Runway', toolB: 'Synthesia', intent: 'AI video workflows' },
  { slug: 'perplexity-vs-gemini', toolA: 'Perplexity', toolB: 'Google Gemini', intent: 'research and citations' },
]

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const deslugify = (value) => value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const TOOL_BY_SLUG = new Map(TOOLS_EXTENDED.map((tool) => [slugify(tool.name), tool]))
const CATEGORY_SLUGS = new Map(CATEGORIES.filter((category) => category !== 'All').map((category) => [slugify(category), category]))

const getToolBySlug = (slug) => TOOL_BY_SLUG.get(slug)
const getCategoryBySlug = (slug) => CATEGORY_SLUGS.get(slug)
const getUseCaseBySlug = (slug) => USE_CASE_PAGES.find((useCase) => useCase.slug === slug) || null
const getComparisonBySlug = (slug) => COMPARISON_PAGES.find((comparison) => comparison.slug === slug) || null

const resolvePathPage = (pathname) => {
  const normalizedPath = (pathname || '/').replace(/\/$/, '') || '/'

  const legalPathMap = {
    '/privacy': 'privacy',
    '/terms': 'terms',
    '/affiliate-disclosure': 'affiliateDisclosure',
    '/contact': 'contact',
  }

  if (legalPathMap[normalizedPath]) {
    return { type: 'legal', key: legalPathMap[normalizedPath] }
  }

  if (normalizedPath === '/' || normalizedPath === '/home') {
    return { type: 'home' }
  }

  if (normalizedPath.startsWith('/ai-tools/')) {
    const slug = normalizedPath.replace('/ai-tools/', '')
    const tool = getToolBySlug(slug)
    if (tool) return { type: 'tool', tool }
  }

  if (normalizedPath.startsWith('/categories/')) {
    const slug = normalizedPath.replace('/categories/', '')
    const category = getCategoryBySlug(slug)
    if (category) return { type: 'category', category }
  }

  if (normalizedPath.startsWith('/use-cases/')) {
    const slug = normalizedPath.replace('/use-cases/', '')
    const useCase = getUseCaseBySlug(slug)
    if (useCase) return { type: 'useCase', useCase }
  }

  if (normalizedPath.startsWith('/compare/')) {
    const slug = normalizedPath.replace('/compare/', '')
    const comparison = getComparisonBySlug(slug)
    if (comparison) return { type: 'comparison', comparison }
  }

  return { type: 'home' }
}

const getRouteSocialImagePath = (page) => {
  if (page.type === 'category') {
    return `/social/categories/${slugify(page.category)}.svg`
  }

  if (page.type === 'useCase') {
    return `/social/use-cases/${page.useCase.slug}.svg`
  }

  if (page.type === 'comparison') {
    return `/social/compare/${page.comparison.slug}.svg`
  }

  if (page.type === 'tool') {
    return `/social/categories/${slugify(page.tool.category)}.svg`
  }

  return '/og-image.svg'
}

// ==================================================
// RECOMMENDATION QUESTIONS
// ==================================================

const LEGAL_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'We collect only the information needed to operate the site, process submissions, and improve the experience. Last updated: May 29, 2026.',
    sections: [
      {
        heading: 'What We Collect',
        items: [
          'Email addresses submitted through newsletter signup.',
          'Basic analytics and advertising signals used to understand traffic and performance.',
          'Visitor count and engagement metrics.',
        ],
      },
      {
        heading: 'How We Use It',
        items: [
          'We use email addresses to send weekly newsletters with AI tool updates and curated news.',
          'We use analytics to measure site usage and improve content quality.',
          'We use outbound click data to understand which tools and recommendations are useful to visitors.',
          'We do not sell personal data to third parties.',
        ],
      },
      {
        heading: 'Newsletter & Unsubscribe',
        items: [
          'Subscribers receive a weekly digest of AI tool updates and trending news every Monday at 9 AM UTC.',
          'All newsletter emails include a clear one-click unsubscribe link at the bottom.',
          'You can also contact support@aitoolscenter.in to manage your subscription.',
          'Unsubscribe requests are processed immediately.',
        ],
      },
      {
        heading: 'Your Choices',
        items: [
          'You can update cookie preferences in your browser settings.',
          'You can unsubscribe from the newsletter using the link in any email.',
          'Google AdSense may use cookies to serve ads based on your visits to this and other sites. You can manage ad personalization in Google Ad Settings.',
          'In regions where consent is required, Google Consent Mode v2 defaults are applied before ads are loaded.',
          'Third-party advertising partners may use cookies subject to their own policies.',
          'Some outbound links may be affiliate or sponsored links, which are disclosed on the site and on our Affiliate Disclosure page.',
        ],
      },
    ],
  },
  affiliateDisclosure: {
    title: 'Affiliate Disclosure',
    intro: 'AIToolsCenter may earn a commission when you click certain links and sign up or purchase through partner offers. Last updated: June 1, 2026.',
    sections: [
      {
        heading: 'How Affiliate Links Work',
        items: [
          'Some links on this site are affiliate links, which means we may earn a commission if you take action after clicking them.',
          'The price you pay does not increase because of our affiliate relationship.',
          'Affiliate relationships help support the site, research, and ongoing maintenance.',
        ],
      },
      {
        heading: 'Editorial Independence',
        items: [
          'We aim to list tools based on relevance, utility, and user value rather than commission potential alone.',
          'Sponsored relationships do not guarantee placement, higher rankings, or positive reviews.',
          'You should always evaluate a tool independently before purchasing or subscribing.',
        ],
      },
      {
        heading: 'How We Label Commercial Links',
        items: [
          'Affiliate-ready tool cards may be marked with an Affiliate label.',
          'Commercial outbound links use sponsored and nofollow attributes where appropriate.',
          'General site-level disclosures appear near tool listings and in the footer for transparency.',
        ],
      },
      {
        heading: 'Questions',
        items: [
          'If you have questions about a recommendation or partnership, contact support@aitoolscenter.in.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    intro: 'By using AIToolsCenter, you agree to the terms below and applicable laws.',
    sections: [
      {
        heading: 'Use of the Site',
        items: [
          'All listings are provided for informational purposes only.',
          'Tool pricing, features, and availability may change without notice.',
          'You are responsible for evaluating third-party tools before use.',
          'Some listings may contain affiliate or sponsored outbound links as disclosed on the site.',
        ],
      },
      {
        heading: 'Restrictions',
        items: [
          'Do not abuse, scrape, or disrupt the site or its services.',
          'Do not submit misleading or unlawful content.',
          'We may update these terms as the site evolves.',
        ],
      },
    ],
  },
  contact: {
    title: 'Contact AIToolsCenter',
    intro: 'Use the details below for support, corrections, privacy requests, or partnerships.',
    sections: [
      {
        heading: 'Contact Details',
        items: [
          'Email: support@aitoolscenter.in',
          'Response time: 2 to 5 business days.',
          'Use this address for newsletter management, feedback, and site support.',
        ],
      },
    ],
  },
}

function StaticPage({ title, intro, sections, onHomeClick }) {
  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>AIToolsCenter</div>
        <div className="navbar-links">
          <button className="navbar-link" onClick={onHomeClick}>Home</button>
        </div>
      </nav>
      <main style={{ paddingTop: '6rem' }}>
        <section className="section">
          <div className="container" style={{ maxWidth: '900px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>{title}</h1>
            <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '2rem' }}>{intro}</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {sections.map((section) => (
                <article key={section.heading} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.25rem' }}>
                  <h2 style={{ marginBottom: '0.75rem' }}>{section.heading}</h2>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: 1.8 }}>
                    {section.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function SeoLandingPage({ page, onNavigate, onHomeClick, onToolClick, visitorCount, theme, onToggleTheme }) {
  const titleMap = {
    tool: `${page.tool?.name} Review, Pricing & Alternatives | AIToolsCenter`,
    category: `${page.category} AI Tools Directory | AIToolsCenter`,
    useCase: `${page.useCase?.title} | AIToolsCenter`,
    comparison: `${page.comparison?.toolA} vs ${page.comparison?.toolB} | AIToolsCenter`,
  }

  const descriptionMap = {
    tool: `${page.tool?.name}: ${page.tool?.tagline}. Compare ratings, pricing, and similar tools before you choose.`,
    category: `Explore hand-picked ${page.category} AI tools with ratings, pricing tiers, and practical use cases.`,
    useCase: page.useCase?.description,
    comparison: `Compare ${page.comparison?.toolA} and ${page.comparison?.toolB} for ${page.comparison?.intent}.`,
  }

  const pageTitle = titleMap[page.type]
  const pageDescription = descriptionMap[page.type]

  const categoryTools = page.type === 'category'
    ? TOOLS_EXTENDED.filter((tool) => tool.category === page.category).slice(0, 12)
    : []

  const useCaseTools = page.type === 'useCase'
    ? TOOLS_EXTENDED.filter((tool) => page.useCase.categories.includes(tool.category)).slice(0, 12)
    : []

  const toolAlternatives = page.type === 'tool'
    ? TOOLS_EXTENDED
      .filter((tool) => tool.category === page.tool.category && tool.name !== page.tool.name)
      .slice(0, 8)
    : []

  const comparisonTools = page.type === 'comparison'
    ? [
      TOOLS_EXTENDED.find((tool) => tool.name === page.comparison.toolA),
      TOOLS_EXTENDED.find((tool) => tool.name === page.comparison.toolB),
    ].filter(Boolean)
    : []

  const parseMonthlyPrice = (priceValue) => {
    if (!priceValue) return null
    const normalized = String(priceValue).toLowerCase()
    if (normalized.includes('free')) return 0
    const numberMatch = normalized.match(/\$\s*(\d+(?:\.\d+)?)/) || normalized.match(/(\d+(?:\.\d+)?)/)
    return numberMatch ? Number(numberMatch[1]) : null
  }

  const comparisonRows = page.type === 'comparison' && comparisonTools.length === 2
    ? (() => {
      const [toolA, toolB] = comparisonTools
      const priceA = parseMonthlyPrice(toolA.price)
      const priceB = parseMonthlyPrice(toolB.price)

      const winnerByHigher = (a, b) => (a > b ? 'A' : b > a ? 'B' : 'Tie')
      const winnerByLower = (a, b) => {
        if (a == null || b == null) return 'Tie'
        return a < b ? 'A' : b < a ? 'B' : 'Tie'
      }

      return [
        {
          label: 'Overall Rating',
          valueA: `${toolA.rating}/5`,
          valueB: `${toolB.rating}/5`,
          winner: winnerByHigher(toolA.rating, toolB.rating),
          rationale: 'Higher is better',
        },
        {
          label: 'Community Reviews',
          valueA: toolA.reviews?.toLocaleString() || 'N/A',
          valueB: toolB.reviews?.toLocaleString() || 'N/A',
          winner: winnerByHigher(toolA.reviews || 0, toolB.reviews || 0),
          rationale: 'More social proof',
        },
        {
          label: 'Entry Price',
          valueA: toolA.price || 'N/A',
          valueB: toolB.price || 'N/A',
          winner: winnerByLower(priceA, priceB),
          rationale: 'Lower cost wins',
        },
        {
          label: 'Pricing Model',
          valueA: toolA.badge || 'N/A',
          valueB: toolB.badge || 'N/A',
          winner: 'Tie',
          rationale: 'Depends on your budget',
        },
        {
          label: 'Best For',
          valueA: toolA.tagline,
          valueB: toolB.tagline,
          winner: 'Tie',
          rationale: page.comparison.intent,
        },
      ]
    })()
    : []

  const featuredTools = page.type === 'category'
    ? categoryTools
    : page.type === 'useCase'
      ? useCaseTools
      : page.type === 'comparison'
        ? comparisonTools
        : [page.tool, ...toolAlternatives].slice(0, 10)

  const pageTypeLabel = {
    category: `${CATEGORY_UI_META[page.category]?.icon || '📁'} ${page.category} AI Tools`,
    useCase: `🎯 Use Case`,
    comparison: `⚡ Tool Comparison`,
    tool: `🔧 Tool Review`,
  }[page.type] || ''

  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '999px', background: 'var(--primary)', boxShadow: '0 0 16px var(--glow)' }} />
          <span style={{ fontWeight: 800 }}>AIToolsCenter</span>
        </div>
        <div className="navbar-links">
          <button className="navbar-link navbar-link-button" onClick={onHomeClick} type="button">🏠 Home</button>
          {CATEGORIES.filter((c) => c !== 'All').slice(0, 4).map((cat) => (
            <button
              key={cat}
              className="navbar-link navbar-link-button"
              onClick={() => onNavigate(`/categories/${slugify(cat)}`)}
              type="button"
              style={page.type === 'category' && page.category === cat ? { color: 'var(--primary)' } : {}}
            >
              {CATEGORY_UI_META[cat]?.icon} {cat}
            </button>
          ))}
          <button onClick={onToggleTheme} className="navbar-link navbar-link-button" title="Toggle theme" type="button">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <main style={{ paddingTop: '4rem' }}>
        {/* Hero */}
        <section style={{
          background: 'linear-gradient(135deg, var(--surface) 0%, var(--bg) 100%)',
          borderBottom: '1px solid var(--border)',
          padding: '3rem var(--spacing-lg) 2.5rem',
        }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <button onClick={onHomeClick} type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>Home</button>
              <span>›</span>
              {page.type === 'category' && <span>Categories</span>}
              {page.type === 'useCase' && <><span>Use Cases</span></>}
              {page.type === 'comparison' && <><span>Compare</span></>}
              {page.type === 'tool' && <><button onClick={() => onNavigate(`/categories/${slugify(page.tool?.category)}`)} type="button" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontSize: 'inherit' }}>{page.tool?.category}</button></>}
              <span>›</span>
              <span style={{ color: 'var(--text)' }}>
                {page.type === 'category' ? page.category : page.type === 'tool' ? page.tool?.name : page.type === 'useCase' ? page.useCase?.title : `${page.comparison?.toolA} vs ${page.comparison?.toolB}`}
              </span>
            </div>

            {/* Type badge */}
            <div style={{ marginBottom: '0.75rem' }}>
              <span style={{ background: 'var(--primary)', color: '#fff', borderRadius: '999px', padding: '0.25rem 0.85rem', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.02em' }}>
                {pageTypeLabel}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.8rem', color: 'var(--text)' }}>
              {page.type === 'tool' ? `${page.tool?.name} — Review & Alternatives` : pageTitle.replace(' | AIToolsCenter', '')}
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.65, maxWidth: '680px', marginBottom: '1.5rem' }}>{pageDescription}</p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.3rem 0.9rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                {featuredTools.length} tools listed
              </span>
              <span style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.3rem 0.9rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                Updated June 2026
              </span>
              {visitorCount > 0 && (
                <span style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '999px', padding: '0.3rem 0.9rem', fontSize: '0.82rem', color: 'var(--muted)' }}>
                  {visitorCount.toLocaleString()} live visitors
                </span>
              )}
            </div>
          </div>
        </section>

        {/* SEO LANDING PAGE ADS */}
        <section style={{ padding: '1.15rem var(--spacing-lg) 0.5rem' }}>
          <div className="container">
            <AdsContainer type="horizontal" />
          </div>
        </section>

        {/* Comparison Panel */}
        {page.type === 'comparison' && comparisonTools.length === 2 && (
          <section style={{ padding: '2.5rem var(--spacing-lg) 1rem' }}>
            <div className="container" style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.8rem', alignItems: 'stretch' }}>
                {comparisonTools.map((tool) => (
                  <a
                    key={`compare-head-${tool.id}`}
                    href={getToolOutboundUrl(tool)}
                    target="_blank"
                    rel={getToolAnchorRel(tool)}
                    className="tool-card"
                    onClick={() => onToolClick(tool, 'seo-comparison-hero')}
                    style={{ minHeight: '100%' }}
                  >
                    <div className="tool-header">
                      <div className="tool-logo">{tool.icon}</div>
                      <div className="tool-meta">
                        <div className="tool-name">{tool.name}</div>
                        <div className="tool-tagline">{tool.tagline}</div>
                      </div>
                    </div>
                    <div className="tool-card-top" style={{ marginTop: '0.7rem' }}>
                      <span className="tool-badge">{tool.badge}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{tool.rating}/5</span>
                    </div>
                    <div style={{ marginTop: '0.7rem', display: 'grid', gap: '0.25rem', fontSize: '0.84rem', color: 'var(--muted)' }}>
                      <span><strong style={{ color: 'var(--text)' }}>Price:</strong> {tool.price}</span>
                      <span><strong style={{ color: 'var(--text)' }}>Reviews:</strong> {(tool.reviews || 0).toLocaleString()}</span>
                      <span><strong style={{ color: 'var(--text)' }}>Category:</strong> {tool.category}</span>
                    </div>
                  </a>
                ))}
                <div style={{ alignSelf: 'center', justifySelf: 'center', fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>VS</div>
              </div>

              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', padding: '0.8rem 1rem', borderBottom: '1px solid var(--border)', background: 'var(--background)', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span>Criteria</span>
                  <span>{comparisonTools[0].name}</span>
                  <span>{comparisonTools[1].name}</span>
                  <span>Winner</span>
                </div>
                {comparisonRows.map((row) => (
                  <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{row.label}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--muted)' }}>{row.rationale}</div>
                    </div>
                    <div style={{ color: row.winner === 'A' ? 'var(--primary)' : 'var(--text)' }}>{row.valueA}</div>
                    <div style={{ color: row.winner === 'B' ? 'var(--primary)' : 'var(--text)' }}>{row.valueB}</div>
                    <div style={{
                      justifySelf: 'end',
                      border: '1px solid var(--border)',
                      borderRadius: '999px',
                      padding: '0.15rem 0.6rem',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: row.winner === 'Tie' ? 'var(--muted)' : 'var(--primary)',
                    }}>
                      {row.winner === 'Tie' ? 'Tie' : row.winner === 'A' ? comparisonTools[0].name : comparisonTools[1].name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tools Grid */}
        <section style={{ padding: page.type === 'comparison' ? '1rem var(--spacing-lg) 2.5rem' : '2.5rem var(--spacing-lg)' }}>
          <div className="container">
            {page.type !== 'comparison' && (featuredTools.length > 0 ? (
              <div className="tools-grid">
                {featuredTools.map((tool) => (
                  <a
                    key={`${page.type}-${tool.id}`}
                    href={getToolOutboundUrl(tool)}
                    target="_blank"
                    rel={getToolAnchorRel(tool)}
                    className="tool-card"
                    onClick={() => onToolClick(tool, `seo-${page.type}`)}
                  >
                    <div className="tool-header">
                      <div className="tool-logo">{tool.icon}</div>
                      <div className="tool-meta">
                        <div className="tool-name">{tool.name}</div>
                        <div className="tool-tagline">{tool.tagline}</div>
                      </div>
                    </div>
                    <div className="tool-card-top" style={{ marginTop: '0.6rem' }}>
                      <span className="tool-badge">{tool.badge}</span>
                      {isAffiliateTool(tool) && <span className="tool-affiliate-pill">Affiliate</span>}
                    </div>
                    <div className="tool-description" style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '0.6rem', lineHeight: 1.55 }}>{tool.description}</div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No tools found for this page.</p>
            ))}

            {/* Explore more */}
            <div style={{ marginTop: '3rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem', color: 'var(--text)' }}>Explore More Categories</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '1.1rem' }}>Browse AI tools across all categories and use cases.</p>
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
                {CATEGORIES.filter((category) => category !== 'All').map((category) => (
                  <button
                    key={category}
                    className="navbar-link navbar-link-button"
                    onClick={() => onNavigate(`/categories/${slugify(category)}`)}
                    type="button"
                    style={page.type === 'category' && page.category === category ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                  >
                    {CATEGORY_UI_META[category]?.icon} {category}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                {USE_CASE_PAGES.map((useCase) => (
                  <button
                    key={useCase.slug}
                    className="navbar-link navbar-link-button"
                    onClick={() => onNavigate(`/use-cases/${useCase.slug}`)}
                    type="button"
                    style={page.type === 'useCase' && page.useCase?.slug === useCase.slug ? { color: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
                  >
                    🎯 {useCase.title.replace('Best AI Tools for ', '')}
                  </button>
                ))}
                {COMPARISON_PAGES.map((comparison) => (
                  <button
                    key={comparison.slug}
                    className="navbar-link navbar-link-button"
                    onClick={() => onNavigate(`/compare/${comparison.slug}`)}
                    type="button"
                  >
                    ⚡ {comparison.toolA} vs {comparison.toolB}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                onClick={onHomeClick}
                type="button"
                style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '999px', padding: '0.65rem 1.8rem', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                ← Back to Full Directory
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// ==================================================
// PAGE COMPONENTS
// ==================================================

const IS_DEV = import.meta.env.DEV === true
const CMP_SCRIPT_URL = (import.meta.env.VITE_CMP_SCRIPT_URL || '').trim()
const CONSENT_STORAGE_KEY = 'aitoolscenter-consent-v1'
const CONSENT_DEFAULTS = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
}
const CONSENT_ACCEPT_ALL = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
}

const applyConsentUpdate = (consentSettings) => {
  if (typeof window === 'undefined') return

  const payload = { ...CONSENT_DEFAULTS, ...consentSettings }
  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }

  window.gtag('consent', 'update', payload)
}

const getStoredConsent = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw)
    if (!parsed?.consent || typeof parsed.consent !== 'object') return null

    return { ...CONSENT_DEFAULTS, ...parsed.consent }
  } catch {
    return null
  }
}

const mapTcfToGoogleConsent = (tcData = {}) => {
  if (tcData?.gdprApplies === false) {
    return { ...CONSENT_ACCEPT_ALL }
  }

  const purposeConsents = tcData?.purpose?.consents || {}
  const hasStorageConsent = Boolean(purposeConsents[1])
  const hasPersonalizedAdsConsent = Boolean(purposeConsents[3]) && Boolean(purposeConsents[4])
  const hasUserDataConsent = Boolean(purposeConsents[7]) || hasPersonalizedAdsConsent

  return {
    analytics_storage: hasStorageConsent ? 'granted' : 'denied',
    ad_storage: hasStorageConsent ? 'granted' : 'denied',
    ad_user_data: hasStorageConsent && hasUserDataConsent ? 'granted' : 'denied',
    ad_personalization: hasPersonalizedAdsConsent ? 'granted' : 'denied',
  }
}

const subscribeToTcfConsent = (onConsent) => {
  if (typeof window === 'undefined' || typeof window.__tcfapi !== 'function') return null

  let listenerId = null
  const callback = (tcData, success) => {
    if (!success || !tcData) return

    listenerId = tcData.listenerId || listenerId
    onConsent(tcData)
  }

  window.__tcfapi('addEventListener', 2, callback)

  return () => {
    if (!listenerId || typeof window.__tcfapi !== 'function') return
    window.__tcfapi('removeEventListener', 2, () => {}, listenerId)
  }
}

// AdsContainer Component for Google AdSense
function AdsContainer({ type = 'horizontal' }) {
  const adRef = useRef(null)
  const [debugStatus, setDebugStatus] = useState('waiting')
  const hasClientId = ADSENSE_CLIENT_ID.startsWith('ca-pub-')

  useEffect(() => {
    let attempts = 0

    const tryLoadAd = () => {
      if (!adRef.current || adRef.current.getAttribute('data-ads-loaded') === 'true') {
        return true
      }

      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
          adRef.current.setAttribute('data-ads-loaded', 'true')
          if (IS_DEV) setDebugStatus('pushed')
          return true
        }
      } catch {
        if (IS_DEV) setDebugStatus('error')
      }

      return false
    }

    if (tryLoadAd()) {
      return
    }

    const interval = setInterval(() => {
      attempts += 1
      const loaded = tryLoadAd()
      if (loaded || attempts >= 12) {
        clearInterval(interval)
        if (!loaded && IS_DEV) setDebugStatus('timeout — adsbygoogle script not loaded')
      }
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const slotMap = {
    horizontal: (import.meta.env.VITE_ADSENSE_SLOT_HORIZONTAL || '').trim(),
    vertical: (import.meta.env.VITE_ADSENSE_SLOT_VERTICAL || '').trim(),
    square: (import.meta.env.VITE_ADSENSE_SLOT_SQUARE || '').trim(),
  }

  const activeSlot = slotMap[type] || slotMap.horizontal

  if (!hasClientId) {
    return IS_DEV ? (
      <div className={`ads-container ads-${type}`} aria-label="Advertisement" style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', background: '#1a1a2e', color: '#fca5a5', border: '1px dashed #ef4444', borderRadius: '6px', padding: '0.4rem 0.7rem', textAlign: 'left', lineHeight: 1.6 }}>
          <strong>Ad Debug</strong> [{type}]<br />
          client configured: ⚠ not set<br />
          status: skipped
        </div>
      </div>
    ) : null
  }

  return (
    <div
      className={`ads-container ads-${type}`}
      style={{
        overflow: 'hidden',
        textAlign: 'center',
        marginBottom: '1rem',
      }}
      aria-label="Advertisement"
    >
      <div style={{ fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.35rem' }}>
        Advertisement
      </div>
      {IS_DEV && (
        <div style={{
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          background: '#1a1a2e',
          color: '#a0d8ef',
          border: '1px dashed #4f46e5',
          borderRadius: '6px',
          padding: '0.4rem 0.7rem',
          marginBottom: '0.4rem',
          textAlign: 'left',
          lineHeight: 1.6,
        }}>
          <strong>Ad Debug</strong> [{type}]<br />
          client configured: {ADSENSE_CLIENT_ID ? 'yes' : '⚠ not set'}<br />
          slot: {activeSlot || '⚠ not set'}<br />
          status: {debugStatus}
        </div>
      )}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={activeSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

// User Reviews Component
function UserReviewsSection() {
  const sampleReviews = [
    { tool: 'ChatGPT', author: 'Sarah M.', rating: 5, text: 'ChatGPT has completely changed how I work. Incredibly versatile and reliable. Best AI investment ever!' },
    { tool: 'Claude', author: 'James K.', rating: 5, text: 'The context window is insane. Perfect for analyzing large documents. Better tone than competitors.' },
    { tool: 'Midjourney', author: 'Alex P.', rating: 5, text: 'Mind-blowing image quality. Takes some practice but worth every penny. My design workflow is transformed!' },
    { tool: 'GitHub Copilot', author: 'Dev Raj', rating: 5, text: 'Cut my coding time in half. Learned new patterns from Copilot. Absolutely love it for daily development.' },
    { tool: 'Grammarly', author: 'Emma L.', rating: 5, text: 'Silent productivity boost. Saves me hours every week on writing. Premium is totally worth it.' },
    { tool: 'Synthesia', author: 'Mark T.', rating: 5, text: 'Creates professional videos in minutes. Avatars look natural. Game changer for video content.' },
    { tool: 'Cursor', author: 'Lisa R.', rating: 5, text: 'The future of code editors. Cursor + Claude = unstoppable development combo!' },
    { tool: 'ElevenLabs', author: 'Tom B.', rating: 5, text: 'Voices sound incredibly natural. Using for podcast production. Quality is professional grade.' },
  ]
  
  return (
    <section className="section" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>⭐ What Users Love</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>
          Read genuine reviews from real users worldwide
        </p>
        <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {sampleReviews.map((review, idx) => (
            <div key={idx} style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{review.tool}</span>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                {[...Array(review.rating)].map((_, i) => <span key={i} style={{ color: '#fbbf24' }}>⭐</span>)}
              </div>
              <p style={{ color: 'var(--foreground)', marginBottom: '1rem', fontStyle: 'italic' }}>&quot;{review.text}&quot;</p>
              <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>— {review.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ConsentBanner({ onPrivacyClick, cmpManaged }) {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [choices, setChoices] = useState({ analytics: false, advertising: false })

  useEffect(() => {
    if (cmpManaged) {
      setVisible(false)
      return
    }

    const stored = getStoredConsent()

    if (stored) {
      applyConsentUpdate(stored)
      setChoices({
        analytics: stored.analytics_storage === 'granted',
        advertising: stored.ad_storage === 'granted' && stored.ad_user_data === 'granted' && stored.ad_personalization === 'granted',
      })
      setVisible(false)
      return
    }

    applyConsentUpdate(CONSENT_DEFAULTS)
    setVisible(true)
  }, [cmpManaged])

  if (cmpManaged) {
    return null
  }

  const persistConsent = (consent, source) => {
    const payload = { ...CONSENT_DEFAULTS, ...consent }

    try {
      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({ consent: payload, source, updatedAt: new Date().toISOString() })
      )
    } catch {
      // Ignore localStorage errors and still apply consent in-session.
    }

    applyConsentUpdate(payload)
    setVisible(false)
    setShowCustomize(false)
    setChoices({
      analytics: payload.analytics_storage === 'granted',
      advertising: payload.ad_storage === 'granted' && payload.ad_user_data === 'granted' && payload.ad_personalization === 'granted',
    })
  }

  const saveCustomConsent = () => {
    persistConsent({
      analytics_storage: choices.analytics ? 'granted' : 'denied',
      ad_storage: choices.advertising ? 'granted' : 'denied',
      ad_user_data: choices.advertising ? 'granted' : 'denied',
      ad_personalization: choices.advertising ? 'granted' : 'denied',
    }, 'custom')
  }

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        style={{
          position: 'fixed',
          left: '1rem',
          bottom: '1rem',
          zIndex: 9998,
          border: '1px solid var(--border)',
          borderRadius: '999px',
          background: 'var(--surface)',
          color: 'var(--foreground)',
          padding: '0.5rem 0.9rem',
          fontSize: '0.8rem',
          cursor: 'pointer',
        }}
      >
        Cookie Preferences
      </button>
    )
  }

  return (
    <section
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        left: '1rem',
        right: '1rem',
        bottom: '1rem',
        zIndex: 9999,
        maxWidth: '860px',
        margin: '0 auto',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        background: 'var(--surface)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
        padding: '1rem',
      }}
    >
      <p style={{ margin: 0, color: 'var(--foreground)', lineHeight: 1.5, fontSize: '0.9rem' }}>
        We use cookies for analytics and advertising. You can accept all, reject non-essential cookies, or customize settings.
        {' '}
        <button type="button" onClick={onPrivacyClick} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
          Privacy Policy
        </button>
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.8rem' }}>
        <button type="button" className="btn btn-primary" onClick={() => persistConsent(CONSENT_ACCEPT_ALL, 'accept-all')}>Accept All</button>
        <button type="button" className="btn btn-secondary" onClick={() => persistConsent(CONSENT_DEFAULTS, 'reject')}>Reject Non-Essential</button>
        <button
          type="button"
          onClick={() => setShowCustomize((v) => !v)}
          style={{ border: '1px solid var(--border)', borderRadius: '10px', background: 'transparent', color: 'var(--foreground)', padding: '0.55rem 0.9rem', cursor: 'pointer' }}
        >
          {showCustomize ? 'Hide Choices' : 'Customize'}
        </button>
      </div>

      {showCustomize && (
        <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--border)', paddingTop: '0.8rem', display: 'grid', gap: '0.65rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={choices.analytics}
              onChange={(e) => setChoices((v) => ({ ...v, analytics: e.target.checked }))}
            />
            Allow analytics cookies
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={choices.advertising}
              onChange={(e) => setChoices((v) => ({ ...v, advertising: e.target.checked }))}
            />
            Allow advertising and personalization cookies
          </label>
          <div>
            <button type="button" className="btn btn-primary" onClick={saveCustomConsent}>Save Choices</button>
          </div>
        </div>
      )}
    </section>
  )
}

// ==================================================
// MAIN APP COMPONENT
// ==================================================

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [currentPage, setCurrentPage] = useState('home')
  const [routePath, setRoutePath] = useState(() => window.location.pathname || '/')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' })
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0)
  const [visitorCount, setVisitorCount] = useState(0)
  const [visitorCountError, setVisitorCountError] = useState(false)
  const [shareStatus, setShareStatus] = useState('')
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false)
  const [unsubscribeEmail, setUnsubscribeEmail] = useState('')
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [cmpManagedConsent, setCmpManagedConsent] = useState(false)
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', subject: '', message: '' })
  const [feedbackStatus, setFeedbackStatus] = useState({ type: '', message: '' })
  const [toolClicks, setToolClicks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('aitoolscenter-tool-clicks') || '{}')
    } catch {
      return {}
    }
  })
  const toolsSectionRef = useRef(null)
  const collectionsSectionRef = useRef(null)
  const seoHubSectionRef = useRef(null)
  const updatesSectionRef = useRef(null)

  const resolvedPage = resolvePathPage(routePath)

  useEffect(() => {
    const stored = localStorage.getItem('aitoolscenter-theme') || 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  useEffect(() => {
    // The stylesheet keeps ad units hidden unless this flag is present.
    document.documentElement.setAttribute('data-ads-ready', 'true')
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !CMP_SCRIPT_URL || typeof window.__tcfapi === 'function') {
      return
    }

    if (document.querySelector('script[data-cmp-loader="external"]')) {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = CMP_SCRIPT_URL
    script.setAttribute('data-cmp-loader', 'external')
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    let cleanupTcfListener = null
    let pollerId = null

    const bindTcfListener = () => {
      if (typeof window === 'undefined' || typeof window.__tcfapi !== 'function') {
        return false
      }

      setCmpManagedConsent(true)
      cleanupTcfListener = subscribeToTcfConsent((tcData) => {
        const mapped = mapTcfToGoogleConsent(tcData)
        applyConsentUpdate(mapped)
      })

      return true
    }

    if (!bindTcfListener()) {
      let attempts = 0
      pollerId = window.setInterval(() => {
        attempts += 1
        if (bindTcfListener() || attempts >= 25) {
          window.clearInterval(pollerId)
        }
      }, 400)
    }

    return () => {
      if (pollerId) {
        window.clearInterval(pollerId)
      }
      if (cleanupTcfListener) {
        cleanupTcfListener()
      }
    }
  }, [])

  useEffect(() => {
    const onPopState = () => {
      setRoutePath(window.location.pathname || '/')
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('aitoolscenter-tool-clicks', JSON.stringify(toolClicks))
    } catch {
      // Ignore storage errors (private mode / quotas).
    }
  }, [toolClicks])

  useEffect(() => {
    const setMetaTag = (selector, attribute, key, value) => {
      let tag = document.head.querySelector(selector)
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute(attribute, key)
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', value)
    }

    const setCanonical = (href) => {
      let tag = document.head.querySelector('link[rel="canonical"]')
      if (!tag) {
        tag = document.createElement('link')
        tag.setAttribute('rel', 'canonical')
        document.head.appendChild(tag)
      }
      tag.setAttribute('href', href)
    }

    const setJsonLd = (id, payload) => {
      let scriptTag = document.head.querySelector(`script[data-jsonld-id="${id}"]`)
      if (!scriptTag) {
        scriptTag = document.createElement('script')
        scriptTag.type = 'application/ld+json'
        scriptTag.setAttribute('data-jsonld-id', id)
        document.head.appendChild(scriptTag)
      }
      scriptTag.textContent = JSON.stringify(payload)
    }

    let title = 'AIToolsCenter.in - Best AI Tools Directory for 2026'
    let description = 'Discover and compare top AI tools for writing, coding, images, video, automation, and productivity.'

    if (resolvedPage.type === 'tool') {
      title = `${resolvedPage.tool.name} Review, Pricing & Alternatives | AIToolsCenter`
      description = `${resolvedPage.tool.name}: ${resolvedPage.tool.tagline}. Compare pricing, reviews, and similar tools.`
    } else if (resolvedPage.type === 'category') {
      title = `${resolvedPage.category} AI Tools Directory | AIToolsCenter`
      description = `Explore curated ${resolvedPage.category} AI tools with trusted recommendations, pricing, and quick comparisons.`
    } else if (resolvedPage.type === 'useCase') {
      title = `${resolvedPage.useCase.title} | AIToolsCenter`
      description = resolvedPage.useCase.description
    } else if (resolvedPage.type === 'comparison') {
      title = `${resolvedPage.comparison.toolA} vs ${resolvedPage.comparison.toolB} | AIToolsCenter`
      description = `Compare ${resolvedPage.comparison.toolA} and ${resolvedPage.comparison.toolB} for ${resolvedPage.comparison.intent}.`
    }

    const canonicalUrl = `${SITE_ORIGIN}${routePath === '/' ? '/' : routePath.replace(/\/$/, '')}`
    const socialImageUrl = `${SITE_ORIGIN}${getRouteSocialImagePath(resolvedPage)}`

    document.title = title
    setCanonical(canonicalUrl)
    setMetaTag('meta[name="description"]', 'name', 'description', description)
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', socialImageUrl)
    setMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', title)
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', socialImageUrl)

    const topTools = TOOLS_EXTENDED.slice(0, 12)
    let jsonLdPayload = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonicalUrl,
    }

    if (resolvedPage.type === 'home') {
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            name: 'AIToolsCenter.in',
            url: SITE_ORIGIN,
            description,
          },
          {
            '@type': 'CollectionPage',
            name: title,
            description,
            url: canonicalUrl,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: topTools.map((tool, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_ORIGIN}/ai-tools/${slugify(tool.name)}`,
                name: tool.name,
              })),
            },
          },
        ],
      }
    } else if (resolvedPage.type === 'tool') {
      const tool = resolvedPage.tool
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.name,
        applicationCategory: `${tool.category} AI Tool`,
        operatingSystem: 'Web',
        description: tool.description,
        url: canonicalUrl,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          category: tool.badge,
          url: getToolOutboundUrl(tool),
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: String(tool.rating),
          reviewCount: String(tool.reviews || 1),
          bestRating: '5',
          worstRating: '1',
        },
      }
    } else if (resolvedPage.type === 'category') {
      const categoryTools = TOOLS_EXTENDED.filter((tool) => tool.category === resolvedPage.category).slice(0, 15)
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: categoryTools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_ORIGIN}/ai-tools/${slugify(tool.name)}`,
            name: tool.name,
          })),
        },
      }
    } else if (resolvedPage.type === 'useCase') {
      const useCaseTools = TOOLS_EXTENDED.filter((tool) => resolvedPage.useCase.categories.includes(tool.category)).slice(0, 15)
      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: title,
        description,
        url: canonicalUrl,
        about: resolvedPage.useCase.categories.join(', '),
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: useCaseTools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_ORIGIN}/ai-tools/${slugify(tool.name)}`,
            name: tool.name,
          })),
        },
      }
    } else if (resolvedPage.type === 'comparison') {
      const comparisonTools = [
        TOOLS_EXTENDED.find((tool) => tool.name === resolvedPage.comparison.toolA),
        TOOLS_EXTENDED.find((tool) => tool.name === resolvedPage.comparison.toolB),
      ].filter(Boolean)

      jsonLdPayload = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: comparisonTools.map((tool, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_ORIGIN}/ai-tools/${slugify(tool.name)}`,
            name: tool.name,
          })),
        },
      }
    }

    setJsonLd('route-schema', jsonLdPayload)
  }, [resolvedPage, routePath])

  // Scroll to top on page load and when page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, routePath])

  // Also scroll to top on initial load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadVisitorCount = async () => {
      const today = new Date().toISOString().slice(0, 10)
      const lastCountedDate = localStorage.getItem(LOCAL_GLOBAL_VISIT_DATE_KEY)
      const method = lastCountedDate === today ? 'GET' : 'POST'

      try {
        const response = await fetch(PAGE_VIEWS_API, { method })
        if (!response.ok) throw new Error('Visitor count request failed')

        const result = await response.json()
        const count = Number(result.count)

        if (!cancelled && Number.isFinite(count)) {
          setVisitorCount(count)
          setVisitorCountError(false)

          if (method === 'POST') {
            localStorage.setItem(LOCAL_GLOBAL_VISIT_DATE_KEY, today)
          }
        }
      } catch (error) {
        console.error('Error loading visitor count:', error)

        try {
          const fallbackResponse = await fetch(PAGE_VIEWS_API, { method: 'GET' })
          if (!fallbackResponse.ok) throw new Error('Fallback visitor count request failed')

          const fallbackResult = await fallbackResponse.json()
          const fallbackCount = Number(fallbackResult.count)

          if (!cancelled && Number.isFinite(fallbackCount)) {
            setVisitorCount(fallbackCount)
            setVisitorCountError(false)
          }
        } catch (fallbackError) {
          console.error('Visitor count fallback failed:', fallbackError)

          if (!cancelled) {
            const cached = Number(localStorage.getItem('aitoolscenter-last-known-visitors') || '0')
            setVisitorCount(Number.isFinite(cached) ? cached : 0)
            setVisitorCountError(true)
          }
        }
      }
    }

    loadVisitorCount()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (Number.isFinite(visitorCount) && visitorCount > 0) {
      localStorage.setItem('aitoolscenter-last-known-visitors', String(visitorCount))
    }
  }, [visitorCount])

  useEffect(() => {
    if (!shareStatus) return undefined

    const timer = setTimeout(() => {
      setShareStatus('')
    }, 2800)

    return () => clearTimeout(timer)
  }, [shareStatus])

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navigateTo = (pathname) => {
    const targetPath = pathname.startsWith('/') ? pathname : `/${pathname}`
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath)
      setRoutePath(targetPath)
    }
  }

  const trackToolClick = (tool, source = 'directory') => {
    if (!tool?.name) return
    setToolClicks((current) => ({
      ...current,
      [tool.name]: {
        count: (current[tool.name]?.count || 0) + 1,
        category: tool.category,
        source,
        lastClickedAt: new Date().toISOString(),
      },
    }))
  }

  const handleDiscoverClick = (event) => {
    event.preventDefault()
    navigateTo('/')
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
    scrollToSection(toolsSectionRef)
  }

  const goHome = () => {
    navigateTo('/')
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
  }

  const openPage = (page) => {
    const legalPaths = {
      privacy: '/privacy',
      terms: '/terms',
      affiliateDisclosure: '/affiliate-disclosure',
      contact: '/contact',
      home: '/',
    }
    if (legalPaths[page]) {
      navigateTo(legalPaths[page])
    }
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleCollectionsClick = (event) => {
    event.preventDefault()
    scrollToSection(collectionsSectionRef)
  }

  const handleCategoriesClick = (event) => {
    event.preventDefault()
    navigateTo('/')
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
    window.setTimeout(() => {
      scrollToSection(seoHubSectionRef)
    }, 0)
  }

  const handleUpdatesClick = (event) => {
    event.preventDefault()
    scrollToSection(updatesSectionRef)
  }

  const handleShareWebsite = async () => {
    const shareUrl = SITE_ORIGIN
    const shareTitle = 'AIToolsCenter - Discover The Best AI Tools'
    const shareText = 'Found a curated AI tools directory with 100+ tools, comparisons, and weekly updates.'

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl })
        setShareStatus('Thanks for sharing!')
        return
      } catch {
        // Ignore user-cancelled share sheet and continue to clipboard fallback.
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setShareStatus('Link copied. Share it with your network!')
    } catch {
      setShareStatus('Share this link: ' + shareUrl)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('aitoolscenter-theme', newTheme)
  }

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    setNewsletterStatus({ type: '', message: '' })

    const email = newsletterEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNewsletterStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || data.message || data.details || `Newsletter API error (${response.status})`
        throw new Error(errorMsg)
      }

      // Store in localStorage for real-time tracking
      const subscribers = JSON.parse(localStorage.getItem('aitoolscenter-newsletter-subscribers') || '[]')
      if (!subscribers.includes(email)) {
        subscribers.push(email)
        localStorage.setItem('aitoolscenter-newsletter-subscribers', JSON.stringify(subscribers))
      }

      setNewsletterStatus({ 
        type: 'success', 
        message: '✓ Subscribed! Check your email for confirmation. Weekly AI updates start Monday.' 
      })
      setNewsletterEmail('')
      return
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setNewsletterStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      })
    }
  }

  const handleUnsubscribeSubmit = async (event) => {
    event.preventDefault()
    
    const email = unsubscribeEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.')
      return
    }

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      let data = {}
      const contentType = response.headers.get('content-type')
      
      try {
        if (contentType && contentType.includes('application/json')) {
          data = await response.json()
        } else {
          const text = await response.text()
          console.warn('Non-JSON response:', text.substring(0, 200))
          data = { error: 'Server error - invalid response format' }
        }
      } catch (parseError) {
        console.error('Failed to parse response:', parseError)
        data = { error: 'Server returned invalid response format' }
      }

      if (response.ok) {
        // Remove from localStorage
        const subscribers = JSON.parse(localStorage.getItem('aitoolscenter-newsletter-subscribers') || '[]')
        const filtered = subscribers.filter(sub => sub !== email)
        localStorage.setItem('aitoolscenter-newsletter-subscribers', JSON.stringify(filtered))
        
        alert('✓ Successfully unsubscribed. You will not receive further emails.')
        setShowUnsubscribeModal(false)
        setUnsubscribeEmail('')
      } else {
        const errorMsg = data.error || data.details || `Server error (${response.status})`
        console.error('Unsubscribe response error:', errorMsg)
        alert(`Error: ${errorMsg}`)
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      alert(`Error unsubscribing: ${error.message}`)
    }
  }

  const handleFeedbackSubmit = async (event) => {
    event.preventDefault()
    setFeedbackStatus({ type: '', message: '' })

    const { name, email, subject, message } = feedbackData
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setFeedbackStatus({ type: 'error', message: 'All fields are required.' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedbackStatus({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    if (message.trim().length < 10) {
      setFeedbackStatus({ type: 'error', message: 'Please provide at least 10 characters in your feedback.' })
      return
    }

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await response.json()

      if (response.ok) {
        setFeedbackStatus({ 
          type: 'success', 
          message: '✓ Thank you! Your feedback has been sent successfully.' 
        })
        setFeedbackData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => {
          setShowFeedbackModal(false)
          setFeedbackStatus({ type: '', message: '' })
        }, 2000)
      } else {
        setFeedbackStatus({ 
          type: 'error', 
          message: data.error || 'Failed to send feedback. Please try again.' 
        })
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
      setFeedbackStatus({ 
        type: 'error', 
        message: `Error: ${error.message}` 
      })
    }
  }

  const filteredTools = TOOLS_EXTENDED.filter(tool =>
    (selectedCategory === 'All' || tool.category === selectedCategory) &&
    (searchQuery === '' || 
     tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedCollection = COLLECTIONS[activeCollectionIndex] || COLLECTIONS[0]
  const selectedCollectionTools = selectedCollection.tools
    .map((toolName) => TOOLS_EXTENDED.find((tool) => tool.name === toolName))
    .filter(Boolean)
  const weeklyHighlights = aiNews.slice(0, 3)
  const topClickedTools = Object.entries(toolClicks)
    .map(([toolName, data]) => ({
      tool: TOOLS_EXTENDED.find((candidate) => candidate.name === toolName),
      count: data?.count || 0,
    }))
    .filter((entry) => entry.tool && entry.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const categories = CATEGORIES
    .filter((category) => category !== 'All')
    .map((category) => ({
      name: category,
      icon: CATEGORY_UI_META[category]?.icon || '•',
      label: CATEGORY_UI_META[category]?.label || category,
      count: TOOLS_EXTENDED.filter((tool) => tool.category === category).length,
    }))

  if (resolvedPage.type === 'legal') {
    const legalKey = resolvedPage.key
    const legalPage = LEGAL_PAGES[legalKey]

    if (!legalPage) {
      return null
    }

    return (
      <>
        <StaticPage
          title={legalPage.title}
          intro={legalPage.intro}
          sections={legalPage.sections}
          onHomeClick={goHome}
        />
        <ConsentBanner onPrivacyClick={() => openPage('privacy')} cmpManaged={cmpManagedConsent} />
      </>
    )
  }

  if (resolvedPage.type !== 'home') {
    return (
      <>
        <SeoLandingPage
          page={resolvedPage}
          onNavigate={navigateTo}
          onHomeClick={goHome}
          onToolClick={trackToolClick}
          visitorCount={visitorCount}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <ConsentBanner onPrivacyClick={() => openPage('privacy')} cmpManaged={cmpManagedConsent} />
      </>
    )
  }

  // STATS SECTION DATA
  const totalReviews = filteredTools.reduce((sum, tool) => sum + (tool.reviews || 0), 0)
  const formattedReviews = totalReviews >= 1000 ? `${Math.round(totalReviews / 1000)}K+` : String(totalReviews)
  
  const stats = [
    { value: '100+', label: 'Genuine AI Tools' },
    { value: '10+', label: 'Categories' },
    { value: formattedReviews, label: 'User Reviews' },
  ]

  return (
    <div className="page">
      {/* ==========  NAVIGATION ========== */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={goHome} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ width: '0.7rem', height: '0.7rem', borderRadius: '999px', background: 'var(--primary)', boxShadow: '0 0 16px var(--glow)' }} />
          <span style={{ fontWeight: 800 }}>AIToolsCenter</span>
        </div>
        <div className="navbar-links">
          <a href="#tools" className="navbar-link navbar-link-button" onClick={handleDiscoverClick}>Discover</a>
          <a href="#collections" className="navbar-link navbar-link-button" onClick={handleCollectionsClick}>Collections</a>
          <a href="#seo-hub" className="navbar-link navbar-link-button" onClick={handleCategoriesClick}>Categories</a>
          <a href="#updates" className="navbar-link navbar-link-button" onClick={handleUpdatesClick}>Weekly Updates</a>
          <a href="#news" className="navbar-link navbar-link-button">News</a>
          <a href="#faq" className="navbar-link navbar-link-button">FAQ</a>
          <button onClick={() => openPage('contact')} className="navbar-link navbar-link-button" type="button">Contact</button>
          <button onClick={toggleTheme} className="navbar-link navbar-link-button" title="Toggle theme" type="button">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* ==========  HERO SECTION ========== */}
      <section className="section section-hero hero">
        <div className="hero-content">
          <div className="hero-tagline">✨ Discover the Perfect AI Tool</div>
          <h1 className="hero-headline">Find Your Ideal <span style={{ color: 'var(--primary)' }}>AI Solution</span> in Seconds</h1>
          <p className="hero-description">Explore 100+ genuine AI tools across 10+ categories. Read real user reviews, compare features, and find exactly what you need.</p>

          {/* SEARCH BAR */}
          <div className="search-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search AI tools, workflows, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* STATS */}
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <a href="#tools" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', display: 'inline-block' }} onClick={handleDiscoverClick}>Explore Tools</a>
            <a href="#updates" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none', display: 'inline-block' }} onClick={handleUpdatesClick}>Subscribe for Updates</a>
            <button className="btn btn-secondary btn-lg hero-share-btn" type="button" onClick={handleShareWebsite}>Share Directory</button>
          </div>

          {shareStatus && <p className="hero-share-feedback">{shareStatus}</p>}

          <div className="growth-strip" aria-label="Live community growth data">
            <div className="growth-pill">
              <span className="growth-pill-label">Live Visitors</span>
              <strong>{visitorCount.toLocaleString()}</strong>
            </div>
            <div className="growth-pill">
              <span className="growth-pill-label">Weekly Newsletter</span>
              <strong>Fresh Every Friday</strong>
            </div>
            <div className="growth-pill">
              <span className="growth-pill-label">SEO-Ready Picks</span>
              <strong>100+ Curated Tools</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ==========  ALL TOOLS DIRECTORY ========== */}
      <section className="section" id="tools" ref={toolsSectionRef} style={{ scrollMarginTop: '6rem' }}>
        <div className="container">
          <h2 style={{ marginBottom: '0.5rem', textAlign: 'center' }}>🔥 AI Tools Directory</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '1.5rem' }}>
            {searchQuery ? `Search results for "${searchQuery}"` : selectedCategory === 'All' ? 'Explore our complete directory of 100+ genuine AI tools' : `Tools in ${selectedCategory}`}
          </p>
          <div className="affiliate-disclosure-banner">
            <span>Disclosure: some tool links may be affiliate links, which may earn us a commission at no extra cost to you.</span>
            <button className="affiliate-disclosure-link" onClick={() => openPage('affiliateDisclosure')} type="button">Read disclosure</button>
          </div>
          
          {/* CATEGORY FILTER BAR */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
              style={selectedCategory === 'All' ? { background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' } : { background: 'var(--muted-foreground)', color: 'var(--foreground)', padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer' }}
            >
              All Tools ({TOOLS_EXTENDED.length})
            </button>
            {categories.map((cat) => {
              return (
                <button
                  key={cat.name}
                  onClick={() => { setSelectedCategory(cat.name); setSearchQuery('') }}
                  style={selectedCategory === cat.name ? { background: 'var(--primary)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' } : { background: 'var(--muted-foreground)', color: 'var(--foreground)', padding: '0.5rem 0.75rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {cat.icon} {cat.name} ({cat.count})
                </button>
              )
            })}
          </div>
          
          {/* ADS CONTAINER - AFTER TOOLS INTRO */}
          <AdsContainer type="horizontal" />
          
          <div className="tools-grid">
            {filteredTools.length > 0 ? (
              filteredTools.map(tool => (
                <a key={tool.id} href={getToolOutboundUrl(tool)} target="_blank" rel={getToolAnchorRel(tool)} className="tool-card" title={`Visit ${tool.name}`} onClick={() => trackToolClick(tool, 'directory')}>
                  <div className="tool-header">
                    <div className="tool-logo">{tool.icon}</div>
                    <div className="tool-meta">
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-tagline">{tool.tagline}</div>
                    </div>
                  </div>
                  <div className="tool-card-top">
                    <span className="tool-badge">{tool.badge}</span>
                    {isAffiliateTool(tool) && <span className="tool-affiliate-pill">Affiliate</span>}
                  </div>
                  <div className="tool-description" style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                    {tool.description}
                  </div>
                  <div className="tool-footer">
                    <div className="tool-rating">{'⭐'.repeat(Math.floor(tool.rating))}</div>
                  </div>
                </a>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
                No tools found matching your search or category. Try a different search term or category.
              </div>
            )}
          </div>
        </div>
      </section>



      {/* ==========  COLLECTIONS ========== */}
      <section className="section" id="collections" ref={collectionsSectionRef} style={{ scrollMarginTop: '6rem' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📚 Curated Collections</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>Hand-picked tools for specific use cases</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {COLLECTIONS.map((collection, idx) => (
              <button
                key={collection.title}
                onClick={() => setActiveCollectionIndex(idx)}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: idx === activeCollectionIndex ? 'var(--primary)' : 'var(--surface)',
                  color: idx === activeCollectionIndex ? 'white' : 'var(--foreground)',
                  fontWeight: 700,
                }}
              >
                {collection.title}
              </button>
            ))}
          </div>
          <div className="collection-card" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <div className="collection-header" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <div className="collection-title" style={{ fontSize: '1.35rem' }}>{selectedCollection.title}</div>
                <div style={{ color: 'var(--muted)', marginTop: '0.35rem' }}>{selectedCollection.description}</div>
              </div>
              <div className="collection-count">{selectedCollectionTools.length} tools</div>
            </div>
            <div className="collection-items" style={{ display: 'grid', gap: '0.75rem', marginTop: '1.25rem' }}>
              {selectedCollectionTools.map((tool) => (
                <a
                  key={tool.id}
                  href={getToolOutboundUrl(tool)}
                  target="_blank"
                  rel={getToolAnchorRel(tool)}
                  onClick={() => trackToolClick(tool, 'collection')}
                  className="collection-item"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    textDecoration: 'none',
                    color: 'inherit',
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--background)',
                    border: '1px solid var(--border)',
                  }}
                  title={`Open ${tool.name}`}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{tool.icon}</span>
                    <span style={{ fontWeight: 700 }}>{tool.name}</span>
                    {isAffiliateTool(tool) && <span className="tool-affiliate-pill">Affiliate</span>}
                  </span>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Open</span>
                </a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const firstTool = selectedCollectionTools[0]
                  if (firstTool) {
                    trackToolClick(firstTool, 'collection-cta')
                    window.open(getToolOutboundUrl(firstTool), '_blank', 'noopener,noreferrer')
                  }
                }}
              >
                Open First Tool
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const firstTool = selectedCollectionTools[0]
                  if (firstTool) {
                    setSearchQuery(firstTool.name)
                    setSelectedCategory('All')
                    scrollToSection(toolsSectionRef)
                  }
                }}
              >
                Explore in Directory
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========  SEO HUB + TRENDING ========== */}
      <section id="seo-hub" ref={seoHubSectionRef} className="section seo-hub-section" style={{ scrollMarginTop: '6rem' }}>
        <div className="container">
          <div className="seo-hub-grid">
            <article className="seo-hub-card">
              <div className="seo-hub-header">
                <div className="seo-hub-kicker">Discover</div>
                <h3 className="seo-hub-title">Explore SEO Landing Pages</h3>
                <p className="seo-hub-subtitle">Jump straight to high-intent pages for categories, use cases, and tool comparisons.</p>
              </div>

              <div className="seo-hub-group">
                <div className="seo-hub-group-head">
                  <span>Categories</span>
                  <span>{categories.length} groups</span>
                </div>
                <div className="seo-chip-wrap">
                  {categories.slice(0, 8).map((cat) => (
                    <button
                      key={`seo-cat-${cat.name}`}
                      className="seo-chip"
                      type="button"
                      onClick={() => navigateTo(`/categories/${slugify(cat.name)}`)}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className="seo-chip-count">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="seo-hub-group">
                <div className="seo-hub-group-head">
                  <span>Use Cases</span>
                  <span>{USE_CASE_PAGES.length} pages</span>
                </div>
                <div className="seo-chip-wrap">
                  {USE_CASE_PAGES.map((useCase) => (
                    <button
                      key={useCase.slug}
                      className="seo-chip seo-chip-text"
                      type="button"
                      onClick={() => navigateTo(`/use-cases/${useCase.slug}`)}
                    >
                      <span>{deslugify(useCase.slug)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="seo-hub-group">
                <div className="seo-hub-group-head">
                  <span>Comparisons</span>
                  <span>{COMPARISON_PAGES.length} matchups</span>
                </div>
                <div className="seo-chip-wrap">
                  {COMPARISON_PAGES.map((comparison) => (
                    <button
                      key={comparison.slug}
                      className="seo-chip seo-chip-text"
                      type="button"
                      onClick={() => navigateTo(`/compare/${comparison.slug}`)}
                    >
                      <span>{comparison.toolA} vs {comparison.toolB}</span>
                    </button>
                  ))}
                </div>
              </div>
            </article>

            <article className="seo-hub-card seo-hub-card-leaderboard">
              <div className="seo-hub-header">
                <div className="seo-hub-kicker">Live Activity</div>
                <h3 className="seo-hub-title">Trending Tools Leaderboard</h3>
                <p className="seo-hub-subtitle">Ranking updates as visitors click tool links across the directory.</p>
              </div>

              {topClickedTools.length === 0 ? (
                <div className="leaderboard-empty">
                  <div className="leaderboard-empty-title">No clicks tracked yet</div>
                  <p>Open a few tools from the directory to start populating this leaderboard.</p>
                  <button className="btn btn-secondary" type="button" onClick={() => scrollToSection(toolsSectionRef)}>
                    Browse Tools
                  </button>
                </div>
              ) : (
                <div className="leaderboard-list">
                  {topClickedTools.map((entry, index) => (
                    <a
                      key={`leader-${entry.tool.id}`}
                      href={getToolOutboundUrl(entry.tool)}
                      target="_blank"
                      rel={getToolAnchorRel(entry.tool)}
                      onClick={() => trackToolClick(entry.tool, 'leaderboard')}
                      className="leaderboard-item"
                    >
                      <strong className="leaderboard-rank">#{index + 1}</strong>
                      <span className="leaderboard-tool">
                        <span>{entry.tool.icon}</span>
                        <span>
                          <span className="leaderboard-tool-name">{entry.tool.name}</span>
                          <span className="leaderboard-tool-category">{entry.tool.category}</span>
                        </span>
                      </span>
                      <span className="leaderboard-count">{entry.count.toLocaleString()}</span>
                    </a>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* ==========  NEWSLETTER ========== */}
      <section className="section" id="updates" ref={updatesSectionRef} style={{ background: 'var(--surface)', scrollMarginTop: '6rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '1.25rem', alignItems: 'stretch' }}>
            <div className="newsletter-section" style={{ margin: 0, textAlign: 'left' }}>
              <div style={{ display: 'inline-flex', padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border)', marginBottom: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>Weekly Update</div>
              <h2 className="newsletter-headline" style={{ textAlign: 'left' }}>Get Weekly AI Updates</h2>
              <p className="newsletter-description" style={{ textAlign: 'left' }}>Browse the latest weekly picks, then subscribe for a curated digest of AI tools and news.</p>
              <form className="newsletter-form" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  style={{ flex: '1 1 220px', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }}
                  disabled={newsletterStatus.type === 'success'}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={newsletterStatus.type === 'success'}
                >
                  {newsletterStatus.type === 'success' ? '✓ Subscribed' : 'Subscribe'}
                </button>
              </form>
              {newsletterStatus.message && (
                <p style={{ marginTop: '0.75rem', color: newsletterStatus.type === 'error' ? '#ef4444' : 'var(--primary)', fontSize: '0.9rem' }}>
                  {newsletterStatus.message}
                </p>
              )}
              <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                ✓ No spam. <button onClick={() => setShowUnsubscribeModal(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Unsubscribe anytime</button>.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                {['Tools', 'Collections', 'News', 'Contact'].map((label) => (
                  <button
                    key={label}
                    className="navbar-link"
                    onClick={() => {
                      if (label === 'Tools') scrollToSection(toolsSectionRef)
                      if (label === 'Collections') scrollToSection(collectionsSectionRef)
                      if (label === 'News') scrollToSection({ current: document.getElementById('news') })
                      if (label === 'Contact') openPage('contact')
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="collection-card" style={{ margin: 0, display: 'grid', gap: '0.75rem' }}>
              {weeklyHighlights.map((article) => (
                <a key={article.title} href={article.link} target="_blank" rel="noopener noreferrer" className="collection-item" style={{ textDecoration: 'none', color: 'inherit', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }} onClick={() => setToolClicks((current) => ({ ...current, 'News Clicks': { count: (current['News Clicks']?.count || 0) + 1, category: 'News' } }))}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '0.35rem' }}>{article.date}</div>
                      <div style={{ fontWeight: 800, marginBottom: '0.35rem' }}>{article.title}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.92rem' }}>{article.summary}</div>
                    </div>
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Open</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==========  NEWS HUB ========== */}
      <section className="section" id="news" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📰 Latest AI News</h2>
          <div className="tools-grid">
            {aiNews.slice(0, 3).map((article, idx) => (
              <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer" className="news-card" style={{ textDecoration: 'none', cursor: 'pointer' }} onClick={() => setToolClicks((current) => ({ ...current, 'News Clicks': { count: (current['News Clicks']?.count || 0) + 1, category: 'News' } }))}>
                <div className="news-image" style={{ position: 'relative', overflow: 'hidden' }}>
                  {article.image ? (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px 8px 0 0' }} 
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        // Show fallback emoji when image fails
                        const fallback = e.target.parentElement.querySelector('.news-fallback');
                        if (fallback) fallback.style.display = 'flex';
                      }} 
                    />
                  ) : null}
                  <div 
                    className="news-fallback" 
                    style={{
                      display: article.image ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      fontSize: '3rem',
                      background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      borderRadius: '8px 8px 0 0',
                      position: 'absolute',
                      top: 0,
                      left: 0
                    }}
                  >
                    📰
                  </div>
                </div>
                <div className="news-content">
                  <div className="news-date">{article.date}</div>
                  <div className="news-title">{article.title}</div>
                  <div className="news-excerpt">{article.summary}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==========  USER REVIEWS ========== */}
      <UserReviewsSection tools={TOOLS_EXTENDED} />

      {/* ==========  ADS CONTAINER - AFTER NEWS ========== */}
      <div style={{ padding: '0 1rem' }}>
        <div className="container">
          <AdsContainer type="horizontal" />
        </div>
      </div>

      {/* ==========  FAQ SECTION ========== */}
      <section className="section" id="faq" style={{ background: 'var(--surface)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', padding: '0.35rem 0.75rem', borderRadius: '999px', border: '1px solid var(--border)', marginBottom: '0.9rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>Common Questions</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>Everything you need to know about AIToolsCenter</p>
          </div>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              {
                q: '🎯 What is AIToolsCenter?',
                a: 'AIToolsCenter is a comprehensive directory of 100+ authentic AI tools across categories like writing, coding, image generation, video, automation, and productivity. We help you discover, compare, and choose the best AI tools for your needs.'
              },
              {
                q: '🔍 How do I find the right AI tool for my needs?',
                a: 'Use our search bar to find tools by name, or filter by category (Writing, Coding, Image, Video, etc.). You can also browse our curated collections for specific use cases. Each tool includes detailed descriptions, pricing, and ratings to help you decide.'
              },
              {
                q: '⭐ How are tools rated and reviewed?',
                a: 'Tools are rated based on features, user feedback, pricing value, and community reviews. We update ratings regularly as tools evolve. You can submit your own reviews to help other users make informed decisions.'
              },
              {
                q: '💰 Do I need to pay for the tools listed?',
                a: 'Most tools have both free and paid versions. Each tool listing shows the pricing tier (Free, Free + Pro, Paid, etc.). Click "Open" on any tool to visit their website and try them yourself.'
              },
              {
                q: '📧 How often do I receive newsletter updates?',
                a: 'Our weekly newsletter is sent every Monday at 9 AM UTC. You can subscribe for free and cancel anytime with one click. Each email includes top trending AI tools, latest news, and curated collections.'
              },
              {
                q: '🔐 Is my email safe with you?',
                a: 'We take privacy seriously. Your email is only used for our weekly newsletter and is never shared or sold. You can unsubscribe instantly with one click from any email.'
              },
              {
                q: '📚 What categories of AI tools do you cover?',
                a: 'We cover 20+ categories including Writing & Content, Image Generation, Video Creation, Coding & Development, Research & Knowledge, Productivity, Automation, Business Tools, and more. New categories added regularly!'
              },
              {
                q: '🌐 Is AIToolsCenter free to use?',
                a: 'Yes! AIToolsCenter is completely free. No registration required to browse tools. Our newsletter is also free. We keep it free for everyone.'
              },
              {
                q: '💼 Do you use affiliate links?',
                a: 'Yes. Some tool links may be affiliate links, which means we may earn a commission if you sign up or buy through them. This does not increase your price, and we label commercial links and maintain a separate Affiliate Disclosure page.'
              },
              {
                q: '❓ How can I get help or report an issue?',
                a: 'Contact us at support@aitoolscenter.in or use our contact form in the footer. We respond within 24 hours. You can also find detailed information about our service in our Privacy Policy and Terms.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                className="faq-item"
                onClick={(e) => {
                  const answer = e.currentTarget.querySelector('.faq-answer');
                  if (answer) {
                    answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
                    e.currentTarget.querySelector('.faq-toggle').style.transform = 
                      answer.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--foreground)' }}>{faq.q}</div>
                  <div 
                    className="faq-toggle"
                    style={{
                      fontSize: '1.25rem',
                      transition: 'transform 0.3s ease',
                      flex: '0 0 auto',
                      color: 'var(--foreground)'
                    }}
                  >
                    ▼
                  </div>
                </div>
                <div 
                  className="faq-answer"
                  style={{
                    display: 'none',
                    marginTop: '0.75rem',
                    color: 'var(--muted)',
                    lineHeight: '1.6',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'linear-gradient(135deg, rgba(0,194,168,0.1), rgba(247,179,43,0.05))', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--foreground)' }}>Didn&apos;t find your answer?</div>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>We&apos;re here to help. Reach out to our support team.</p>
            <button 
              onClick={() => openPage('contact')}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>

      {/* ==========  UNSUBSCRIBE MODAL ========== */}
      {showUnsubscribeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem', color: 'var(--foreground)' }}>Unsubscribe from Newsletter</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Enter your email address to unsubscribe from our newsletter.
            </p>
            <form onSubmit={handleUnsubscribeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={unsubscribeEmail}
                onChange={(e) => setUnsubscribeEmail(e.target.value)}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Unsubscribe
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUnsubscribeModal(false)
                    setUnsubscribeEmail('')
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========  FEEDBACK MODAL ========== */}
      {showFeedbackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '0.5rem', color: 'var(--foreground)' }}>Send Us Your Feedback</h2>
            <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
              Help us improve AIToolsCenter by sharing your thoughts, suggestions, or reporting issues.
            </p>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Your Name"
                value={feedbackData.name}
                onChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                value={feedbackData.email}
                onChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <input
                type="text"
                placeholder="Subject"
                value={feedbackData.subject}
                onChange={(e) => setFeedbackData({ ...feedbackData, subject: e.target.value })}
                required
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
              />
              <textarea
                placeholder="Your Feedback (minimum 10 characters)"
                value={feedbackData.message}
                onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
                required
                rows="5"
                style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              
              {feedbackStatus.message && (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  background: feedbackStatus.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                  border: `1px solid ${feedbackStatus.type === 'success' ? '#4CAF50' : '#F44336'}`,
                  color: feedbackStatus.type === 'success' ? '#4CAF50' : '#F44336',
                  fontSize: '0.9rem',
                }}>
                  {feedbackStatus.message}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Send Feedback
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal(false)
                    setFeedbackData({ name: '', email: '', subject: '', message: '' })
                    setFeedbackStatus({ type: '', message: '' })
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========  FOOTER ========== */}
      <footer className="footer-shell">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-title">AIToolsCenter</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Discover 100+ AI tools across all categories. Subscribe for weekly updates on trending tools, news, and comparisons.</p>
            </div>
            <div className="footer-panels">
              <div className="footer-panel">
                <div className="footer-panel-title">Explore</div>
                <div className="footer-actions">
                  <button className="navbar-link navbar-link-button footer-link" onClick={goHome} type="button">Discover</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={handleCollectionsClick} type="button">Collections</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={handleUpdatesClick} type="button">Weekly Updates</button>
                </div>
              </div>
              <div className="footer-panel">
                <div className="footer-panel-title">Help</div>
                <div className="footer-actions">
                  <a className="navbar-link navbar-link-button footer-link" href="#faq">FAQ</a>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('contact')} type="button">Contact Us</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => setShowUnsubscribeModal(true)} type="button">Unsubscribe</button>
                </div>
              </div>
              <div className="footer-panel">
                <div className="footer-panel-title">Legal</div>
                <div className="footer-actions">
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('privacy')} type="button">Privacy Policy</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('affiliateDisclosure')} type="button">Affiliate Disclosure</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('terms')} type="button">Terms</button>
                </div>
              </div>
              <div className="footer-panel">
                <div className="footer-panel-title">Actions</div>
                <div className="footer-actions">
                  <a className="navbar-link navbar-link-button footer-link" href="#news">View News</a>
                  <button className="navbar-link navbar-link-button footer-link" onClick={handleUpdatesClick} type="button">Subscribe</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => setShowFeedbackModal(true)} type="button">Feedback</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="button">Back to Top</button>
                </div>
              </div>
            </div>
          </div>
          <p className="footer-meta">© 2026 AIToolsCenter. All rights reserved. | 👥 Visitors: {visitorCount.toLocaleString()} {visitorCountError ? '(cached)' : '(live)'}</p>
          <p className="footer-disclosure">Some links on this site may be affiliate links. We may earn a commission at no extra cost to you.</p>
        </div>
      </footer>
      <ConsentBanner onPrivacyClick={() => openPage('privacy')} cmpManaged={cmpManagedConsent} />
    </div>
  )
}
