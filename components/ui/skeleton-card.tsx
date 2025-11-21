import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function SkeletonCard() {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-24 bg-slate-700" />
        <Skeleton className="h-5 w-5 rounded bg-slate-700" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32 mb-2 bg-slate-700" />
        <Skeleton className="h-3 w-40 bg-slate-700" />
      </CardContent>
    </Card>
  );
}

export function SkeletonAnalysisCard() {
  return (
    <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-3/4 bg-slate-700" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-32 bg-slate-700" />
              <Skeleton className="h-5 w-20 rounded-full bg-slate-700" />
            </div>
          </div>
          <Skeleton className="h-12 w-12 bg-slate-700" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/50 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-6"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3 bg-slate-700" />
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-32 bg-slate-700" />
                <Skeleton className="h-5 w-20 rounded-full bg-slate-700" />
              </div>
            </div>
            <Skeleton className="h-10 w-10 bg-slate-700" />
          </div>
        </div>
      ))}
    </div>
  );
}
