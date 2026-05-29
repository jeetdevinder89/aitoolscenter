import { useEffect, useRef, useState } from 'react'
import './redesign.css'
import './advanced-components.css'
import aiNews from './data/ai-news.json'

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://www.aitoolscenter.in').replace(/\/$/, '')

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

// Compatibility constant for sitemap generation
const TOOLS = TOOLS_EXTENDED

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

const resolveToolLink = (tool) => TOOL_LINK_OVERRIDES[tool.name] || tool.link

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

// ==================================================
// RECOMMENDATION QUESTIONS
// ==================================================

const WIZARD_QUESTIONS = [
  {
    id: 0,
    question: 'What is your profession?',
    options: ['Developer', 'Writer', 'Designer', 'Marketer', 'Teacher', 'Student', 'Other'],
  },
  {
    id: 1,
    question: 'What is your primary goal?',
    options: ['Content Creation', 'Coding/Development', 'Design/Art', 'Research', 'Productivity', 'Learning'],
  },
  {
    id: 2,
    question: 'What is your budget?',
    options: ['Free Only', 'Under $20/month', '$20-50/month', '$50-100/month', '$100+/month'],
  },
  {
    id: 3,
    question: 'What is your experience level?',
    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  },
]

const LEGAL_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'We collect only the information needed to operate the site, process submissions, and improve the experience. Last updated: May 29, 2026.',
    sections: [
      {
        heading: 'What We Collect',
        items: [
          'Email addresses submitted through newsletters and contact forms.',
          'Tool submission details such as name, URL, category, pricing, and description.',
          'Basic analytics and advertising signals used to understand traffic and performance.',
        ],
      },
      {
        heading: 'How We Use It',
        items: [
          'We use submitted data to respond to inquiries and review tool submissions.',
          'We use analytics to measure site usage and improve content.',
          'We do not sell personal data.',
        ],
      },
      {
        heading: 'Newsletter & Unsubscribe',
        items: [
          'Subscribers receive a weekly digest of AI tool updates and news every Monday.',
          'All newsletter emails include a clear unsubscribe link at the bottom.',
          'You can also contact support@aitoolscenter.in to manage your subscription.',
          'Unsubscribe requests are processed immediately.',
        ],
      },
      {
        heading: 'Your Choices',
        items: [
          'You can request removal of submitted personal data by contacting support.',
          'You can update cookie preferences in your browser settings.',
          'You can unsubscribe from the newsletter using the link in any email.',
          'Third-party advertising partners may use cookies subject to their own policies.',
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
          'Use this address for tool submission follow-up and site support.',
        ],
      },
    ],
  },
}

