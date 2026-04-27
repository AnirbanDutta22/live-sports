import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { MatchDetailPage } from './pages/MatchDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Background grid pattern */}
        <div className="fixed inset-0 bg-pitch-950 bg-grid-pattern bg-grid pointer-events-none" />

        {/* Subtle radial glow */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(200,255,0,0.03),transparent)] pointer-events-none" />

        {/* Content */}
        <div className="relative min-h-screen">
          <Header />
          <main className="pb-16">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/match/:id" element={<MatchDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
