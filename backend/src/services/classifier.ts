const CATEGORY_RULES = [
  { name: 'AI', keywords: ['AI', 'LLM', 'OpenAI', 'GPT', 'Claude', 'Gemini', 'NVIDIA', 'നിർമിത ബുദ്ധി', 'ആർട്ടിഫിഷ്യൽ ഇൻ്റലിജൻസ്'] },
  { name: 'Software', keywords: ['React', 'API', 'backend', 'Python', 'JavaScript', 'TypeScript', 'Node', 'Rust', 'Docker', 'ആപ്ലിക്കേഷൻ', 'സോഫ്റ്റ്‌വെയർ', 'അപ്ഡേറ്റ്'] },
  { name: 'Gadgets', keywords: ['phone', 'laptop', 'device', 'iPhone', 'Samsung', 'MacBook', 'pixel', 'smartwatch', 'PlayStation', 'ഫോൺ', 'മൊബൈൽ', 'സ്മാർട്ഫോൺ', 'ഗാഡ്‌ജെറ്റ്'] },
  { name: 'Startups', keywords: ['funding', 'venture', 'startup', 'IPO', 'acquisition', 'founder', 'നിക്ഷേപം', 'സ്റ്റാർട്ടപ്പ്'] },
];

const TOPIC_DICTIONARY: Record<string, string[]> = {
  'OpenAI': ['openai', 'sam altman', 'chatgpt'],
  'NVIDIA': ['nvidia', 'gpu', 'h100', 'b200'],
  'LLM': ['llm', 'language model', 'transformer'],
  'RAG': ['rag', 'retrieval augmented'],
  'Apple': ['apple', 'iphone', 'macbook', 'ipad', 'ആപ്പിൾ', 'ഐഫോൺ'],
  'Google': ['google', 'alphabet', 'gemini', 'pixel', 'ഗൂഗിൾ', 'ആൻഡ്രോയിഡ്'],
  'Microsoft': ['microsoft', 'azure', 'copilot', 'മൈക്രോസോഫ്റ്റ്', 'വിൻഡോസ്'],
  'Security': ['security', 'cyber', 'vulnerability', 'exploit', 'ഹാക്കിംഗ്', 'സെക്യൂരിറ്റി'],
};

export const classifyArticle = (title: string, description: string) => {
  const content = `${title} ${description}`.toLowerCase();
  
  // Extract Category
  let category = 'General';
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some(k => content.includes(k.toLowerCase()))) {
      category = rule.name;
      break;
    }
  }

  // Extract Topics
  const topics: string[] = [];
  for (const [topicName, keywords] of Object.entries(TOPIC_DICTIONARY)) {
    if (keywords.some(k => content.includes(k.toLowerCase()))) {
      topics.push(topicName);
    }
    if (topics.length >= 5) break;
  }

  return { category, topics };
};
