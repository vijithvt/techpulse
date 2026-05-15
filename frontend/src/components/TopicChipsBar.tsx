import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Zap } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopicChipsBar() {
  const { topicsList, selectedTopics, toggleTopic, resetFilters, showImportantOnly, toggleImportant } = useArticleStore();

  return (
    <div className="sticky top-14 z-40 w-full border-b border-[#1F2933] bg-[#0B0F14]/60 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="flex items-center px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pr-6">
            <button
              onClick={resetFilters}
              className={cn(
                "flex h-8 items-center justify-center rounded-lg px-4 text-[12px] font-bold transition-all duration-200 whitespace-nowrap",
                selectedTopics.length === 0 
                  ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20" 
                  : "bg-[#161B22] border border-[#1F2933] text-[#9AA4AF] hover:border-[#3B82F6]/50 hover:text-[#E6EDF3]"
              )}
            >
              All
            </button>
            
            <div className="h-4 w-[1px] bg-[#1F2933] mx-2 shrink-0" />

            {topicsList.slice(0, 18).map((topic) => (
              <button
                key={topic.name}
                onClick={() => toggleTopic(topic.name)}
                className={cn(
                  "flex h-8 items-center gap-2 rounded-lg border px-3 text-[12px] font-bold transition-all duration-200 whitespace-nowrap",
                  selectedTopics.includes(topic.name)
                    ? "bg-[#3B82F6] border-none text-white shadow-lg shadow-blue-500/20"
                    : "bg-[#161B22] border-[#1F2933] text-[#9AA4AF] hover:border-[#3B82F6]/50 hover:text-[#E6EDF3]"
                )}
              >
                {topic.name}
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  selectedTopics.includes(topic.name) ? "bg-white/20 text-white" : "bg-[#1F2933] text-[#9AA4AF]/60"
                )}>
                  {topic.count}
                </span>
              </button>
            ))}

            <div className="h-4 w-[1px] bg-[#1F2933] mx-2 shrink-0" />

            <button
              onClick={toggleImportant}
              className={cn(
                "flex h-8 items-center gap-2 rounded-lg border px-4 text-[12px] font-bold transition-all duration-200 whitespace-nowrap",
                showImportantOnly
                  ? "bg-amber-500 border-none text-white shadow-lg shadow-amber-500/20"
                  : "bg-[#161B22] border-[#1F2933] text-[#9AA4AF] hover:border-amber-500/50 hover:text-amber-500"
              )}
            >
              <Zap className={cn("h-3.5 w-3.5", showImportantOnly ? "fill-white" : "")} />
              Only Important
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
