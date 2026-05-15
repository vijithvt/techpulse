import { create } from 'zustand';
import axios from 'axios';

export interface Article {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  image: string;
  description: string;
  category: string;
  topics: string[];
  importanceScore: number;
  isImportant: boolean;
}

export interface Topic {
  name: string;
  count: number;
}

export interface TrendingTopic {
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface FilterState {
  selectedCategory: string;
  selectedTopics: string[];
  selectedSources: string[];
  searchQuery: string;
  showImportantOnly: boolean;
}

interface ArticleState extends FilterState {
  articles: Article[];
  topicsList: Topic[];
  trendingTopics: TrendingTopic[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchArticles: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  fetchTrending: () => Promise<void>;
  setCategory: (category: string) => void;
  toggleTopic: (topic: string) => void;
  setSearchQuery: (query: string) => void;
  toggleImportant: () => void;
  resetFilters: () => void;
}

const API_URL = 'http://127.0.0.1:3001/api';

const REGIONS = ['India', 'Malayalam'];

export const useArticleStore = create<ArticleState>((set, get) => ({
  articles: [],
  topicsList: [],
  trendingTopics: [],
  isLoading: false,
  error: null,
  
  // Initial Filter State
  selectedCategory: 'All',
  selectedTopics: [],
  selectedSources: [],
  searchQuery: '',
  showImportantOnly: false,

  fetchArticles: async () => {
    const state = get() as any;
    if (state.fetchTimer) clearTimeout(state.fetchTimer);
    
    const timer = setTimeout(async () => {
      set({ isLoading: true, error: null });
      const { selectedCategory, selectedTopics, selectedSources, searchQuery, showImportantOnly } = get();
      
      try {
        const params = new URLSearchParams();
        
        // Map Category to Region if needed
        if (selectedCategory !== 'All') {
          if (REGIONS.includes(selectedCategory)) {
            params.append('region', selectedCategory.toLowerCase());
          } else {
            params.append('category', selectedCategory);
          }
        }
        
        if (selectedTopics.length > 0) params.append('topics', selectedTopics.join(','));
        if (selectedSources.length > 0) params.append('sources', selectedSources.join(','));
        if (searchQuery) params.append('q', searchQuery);
        if (showImportantOnly) params.append('important', 'true');

        const response = await axios.get(`${API_URL}/articles?${params.toString()}`);
        set({ articles: response.data, isLoading: false });
      } catch (error) {
        set({ error: 'Failed to fetch articles.', isLoading: false });
      }
    }, 200);

    set({ fetchTimer: timer } as any);
  },

  fetchTopics: async () => {
    try {
      const response = await axios.get(`${API_URL}/topics`);
      set({ topicsList: response.data });
    } catch (error) {
      console.error('Failed to fetch topics');
    }
  },

  fetchTrending: async () => {
    try {
      const response = await axios.get(`${API_URL}/trending`);
      set({ trendingTopics: response.data });
    } catch (error) {
      console.error('Failed to fetch trending topics');
    }
  },

  setCategory: (category: string) => {
    set({ selectedCategory: category, selectedTopics: [] }); // Reset topics on category change
    get().fetchArticles();
  },

  toggleTopic: (topic: string) => {
    const current = get().selectedTopics;
    const next = current.includes(topic) 
      ? current.filter(t => t !== topic)
      : [...current, topic];
    set({ selectedTopics: next });
    get().fetchArticles();
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().fetchArticles();
  },

  toggleImportant: () => {
    set({ showImportantOnly: !get().showImportantOnly });
    get().fetchArticles();
  },

  resetFilters: () => {
    set({ selectedCategory: 'All', selectedTopics: [], searchQuery: '', showImportantOnly: false });
    get().fetchArticles();
  }
}));
