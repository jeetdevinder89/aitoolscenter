import { useEffect, useState } from 'react'

const CATEGORIES = ['All', 'Writing', 'Image', 'Video', 'Coding', 'Productivity', 'Automation', 'Research']

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
  { value: 'name', label: 'A to Z' },
]

const PRICING_FILTERS = ['All', 'Free', 'Freemium', 'Paid', 'Pro']

const LOCAL_FAVORITES_KEY = 'aitoolscenter-favorites'
const LOCAL_VISITS_KEY = 'aitoolscenter-local-visits'
const LOCAL_RATINGS_KEY = 'aitoolscenter-user-ratings'
const SESSION_VISIT_KEY = 'aitoolscenter-session-visited'
const NEWSLETTER_ENDPOINT = '/api/newsletter'

const AI_NEWS = [
  {
    date: 'May 12, 2026',
    title: 'OpenAI launches GPT-5 with real-time voice and vision',
    summary: 'GPT-5 introduces a unified model for text, voice, and vision with dramatically improved reasoning and a new o3-style thinking mode built in.',
    tag: 'OpenAI',
    link: 'https://openai.com/index/gpt-5/',
  },
  {
    date: 'May 8, 2026',
    title: 'Google DeepMind releases Gemini 2.5 Ultra',
    summary: 'Gemini 2.5 Ultra tops coding and science benchmarks, with a 2M token context window and native integration across all Google Workspace apps.',
    tag: 'Google',
    link: 'https://deepmind.google/models/gemini/',
  },
  {
    date: 'May 5, 2026',
    title: 'Midjourney V7 launches with reference image control',
    summary: 'Midjourney V7 adds style and subject reference images, giving creators fine-grained control over character consistency across generations.',
    tag: 'Image AI',
    link: 'https://www.midjourney.com',
  },
  {
    date: 'Apr 29, 2026',
    title: 'Cursor 1.0 ships with background agent and full codebase indexing',
    summary: 'Cursor hits 1.0 with an autonomous background agent that can open PRs, run tests, and iterate on code without manual prompting.',
    tag: 'Coding',
    link: 'https://cursor.sh',
  },
]

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
    intro: 'We collect minimal data needed to run this site, handle submissions, and improve user experience.',
    sections: [
      {
        heading: 'What We Collect',
        items: [
          'Newsletter subscriptions store email address and subscription source.',
          'Tool submissions store details provided through the submission form.',
          'Basic analytics and ad technologies may use cookies to personalize content and measure performance.',
        ],
      },
      {
        heading: 'How We Use Data',
        items: [
          'We use submitted information to respond to requests, review tool listings, and improve site content.',
          'We do not sell personal data to third parties.',
          'You can request removal of your submitted personal data by contacting us.',
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

const slugifyToolName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const slugifyCategoryName = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const getToolBySlug = (slug) => TOOLS.find((tool) => slugifyToolName(tool.name) === slug)
const getCategoryBySlug = (slug) => TOOL_CATEGORIES.find((category) => slugifyCategoryName(category) === slug) || null
const getLegalPage = (pathname) => LEGAL_PAGES[pathname] || null

const getPricingBucket = (badge) => {
  const normalized = badge.toLowerCase()
  if (normalized.includes('free + pro') || normalized.includes('freemium')) {
    return 'Freemium'
  }
  if (normalized.includes('free')) {
    return 'Free'
  }
  if (normalized.includes('pro') || normalized.includes('add-on')) {
    return 'Pro'
  }
  return 'Paid'
}

const getToolSlugFromPath = (pathname) => (pathname.startsWith('/tools/') ? pathname.replace('/tools/', '') : null)
const getCategorySlugFromPath = (pathname) => (pathname.startsWith('/categories/') ? pathname.replace('/categories/', '') : null)

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

function ToolCard({ tool, isFavorite, isCompared, userRating, onToggleFavorite, onToggleCompare, onTagClick, onRate }) {
  const [reported, setReported] = useState(false)
  const similarTools = TOOLS
    .filter((t) => t.category === tool.category && t.name !== tool.name)
    .slice(0, 2)

  return (
    <article className="tool-card">
      <div className="tool-card-top">
        <span className="tool-badge">{tool.badge}</span>
        <a className="tool-category" href={`/categories/${slugifyCategoryName(tool.category)}`}>{tool.category}</a>
      </div>
      <div className="tool-card-header">
        <div>
          <h3><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></h3>
          <Stars count={tool.rating} />
          <span className="community-label"> community</span>
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
          href={tool.link}
          target="_blank"
          rel="noopener noreferrer"
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
      <a className="comparison-link" href={tool.link} target="_blank" rel="noopener noreferrer">
        Open {tool.name}
      </a>
    </article>
  )
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="faq-item">
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
    return (
      <aside className={`ad-unit ${className}`} aria-label="Advertisement placeholder">
        <div className="ad-unit-placeholder">
          <strong>Ad Placement</strong>
          <span>
            {import.meta.env.DEV
              ? 'Visible in local dev as placeholder. Real ads render only on production domain.'
              : 'Set VITE_ADSENSE_CLIENT_ID to render real ads.'}
          </span>
        </div>
      </aside>
    )
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

function SiteNav() {
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">⚡ AIToolsCenter.in</a>
      <div className="nav-links">
        <a href="/#tools">Tools</a>
        <a href="/#compare">Compare</a>
        <a href="/#ai-news">AI News</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
        <a href="/privacy-policy">Privacy</a>
        <a href="/terms-and-conditions">Terms</a>
        <a href="/#newsletter" className="btn btn-primary nav-cta">Get Weekly Picks</a>
      </div>
    </nav>
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
        Some links are affiliate links. We may earn a small commission at no extra cost to you.
      </p>
    </footer>
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
              <p>{tool.name} helps with {tool.category.toLowerCase()} workflows and is commonly used for faster execution with AI-assisted output.</p>
              <ul className="policy-list">
                <li>Best for: teams and creators who need reliable {tool.category.toLowerCase()} support.</li>
                <li>Pricing model: {tool.badge}.</li>
                <li>Community rating: {tool.rating}/5 based on editorial scoring.</li>
              </ul>
              <a className="btn btn-primary" href={tool.link} target="_blank" rel="noopener noreferrer">Visit {tool.name}</a>
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

function App() {
  const normalizedPath = window.location.pathname.replace(/\/$/, '') || '/'
  const legalPage = getLegalPage(normalizedPath)
  const toolSlug = getToolSlugFromPath(normalizedPath)
  const categorySlug = getCategorySlugFromPath(normalizedPath)
  const toolPage = toolSlug ? getToolBySlug(toolSlug) : null
  const categoryPage = categorySlug ? getCategoryBySlug(categorySlug) : null
  const [activeCategory, setActiveCategory] = useState('All')
  const [activePricing, setActivePricing] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [compareList, setCompareList] = useState([])
  const [localVisits, setLocalVisits] = useState(1)
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
    localStorage.setItem(LOCAL_FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem(LOCAL_RATINGS_KEY, JSON.stringify(userRatings))
  }, [userRatings])

  useEffect(() => {
    const baseUrl = 'https://aitoolscenter.in'
    const matched = toolSlug ? getToolBySlug(toolSlug) : null
    const matchedCategory = categorySlug ? getCategoryBySlug(categorySlug) : null
    const matchedLegalPage = getLegalPage(normalizedPath)

    if (matched) {
      setSearch((current) => current || matched.name)
    }

    const title = matched
      ? `${matched.name} Review, Pricing & Alternatives | AIToolsCenter.in`
      : matchedCategory
        ? `${matchedCategory} AI Tools, Reviews & Alternatives | AIToolsCenter.in`
      : matchedLegalPage
        ? `${matchedLegalPage.title} | AIToolsCenter.in`
        : 'AIToolsCenter.in - Best AI Tools Directory for 2026'

    const description = matched
      ? `${matched.name}: ${matched.tagline} Explore pricing, use cases, categories, and alternatives on AIToolsCenter.in.`
      : matchedCategory
        ? (CATEGORY_SEO[matchedCategory]?.description || `Explore top ${matchedCategory} AI tools with reviews and alternatives.`)
      : matchedLegalPage
        ? matchedLegalPage.description
        : 'Discover and compare top AI tools for writing, coding, images, video, automation, and productivity.'

    const canonicalUrl = matched
      ? `${baseUrl}/tools/${slugifyToolName(matched.name)}`
      : matchedCategory
        ? `${baseUrl}/categories/${slugifyCategoryName(matchedCategory)}`
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
  }, [normalizedPath, toolSlug, categorySlug])

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

  const filtered = TOOLS.filter((tool) => {
    const matchCategory = activeCategory === 'All' || tool.category === activeCategory
    const pricingBucket = getPricingBucket(tool.badge)
    const matchPricing = activePricing === 'All' || pricingBucket === activePricing
    const query = search.toLowerCase().trim()
    const matchSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.tagline.toLowerCase().includes(query) ||
      tool.badge.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query))
    const matchFavorites = !favoritesOnly || favorites.includes(tool.name)

    return matchCategory && matchPricing && matchSearch && matchFavorites
  }).sort((left, right) => {
    if (sortBy === 'rating') {
      return right.rating - left.rating || left.name.localeCompare(right.name)
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

  const topTen = [...TOOLS]
    .sort((left, right) => right.rating - left.rating || left.name.localeCompare(right.name))
    .slice(0, 10)

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()

    setIsSubmittingNewsletter(true)
    setNewsletterStatus({ type: 'idle', message: '' })

    // In local dev the serverless API is not available
    if (import.meta.env.DEV) {
      setNewsletterEmail('')
      setNewsletterStatus({
        type: 'success',
        message: 'Thanks for subscribing. (Demo mode — email not sent in local dev.)',
      })
      setIsSubmittingNewsletter(false)
      return
    }

    try {
      const response = await fetch(NEWSLETTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newsletterEmail,
          source: 'aitoolscenter-newsletter',
        }),
      })

      if (!response.ok) {
        throw new Error('Unable to subscribe at the moment.')
      }

      const result = await response.json()

      setNewsletterEmail('')
      setNewsletterStatus({
        type: 'success',
        message: result.confirmationSent
          ? 'Thanks for subscribing. Check your inbox for confirmation.'
          : 'Thanks for subscribing. Your email has been added to the newsletter list.',
      })
    } catch {
      setNewsletterStatus({
        type: 'error',
        message: 'Subscription failed. Please try again in a moment.',
      })
    } finally {
      setIsSubmittingNewsletter(false)
    }
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

  return (
    <div className="page">
      <SiteNav />

      <header className="hero">
        <div className="hero-grid">
          <div className="hero-main">
            <p className="eyebrow">UPDATED MAY 2026 • 15+ TOOLS REVIEWED</p>
            <h1>Find the Best <span className="gradient-text">AI Tools</span> in One Place</h1>
            <p className="subtext">
              We test, rank, and explain AI tools so you can skip the confusion and start using the right
              tool for writing, images, coding, video, automation, and more.
            </p>
            <div className="hero-cta-row">
              <a href="#tools" className="btn btn-primary">Explore Directory</a>
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
              <span>✅ 15+ Tools Listed</span>
              <span>★ {favorites.length} Saved Favorites</span>
              <span>↺ {localVisits} Visits From This Browser</span>
              <span>🛡️ Manually Curated Listings</span>
            </div>
          </div>

          <aside className="hero-visual" aria-hidden="true">
            <div className="orbital-shell">
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
        <section className="section picks-section">
          <div className="section-heading-row">
            <div>
              <h2>Top Picks Right Now</h2>
              <p className="section-copy">Start here if you want the shortest path to proven AI tools.</p>
            </div>
          </div>
          <div className="quick-picks-grid">
            {topPicks.map((tool) => (
              <div key={tool.name} className="quick-pick-card">
                <div className="quick-pick-top">
                  <strong><a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a></strong>
                  <Stars count={tool.rating} />
                </div>
                <p>{tool.tagline}</p>
                <div className="tool-tags">
                  {tool.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <AdUnit slot="5239162471" className="ad-unit-inline" />
        </section>

        <section className="section top-ten-section" id="top-10">
          <div className="section-divider"></div>
          <div className="section-heading-row">
            <div>
              <h2>Top 10 This Week</h2>
              <p className="section-copy">A fast-moving shortlist of tools users are most likely to pick first.</p>
            </div>
            <span className="results-chip">Updated Weekly</span>
          </div>
          <div className="top-ten-grid">
            {topTen.map((tool, index) => (
              <article key={tool.name} className="top-ten-card">
                <div className="top-ten-rank">#{index + 1}</div>
                <div className="top-ten-body">
                  <div className="top-ten-head">
                    <h3>
                      <a className="tool-name-link" href={`/tools/${slugifyToolName(tool.name)}`}>{tool.name}</a>
                    </h3>
                    <Stars count={tool.rating} />
                  </div>
                  <p>{tool.tagline}</p>
                  <div className="top-ten-meta">
                    <span className="tag">{tool.category}</span>
                    <span className="tag">{tool.badge}</span>
                    <a href={tool.link} target="_blank" rel="noopener noreferrer" className="top-ten-visit">
                      Visit
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

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
                {category}
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
                setActivePricing('All')
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
              {filtered.map((tool) => (
                <ToolCard
                  key={tool.name}
                  tool={tool}
                  isFavorite={favorites.includes(tool.name)}
                  isCompared={compareList.includes(tool.name)}
                  userRating={userRatings[tool.name] || 0}
                  onToggleFavorite={toggleFavorite}
                  onToggleCompare={toggleCompare}
                  onTagClick={(tag) => setSearch(tag)}
                  onRate={rateTool}
                />
              ))}
            </div>
          )}
        </section>

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
              {comparisonTools.map((tool) => (
                <ComparisonCard key={tool.name} tool={tool} onRemove={toggleCompare} />
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
                best next output given your input (called a "prompt").
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
            ].map((useCase) => (
              <div key={useCase.title} className="use-case-card">
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
            {AI_NEWS.map((item) => (
              <div key={item.title} className="news-card">
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
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
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

        <section className="section newsletter" id="newsletter">
          <h2>Get Weekly AI Tool Picks in Your Inbox</h2>
          <p>Every week we review 2-3 new or updated AI tools — free to subscribe, no spam.</p>
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

      <SiteFooter />
    </div>
  )
}

export default App

