import { LayoutGrid, Cpu, Code, Smartphone, Rocket, Globe, Languages, ChevronDown } from 'lucide-react';
import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const filters = [
  { name: 'All', icon: LayoutGrid },
  { name: 'AI', icon: Cpu },
  { name: 'Software', icon: Code },
  { name: 'Gadgets', icon: Smartphone },
  { name: 'Startups', icon: Rocket },
  { name: 'India', icon: Globe },
  { name: 'Malayalam', icon: Languages },
];

const sources = [
  { name: 'TechCrunch', code: 'TC' },
  { name: 'Wired', code: 'W' },
  { name: 'VentureBeat', code: 'VB' },
  { name: 'Engadget', code: 'E' },
  { name: 'TechSpot', code: 'TS' },
  { name: 'Gizmodo', code: 'G' }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { selectedCategory, setCategory } = useArticleStore();

  return (
    <aside className={cn("flex flex-col border-r border-[#1F2933] bg-[#0B0F14] p-4 sticky top-14 h-[calc(100vh-3.5rem)]", className)}>
      <div className="space-y-8">
        <div>
          <h2 className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
            Feed Categories
          </h2>
          <nav className="space-y-1">
            {filters.map((item) => (
              <button
                key={item.name}
                onClick={() => setCategory(item.name)}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                  selectedCategory === item.name 
                    ? "bg-[#161B22] text-[#3B82F6]" 
                    : "text-[#9AA4AF] hover:bg-[#161B22] hover:text-[#E6EDF3]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3 px-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B7280]">
              Sources
            </h2>
            <ChevronDown className="h-3 w-3 text-[#6B7280]/40" />
          </div>
          <nav className="space-y-1">
            {sources.map((source) => (
              <button
                key={source.name}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-[#9AA4AF] transition-all hover:bg-[#161B22] hover:text-[#E6EDF3] group"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#1F2933]/50 text-[9px] font-bold text-[#6B7280] transition-colors group-hover:bg-[#3B82F6]/20 group-hover:text-[#3B82F6]">
                  {source.code}
                </div>
                <span className="truncate">{source.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-auto px-3 py-4 text-[10px] font-medium text-[#6B7280]/40 border-t border-[#1F2933]/50">
        Tech Pulse v1.2.0
      </div>
    </aside>
  );
}
