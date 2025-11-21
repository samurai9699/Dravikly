import Link from 'next/link';
import { FileQuestion, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="not-found-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M50 0 L50 100 M0 50 L100 50" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <path d="M25 25 L75 25 L75 75 L25 75 Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#not-found-pattern)" />
        </svg>
      </div>

      <Card className="relative z-10 max-w-2xl w-full bg-slate-800/80 backdrop-blur-sm border-cyan-400/30">
        <CardContent className="p-8 sm:p-12">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <FileQuestion className="w-10 h-10 text-cyan-400" />
            </div>

            <div className="space-y-2">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                404
              </h1>
              <h2 className="text-3xl font-bold">Page Not Found</h2>
              <p className="text-slate-400 text-lg">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-slate-900/50 border border-cyan-400/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-cyan-400" />
                  Looking for something?
                </h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li>
                    <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">
                      → Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/analyze" className="hover:text-cyan-400 transition-colors">
                      → Run New Analysis
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/history" className="hover:text-cyan-400 transition-colors">
                      → Analysis History
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-cyan-400 transition-colors">
                      → Pricing Plans
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/10"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
