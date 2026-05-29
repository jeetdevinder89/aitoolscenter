import { useEffect, useRef, useState } from 'react'
import './redesign.css'
import aiNews from './data/ai-news.json'

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://www.aitoolscenter.in').replace(/\/$/, '')

// ==================================================
// AI TOOLS DATABASE
// ==================================================

const TOOLS = [
  {
    id: 1,
    name: 'ChatGPT',
    category: 'Writing',
    tagline: 'Conversational AI for writing, research, and coding',
    link: 'https://chat.openai.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['GPT-4o', 'Chatbot', 'Writing'],
    icon: '🤖',
    monthlyVisits: '50M+',
    trending: true,
  },
  {
    id: 2,
    name: 'Claude',
    category: 'Writing',
    tagline: 'Long-context AI assistant for analysis and documents',
    link: 'https://claude.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Anthropic', 'Analysis', 'Documents'],
    icon: '🧠',
    monthlyVisits: '30M+',
    trending: true,
  },
  {
    id: 3,
    name: 'Midjourney',
    category: 'Image',
    tagline: 'AI image generation via Discord or web',
    link: 'https://midjourney.com',
    badge: 'Paid',
    rating: 5,
    tags: ['Art', 'Creative', 'Design'],
    icon: '🎨',
    monthlyVisits: '15M+',
    trending: true,
  },
  {
    id: 4,
    name: 'GitHub Copilot',
    category: 'Coding',
    tagline: 'AI pair programmer for VS Code and JetBrains',
    link: 'https://github.com/features/copilot',
    badge: 'Paid',
    rating: 5,
    tags: ['Coding', 'IDE', 'Autocomplete'],
    icon: '💻',
    monthlyVisits: '10M+',
    trending: true,
  },
  {
    id: 5,
    name: 'Runway',
    category: 'Video',
    tagline: 'AI video generation and editing tools',
    link: 'https://runwayml.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Video Gen', 'Editing', 'Motion'],
    icon: '🎬',
    monthlyVisits: '8M+',
    trending: false,
  },
  {
    id: 6,
    name: 'Perplexity',
    category: 'Research',
    tagline: 'AI search engine with real-time web sources',
    link: 'https://perplexity.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Search', 'Citations', 'Research'],
    icon: '🔍',
    monthlyVisits: '12M+',
    trending: true,
  },
]

// ==================================================
// CATEGORIES
// ==================================================

const CATEGORIES_DATA = [
  { name: 'Writing AI', icon: '✍️', count: 45 },
  { name: 'Image AI', icon: '🖼️', count: 38 },
  { name: 'Video AI', icon: '🎥', count: 22 },
  { name: 'Coding AI', icon: '⚙️', count: 67 },
  { name: 'Productivity', icon: '⚡', count: 52 },
  { name: 'Research', icon: '🔬', count: 28 },
  { name: 'Business', icon: '📊', count: 41 },
  { name: 'Marketing', icon: '📢', count: 35 },
]

// ==================================================
// COLLECTIONS
// ==================================================

const COLLECTIONS = [
  {
    id: 1,
    title: 'Best Free AI Tools',
    count: 24,
    items: ['ChatGPT', 'Claude', 'Gemini', 'Copilot Free'],
  },
  {
    id: 2,
    title: 'AI for Teachers',
    count: 18,
    items: ['ChatGPT', 'Perplexity', 'Claude', 'Grammarly'],
  },
  {
    id: 3,
    title: 'AI for Developers',
    count: 31,
    items: ['GitHub Copilot', 'Cursor', 'Tabnine', 'ChatGPT'],
  },
  {
    id: 4,
    title: 'Best Productivity Tools',
    count: 22,
    items: ['Notion AI', 'Zapier', 'Make', 'Microsoft Copilot'],
  },
]

// ==================================================
// WORKFLOWS
// ==================================================

const WORKFLOWS = [
  {
    id: 1,
    title: 'YouTube Automation',
    description: 'Complete workflow for automated video production',
    tools: ['ChatGPT', 'Runway', 'Make', 'Zapier'],
  },
  {
    id: 2,
    title: 'Blog Writing',
    description: 'End-to-end content creation workflow',
    tools: ['ChatGPT', 'Claude', 'Grammarly', 'Jasper'],
  },
  {
    id: 3,
    title: 'SEO Optimization',
    description: 'AI-powered SEO strategy and implementation',
    tools: ['Perplexity', 'ChatGPT', 'Writesonic', 'Semrush'],
  },
]

// ==================================================
// APP COMPONENT
// ==================================================

