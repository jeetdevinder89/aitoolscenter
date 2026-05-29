import { useEffect, useRef, useState } from 'react'
import './redesign.css'
import './advanced-components.css'
import aiNews from './data/ai-news.json'

const SITE_ORIGIN = (import.meta.env.VITE_SITE_ORIGIN || 'https://www.aitoolscenter.in').replace(/\/$/, '')

// ==================================================
// ENHANCED AI TOOLS DATABASE WITH DETAILS
// ==================================================

const TOOLS_EXTENDED = [
  {
    id: 1,
    name: 'ChatGPT',
    category: 'Writing',
    tagline: 'Conversational AI for writing, research, and coding',
    description: 'ChatGPT is an AI model trained to have conversations with users. It can help with writing, analysis, math, coding, and creative tasks.',
    link: 'https://chat.openai.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['GPT-4o', 'Chatbot', 'Writing'],
    icon: '🤖',
    monthlyVisits: '50M+',
    trending: true,
    price: 'Free / $20/month pro',
    features: ['Conversational AI', 'Code Generation', 'Content Writing', 'Research Analysis', 'Math Problem Solving'],
    pros: ['Powerful and versatile', 'Easy to use', 'Large knowledge base'],
    cons: ['Can hallucinate', 'Knowledge cutoff', 'Limited context'],
    integrations: ['Slack', 'Gmail', 'Zapier', 'Make'],
    useCases: ['Content writing', 'Coding help', 'Research', 'Brainstorming'],
  },
  {
    id: 2,
    name: 'Claude',
    category: 'Writing',
    tagline: 'Long-context AI assistant for analysis and documents',
    description: 'Claude is an AI assistant made by Anthropic. Known for its long context window and thoughtful responses.',
    link: 'https://claude.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Anthropic', 'Analysis', 'Documents'],
    icon: '🧠',
    monthlyVisits: '30M+',
    trending: true,
    price: 'Free / $20/month pro',
    features: ['100K context window', 'Document analysis', 'Code generation', 'Creative writing'],
    pros: ['Very large context', 'Nuanced responses', 'Good for analysis'],
    cons: ['Slightly slower', 'Fewer integrations'],
    integrations: ['Slack', 'Discord', 'Zapier'],
    useCases: ['Document analysis', 'Long-form writing', 'Code review'],
  },
  {
    id: 3,
    name: 'Midjourney',
    category: 'Image',
    tagline: 'AI image generation via Discord or web',
    description: 'Midjourney is an AI image generator that creates stunning artwork from text descriptions.',
    link: 'https://midjourney.com',
    badge: 'Paid',
    rating: 5,
    tags: ['Art', 'Creative', 'Design'],
    icon: '🎨',
    monthlyVisits: '15M+',
    trending: true,
    price: '$10-120/month',
    features: ['Text to image', 'Style transfer', 'Upscaling', 'Variations'],
    pros: ['Excellent quality', 'Diverse styles', 'Active community'],
    cons: ['Subscription required', 'Discord interface', 'Moderate learning curve'],
    integrations: ['Discord'],
    useCases: ['Concept art', 'Marketing materials', 'Social media'],
  },
  {
    id: 4,
    name: 'GitHub Copilot',
    category: 'Coding',
    tagline: 'AI pair programmer for VS Code and JetBrains',
    description: 'GitHub Copilot uses AI to suggest code and entire functions in real time.',
    link: 'https://github.com/features/copilot',
    badge: 'Paid',
    rating: 5,
    tags: ['Coding', 'IDE', 'Autocomplete'],
    icon: '💻',
    monthlyVisits: '10M+',
    trending: true,
    price: '$10/month or $100/year',
    features: ['Code suggestions', 'Function generation', 'Multiple language support', 'IDE integration'],
    pros: ['Great productivity boost', 'Multiple IDE support', 'Learns your style'],
    cons: ['Subscription required', 'Can suggest suboptimal code'],
    integrations: ['VS Code', 'JetBrains', 'Visual Studio', 'Neovim'],
    useCases: ['Speed up development', 'Learn new languages', 'Reduce repetitive coding'],
  },
  {
    id: 5,
    name: 'Runway',
    category: 'Video',
    tagline: 'AI video generation and editing tools',
    description: 'Runway is a platform for AI-powered video generation and editing features.',
    link: 'https://runwayml.com',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Video Gen', 'Editing', 'Motion'],
    icon: '🎬',
    monthlyVisits: '8M+',
    trending: false,
    price: 'Free / $12-150/month',
    features: ['Video generation', 'Background removal', 'Motion tracking', 'Upscaling'],
    pros: ['Versatile tools', 'Web-based', 'Free tier available'],
    cons: ['Credits system', 'Subscription can be expensive'],
    integrations: ['Adobe', 'Figma'],
    useCases: ['Video editing', 'Content creation', 'Motion graphics'],
  },
  {
    id: 6,
    name: 'Perplexity',
    category: 'Research',
    tagline: 'AI search engine with real-time web sources',
    description: 'Perplexity is an AI search engine that provides answers with cited sources.',
    link: ' https://perplexity.ai',
    badge: 'Free + Pro',
    rating: 5,
    tags: ['Search', 'Citations', 'Research'],
    icon: '🔍',
    monthlyVisits: '12M+',
    trending: true,
    price: 'Free / $20/month pro',
    features: ['Real-time search', 'Source citations', 'Follow-ups', 'Research threads'],
    pros: ['Cites sources', 'Real-time information', 'Easy follow-ups'],
    cons: ['Newer platform', 'Less context than ChatGPT Pro'],
    integrations: ['None major yet'],
    useCases: ['Research', 'Fact checking', 'Current events'],
  },
]

