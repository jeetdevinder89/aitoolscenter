import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from '@babel/parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const workspaceRoot = path.resolve(__dirname, '..')

const appFilePath = path.join(workspaceRoot, 'src', 'App.jsx')
const indexFilePath = path.join(workspaceRoot, 'index.html')
const newsFilePath = path.join(workspaceRoot, 'src', 'data', 'ai-news.json')

const parseAst = (filePath) => parse(fs.readFileSync(filePath, 'utf8'), { sourceType: 'module', plugins: ['jsx'] })

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

const isHttpUrl = (value) => {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const errors = []

const appSource = fs.readFileSync(appFilePath, 'utf8')
const appAst = parseAst(appFilePath)

const toolsNode = findConstInitializer(appAst.program, 'TOOLS_EXTENDED')
if (toolsNode?.type === 'ArrayExpression') {
  for (const element of toolsNode.elements) {
    if (!element || element.type !== 'ObjectExpression') continue

    const name = readString(getObjectProperty(element, 'name')?.value) || 'UNKNOWN_TOOL'
    const link = readString(getObjectProperty(element, 'link')?.value)

    if (!link || !isHttpUrl(link)) {
      errors.push(`Invalid tool link for ${name}: ${String(link)}`)
    }
  }
}

const overridesNode = findConstInitializer(appAst.program, 'TOOL_LINK_OVERRIDES')
if (overridesNode?.type === 'ObjectExpression') {
  for (const property of overridesNode.properties) {
    if (property.type !== 'ObjectProperty') continue

    const value = readString(property.value)
    if (!value || !isHttpUrl(value)) {
      const key = property.key.type === 'Identifier' ? property.key.name : readString(property.key) || 'UNKNOWN_KEY'
      errors.push(`Invalid TOOL_LINK_OVERRIDES URL for ${key}: ${String(value)}`)
    }
  }
}

const anchorRegex = /href="#([a-zA-Z0-9_-]+)"/g
const idRegex = /id="([a-zA-Z0-9_-]+)"/g

const anchorTargets = new Set([...appSource.matchAll(anchorRegex)].map((match) => match[1]))
const definedIds = new Set([...appSource.matchAll(idRegex)].map((match) => match[1]))

for (const target of anchorTargets) {
  if (!definedIds.has(target)) {
    errors.push(`Missing section id for anchor target: #${target}`)
  }
}

const newsData = JSON.parse(fs.readFileSync(newsFilePath, 'utf8'))
for (const [index, item] of newsData.entries()) {
  if (!isHttpUrl(item.link)) {
    errors.push(`Invalid ai-news link at index ${index}: ${item.link}`)
  }

  if (item.image && typeof item.image === 'string') {
    const isAbsolute = isHttpUrl(item.image)
    const isRootRelative = item.image.startsWith('/')
    if (!isAbsolute && !isRootRelative) {
      errors.push(`Invalid ai-news image URL at index ${index}: ${item.image}`)
    }
  }
}

const indexSource = fs.readFileSync(indexFilePath, 'utf8')
const localAssetRegex = /(href|src)="\/(?!\/)([^"]+)"/g
for (const match of indexSource.matchAll(localAssetRegex)) {
  const workspaceAssetPath = path.join(workspaceRoot, match[2])
  const publicAssetPath = path.join(workspaceRoot, 'public', match[2])
  if (!fs.existsSync(workspaceAssetPath) && !fs.existsSync(publicAssetPath)) {
    errors.push(`Missing local asset referenced in index.html: /${match[2]}`)
  }
}

if (errors.length > 0) {
  console.error('Link validation failed:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('Link validation passed: all checked links and section anchors are valid.')
