import { useState } from 'react'

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

function Stars({ count }) {
  return (
    <span aria-label={`${count} out of 5 stars`} style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
      {'★'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

function ToolCard({ tool }) {
  return (
    <article className="tool-card">
      <div className="tool-card-top">
        <span className="tool-badge">{tool.badge}</span>
        <span className="tool-category">{tool.category}</span>
      </div>
      <h3>{tool.name}</h3>
      <Stars count={tool.rating} />
      <p>{tool.tagline}</p>
      <div className="tool-tags">
        {tool.tags.map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <a
        className="btn btn-primary tool-btn"
        href={tool.link}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Tool →
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

function App() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = TOOLS.filter((tool) => {
    const matchCat = activeCategory === 'All' || tool.category === activeCategory
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q))
    return matchCat && matchSearch
  })

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <span className="nav-logo">⚡ AIToolsCenter.in</span>
        <div className="nav-links">
          <a href="#tools">Tools</a>
          <a href="#how-ai-works">How AI Works</a>
          <a href="#faq">FAQ</a>
          <a href="#newsletter" className="btn btn-primary nav-cta">Get Weekly Picks</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <p className="eyebrow">UPDATED MAY 2026 • 15+ TOOLS REVIEWED</p>
        <h1>Find the Best AI Tools in One Place</h1>
        <p className="subtext">
          We test, rank, and explain AI tools so you can skip the confusion and start using the right
          tool for writing, images, coding, video, automation, and more.
        </p>
        <div className="search-bar">
          <input
            type="search"
            placeholder="Search tools, e.g. 'image generation', 'code', 'free'…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search AI tools"
          />
        </div>
        <div className="hero-stats">
          <span>✅ 15+ Tools Listed</span>
          <span>✅ Free &amp; Paid Options</span>
          <span>✅ Updated Monthly</span>
        </div>
      </header>

      {/* TOOLS */}
      <main>
        <section className="section" id="tools">
          <h2>Browse AI Tools by Category</h2>
          <div className="category-filters" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p style={{ marginTop: '2rem', color: 'var(--muted)' }}>No tools match your search. Try a different keyword.</p>
          ) : (
            <div className="tools-grid">
              {filtered.map((tool) => (
                <ToolCard key={tool.name} tool={tool} />
              ))}
            </div>
          )}
        </section>

        {/* HOW AI WORKS */}
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
              ].map((c) => (
                <div key={c.title} className="info-card">
                  <span className="info-icon">{c.icon}</span>
                  <div>
                    <strong>{c.title}</strong>
                    <p>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES */}
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
            ].map((u) => (
              <div key={u.title} className="use-case-card">
                <span className="use-icon">{u.icon}</span>
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section" id="faq">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="section newsletter" id="newsletter">
          <h2>Get Weekly AI Tool Picks in Your Inbox</h2>
          <p>Every week we review 2-3 new or updated AI tools — free to subscribe, no spam.</p>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thanks! You are subscribed. (Connect a real email service like Mailchimp or ConvertKit to activate.)')
            }}
          >
            <input type="email" placeholder="Enter your email address" required aria-label="Email address" />
            <button type="submit" className="btn btn-primary">Subscribe Free</button>
          </form>
          <p className="trust">No spam. Unsubscribe anytime. 100% free.</p>
        </section>
      </main>

      <footer className="footer">
        <p>© 2026 AIToolsCenter.in · Built to help you navigate the AI landscape.</p>
        <p style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          Some links are affiliate links. We may earn a small commission at no extra cost to you.
        </p>
      </footer>
    </div>
  )
}

export default App

