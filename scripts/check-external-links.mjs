import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, '..')

const appFilePath = path.join(workspaceRoot, 'src', 'App.jsx')
const newsFilePath = path.join(workspaceRoot, 'src', 'data', 'ai-news.json')
const reportDir = path.join(workspaceRoot, 'reports')
const reportPath = path.join(reportDir, 'external-link-uptime.json')

const timeoutMs = Number(process.env.LINK_CHECK_TIMEOUT_MS || '6000')
const retries = Number(process.env.LINK_CHECK_RETRIES || '2')
const concurrency = Number(process.env.LINK_CHECK_CONCURRENCY || '8')
const strictMode = process.argv.includes('--strict')

const parseAst = (filePath) => parse(fs.readFileSync(filePath, 'utf8'), { sourceType: 'module', plugins: ['jsx'] })

const readString = (node) => {
  if (!node) return null
  if (node.type === 'StringLiteral') return node.value
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) {
    return node.quasis[0]?.value?.cooked || ''
  }
  return null
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

const getObjectProperty = (objectNode, propertyName) => {
  if (!objectNode || objectNode.type !== 'ObjectExpression') return null
  return objectNode.properties.find((property) => (
    property.type === 'ObjectProperty'
    && !property.computed
    && ((property.key.type === 'Identifier' && property.key.name === propertyName)
      || (property.key.type === 'StringLiteral' && property.key.value === propertyName))
  )) || null
}

const normalizeUrl = (value) => {
  try {
    const parsed = new URL(value)
    parsed.hash = ''
    return parsed.toString()
  } catch {
    return null
  }
}

const extractExternalLinks = () => {
  const links = []
  const appAst = parseAst(appFilePath)

  const toolsNode = findConstInitializer(appAst.program, 'TOOLS_EXTENDED')
  if (toolsNode?.type === 'ArrayExpression') {
    for (const item of toolsNode.elements) {
      if (!item || item.type !== 'ObjectExpression') continue
      const name = readString(getObjectProperty(item, 'name')?.value) || 'UNKNOWN_TOOL'
      const link = readString(getObjectProperty(item, 'link')?.value)
      const normalized = normalizeUrl(link)
      if (normalized) {
        links.push({ source: 'tool', label: name, url: normalized })
      }
    }
  }

  const overridesNode = findConstInitializer(appAst.program, 'TOOL_LINK_OVERRIDES')
  if (overridesNode?.type === 'ObjectExpression') {
    for (const property of overridesNode.properties) {
      if (property.type !== 'ObjectProperty') continue
      const key = property.key.type === 'Identifier' ? property.key.name : readString(property.key) || 'UNKNOWN_OVERRIDE'
      const value = readString(property.value)
      const normalized = normalizeUrl(value)
      if (normalized) {
        links.push({ source: 'override', label: key, url: normalized })
      }
    }
  }

  const newsItems = JSON.parse(fs.readFileSync(newsFilePath, 'utf8'))
  for (const item of newsItems) {
    const normalized = normalizeUrl(item.link)
    if (normalized) {
      links.push({ source: 'news', label: item.title, url: normalized })
    }
  }

  const deduped = new Map()
  for (const link of links) {
    if (!deduped.has(link.url)) {
      deduped.set(link.url, link)
    }
  }

  return Array.from(deduped.values())
}

const fetchWithTimeout = async (url, method) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'AIToolsCenter-LinkChecker/1.0 (+https://www.aitoolscenter.in)',
        Accept: 'text/html,application/json;q=0.9,*/*;q=0.8',
      },
    })
    return { ok: response.ok, status: response.status, finalUrl: response.url }
  } finally {
    clearTimeout(timeout)
  }
}

const checkOneUrl = async (entry) => {
  let lastError = null

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      const headResult = await fetchWithTimeout(entry.url, 'HEAD')
      if (headResult.ok) {
        return { ...entry, healthy: true, status: headResult.status, method: 'HEAD', attempts: attempt, finalUrl: headResult.finalUrl }
      }

      const getResult = await fetchWithTimeout(entry.url, 'GET')
      if (getResult.ok) {
        return { ...entry, healthy: true, status: getResult.status, method: 'GET', attempts: attempt, finalUrl: getResult.finalUrl }
      }

      lastError = `HTTP ${getResult.status}`
    } catch (error) {
      lastError = error?.name === 'AbortError' ? `Timeout after ${timeoutMs}ms` : (error?.message || 'Unknown network error')
    }
  }

  return {
    ...entry,
    healthy: false,
    status: null,
    method: 'HEAD/GET',
    attempts: retries + 1,
    error: lastError,
  }
}

const runWithConcurrency = async (items, worker, limit) => {
  const results = []
  let nextIndex = 0

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex
      nextIndex += 1
      results[index] = await worker(items[index])
    }
  })

  await Promise.all(runners)
  return results
}

const links = extractExternalLinks()
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir, { recursive: true })
}

console.log(`Checking ${links.length} unique external links...`)
const checked = await runWithConcurrency(links, checkOneUrl, concurrency)

const healthyCount = checked.filter((item) => item.healthy).length
const failed = checked.filter((item) => !item.healthy)

const report = {
  generatedAt: new Date().toISOString(),
  timeoutMs,
  retries,
  concurrency,
  total: checked.length,
  healthy: healthyCount,
  failed: failed.length,
  failures: failed,
  checks: checked,
}

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

console.log(`External link uptime: ${healthyCount}/${checked.length} healthy.`)
console.log(`Report written to ${path.relative(workspaceRoot, reportPath)}`)

if (failed.length > 0) {
  console.log('Failed URLs:')
  for (const item of failed.slice(0, 20)) {
    console.log(`- [${item.source}] ${item.label}: ${item.url} (${item.error || 'Unhealthy'})`)
  }
  if (failed.length > 20) {
    console.log(`- ...and ${failed.length - 20} more`) 
  }
}

if (strictMode && failed.length > 0) {
  process.exit(1)
}
