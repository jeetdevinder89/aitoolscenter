import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, '..')
const appFilePath = path.join(workspaceRoot, 'src', 'App.jsx')
const publicDir = path.join(workspaceRoot, 'public')
const socialDir = path.join(publicDir, 'social')

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

const readString = (node) => {
  if (!node) return null
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0]?.value?.cooked || ''
  }
  return null
}

const getObjectProperty = (objectNode, propertyName) => {
  if (!objectNode || objectNode.type !== 'ObjectExpression') return null
  return objectNode.properties.find((property) => (
    property.type === 'ObjectProperty'
    && !property.computed
    && ((property.key.type === 'Identifier' && property.key.name === propertyName)
      || (property.key.type === 'StringLiteral' && property.key.value === propertyName))
  )) || null
}

const findConstInitializer = (programNode, constName) => {
  for (const statement of programNode.body) {
    if (statement.type !== 'VariableDeclaration') continue
    for (const declaration of statement.declarations) {
      if (declaration.id.type === 'Identifier' && declaration.id.name === constName) {
        return declaration.init || null
      }
    }
  }
  return null
}

const toSlug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const escapeXml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const cardTemplate = ({ title, subtitle, accent = '#00c2a8' }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06111a" />
      <stop offset="55%" stop-color="#12293f" />
      <stop offset="100%" stop-color="#1a3350" />
    </linearGradient>
    <radialGradient id="glowA" cx="20%" cy="10%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.5" />
      <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowB" cx="95%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#f7b32b" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#f7b32b" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#glowA)" />
  <rect width="1200" height="630" fill="url(#glowB)" />

  <g>
    <text x="72" y="105" fill="#9dd7ff" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="700">AIToolsCenter</text>
    <text x="72" y="255" fill="#ffffff" font-size="66" font-family="Arial, Helvetica, sans-serif" font-weight="800">${escapeXml(title)}</text>
    <text x="72" y="330" fill="#d4ebff" font-size="34" font-family="Arial, Helvetica, sans-serif" font-weight="500">${escapeXml(subtitle)}</text>
    <rect x="72" y="390" rx="24" ry="24" width="540" height="66" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" />
    <text x="102" y="434" fill="#ffffff" font-size="30" font-family="Arial, Helvetica, sans-serif" font-weight="700">100+ Tools • Updated Weekly • 2026</text>
  </g>
</svg>
`

const appSource = fs.readFileSync(appFilePath, 'utf8')
const appAst = parse(appSource, { sourceType: 'module', plugins: ['jsx'] })

const categoriesNode = findConstInitializer(appAst.program, 'CATEGORIES')
const useCasesNode = findConstInitializer(appAst.program, 'USE_CASE_PAGES')
const comparisonsNode = findConstInitializer(appAst.program, 'COMPARISON_PAGES')

const categories = categoriesNode?.type === 'ArrayExpression'
  ? categoriesNode.elements.map(readString).filter(Boolean).filter((item) => item !== 'All')
  : []

const useCases = []
if (useCasesNode?.type === 'ArrayExpression') {
  for (const entry of useCasesNode.elements) {
    if (!entry || entry.type !== 'ObjectExpression') continue
    const slug = readString(getObjectProperty(entry, 'slug')?.value)
    const title = readString(getObjectProperty(entry, 'title')?.value)
    if (slug && title) {
      useCases.push({ slug, title })
    }
  }
}

const comparisons = []
if (comparisonsNode?.type === 'ArrayExpression') {
  for (const entry of comparisonsNode.elements) {
    if (!entry || entry.type !== 'ObjectExpression') continue
    const slug = readString(getObjectProperty(entry, 'slug')?.value)
    const toolA = readString(getObjectProperty(entry, 'toolA')?.value)
    const toolB = readString(getObjectProperty(entry, 'toolB')?.value)
    if (slug && toolA && toolB) {
      comparisons.push({ slug, title: `${toolA} vs ${toolB}` })
    }
  }
}

ensureDir(socialDir)

const generatedFiles = []

const writeCard = (relativePath, title, subtitle, accent) => {
  const fullPath = path.join(publicDir, relativePath)
  ensureDir(path.dirname(fullPath))
  fs.writeFileSync(fullPath, cardTemplate({ title, subtitle, accent }), 'utf8')
  generatedFiles.push(relativePath)
}

writeCard('og-image.svg', 'Best AI Tools Directory', 'Discover and compare AI tools for work and creativity', '#00c2a8')

for (const category of categories) {
  writeCard(`social/categories/${toSlug(category)}.svg`, `${category} AI Tools`, 'Curated picks, pricing, and alternatives', '#67e8f9')
}

for (const useCase of useCases) {
  writeCard(`social/use-cases/${useCase.slug}.svg`, useCase.title, 'High-intent workflow recommendations', '#10b981')
}

for (const comparison of comparisons) {
  writeCard(`social/compare/${comparison.slug}.svg`, comparison.title, 'Side-by-side AI tool decision guide', '#f7b32b')
}

console.log(`Generated ${generatedFiles.length} social card SVG files.`)
