export interface SourceConfig {
  name: string;
  url: string;
  region: 'global' | 'india' | 'malayalam';
}

export const RSS_SOURCES: SourceConfig[] = [
  // Global
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', region: 'global' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', region: 'global' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', region: 'global' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', region: 'global' },
  { name: 'TechSpot', url: 'https://www.techspot.com/backend.xml', region: 'global' },
  { name: 'Gizmodo', url: 'https://gizmodo.com/rss', region: 'global' },

  // India
  { name: 'Indian Express Tech', url: 'https://indianexpress.com/section/technology/feed/', region: 'india' },
  { name: 'The Hindu Tech', url: 'https://www.thehindu.com/sci-tech/technology/feeder/default.rss', region: 'india' },
  { name: 'Gadgets360', url: 'https://www.gadgets360.com/rss/news', region: 'india' },
  { name: 'Economic Times Tech', url: 'https://economictimes.indiatimes.com/tech/rssfeeds/13357270.cms', region: 'india' },
  { name: 'YourStory Tech', url: 'https://yourstory.com/feed', region: 'india' },

  // Malayalam
  { name: 'Manorama Online Tech', url: 'https://www.manoramaonline.com/technology/technology-news.rss', region: 'malayalam' },
  { name: 'Mathrubhumi Tech', url: 'https://www.mathrubhumi.com/technology/rss', region: 'malayalam' },
];

export const CACHE_TTL = 600; // 10 minutes
export const PORT = process.env.PORT || 3001;
