export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <div className="h-10 w-64 bg-slate-700 rounded animate-pulse mb-2" />
        <div className="h-6 w-96 bg-slate-700 rounded animate-pulse" />
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
            <div className="h-8 w-48 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-5 w-5 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="h-8 w-32 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-3 w-40 bg-slate-700 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-400/30 rounded-2xl p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-64 bg-slate-700 rounded animate-pulse" />
          <div className="h-6 w-96 bg-slate-700 rounded animate-pulse" />
          <div className="h-12 w-48 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      <div>
        <div className="h-8 w-48 bg-slate-700 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
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
                <div className="h-12 w-12 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
