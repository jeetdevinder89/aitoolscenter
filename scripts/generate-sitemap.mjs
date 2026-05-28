import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, '..')
const appFilePath = path.join(workspaceRoot, 'src', 'App.jsx')
const sitemapFilePath = path.join(workspaceRoot, 'public', 'sitemap.xml')

const SITE_ORIGIN = 'https://www.aitoolscenter.in'

const slugify = (value) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const getObjectProperty = (objectNode, propertyName) => {
  if (!objectNode || objectNode.type !== 'ObjectExpression') {
    return null
  }

  return objectNode.properties.find((property) => (
    property.type === 'ObjectProperty'
    && !property.computed
    && ((property.key.type === 'Identifier' && property.key.name === propertyName)
      || (property.key.type === 'StringLiteral' && property.key.value === propertyName))
  )) || null
}

const readString = (node) => {
  if (!node) {
    return null
  }

  if (node.type === 'StringLiteral') {
    return node.value
  }

  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0]?.value?.cooked || ''
  }

  return null
}

const findConstInitializer = (programNode, constName) => {
  for (const statement of programNode.body) {
    if (statement.type !== 'VariableDeclaration') {
      continue
    }

    for (const declaration of statement.declarations) {
      if (declaration.id.type === 'Identifier' && declaration.id.name === constName) {
        return declaration.init || null
      }
    }
  }

  return null
}

const parseAppRouteData = () => {
  const source = fs.readFileSync(appFilePath, 'utf8')
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['jsx'],
  })

  const toolsNode = findConstInitializer(ast.program, 'TOOLS')
  const categoriesNode = findConstInitializer(ast.program, 'CATEGORIES')
  const useCasePagesNode = findConstInitializer(ast.program, 'USE_CASE_PAGES')
  const programmaticProfessionsNode = findConstInitializer(ast.program, 'PROGRAMMATIC_PROFESSIONS')
  const comparisonPagesNode = findConstInitializer(ast.program, 'COMPARISON_PAGES')
  const legalPagesNode = findConstInitializer(ast.program, 'LEGAL_PAGES')

  if (!toolsNode || toolsNode.type !== 'ArrayExpression') {
    throw new Error('Unable to parse TOOLS array from src/App.jsx')
  }

  const toolNames = toolsNode.elements
    .filter((element) => element && element.type === 'ObjectExpression')
    .map((element) => readString(getObjectProperty(element, 'name')?.value))
    .filter(Boolean)

  const categories = (categoriesNode?.type === 'ArrayExpression'
    ? categoriesNode.elements
      .map(readString)
      .filter(Boolean)
      .filter((name) => name !== 'All')
    : [])

  const useCaseSlugs = []
  if (useCasePagesNode?.type === 'ArrayExpression') {
    for (const element of useCasePagesNode.elements) {
      if (!element || element.type !== 'ObjectExpression') {
        continue
      }
      const slug = readString(getObjectProperty(element, 'slug')?.value)
      if (slug) {
        useCaseSlugs.push(slug)
      }
    }
  }

  const programmaticSlugs = []
  if (programmaticProfessionsNode?.type === 'ArrayExpression') {
    for (const element of programmaticProfessionsNode.elements) {
      if (!element || element.type !== 'ObjectExpression') {
        continue
      }
      const slug = readString(getObjectProperty(element, 'slug')?.value)
      if (slug) {
        programmaticSlugs.push(slug)
      }
    }
  }

  const comparisonSlugs = []
  if (comparisonPagesNode?.type === 'ArrayExpression') {
    for (const element of comparisonPagesNode.elements) {
      if (!element || element.type !== 'ObjectExpression') {
        continue
      }
      const slug = readString(getObjectProperty(element, 'slug')?.value)
      if (slug) {
        comparisonSlugs.push(slug)
      }
    }
  }

  const legalPaths = []
  if (legalPagesNode?.type === 'ObjectExpression') {
    for (const property of legalPagesNode.properties) {
      if (property.type !== 'ObjectProperty') {
        continue
      }

      const key = property.key
      const pathValue = key.type === 'StringLiteral' ? key.value : key.type === 'Identifier' ? key.name : null
      if (pathValue) {
        legalPaths.push(pathValue)
      }
    }
  }

  return {
    toolSlugs: toolNames.map(slugify),
    categorySlugs: categories.map(slugify),
    useCaseSlugs: Array.from(new Set([...useCaseSlugs, ...programmaticSlugs])),
    comparisonSlugs,
    legalPaths,
  }
}

const buildSitemapXml = ({ toolSlugs, categorySlugs, useCaseSlugs, comparisonSlugs, legalPaths }) => {
  const urls = new Map()
  const lastmod = new Date().toISOString().slice(0, 10)

  const addUrl = (pathname, changefreq, priority) => {
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
    if (!urls.has(normalized)) {
      urls.set(normalized, { changefreq, priority })
    }
  }

  addUrl('/', 'weekly', '1.0')

  for (const slug of toolSlugs) {
    addUrl(`/tools/${slug}`, 'weekly', '0.9')
  }

  for (const slug of categorySlugs) {
    addUrl(`/categories/${slug}`, 'weekly', '0.8')
  }

  for (const slug of useCaseSlugs) {
    addUrl(`/best-ai-tools-for/${slug}`, 'weekly', '0.85')
  }

  addUrl('/compare-hub', 'weekly', '0.85')
  addUrl('/news', 'daily', '0.82')
  addUrl('/trending-ai-tools-this-week', 'daily', '0.8')

  for (const slug of comparisonSlugs) {
    addUrl(`/compare/${slug}`, 'weekly', '0.84')
  }

  for (const slug of toolSlugs) {
    addUrl(`/alternatives-to-${slug}`, 'weekly', '0.82')
  }

  for (const legalPath of legalPaths) {
    const isContact = legalPath === '/contact'
    addUrl(legalPath, 'monthly', isContact ? '0.6' : '0.7')
  }

  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

  for (const [pathname, metadata] of urls) {
    lines.push('  <url>')
    lines.push(`    <loc>${SITE_ORIGIN}${pathname}</loc>`)
    lines.push(`    <lastmod>${lastmod}</lastmod>`)
    lines.push(`    <changefreq>${metadata.changefreq}</changefreq>`)
    lines.push(`    <priority>${metadata.priority}</priority>`)
    lines.push('  </url>')
  }

  lines.push('</urlset>')
  lines.push('')

  return lines.join('\n')
}

const routeData = parseAppRouteData()
const sitemapXml = buildSitemapXml(routeData)

fs.writeFileSync(sitemapFilePath, sitemapXml, 'utf8')
console.log(`Generated sitemap with ${sitemapXml.match(/<url>/g)?.length || 0} URLs at public/sitemap.xml`)
