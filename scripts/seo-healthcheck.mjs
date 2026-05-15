const baseUrlArg = process.argv[2];

if (!baseUrlArg) {
  console.error('Usage: node scripts/seo-healthcheck.mjs <base-url>');
  process.exit(1);
}

const baseUrl = baseUrlArg.replace(/\/$/, '');

const REQUIRED_PATHS = [
  '/',
  '/sitemap.xml',
  '/robots.txt',
  '/ads.txt',
  '/about',
  '/privacy-policy',
  '/terms-and-conditions',
  '/contact',
];

const timeoutMs = 15000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'AIToolsCenter-SEO-Check/1.0',
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

function extractUrlsFromSitemap(xmlText) {
  const regex = /<loc>(.*?)<\/loc>/g;
  const urls = [];
  let match;

  while ((match = regex.exec(xmlText)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

async function checkUrl(url, failures) {
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      failures.push({ url, reason: `HTTP ${response.status}` });
      return;
    }

    const contentType = response.headers.get('content-type') || '';
    if (url.endsWith('/ads.txt')) {
      const text = await response.text();
      if (!text.includes('google.com, pub-2770089511325323')) {
        failures.push({ url, reason: 'ads.txt missing expected publisher line' });
      }
    } else if (url.endsWith('/sitemap.xml') && !contentType.includes('xml')) {
      failures.push({ url, reason: `unexpected content-type: ${contentType || 'missing'}` });
    }
  } catch (error) {
    failures.push({ url, reason: error?.message || 'request failed' });
  }
}

async function main() {
  const failures = [];

  console.log(`Checking required URLs on ${baseUrl}`);
  for (const path of REQUIRED_PATHS) {
    await checkUrl(`${baseUrl}${path}`, failures);
  }

  const sitemapUrl = `${baseUrl}/sitemap.xml`;
  try {
    const sitemapResponse = await fetchWithTimeout(sitemapUrl);
    if (!sitemapResponse.ok) {
      failures.push({ url: sitemapUrl, reason: `unable to read sitemap (HTTP ${sitemapResponse.status})` });
    } else {
      const xmlText = await sitemapResponse.text();
      const sitemapUrls = extractUrlsFromSitemap(xmlText);

      if (sitemapUrls.length === 0) {
        failures.push({ url: sitemapUrl, reason: 'no URLs found in sitemap' });
      } else {
        console.log(`Checking ${sitemapUrls.length} sitemap URLs`);
        for (const url of sitemapUrls) {
          await checkUrl(url, failures);
        }
      }
    }
  } catch (error) {
    failures.push({ url: sitemapUrl, reason: error?.message || 'failed to fetch sitemap' });
  }

  if (failures.length > 0) {
    console.error('\nSEO health check failed:');
    for (const failure of failures) {
      console.error(`- ${failure.url}: ${failure.reason}`);
    }
    process.exit(1);
  }

  console.log('\nSEO health check passed.');
}

main();
