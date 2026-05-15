export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl border border-transparent bg-[#11161C]/30 animate-pulse">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-12 rounded bg-[#1F2933]" />
              <div className="h-2 w-2 rounded-full bg-[#1F2933]" />
              <div className="h-2 w-20 rounded bg-[#1F2933]" />
            </div>
            <div className="h-4 w-3/4 rounded bg-[#1F2933]" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-[#1F2933]" />
              <div className="h-3 w-5/6 rounded bg-[#1F2933]" />
            </div>
          </div>
          <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-[#1F2933]" />
        </div>
      ))}
    </div>
  );
}
