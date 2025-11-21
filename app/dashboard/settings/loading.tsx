export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="h-10 w-48 bg-slate-700 rounded animate-pulse mb-2" />
        <div className="h-6 w-80 bg-slate-700 rounded animate-pulse" />
      </div>

      <div className="space-y-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
          <div className="h-6 w-40 bg-slate-700 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-6 w-48 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
              <div className="h-6 w-32 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex justify-between items-center py-3">
              <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
              <div className="h-6 w-20 bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
              <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-700">
              <div className="h-4 w-40 bg-slate-700 rounded animate-pulse" />
              <div className="h-10 w-32 bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-red-400/20 rounded-lg p-6">
          <div className="h-6 w-32 bg-slate-700 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-slate-700 rounded animate-pulse mb-6" />
          <div className="h-10 w-40 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
