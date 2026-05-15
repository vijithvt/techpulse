import axios from 'axios';
import { RawArticle } from './rss';
import { classifyArticle } from './classifier';
import { calculateImportance } from './importanceScorer';

const MANORAMA_TECH_URL = 'https://www.manoramaonline.com/technology.html';
const MATHRUBHUMI_TECH_URL = 'https://www.mathrubhumi.com/technology';

export const scrapeManorama = async (): Promise<RawArticle[]> => {
  try {
    const { data } = await axios.get(MANORAMA_TECH_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const articles: RawArticle[] = [];
    // 1. Find story blocks (containers that usually have an image and a link)
    const storyBlocks = data.matchAll(/<div[^>]+class="[^"]*story[^"]*"[^>]*>([\s\S]*?)<\/div>/g);

    for (const blockMatch of storyBlocks) {
      const blockHTML = blockMatch[1];
      
      // 2. Find the main link
      const linkMatch = blockHTML.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      if (!linkMatch) continue;

      const [_, url, innerHTML] = linkMatch;
      if (!url.includes('/technology/') && !url.includes('/news/')) continue;
      if (url.includes('google') || url.includes('facebook') || url.includes('twitter')) continue;

      const cleanTitle = innerHTML.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      const hasMalayalam = /[\u0D00-\u0D7F]/.test(cleanTitle);
      if (!hasMalayalam) continue;

      const isNav = /LIVE TV|E-PAPER|LOGIN|SUBSCRIBE|BOOKS|ADS|CLASSIFIEDS|OFFERS|MENU/i.test(cleanTitle);
      if (cleanTitle.length < 20 || isNav) continue;

      // 3. Find the image in this block
      const imgMatch = blockHTML.match(/<img[^>]+(?:src|data-src)="([^"]+)"/);
      const imageUrl = imgMatch ? imgMatch[1] : '';

      const fullUrl = url.startsWith('http') ? url : `https://www.manoramaonline.com${url}`;
      const { category, topics } = classifyArticle(cleanTitle, '');

      if (category !== 'General') {
        articles.push({
          id: `scrape-manorama-${fullUrl}`,
          title: cleanTitle,
          url: fullUrl,
          source: 'Manorama Online',
          publishedAt: new Date().toISOString(),
          image: imageUrl,
          description: '',
          category,
          topics,
          region: 'malayalam',
          ...calculateImportance({ title: cleanTitle, source: 'Manorama Online', topics, publishedAt: new Date().toISOString() })
        } as any);
      }
    }

    // Fallback: if no blocks found, try direct link matching as before but with image search
    if (articles.length === 0) {
      const aTags = data.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g);
      for (const match of aTags) {
        const [_, url, innerHTML] = match;
        if (!url.includes('/technology/') && !url.includes('/news/')) continue;
        
        const cleanTitle = innerHTML.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
        if (cleanTitle.length > 25 && /[\u0D00-\u0D7F]/.test(cleanTitle)) {
           // Basic fallback for images if block-based fails
           const fullUrl = url.startsWith('http') ? url : `https://www.manoramaonline.com${url}`;
           const { category, topics } = classifyArticle(cleanTitle, '');
           if (category !== 'General') {
             articles.push({
               id: `scrape-manorama-${fullUrl}`,
               title: cleanTitle,
               url: fullUrl,
               source: 'Manorama Online',
               publishedAt: new Date().toISOString(),
               image: '',
               description: '',
               category,
               topics,
               region: 'malayalam',
               ...calculateImportance({ title: cleanTitle, source: 'Manorama Online', topics, publishedAt: new Date().toISOString() })
             } as any);
           }
        }
      }
    }

    return Array.from(new Map(articles.map(a => [a.title, a])).values()).slice(0, 10);
  } catch (error) {
    console.error('Error scraping Manorama:', error);
    return [];
  }
};

export const scrapeMathrubhumi = async (): Promise<RawArticle[]> => {
  try {
    const { data } = await axios.get(MATHRUBHUMI_TECH_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    const articles: RawArticle[] = [];
    // Mathrubhumi often uses article tags or divs with specific classes
    const storyBlocks = data.matchAll(/<(?:article|div)[^>]+class="[^"]*(?:story|news)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>/g);

    for (const blockMatch of storyBlocks) {
      const blockHTML = blockMatch[1];
      const linkMatch = blockHTML.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
      if (!linkMatch) continue;

      const [_, url, innerHTML] = linkMatch;
      if (!url.includes('/technology/') && !url.includes('/specials/')) continue;

      const cleanTitle = innerHTML.replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      const hasMalayalam = /[\u0D00-\u0D7F]/.test(cleanTitle);
      if (!hasMalayalam) continue;

      const imgMatch = blockHTML.match(/<img[^>]+(?:src|data-src|srcset)="([^" ]+)"/);
      const imageUrl = imgMatch ? imgMatch[1] : '';

      const fullUrl = url.startsWith('http') ? url : `https://www.mathrubhumi.com${url}`;
      const { category, topics } = classifyArticle(cleanTitle, '');

      if (category !== 'General') {
        articles.push({
          id: `scrape-mathrubhumi-${fullUrl}`,
          title: cleanTitle,
          url: fullUrl,
          source: 'Mathrubhumi',
          publishedAt: new Date().toISOString(),
          image: imageUrl,
          description: '',
          category,
          topics,
          region: 'malayalam',
          ...calculateImportance({ title: cleanTitle, source: 'Mathrubhumi', topics, publishedAt: new Date().toISOString() })
        } as any);
      }
    }

    return Array.from(new Map(articles.map(a => [a.title, a])).values()).slice(0, 10);
  } catch (error) {
    console.error('Error scraping Mathrubhumi:', error);
    return [];
  }
};
