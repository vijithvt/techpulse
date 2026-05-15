import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LayoutGrid } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function TopicFilterBar() {
  const { topicsList, selectedTopics, toggleTopic, resetFilters } = useArticleStore();

  return (
    <div className="sticky top-14 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={resetFilters}
            className={cn(
              "flex h-8 items-center justify-center rounded-md px-4 text-[12px] font-semibold transition-all whitespace-nowrap border",
              selectedTopics.length === 0 
                ? "bg-accent border-accent text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]" 
                : "border-[#1F2933] text-[#9AA4AF] hover:bg-[#161B22] hover:text-[#E6EDF3]"
            )}
          >
            All
          </button>
          
          <div className="h-4 w-[1px] bg-border/50 mx-1 shrink-0" />

          {topicsList.slice(0, 12).map((topic) => (
            <TopicChip
              key={topic.name}
              name={topic.name}
              count={topic.count}
              isActive={selectedTopics.includes(topic.name)}
              onClick={() => toggleTopic(topic.name)}
            />
          ))}
        </div>

        <button className="ml-4 flex h-8 items-center gap-2 rounded-md border border-[#1F2933] bg-secondary/30 px-4 text-[12px] font-medium text-[#9AA4AF] transition-all hover:bg-[#161B22] hover:text-[#E6EDF3] shrink-0">
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Explore</span>
        </button>
      </div>
    </div>
  );
}

interface TopicChipProps {
  name: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

function TopicChip({ name, count, isActive, onClick }: TopicChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-2 rounded-md border px-3 text-[12px] font-semibold transition-all whitespace-nowrap",
        isActive
          ? "bg-accent border-accent text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]"
          : "border-[#1F2933] text-[#9AA4AF] hover:bg-[#161B22] hover:text-[#E6EDF3]"
      )}
    >
      {name}
      <span className={cn(
        "text-[10px] font-bold px-1.5 py-0.5 rounded-sm",
        isActive ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground/40"
      )}>
        {count}
      </span>
    </button>
  );
}
