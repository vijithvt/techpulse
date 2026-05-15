import { Zap, Bell, User, Settings, RefreshCw, Search } from 'lucide-react';
import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SearchBar } from './SearchBar';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Header() {
  const { fetchArticles, isLoading } = useArticleStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2933] bg-[#0B0F14]/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-4 w-[280px]">
          <div className="flex h-14 w-auto items-center">
            <img 
              src="/logo.png" 
              alt="Tech Pulse Logo" 
              className="h-12 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-transform hover:scale-105" 
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white hidden lg:block uppercase">
            Tech<span className="text-[#3B82F6]">Pulse</span>
          </h1>
        </div>

        {/* Center Section: Search */}
        <div className="hidden md:flex flex-1 justify-center max-w-2xl px-8">
          <SearchBar />
        </div>

        {/* Actions Section */}
        <div className="flex items-center justify-end gap-3 w-[240px]">
          <button 
            onClick={() => fetchArticles()}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1F2933] bg-[#161B22] text-[#9AA4AF] transition-all hover:border-[#3B82F6]/50 hover:text-[#3B82F6] disabled:opacity-50"
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin text-[#3B82F6]")} />
          </button>
          
          <div className="h-4 w-[1px] bg-[#1F2933] mx-1" />
          
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#1F2933] bg-[#161B22] text-[#9AA4AF] transition-all hover:border-[#3B82F6]/50 hover:text-[#3B82F6]">
            <Bell className="h-4 w-4" />
          </button>
          
          <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] transition-all hover:bg-[#3B82F6]/20">
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
