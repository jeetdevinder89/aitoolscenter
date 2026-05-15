import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const NEWS_RSS_URL =
  'https://news.google.com/rss/search?q=artificial+intelligence+tools&hl=en-IN&gl=IN&ceid=IN:en';
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/ai-news.json');
const MAX_ITEMS = 8;

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const decodeHtml = (value) => value
  .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/gi, ' ')
  .replace(/<[^>]*>/g, '')
  .replace(/\u00a0/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeSourceTag = (value) => value
  .replace(/^[^a-z0-9]+/i, '')
  .replace(/\s+/g, ' ')
  .trim();

const cleanTitle = (title, source) => {
  if (!source) {
    return title;
  }

  const sourcePattern = new RegExp(`\\s[-|:]\\s${escapeForRegExp(source)}$`, 'i');
  return title.replace(sourcePattern, '').trim();
};

const cleanSummary = (summary, source, title) => {
  if (!summary) {
    return 'Latest update from the AI ecosystem.';
  }

  let next = decodeHtml(summary);

  if (source) {
    const tailPattern = new RegExp(`(?:\\s|-|:)+${escapeForRegExp(source)}$`, 'i');
    next = next.replace(tailPattern, '').trim();
  }

  if (next === title || next.length < 25) {
    return `Latest update on ${title}.`;
  }

  return next;
};

const extractItems = (xmlText) => {
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title>([\s\S]*?)<\/title>/;
  const linkRegex = /<link>([\s\S]*?)<\/link>/;
  const pubDateRegex = /<pubDate>([\s\S]*?)<\/pubDate>/;
  const descriptionRegex = /<description>([\s\S]*?)<\/description>/;
  const sourceRegex = /<source[^>]*>([\s\S]*?)<\/source>/;

  const seenTitles = new Set();
  const results = [];

  for (const match of xmlText.matchAll(itemRegex)) {
    const block = match[1];
    const rawTitle = decodeHtml(block.match(titleRegex)?.[1] || '');
    const rawLink = decodeHtml(block.match(linkRegex)?.[1] || '');
    const rawDate = decodeHtml(block.match(pubDateRegex)?.[1] || '');
    const rawDescription = decodeHtml(block.match(descriptionRegex)?.[1] || '');
    const rawSource = sanitizeSourceTag(decodeHtml(block.match(sourceRegex)?.[1] || 'AI News'));
    const title = cleanTitle(rawTitle, rawSource);
    const summary = cleanSummary(rawDescription, rawSource, title);

    if (!title || !rawLink || seenTitles.has(title)) {
      continue;
    }

    seenTitles.add(title);

    results.push({
      date: formatDate(rawDate),
      title,
      summary,
      tag: rawSource || 'AI News',
      link: rawLink,
    });

    if (results.length >= MAX_ITEMS) {
      break;
    }
  }

  return results;
};

const fetchNews = async () => {
  const response = await fetch(NEWS_RSS_URL, {
    headers: {
      'user-agent': 'AIToolsCenter-NewsBot/1.0',
      accept: 'application/rss+xml, application/xml;q=0.9, text/xml;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch feed: HTTP ${response.status}`);
  }

  const xmlText = await response.text();
  const parsedItems = extractItems(xmlText);

  if (parsedItems.length === 0) {
    throw new Error('No news items parsed from RSS feed.');
  }

  return parsedItems;
};

const readCurrentNews = async () => {
  try {
    const content = await readFile(OUTPUT_FILE, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
};

const main = async () => {
  const [latest, current] = await Promise.all([fetchNews(), readCurrentNews()]);

  const nextSerialized = `${JSON.stringify(latest, null, 2)}\n`;
  const currentSerialized = `${JSON.stringify(current, null, 2)}\n`;

  if (nextSerialized === currentSerialized) {
    console.log('No AI news changes detected.');
    return;
  }

  await writeFile(OUTPUT_FILE, nextSerialized, 'utf8');
  console.log(`Updated AI news file with ${latest.length} entries.`);
};

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