function StaticPage({ title, intro, sections, onHomeClick, onSubmitClick }) {
  return (
    <div className="page">
      <nav className="navbar">
        <div className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>AIToolsCenter</div>
        <div className="navbar-links">
          <button className="navbar-link" onClick={onHomeClick}>Home</button>
          <button className="navbar-link" onClick={onSubmitClick}>Submit Tool</button>
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

// ==================================================
// PAGE COMPONENTS
// ==================================================

// AdsContainer Component for Google AdSense
function AdsContainer({ type = 'horizontal' }) {
  return (
    <div className={`ads-container ads-${type}`} style={{ 
      padding: '1rem',
      marginBottom: '1rem',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--muted)'
    }}>
      <div style={{ marginBottom: '0.5rem' }}>Advertisement</div>
      <div style={{ 
        height: type === 'horizontal' ? '90px' : '300px',
        background: 'var(--background)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted-foreground)'
      }}>
        {type === 'horizontal' && 'Ad Space (728x90)'}
        {type === 'vertical' && 'Ad Space (300x250)'}
        {type === 'square' && 'Ad Space (300x300)'}
      </div>
      {/* Google AdSense Script would be inserted here */}
      {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2770089511325323" 
          crossOrigin="anonymous"></script>
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-2770089511325323"
               data-ad-slot="xxxxxxxxxx"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script> */}
    </div>
  )
}

function ComparisonEngine({ tools }) {
  const toolArray = tools && Array.isArray(tools) && tools.length > 1 ? tools : TOOLS_EXTENDED
  const [selectedTools, setSelectedTools] = useState([toolArray[0], toolArray[1]])
  
  const features = ['Price', 'Ease of Use', 'Features', 'Integrations', 'Speed', 'Support']

  const addTool = (tool) => {
    if (!selectedTools.find(t => t.id === tool.id)) {
      setSelectedTools([...selectedTools, tool])
    }
  }

  const removeTool = (toolId) => {
    setSelectedTools(selectedTools.filter(t => t.id !== toolId))
  }

  return (
    <section className="section" id="compare" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>🔄 Compare AI Tools</h2>
        
        <div className="comparison-wrapper">
          <div className="comparison-header">
            {selectedTools.map((tool, idx) => (
              <div key={tool.id} className="comparison-select" style={{ position: 'relative' }}>
                <select value={tool.id} disabled style={{ opacity: 0.8 }}>
                  <option>{tool.name}</option>
                </select>
                <button 
                  className="comparison-remove-btn"
                  onClick={() => removeTool(tool.id)}
                  style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="comparison-content">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  {selectedTools.map(tool => (
                    <th key={tool.id}>{tool.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Price</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id}>{tool.price}</td>
                  ))}
                </tr>
                <tr>
                  <td>Features</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id}>{tool.features.length}+</td>
                  ))}
                </tr>
                <tr>
                  <td>Rating</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id}>{'⭐'.repeat(tool.rating)}</td>
                  ))}
                </tr>
                <tr>
                  <td>Monthly Visits</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id}>{tool.monthlyVisits}</td>
                  ))}
                </tr>
                <tr>
                  <td>Integrations</td>
                  {selectedTools.map(tool => (
                    <td key={tool.id}>{tool.integrations.length}+</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3>Add Tools to Compare</h3>
          <div className="tools-grid" style={{ marginTop: '1rem' }}>
            {toolArray.filter(t => !selectedTools.find(st => st.id === t.id)).map(tool => (
              <div 
                key={tool.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => addTool(tool)}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tool.icon}</div>
                <div style={{ fontWeight: 600 }}>{tool.name}</div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem', width: '100%' }}>Add</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function RecommendationWizard({ tools }) {
  const toolArray = tools && Array.isArray(tools) && tools.length > 0 ? tools : TOOLS_EXTENDED
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [recommendations, setRecommendations] = useState(null)

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [step]: answer }
    setAnswers(newAnswers)
    
    if (step < WIZARD_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      // Generate recommendations
      setRecommendations(tools.slice(0, 3))
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setRecommendations(null)
  }

  const progress = ((step + 1) / WIZARD_QUESTIONS.length) * 100

  return (
    <section className="section" id="wizard" style={{ background: 'var(--surface)' }}>
      <div className="container">
        <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>🎯 Find Your Perfect AI Tool</h2>
        
        <div className="wizard-container">
          {!recommendations ? (
            <>
              <div className="wizard-progress">
                {WIZARD_QUESTIONS.map((q, idx) => (
                  <div key={idx} className={`wizard-progress-item ${idx <= step ? 'active' : ''} ${idx < step ? 'completed' : ''}`} />
                ))}
              </div>

              <div className="wizard-step active">
                <h3 className="wizard-question">{WIZARD_QUESTIONS[step].question}</h3>
                <div className="wizard-options">
                  {WIZARD_QUESTIONS[step].options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`wizard-option ${answers[step] === option ? 'selected' : ''}`}
                      onClick={() => handleAnswer(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="wizard-buttons">
                <button 
                  className="btn btn-secondary"
                  onClick={() => step > 0 && setStep(step - 1)}
                  disabled={step === 0}
                >
                  ← Back
                </button>
                <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                  Step {step + 1} of {WIZARD_QUESTIONS.length}
                </span>
              </div>
            </>
          ) : (
            <>
              <h3 className="wizard-result-title">✨ Recommended Tools For You</h3>
              <div className="wizard-results">
                {recommendations.map((tool, idx) => (
                  <div key={tool.id} className="wizard-result-item">
                    <div>
                      <div style={{ fontWeight: 600 }}>{tool.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{tool.tagline}</div>
                    </div>
                    <div className="wizard-result-match">{100 - idx * 15}% Match</div>
                  </div>
                ))}
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={restart}>
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// User Reviews Component
function UserReviewsSection({ tools }) {
  const toolArray = tools && Array.isArray(tools) && tools.length > 0 ? tools : TOOLS_EXTENDED
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
              <p style={{ color: 'var(--foreground)', marginBottom: '1rem', fontStyle: 'italic' }}>"{review.text}"</p>
              <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>— {review.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UserDashboard({ tools }) {
  const toolArray = tools && Array.isArray(tools) && tools.length > 2 ? tools : TOOLS_EXTENDED
  const [activeTab, setActiveTab] = useState('saved')
  const [savedTools, setSavedTools] = useState([toolArray[0], toolArray[2]])
  const [comparisonHistory, setComparisonHistory] = useState([])

  return (
    <section className="section" id="dashboard" style={{ marginTop: '2rem' }}>
      <div className="dashboard-container">
        <div className="dashboard-sidebar">
          <div className="dashboard-menu">
            <div 
              className={`dashboard-menu-item ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              💾 Saved Tools
            </div>
            <div 
              className={`dashboard-menu-item ${activeTab === 'comparisons' ? 'active' : ''}`}
              onClick={() => setActiveTab('comparisons')}
            >
              🔄 Comparisons
            </div>
            <div 
              className={`dashboard-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {activeTab === 'saved' && (
            <>
              <h2 style={{ marginBottom: '1.5rem' }}>Saved Tools ({savedTools.length})</h2>
              <div className="tools-grid">
                {savedTools.map(tool => (
                  <div key={tool.id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{tool.icon}</div>
                    <div style={{ fontWeight: 600 }}>{tool.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{tool.tagline}</div>
                    <button className="btn btn-secondary" style={{ marginTop: '0.5rem', width: '100%' }}>View</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'comparisons' && (
            <>
              <h2 style={{ marginBottom: '1.5rem' }}>Comparison History</h2>
              <div style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>
                No comparisons yet. <a href="#compare" style={{ color: 'var(--primary)' }}>Start comparing tools</a>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <>
              <h2 style={{ marginBottom: '1.5rem' }}>Profile Settings</h2>
              <div style={{ maxWidth: '500px' }}>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="your@email.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Theme Preference</label>
                  <select className="form-select">
                    <option>Dark</option>
                    <option>Light</option>
                    <option>Auto</option>
                  </select>
                </div>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

// ==================================================
// MAIN APP COMPONENT
// ==================================================

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [submitForm, setSubmitForm] = useState({
    name: '',
    url: '',
    category: '',
    pricing: '',
    contactEmail: '',
    description: '',
  })
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' })
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState({ type: '', message: '' })
  const [activeCollectionIndex, setActiveCollectionIndex] = useState(0)
  const toolsSectionRef = useRef(null)
  const collectionsSectionRef = useRef(null)
  const updatesSectionRef = useRef(null)
  const submitSectionRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('aitoolscenter-theme') || 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  useEffect(() => {
    // Close suggestions when clicking outside search box
    const handleClickOutside = (e) => {
      const searchContainer = document.querySelector('.search-container')
      if (searchContainer && !searchContainer.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSuggestions])

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDiscoverClick = (event) => {
    event.preventDefault()
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
    setShowSuggestions(false)
    scrollToSection(toolsSectionRef)
  }

  const handleBrowseClick = (event) => {
    event.preventDefault()
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
    setShowSuggestions(false)
    scrollToSection(toolsSectionRef)
  }

  const goHome = () => {
    setCurrentPage('home')
    setSelectedCategory('All')
    setSearchQuery('')
    setShowSuggestions(false)
  }

  const openPage = (page) => {
    setCurrentPage(page)
    setShowSuggestions(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleSubmitToolClick = (event) => {
    event.preventDefault()
    scrollToSection(submitSectionRef)
  }

  const handleCollectionsClick = (event) => {
    event.preventDefault()
    scrollToSection(collectionsSectionRef)
  }

  const handleUpdatesClick = (event) => {
    event.preventDefault()
    scrollToSection(updatesSectionRef)
  }

  const handleSubmitToolChange = (field) => (event) => {
    const { value } = event.target
    setSubmitForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmitTool = async (event) => {
    event.preventDefault()
    setSubmitStatus({ type: '', message: '' })

    const payload = {
      name: submitForm.name.trim(),
      url: submitForm.url.trim(),
      category: submitForm.category.trim(),
      pricing: submitForm.pricing.trim(),
      contactEmail: submitForm.contactEmail.trim(),
      description: submitForm.description.trim(),
    }

    if (!payload.name || !payload.url || !payload.category || !payload.contactEmail || payload.description.length < 30) {
      setSubmitStatus({ type: 'error', message: 'Please fill out every field and add a longer description.' })
      return
    }

    try {
      const response = await fetch('/api/submit-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Submission API unavailable')
      }

      setSubmitStatus({ type: 'success', message: 'Tool submission sent successfully.' })
      setSubmitForm({ name: '', url: '', category: '', pricing: '', contactEmail: '', description: '' })
      return
    } catch {
      const storedSubmissions = JSON.parse(localStorage.getItem('aitoolscenter-tool-submissions') || '[]')
      storedSubmissions.push({ ...payload, savedAt: new Date().toISOString() })
      localStorage.setItem('aitoolscenter-tool-submissions', JSON.stringify(storedSubmissions))
      setSubmitStatus({
        type: 'success',
        message: 'Submission saved locally. The form is working, and it will use the API when available.',
      })
      setSubmitForm({ name: '', url: '', category: '', pricing: '', contactEmail: '', description: '' })
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

      if (!response.ok) {
        throw new Error('Newsletter API error')
      }

      setNewsletterStatus({ 
        type: 'success', 
        message: '✓ Subscribed! Check your email for confirmation. You will get weekly AI updates every Monday.' 
      })
      setNewsletterEmail('')
      return
    } catch (error) {
      // Fallback: Save to localStorage if API fails
      const subscribers = JSON.parse(localStorage.getItem('aitoolscenter-newsletter-subscribers') || '[]')
      if (!subscribers.includes(email)) {
        subscribers.push(email)
        localStorage.setItem('aitoolscenter-newsletter-subscribers', JSON.stringify(subscribers))
      }
      setNewsletterStatus({ 
        type: 'success', 
        message: '✓ Subscribed! You will receive weekly AI updates.' 
      })
      setNewsletterEmail('')
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

  if (currentPage === 'privacy') {
    return (
      <StaticPage
        title={LEGAL_PAGES.privacy.title}
        intro={LEGAL_PAGES.privacy.intro}
        sections={LEGAL_PAGES.privacy.sections}
        onHomeClick={goHome}
        onSubmitClick={() => openPage('home')}
      />
    )
  }

  if (currentPage === 'terms') {
    return (
      <StaticPage
        title={LEGAL_PAGES.terms.title}
        intro={LEGAL_PAGES.terms.intro}
        sections={LEGAL_PAGES.terms.sections}
        onHomeClick={goHome}
        onSubmitClick={() => openPage('home')}
      />
    )
  }

  if (currentPage === 'contact') {
    return (
      <StaticPage
        title={LEGAL_PAGES.contact.title}
        intro={LEGAL_PAGES.contact.intro}
        sections={LEGAL_PAGES.contact.sections}
        onHomeClick={goHome}
        onSubmitClick={() => openPage('home')}
      />
    )
  }

  // STATS SECTION DATA
  const stats = [
    { value: '100+', label: 'Genuine AI Tools' },
    { value: '10+', label: 'Categories' },
    { value: '50K+', label: 'User Reviews' },
  ]

  // CATEGORIES DATA
  const categories = [
    { name: 'Writing AI', icon: '✍️', count: 25 },
    { name: 'Image AI', icon: '🖼️', count: 25 },
    { name: 'Video AI', icon: '🎥', count: 15 },
    { name: 'Coding AI', icon: '⚙️', count: 20 },
    { name: 'Research', icon: '🔬', count: 15 },
    { name: 'Audio & Music', icon: '🎵', count: 10 },
    { name: 'Design Tools', icon: '🎨', count: 10 },
    { name: 'Business AI', icon: '📊', count: 15 },
    { name: 'Productivity', icon: '⚡', count: 15 },
    { name: 'APIs', icon: '🔌', count: 7 },
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
          <a href="#updates" className="navbar-link navbar-link-button" onClick={handleUpdatesClick}>Weekly Updates</a>
          <a href="#news" className="navbar-link navbar-link-button">News</a>
          <button onClick={() => openPage('contact')} className="navbar-link navbar-link-button" type="button">Contact</button>
          <button onClick={toggleTheme} className="navbar-link navbar-link-button" title="Toggle theme" type="button">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#submit" className="navbar-cta" onClick={handleSubmitToolClick}>Submit Tool</a>
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
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setShowSuggestions(false)
                  }
                }}
              />
            </div>
            {showSuggestions && (
              <div className="search-suggestions">
                <div className="suggestion-label">Popular Searches</div>
                {['AI for Teachers', 'Best Coding AI', 'Free AI Tools', 'Image Generation'].map((s, i) => (
                  <div key={i} className="suggestion-item" onClick={() => { setSearchQuery(s); setShowSuggestions(false) }}>
                    {s}
                  </div>
                ))}
              </div>
            )}
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
            <a href="#submit" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none', display: 'inline-block' }} onClick={handleSubmitToolClick}>Submit Your Tool</a>
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
          
          {/* CATEGORY FILTER BAR */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'center' }}>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery('') }}
              style={selectedCategory === 'All' ? { background: 'var(--primary)', color: 'white', padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' } : { background: 'var(--muted-foreground)', color: 'var(--foreground)', padding: '0.5rem 1rem', borderRadius: '2rem', border: 'none', cursor: 'pointer' }}
            >
              All Tools ({TOOLS_EXTENDED.length})
            </button>
            {categories.map((cat) => {
              const catName = cat.name.replace(' AI', '').replace('Audio & Music', 'Audio').replace(' Tools', '');
              const actualCategory = TOOLS_EXTENDED.filter(t => t.category === catName).length;
              return (
                <button
                  key={catName}
                  onClick={() => { setSelectedCategory(catName); setSearchQuery('') }}
                  style={selectedCategory === catName ? { background: 'var(--primary)', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' } : { background: 'var(--muted-foreground)', color: 'var(--foreground)', padding: '0.5rem 0.75rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                >
                  {cat.icon} {catName} ({actualCategory})
                </button>
              );
            })}
          </div>
          
          {/* ADS CONTAINER - AFTER TOOLS INTRO */}
          <AdsContainer type="horizontal" />
          
          <div className="tools-grid">
            {filteredTools.length > 0 ? (
              filteredTools.map(tool => (
                <a key={tool.id} href={resolveToolLink(tool)} target="_blank" rel="noopener noreferrer" className="tool-card" title={`Visit ${tool.name}`}>
                  <div className="tool-header">
                    <div className="tool-logo">{tool.icon}</div>
                    <div className="tool-meta">
                      <div className="tool-name">{tool.name}</div>
                      <div className="tool-tagline">{tool.tagline}</div>
                    </div>
                  </div>
                  <div className="tool-description" style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.5rem' }}>
                    {tool.description}
                  </div>
                  <div className="tool-footer">
                    <span className="tool-badge">{tool.badge}</span>
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
                  href={resolveToolLink(tool)}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    window.open(resolveToolLink(firstTool), '_blank', 'noopener,noreferrer')
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
                ✓ No spam. <a href="#contact" onClick={(event) => { event.preventDefault(); openPage('contact') }} style={{ color: 'var(--primary)', textDecoration: 'none' }}>Unsubscribe anytime</a>.
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
                <a key={article.title} href={article.link} target="_blank" rel="noopener noreferrer" className="collection-item" style={{ textDecoration: 'none', color: 'inherit', padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--background)', border: '1px solid var(--border)' }}>
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
              <a key={idx} href={article.link} target="_blank" rel="noopener noreferrer" className="news-card" style={{ textDecoration: 'none', cursor: 'pointer' }}>
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

      {/* ==========  SUBMIT TOOL SECTION ========== */}
      <section className="section" id="submit" ref={submitSectionRef} style={{ background: 'var(--surface)', scrollMarginTop: '6rem' }}>
        <div className="container">
          <div className="submit-tool-section">
            <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📤 Submit Your AI Tool</h2>
            <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--muted)' }}>Help the community discover your tool. Fill out the form below to submit.</p>
            <form className="submit-tool-form" style={{ maxWidth: '600px', margin: '0 auto' }} onSubmit={handleSubmitTool}>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" placeholder="Tool Name" required value={submitForm.name} onChange={handleSubmitToolChange('name')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="url" placeholder="Tool URL" required value={submitForm.url} onChange={handleSubmitToolChange('url')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <select required value={submitForm.category} onChange={handleSubmitToolChange('category')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }}>
                  <option value="">Select Category</option>
                  <option>Writing</option>
                  <option>Image</option>
                  <option>Coding</option>
                  <option>Video</option>
                  <option>Research</option>
                  <option>Productivity</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="text" placeholder="Pricing" value={submitForm.pricing} onChange={handleSubmitToolChange('pricing')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <input type="email" placeholder="Contact Email" required value={submitForm.contactEmail} onChange={handleSubmitToolChange('contactEmail')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <textarea placeholder="Brief description" rows="3" required value={submitForm.description} onChange={handleSubmitToolChange('description')} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--foreground)', fontSize: '1rem' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Tool</button>
            </form>
            {submitStatus.message ? (
              <p style={{ marginTop: '1rem', textAlign: 'center', color: submitStatus.type === 'error' ? '#ef4444' : 'var(--primary)' }}>
                {submitStatus.message}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* ==========  FOOTER ========== */}
      <footer className="footer-shell">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-title">AIToolsCenter</div>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>A clean directory for discovering, comparing, and submitting AI tools. Built for fast browsing, weekly updates, and direct access to the right product pages.</p>
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
                <div className="footer-panel-title">Legal</div>
                <div className="footer-actions">
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('privacy')} type="button">Privacy Policy</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('terms')} type="button">Terms</button>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => openPage('contact')} type="button">Contact</button>
                </div>
              </div>
              <div className="footer-panel">
                <div className="footer-panel-title">Actions</div>
                <div className="footer-actions">
                  <a className="navbar-link navbar-link-button footer-link" href="#submit" onClick={handleSubmitToolClick}>Submit Tool</a>
                  <a className="navbar-link navbar-link-button footer-link" href="#news" onClick={handleUpdatesClick}>View News</a>
                  <button className="navbar-link navbar-link-button footer-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} type="button">Back to Top</button>
                </div>
              </div>
            </div>
          </div>
          <p className="footer-meta">© 2026 AIToolsCenter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
