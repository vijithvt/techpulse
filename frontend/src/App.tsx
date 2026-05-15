import { useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TopicChipsBar } from './components/TopicChipsBar';
import { TrendingRow } from './components/TrendingRow';
import { ArticleCard } from './components/ArticleCard';
import { SkeletonLoader } from './components/SkeletonLoader';
import { LinkedInModal } from './components/LinkedInModal';
import { useArticleStore, type Article } from './store/useArticles';
import { useState } from 'react';
import { AlertCircle, LayoutGrid } from 'lucide-react';

function App() {
  const { articles, isLoading, error, fetchArticles, fetchTopics, fetchTrending } = useArticleStore();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGeneratePost = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchArticles();
    fetchTopics();
    fetchTrending();
    const interval = setInterval(() => {
      fetchArticles();
      fetchTopics();
      fetchTrending();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchArticles, fetchTopics, fetchTrending]);

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-accent/30">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden lg:flex" />
        
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <TopicChipsBar />
          
          <main className="mx-auto w-full max-width-720-centered py-8">
            <TrendingRow />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9AA4AF]">Latest Updates</h2>
              <span className="text-[11px] font-medium text-muted-foreground/40">{articles.length} ARTICLES</span>
            </div>

            {error && (
              <div className="mb-8 flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {isLoading ? (
                <SkeletonLoader />
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard 
                    key={article.id} 
                    article={article} 
                    onGeneratePost={() => handleGeneratePost(article)}
                  />
                ))
              ) : !isLoading && !error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#11161C] text-[#9AA4AF]/20 border border-[#1F2933]">
                    <LayoutGrid className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-bold text-[#E6EDF3]">
                    {useArticleStore.getState().searchQuery ? 'No matching updates found.' : 'No direct updates available.'}
                  </p>
                  <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#9AA4AF]">
                    {useArticleStore.getState().searchQuery 
                      ? 'Try adjusting your search terms or filters to find what you are looking for.'
                      : 'Our regional aggregation is currently refreshing. Showing the latest relevant tech insights soon.'}
                  </p>
                  {!useArticleStore.getState().searchQuery && (
                    <button 
                      onClick={() => fetchArticles()}
                      className="mt-6 text-[12px] font-bold text-[#3B82F6] hover:underline"
                    >
                      Try Refreshing Feed
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {selectedArticle && (
        <LinkedInModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          article={selectedArticle}
        />
      )}
    </div>
  );
}

export default App;
