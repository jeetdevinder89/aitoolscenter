import fs from 'node:fs'
import path from 'node:path'
import PDFDocument from 'pdfkit'

const outPath = path.resolve('public', 'ai-workflow-kit.pdf')
fs.mkdirSync(path.dirname(outPath), { recursive: true })

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 46, bottom: 46, left: 48, right: 48 },
  info: {
    Title: 'AI Workflow Kit - AIToolsCenter.in',
    Author: 'AIToolsCenter.in',
    Subject: 'Prompt workflows for content, coding, research, and business',
  },
})

const stream = fs.createWriteStream(outPath)
doc.pipe(stream)

const colors = {
  bg: '#0A1028',
  panel: '#121A3B',
  ink: '#F3F5FF',
  muted: '#A8B1D8',
  accentA: '#6E6BFF',
  accentB: '#1DD3C6',
  accentC: '#F77FB0',
  white: '#FFFFFF',
}

const sections = [
  {
    title: '1) Content Workflow (Blog + Social)',
    prompts: [
      'You are a senior content strategist. Build a 4-part outline for [topic] aimed at [audience] with practical examples.',
      'Turn this outline into a 900-word post with a clear hook, subheadings, and CTA.',
      'Repurpose this blog into: 3 LinkedIn posts, 5 X posts, and 1 newsletter summary.',
    ],
    accent: colors.accentA,
  },
  {
    title: '2) Research Workflow',
    prompts: [
      'Summarize this topic in 7 bullet points, include key risks, opportunities, and unanswered questions.',
      'Create a comparison table of top tools for [use case] with columns: Free Plan, Best For, Limitations, Pricing Notes.',
    ],
    accent: colors.accentB,
  },
  {
    title: '3) Coding Workflow',
    prompts: [
      'Act as a senior engineer. Review this code for correctness, performance, and readability. Return a patch-style suggestion list.',
      'Generate table-driven tests for this function and include edge cases.',
    ],
    accent: colors.accentC,
  },
  {
    title: '4) Video Workflow',
    prompts: [
      'Write a 60-second short video script about [topic] with hook, 3 key points, and ending CTA.',
      'Generate 10 thumbnail text options under 5 words each.',
    ],
    accent: '#FFA047',
  },
  {
    title: '5) Business Workflow',
    prompts: [
      'Create a weekly AI operations checklist for a small team focused on content, sales, and support.',
      'Suggest 5 automations using Zapier/Make for [business type].',
    ],
    accent: '#9AE66E',
  },
]

const drawBackground = () => {
  const width = doc.page.width
  const height = doc.page.height

  doc.rect(0, 0, width, height).fill(colors.bg)

  doc.save()
  doc.opacity(0.18)
  doc.circle(width * 0.14, height * 0.08, 180).fill(colors.accentA)
  doc.circle(width * 0.9, height * 0.22, 220).fill(colors.accentB)
  doc.circle(width * 0.74, height * 0.86, 190).fill(colors.accentC)
  doc.restore()
}

const drawHeader = () => {
  doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(29)
  doc.text('AI Workflow Kit', 56, 58)

  doc.fillColor(colors.muted).font('Helvetica').fontSize(11)
  doc.text('AIToolsCenter.in  •  Updated May 2026', 56, 94)

  doc.roundedRect(56, 116, doc.page.width - 112, 56, 12)
    .fillAndStroke(colors.panel, '#3B4677')

  doc.fillColor(colors.ink).font('Helvetica').fontSize(12)
  doc.text(
    'Plug-and-play prompts for creators, developers, students, and small teams. Copy, adapt, and launch faster.',
    72,
    136,
    { width: doc.page.width - 144, align: 'left' },
  )
}

const ensureSpace = (requiredHeight) => {
  if (doc.y + requiredHeight <= doc.page.height - 72) {
    return
  }

  doc.addPage()
  drawBackground()
  doc.y = 60
}

const drawSection = (section) => {
  const estimatedHeight = 58 + section.prompts.length * 34
  ensureSpace(estimatedHeight)

  const panelX = 56
  const panelW = doc.page.width - 112
  const panelY = doc.y

  doc.roundedRect(panelX, panelY, panelW, estimatedHeight, 12)
    .fillAndStroke(colors.panel, '#34406F')

  doc.roundedRect(panelX, panelY, 8, estimatedHeight, 5).fill(section.accent)

  doc.fillColor(colors.white).font('Helvetica-Bold').fontSize(14)
  doc.text(section.title, panelX + 20, panelY + 14, { width: panelW - 34 })

  let promptY = panelY + 40
  doc.font('Helvetica').fontSize(10.5).fillColor(colors.ink)

  for (const prompt of section.prompts) {
    doc.fillColor(section.accent).font('Helvetica-Bold').text('Prompt:', panelX + 20, promptY)
    doc.fillColor(colors.ink).font('Helvetica').text(prompt, panelX + 66, promptY, {
      width: panelW - 88,
      align: 'left',
    })
    promptY += 30
  }

  doc.y = panelY + estimatedHeight + 12
}

const drawFooter = () => {
  doc.moveDown(0.8)
  ensureSpace(86)

  doc.roundedRect(56, doc.y, doc.page.width - 112, 58, 12)
    .fillAndStroke('#0E1532', '#364273')

  doc.fillColor(colors.ink).font('Helvetica-Bold').fontSize(11)
  doc.text('Find more guides and weekly AI tool picks at https://aitoolscenter.in', 72, doc.y + 16)

  doc.fillColor(colors.muted).font('Helvetica').fontSize(9)
  doc.text('Use responsibly: review outputs, protect sensitive data, and keep a human quality check in every workflow.', 72, doc.y + 34)
}

drawBackground()
drawHeader()
doc.y = 192

for (const section of sections) {
  drawSection(section)
}

drawFooter()

doc.end()

await new Promise((resolve, reject) => {
  stream.on('finish', resolve)
  stream.on('error', reject)
})

console.log(`Generated toolkit PDF at ${outPath}`)
