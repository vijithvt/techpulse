import { TrendingUp, TrendingDown, Flame } from 'lucide-react';
import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TrendingRow() {
  const { trendingTopics, selectedTopics, toggleTopic } = useArticleStore();

  if (trendingTopics.length === 0) return null;

  return (
    <div className="mb-10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex h-5 w-5 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
            <Flame className="relative h-4 w-4 text-orange-500" />
          </div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9AA4AF]">Trending Topics</h2>
        </div>
        <span className="text-[10px] font-medium text-[#6B7280]">Real-time Updates</span>
      </div>
      
      <div className="flex flex-wrap gap-2.5">
        {trendingTopics.map((item) => {
          const isActive = selectedTopics.includes(item.name);
          return (
            <button
              key={item.name}
              onClick={() => toggleTopic(item.name)}
              className={cn(
                "group flex items-center gap-2.5 rounded-full border px-4 py-2 text-[12px] font-bold transition-all duration-300",
                isActive 
                  ? "bg-[#3B82F6] border-none text-white shadow-xl shadow-blue-500/30 ring-2 ring-blue-400/20" 
                  : "bg-[#11161C] border-[#1F2933] text-[#9AA4AF] hover:border-[#3B82F6]/50 hover:bg-[#161B22] hover:text-[#E6EDF3]"
              )}
            >
              <span>{item.name}</span>
              <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
                {item.trend === 'up' && <TrendingUp className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-green-500")} />}
                {item.trend === 'down' && <TrendingDown className={cn("h-3.5 w-3.5", isActive ? "text-white" : "text-red-500")} />}
                {item.growth && item.growth > 0 && (
                  <span className={cn("text-[10px]", isActive ? "text-white/80" : "text-green-500/80")}>
                    +{item.growth}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
