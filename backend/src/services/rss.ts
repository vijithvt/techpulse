import Parser from 'rss-parser';
import { RSS_SOURCES } from '../config';
import { classifyArticle } from './classifier';
import { scrapeManorama, scrapeMathrubhumi } from './scraping';
import { calculateImportance } from './importanceScorer';

const parser = new Parser();

export interface RawArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string;
  description: string;
  category: string;
  topics: string[];
  region: 'global' | 'india' | 'malayalam';
  importanceScore: number;
  isImportant: boolean;
}

export const fetchFeeds = async (): Promise<RawArticle[]> => {
  const feedPromises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      if (!feed.items || feed.items.length === 0) {
        throw new Error('Empty feed');
      }

      return feed.items.map((item) => {
        const title = item.title || 'No Title';
        const rawDescription = item.contentSnippet || item.description || item.content || '';
        const cleanDesc = cleanDescription(rawDescription);
        
        const { category, topics } = classifyArticle(title, cleanDesc);

        return {
          id: item.guid || item.link || `${source.name}-${item.title}`,
          title,
          url: item.link || '',
          source: source.name,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          image: extractImage(item),
          description: cleanDesc,
          category,
          topics,
          region: source.region,
          ...calculateImportance({ title, source: source.name, topics, publishedAt: item.isoDate || item.pubDate || new Date().toISOString() })
        };
      });
    } catch (error) {
      console.warn(`RSS failed for ${source.name}, region: ${source.region}. Error: ${error instanceof Error ? error.message : 'Unknown'}`);
      
      // Fallback Scraping
      if (source.name === 'Manorama Online Tech') return await scrapeManorama();
      if (source.name === 'Mathrubhumi Tech') return await scrapeMathrubhumi();
      
      return [];
    }
  });

  const results = await Promise.all(feedPromises);
  const allArticles = results.flat();

  // If Malayalam is thin, provide fallback from India/Global AI
  const malayalamArticles = allArticles.filter(a => a.region === 'malayalam');
  if (malayalamArticles.length < 5) {
    console.info(`Malayalam feed thin (${malayalamArticles.length}), adding relevant tech fallbacks...`);
    
    // Primary fallback: India Tech (AI/Software)
    const indiaFallbacks = allArticles
      .filter(a => a.region === 'india' && (a.category === 'AI' || a.category === 'Software'))
      .filter(a => !malayalamArticles.some(ma => ma.url === a.url))
      .slice(0, 10)
      .map(a => ({ ...a, region: 'malayalam' as const, source: `${a.source} (Regional Fallback)` }));
    
    allArticles.push(...indiaFallbacks);

    // Secondary fallback: Global AI (if still thin)
    if (allArticles.filter(a => a.region === 'malayalam').length < 5) {
      const globalFallbacks = allArticles
        .filter(a => a.region === 'global' && a.category === 'AI')
        .slice(0, 5)
        .map(a => ({ ...a, region: 'malayalam' as const, source: `${a.source} (Global Tech)` }));
      allArticles.push(...globalFallbacks);
    }
  }

  return allArticles;
};

function cleanDescription(text: string): string {
  if (!text) return '';
  
  // 1. Remove HTML tags
  let clean = text.replace(/<[^>]*>?/gm, '');
  
  // 2. Decode common HTML entities
  clean = clean
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // 3. Remove extra whitespace and newlines
  clean = clean.replace(/\s+/g, ' ').trim();

  // 4. Truncate to ~160 chars
  if (clean.length > 160) {
    return clean.substring(0, 157) + '...';
  }

  return clean;
}

function extractImage(item: any): string {
  // 1. Enclosure
  if (item.enclosure?.url) return item.enclosure.url;
  
  // 2. Media Content (can be an array or object)
  const mediaContent = item['media:content'];
  if (mediaContent) {
    if (Array.isArray(mediaContent) && mediaContent[0]?.$.url) return mediaContent[0].$.url;
    if (mediaContent.$?.url) return mediaContent.$.url;
    if (mediaContent.url) return mediaContent.url;
  }

  // 3. Media Thumbnail
  if (item['media:thumbnail']?.$.url) return item['media:thumbnail'].$.url;

  // 4. Custom fields like 'image'
  if (typeof item.image === 'string') return item.image;
  if (item.image?.url) return item.image.url;

  // 5. Fallback: check content/description for <img> tags
  const content = item.content || item.contentSnippet || item.description || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : '';
}