// Compatibility constant for sitemap generation
const TOOLS = TOOLS_EXTENDED

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

// ==================================================
// PAGE COMPONENTS
// ==================================================

function ComparisonEngine({ tools = TOOLS_EXTENDED }) {
  const [selectedTools, setSelectedTools] = useState([tools[0], tools[1]])
  
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
    <section className="section" style={{ background: 'var(--surface)' }}>
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
            {tools.filter(t => !selectedTools.find(st => st.id === t.id)).map(tool => (
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

function RecommendationWizard({ tools = TOOLS_EXTENDED }) {
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
    <section className="section" style={{ background: 'var(--surface)' }}>
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

function UserDashboard({ tools = TOOLS_EXTENDED }) {
  const [activeTab, setActiveTab] = useState('saved')
  const [savedTools, setSavedTools] = useState([tools[0], tools[2]])
  const [comparisonHistory, setComparisonHistory] = useState([])

  return (
    <section className="section" style={{ marginTop: '2rem' }}>
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

  useEffect(() => {
    const stored = localStorage.getItem('aitoolscenter-theme') || 'dark'
    setTheme(stored)
    document.documentElement.setAttribute('data-theme', stored)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('aitoolscenter-theme', newTheme)
  }

  const filteredTools = TOOLS_EXTENDED.filter(tool =>
    (selectedCategory === 'All' || tool.category === selectedCategory) &&
    (searchQuery === '' || 
     tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // STATS SECTION DATA
  const stats = [
    { value: '10,000+', label: 'AI Tools' },
    { value: '50+', label: 'Categories' },
    { value: '1M+', label: 'Monthly Users' },
  ]

  // CATEGORIES DATA
  const categories = [
    { name: 'Writing AI', icon: '✍️', count: 45 },
    { name: 'Image AI', icon: '🖼️', count: 38 },
    { name: 'Video AI', icon: '🎥', count: 22 },
    { name: 'Coding AI', icon: '⚙️', count: 67 },
    { name: 'Productivity', icon: '⚡', count: 52 },
    { name: 'Research', icon: '🔬', count: 28 },
  ]

  // COLLECTIONS DATA
  const collections = [
    { title: 'Best Free AI Tools', count: 24, items: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'] },
    { title: 'AI for Teachers', count: 18, items: ['ChatGPT', 'Perplexity', 'Claude', 'Grammarly'] },
    { title: 'AI for Developers', count: 31, items: ['GitHub Copilot', 'Cursor', 'Tabnine', 'ChatGPT'] },
    { title: 'Best Productivity', count: 22, items: ['Notion AI', 'Zapier', 'Make', 'Claude'] },
  ]

  return (
    <div className="page">
      {/* ==========  NAVIGATION ========== */}
      <nav className="navbar">
        <div className="navbar-logo" onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>AIToolsCenter</div>
        <div className="navbar-links">
          <a href="#tools" className="navbar-link">Discover</a>
          <a href="#compare" className="navbar-link">Compare</a>
          <a href="#wizard" className="navbar-link">Find Tool</a>
          <a href="#dashboard" className="navbar-link">Dashboard</a>
          <a href="#news" className="navbar-link">News</a>
          <button onClick={toggleTheme} className="navbar-link" title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <a href="#submit" className="navbar-cta">Submit Tool</a>
        </div>
      </nav>

      {/* ==========  HERO SECTION ========== */}
      <section className="section section-hero hero">
        <div className="hero-content">
          <div className="hero-tagline">✨ Discover the Perfect AI Tool</div>
          <h1 className="hero-headline">Find Your Ideal <span style={{ color: 'var(--primary)' }}>AI Solution</span> in Seconds</h1>
          <p className="hero-description">Browse 10,000+ AI tools across 50+ categories. Compare features, read reviews, and discover exactly what you need.</p>

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
            <button className="btn btn-primary btn-lg">Explore Tools</button>
            <button className="btn btn-secondary btn-lg">Submit Your Tool</button>
          </div>
        </div>
      </section>

      {/* ==========  TRENDING TOOLS ========== */}
      <section className="section" id="tools">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>🔥 Trending This Week</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>
            Discover the most popular AI tools trending right now
          </p>
          <div className="tools-grid">
            {TOOLS_EXTENDED.filter(t => t.trending).map(tool => (
              <a key={tool.id} href={tool.link} target="_blank" rel="noopener noreferrer" className="tool-card">
                <div className="tool-header">
                  <div className="tool-logo">{tool.icon}</div>
                  <div className="tool-meta">
                    <div className="tool-name">{tool.name}</div>
                    <div className="tool-tagline">{tool.tagline}</div>
                  </div>
                </div>
                <div className="tool-footer">
                  <span className="tool-badge">{tool.badge}</span>
                  <div className="tool-rating">{'⭐'.repeat(tool.rating)}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ==========  CATEGORIES ========== */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Browse by Category</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>Find AI tools tailored to your needs</p>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-count">{cat.count} Tools</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========  COLLECTIONS ========== */}
      <section className="section">
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📚 Curated Collections</h2>
          <p style={{ color: 'var(--muted)', textAlign: 'center', marginBottom: '2rem' }}>Hand-picked tools for specific use cases</p>
          <div className="tools-grid">
            {collections.map((col, idx) => (
              <div key={idx} className="collection-card">
                <div className="collection-header">
                  <div className="collection-title">{col.title}</div>
                  <div className="collection-count">{col.count} tools</div>
                </div>
                <div className="collection-items">
                  {col.items.map((item, i) => (
                    <div key={i} className="collection-item">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========  COMPARISON ENGINE ========== */}
      <ComparisonEngine tools={TOOLS_EXTENDED} />

      {/* ==========  RECOMMENDATION WIZARD ========== */}
      <RecommendationWizard tools={TOOLS_EXTENDED} />

      {/* ==========  NEWSLETTER ========== */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="newsletter-section">
            <h2 className="newsletter-headline">Get Weekly AI Updates</h2>
            <p className="newsletter-description">Subscribe to get the best AI tools and news every week</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========  USER DASHBOARD ========== */}
      <UserDashboard tools={TOOLS_EXTENDED} />

      {/* ==========  NEWS HUB ========== */}
      <section className="section" id="news" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>📰 Latest AI News</h2>
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

      {/* ==========  FOOTER ========== */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--muted)', marginTop: '2rem' }}>
        <p>© 2024 AIToolsCenter. All rights reserved. | <a href="#privacy" style={{ color: 'var(--primary)' }}>Privacy</a> | <a href="#terms" style={{ color: 'var(--primary)' }}>Terms</a></p>
      </footer>
    </div>
  )
}
