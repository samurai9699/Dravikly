export default function HistoryLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="h-10 w-64 bg-slate-700 rounded animate-pulse mb-2" />
        <div className="h-6 w-96 bg-slate-700 rounded animate-pulse" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="h-10 w-64 bg-slate-700 rounded animate-pulse" />
        <div className="h-10 w-48 bg-slate-700 rounded animate-pulse" />
      </div>

      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="h-6 w-3/4 bg-slate-700 rounded animate-pulse" />
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                  <div className="h-5 w-20 bg-slate-700 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="ml-4 space-y-2">
                <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
                <div className="h-8 w-12 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-slate-700 rounded animate-pulse" />
          <div className="h-10 w-24 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
