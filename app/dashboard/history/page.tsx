'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Eye,
  Filter,
  Loader2,
  TrendingUp,
  Clock,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';

interface Analysis {
  id: string;
  url: string;
  status: string;
  friction_score: number | null;
  created_at: string;
  completed_at: string | null;
}

type FilterType = 'all' | 'low' | 'medium' | 'high';

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tier, setTier] = useState('FREE');
  const [filter, setFilter] = useState<FilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subscription) {
          setTier(subscription.tier);
        }

        const { data: analysesData, error: analysesError } = await supabase
          .from('analyses')
          .select('id, url, status, friction_score, created_at, completed_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (analysesError) {
          throw analysesError;
        }

        const limitedData =
          subscription?.tier === 'FREE'
            ? (analysesData || []).slice(0, 5)
            : analysesData || [];

        setAnalyses(limitedData);
        setFilteredAnalyses(limitedData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading analyses:', err);
        setError('Failed to load analysis history');
        setLoading(false);
      }
    };

    loadAnalyses();
  }, [router, supabase]);

  useEffect(() => {
    let filtered = [...analyses];

    if (filter !== 'all') {
      filtered = filtered.filter((analysis) => {
        if (analysis.status !== 'completed' || analysis.friction_score === null) {
          return false;
        }

        const score = analysis.friction_score;
        if (filter === 'high' && score > 70) return true;
        if (filter === 'medium' && score >= 40 && score <= 70) return true;
        if (filter === 'low' && score < 40) return true;
        return false;
      });
    }

    setFilteredAnalyses(filtered);
    setCurrentPage(1);
  }, [filter, analyses]);

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'bg-slate-500/20 text-slate-400 border-slate-400/50';
    if (score < 40) return 'bg-green-500/20 text-green-400 border-green-400/50';
    if (score <= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/50';
    return 'bg-red-500/20 text-red-400 border-red-400/50';
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return 'N/A';
    if (score < 40) return 'Low';
    if (score <= 70) return 'Medium';
    return 'High';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 border-green-400/50">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/50">Processing</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400/50">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 border-red-400/50">Failed</Badge>;
      default:
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-400/50">{status}</Badge>;
    }
  };

  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAnalyses = filteredAnalyses.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  if (loading) {
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

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Alert className="bg-red-500/10 border-red-500/50 text-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Analysis History
            </span>
          </h1>
          <p className="text-slate-400">
            View and manage your past friction analyses
          </p>
        </div>
        <Link href="/dashboard/analyze">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
            <TrendingUp className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </Link>
      </div>

      {tier === 'FREE' && analyses.length > 0 && (
        <Alert className="bg-cyan-500/10 border-cyan-400/50">
          <AlertCircle className="h-4 w-4 text-cyan-400" />
          <AlertDescription className="text-slate-300">
            You're viewing your last 5 analyses. Upgrade to{' '}
            <Link href="/pricing" className="text-cyan-400 hover:underline font-semibold">
              PRO or ULTRA
            </Link>{' '}
            to access your complete analysis history.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-white">{analyses.length}</p>
              </div>
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-white">
                  {analyses.filter((a) => a.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-white">
                  {analyses.filter((a) => a.status === 'completed' && a.friction_score !== null).length > 0
                    ? Math.round(
                        analyses
                          .filter((a) => a.status === 'completed' && a.friction_score !== null)
                          .reduce((sum, a) => sum + (a.friction_score || 0), 0) /
                          analyses.filter((a) => a.status === 'completed' && a.friction_score !== null).length
                      )
                    : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-400/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Recent Analyses</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <Select value={filter} onValueChange={(value) => setFilter(value as FilterType)}>
                  <SelectTrigger className="w-[180px] bg-slate-900 border-slate-700 text-white">
                    <SelectValue placeholder="Filter by friction" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-700">
                    <SelectItem value="all" className="text-white">All Analyses</SelectItem>
                    <SelectItem value="low" className="text-white">Low Friction (&lt; 40)</SelectItem>
                    <SelectItem value="medium" className="text-white">Medium Friction (40-70)</SelectItem>
                    <SelectItem value="high" className="text-white">High Friction (&gt; 70)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                {filter === 'all' ? 'No Analyses Yet' : 'No Matching Analyses'}
              </h3>
              <p className="text-slate-500 mb-6">
                {filter === 'all'
                  ? 'Start analyzing your websites to see friction insights here.'
                  : 'Try adjusting your filter to see more results.'}
              </p>
              {filter === 'all' && (
                <Link href="/dashboard/analyze">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                    Run Your First Analysis
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700 hover:bg-slate-800/50">
                      <TableHead className="text-slate-300">URL</TableHead>
                      <TableHead className="text-slate-300">Date</TableHead>
                      <TableHead className="text-slate-300">Status</TableHead>
                      <TableHead className="text-slate-300">Friction Score</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentAnalyses.map((analysis) => (
                      <TableRow
                        key={analysis.id}
                        className="border-slate-700 hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <a
                              href={analysis.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 transition-colors"
                              title={analysis.url}
                            >
                              {truncateUrl(analysis.url)}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(analysis.status)}</TableCell>
                        <TableCell>
                          <Badge className={getScoreColor(analysis.friction_score)}>
                            {analysis.friction_score !== null
                              ? `${analysis.friction_score} - ${getScoreLabel(analysis.friction_score)}`
                              : 'Pending'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {analysis.status === 'completed' ? (
                            <Link href={`/dashboard/results/${analysis.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Report
                              </Button>
                            </Link>
                          ) : analysis.status === 'processing' || analysis.status === 'pending' ? (
                            <Link href={`/dashboard/results/${analysis.id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                              >
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                View Status
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="border-slate-600 text-slate-500"
                            >
                              Failed
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
                  <div className="text-sm text-slate-400">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAnalyses.length)} of{' '}
                    {filteredAnalyses.length} analyses
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          size="sm"
                          variant={currentPage === page ? 'default' : 'outline'}
                          onClick={() => setCurrentPage(page)}
                          className={
                            currentPage === page
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                              : 'border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10'
                          }
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
