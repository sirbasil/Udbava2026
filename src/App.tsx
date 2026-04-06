import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/features/ToastContainer';

const Home = lazy(() => import('@/pages/Home'));
const Exchange = lazy(() => import('@/pages/Exchange'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const CommandCentre = lazy(() => import('@/pages/CommandCentre'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Logistics = lazy(() => import('@/pages/Logistics'));
const Settings = lazy(() => import('@/pages/Settings'));
const Community = lazy(() => import('@/pages/Community'));
const Archives = lazy(() => import('@/pages/Archives'));
const Provenance = lazy(() => import('@/pages/Provenance'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Support = lazy(() => import('@/pages/Support'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-[#6B6358] tracking-wider">LOADING ARCHIVES...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#F0E8D8]">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
          <Route path="/exchange" element={<><Navbar /><Exchange /><Footer /></>} />
          <Route path="/community" element={<><Navbar /><Community /><Footer /></>} />
          <Route path="/archives" element={<><Navbar /><Archives /><Footer /></>} />
          <Route path="/provenance" element={<><Navbar /><Provenance /><Footer /></>} />
          <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} />
          <Route path="/privacy" element={<><Navbar /><Privacy /><Footer /></>} />
          <Route path="/support" element={<><Navbar /><Support /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/command-centre" element={<CommandCentre />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </div>
  );
}
