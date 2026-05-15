import { ExternalLink, Clock, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Article } from '../store/useArticles';

interface ArticleCardProps {
  article: Article;
  onGeneratePost: () => void;
}

export function ArticleCard({ article, onGeneratePost }: ArticleCardProps) {
  const publishedDate = new Date(article.publishedAt);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-transparent p-4 transition-all hover:bg-[#161B22]/50 hover:border-[#1F2933]"
    >
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6]">
              {article.source}
            </span>
            <span className="text-[10px] text-[#6B7280]">•</span>
            <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
              <Clock className="h-2.5 w-2.5" />
              <span>{formatDistanceToNow(publishedDate, { addSuffix: true })}</span>
            </div>

            {article.isImportant && (
              <>
                <span className="text-[10px] text-[#6B7280]">•</span>
                <span className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-500 border border-amber-500/20">
                  🔥 Important
                </span>
              </>
            )}
          </div>

          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#E6EDF3] transition-colors group-hover:text-white">
            {article.title}
          </h3>
          
          {article.description && (
            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#9AA4AF]">
              {article.description}
            </p>
          )}
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {article.topics?.slice(0, 3).map((topic) => (
                <span key={topic} className="rounded-full bg-[#1F2933] px-2 py-0.5 text-[9px] font-medium text-[#9AA4AF]">
                  #{topic}
                </span>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onGeneratePost();
              }}
              className="flex items-center gap-1.5 rounded-lg bg-[#3B82F6]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#3B82F6] transition-all hover:bg-[#3B82F6] hover:text-white"
            >
              <Sparkles className="h-3 w-3" />
              Generate Post
            </button>
          </div>
        </div>

        {article.image && (
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#1F2933]/50 sm:h-24 sm:w-24">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </a>
  );
}