export default function App() {
  const [theme, setTheme] = useState('dark')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [comparisonTools, setComparisonTools] = useState([])
  const [wizardStep, setWizardStep] = useState(0)
  const [wizardAnswers, setWizardAnswers] = useState({})
  const [showNewsletter, setShowNewsletter] = useState(false)
  const searchRef = useRef(null)

  // Initialize theme
  useEffect(() => {
    const stored = localStorage.getItem('aitoolscenter-theme') || 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('aitoolscenter-theme', newTheme)
  }

  // Search suggestions
  const searchSuggestions = [
    'AI for Teachers',
    'AI for Content Writing',
    'Best Coding AI',
    'Free AI Tools',
    'Image Generation',
  ]

  const filteredSuggestions = searchSuggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter tools
  const filteredTools = TOOLS.filter(tool =>
    (selectedCategory === 'All' || tool.category === selectedCategory) &&
    (searchQuery === '' || 
     tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Render star rating
  const renderStars = (rating) => {
    return '⭐'.repeat(rating)
  }

  return (
    <div className="page">
      {/* ==================================================
          NAVIGATION
          ================================================== */}
      <nav className="navbar">
        <div className="navbar-logo">AIToolsCenter</div>
        <div className="navbar-links">
          <a href="#tools" className="navbar-link">Discover Tools</a>
          <a href="#categories" className="navbar-link">Categories</a>
          <a href="#collections" className="navbar-link">Collections</a>
          <a href="#news" className="navbar-link">News</a>
          <button onClick={toggleTheme} className="navbar-link" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#submit" className="navbar-cta">Submit Tool</a>
        </div>
      </nav>

      {/* ==================================================
          HERO SECTION
          ================================================== */}
      <section className="section section-hero hero">
        <div className="hero-content">
          <div className="hero-tagline">✨ Discover the Perfect AI Tool</div>
          <h1 className="hero-headline">
            Find Your Ideal <span style={{color: 'var(--primary)'}}>AI Tool</span> in Seconds
          </h1>
          <p className="hero-description">
            Browse 10,000+ AI tools across 50+ categories. Compare features, read reviews, and find the perfect solution for your needs.
          </p>

          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar" ref={searchRef}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search AI tools, workflows, or categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
              />
            </div>

            {/* Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="search-suggestions">
                <div className="suggestion-label">Popular Searches</div>
                {filteredSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">10,000+</div>
              <div className="stat-label">AI  Tools</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">50+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1M+</div>
              <div className="stat-label">Monthly Users</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <button className="btn btn-primary btn-lg">Explore Tools</button>
            <button className="btn btn-secondary btn-lg">Submit Your Tool</button>
          </div>
        </div>
      </section>

      {/* ==================================================
          TRENDING TOOLS
          ================================================== */}
      <section className="section" id="tools">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>🔥 Trending This Week</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Discover the most popular and fastest-growing AI tools trending right now
          </p>
          <div className="tools-grid">
            {TOOLS.filter(t => t.trending).map(tool => (
              <a key={tool.id} href={tool.link} target="_blank" rel="noopener noreferrer" className="tool-card">
                <div className="tool-header">
                  <div className="tool-logo">{tool.icon}</div>
                  <div className="tool-meta">
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-tagline">{tool.tagline}</div>
                  </div>
                </div>
                <div className="tool-footer">
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="tool-badge">{tool.badge}</span>
                    {tool.tags.slice(0, 1).map((tag, idx) => (
                      <span key={idx} className="tool-badge" style={{ background: 'transparent', border: 'none', color: 'var(--muted)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="tool-rating">{renderStars(tool.rating)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          CATEGORIES
          ================================================== */}
      <section className="section" id="categories" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Browse by Category</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Find AI tools tailored to your specific needs and use case
          </p>
          <div className="categories-grid">
            {CATEGORIES_DATA.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count} Tools</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          COLLECTIONS
          ================================================== */}
      <section className="section" id="collections">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📚 Curated Collections</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Hand-picked collections of the best AI tools for specific use cases
          </p>
          <div className="tools-grid">
            {COLLECTIONS.map(collection => (
              <div key={collection.id} className="collection-card">
                <div className="collection-header">
                  <div className="collection-title">{collection.title}</div>
                  <div className="collection-count">{collection.count} tools included</div>
                </div>
                <div className="collection-items">
                  {collection.items.map((item, idx) => (
                    <div key={idx} className="collection-item">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          AI WORKFLOWS
          ================================================== */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>⚙️ AI Workflows</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Ready-to-use AI workflows that combine multiple tools for maximum productivity
          </p>
          <div className="tools-grid">
            {WORKFLOWS.map(workflow => (
              <div key={workflow.id} className="collection-card">
                <div className="collection-header">
                  <div className="collection-title">{workflow.title}</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>{workflow.description}</div>
                </div>
                <div className="collection-items">
                  {workflow.tools.map((tool, idx) => (
                    <div key={idx} className="collection-item">{tool}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          NEWS HUB
          ================================================== */}
      <section className="section" id="news">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📰 Latest AI News</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem', maxWidth: '700px', margin: '0 auto 2rem' }}>
            Stay updated with the latest AI announcements, product launches, and industry updates
          </p>
          <div className="tools-grid">
            {aiNews.slice(0, 3).map((article, idx) => (
              <div key={idx} className="news-card">
                <div className="news-image">📰</div>
                <div className="news-content">
                  <div className="news-date">{article.date}</div>
                  <div className="news-title">{article.title}</div>
                  <div className="news-excerpt">{article.summary}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================
          NEWSLETTER
          ================================================== */}
      <section className="section">
        <div className="container">
          <div className="newsletter-section">
            <h2 className="newsletter-headline">Get Weekly AI Updates</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter and get the best AI tools, news, and tips every week
            </p>
            <form className="newsletter-form" onSubmit={(e) => {
              e.preventDefault()
              setShowNewsletter(true)
              setTimeout(() => setShowNewsletter(false), 3000)
            }}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {showNewsletter && <p style={{ color: 'var(--success)', fontSize: '0.875rem' }}>✓ Thanks for subscribing!</p>}
          </div>
        </div>
      </section>

      {/* ==================================================
          FOOTER
          ================================================== */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>
        <p>© 2024 AIToolsCenter. All rights reserved. | <a href="#privacy" style={{ color: 'var(--primary)' }}>Privacy</a> | <a href="#terms" style={{ color: 'var(--primary)' }}>Terms</a></p>
      </footer>
    </div>
  )
}
