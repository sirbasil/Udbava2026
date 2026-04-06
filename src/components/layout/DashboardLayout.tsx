import { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DashboardSidebar } from './DashboardSidebar';
import { NewListingModal } from '@/components/features/NewListingModal';
import { Menu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [listingOpen, setListingOpen] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0F]">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar
          onNewListing={() => setListingOpen(true)}
          mobileOpen={mobileSidebar}
          onMobileClose={() => setMobileSidebar(false)}
        />
        <main className="flex-1 min-w-0">
          <div className="lg:hidden px-4 pt-3">
            <button onClick={() => setMobileSidebar(true)} className="p-2 text-[#A09888] hover:text-[#D4A843] border border-[#2A2A36] rounded" aria-label="Open sidebar">
              <Menu className="size-5" />
            </button>
          </div>
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <Footer />
      <NewListingModal isOpen={listingOpen} onClose={() => setListingOpen(false)} />
    </div>
  );
}
