export const calculateImportance = (article: {
  title: string;
  source: string;
  topics: string[];
  publishedAt: string;
}) => {
  let score = 0;

  // 1. Source Credibility
  const highTrustSources = ['Reuters', 'Wired'];
  const midTrustSources = ['TechCrunch', 'VentureBeat'];

  if (highTrustSources.some(s => article.source.includes(s))) score += 3;
  else if (midTrustSources.some(s => article.source.includes(s))) score += 2;
  else score += 1;

  // 2. Topic Importance
  const highImpactTopics = ['AI', 'LLM', 'NVIDIA', 'OpenAI'];
  const midImpactTopics = ['Security', 'Cloud', 'RAG', 'Architecture'];

  if (article.topics?.some(t => highImpactTopics.includes(t))) score += 3;
  else if (article.topics?.some(t => midImpactTopics.includes(t))) score += 2;

  // 3. Title Signals
  const title = article.title.toLowerCase();
  const signals = [
    { keywords: ['launch', 'release', 'new model', 'breakthrough'], weight: 2 },
    { keywords: ['funding', 'acquisition', 'ipo', 'billions'], weight: 2 },
    { keywords: ['report', 'study', 'analysis', 'survey'], weight: 2 },
  ];

  signals.forEach(signal => {
    if (signal.keywords.some(k => title.includes(k))) score += signal.weight;
  });

  // 4. Recency
  const hoursSincePublished = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
  if (hoursSincePublished < 6) score += 2;
  else if (hoursSincePublished < 24) score += 1;

  return {
    importanceScore: score,
    isImportant: score >= 6
  };
};
