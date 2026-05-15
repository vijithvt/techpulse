import React, { useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { useArticleStore } from '../store/useArticles';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SearchBar() {
  const { searchQuery, setSearchQuery, isLoading } = useArticleStore();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Press "/" to focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 max-w-xl group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {isLoading && searchQuery ? (
          <Loader2 className="h-4 w-4 text-accent animate-spin" />
        ) : (
          <Search className={cn(
            "h-4 w-4 transition-colors duration-200",
            searchQuery ? "text-accent" : "text-[#9AA4AF] group-focus-within:text-accent"
          )} />
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tech updates... (Press /)"
        className="w-full h-10 bg-[#11161C] border border-[#1F2933] rounded-xl pl-10 pr-10 text-[13px] text-[#E6EDF3] placeholder-[#9AA4AF]/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-200"
      />

      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-3 flex items-center text-[#9AA4AF] hover:text-[#E6EDF3] transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
