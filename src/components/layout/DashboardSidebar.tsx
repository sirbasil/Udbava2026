import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Package, BarChart3, Truck, Settings, Plus, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';

interface DashboardSidebarProps {
  onNewListing: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const NAV_ITEMS = [
  { label: 'Command Centre', icon: LayoutGrid, path: '/command-centre', roles: ['manager', 'admin'] },
  { label: 'Inventory', icon: Package, path: '/inventory', roles: ['manager', 'admin'] },
  { label: 'Analytics', icon: BarChart3, path: '/analytics', roles: ['manager', 'admin'] },
  { label: 'Logistics', icon: Truck, path: '/logistics', roles: ['manager', 'admin'] },
  { label: 'Settings', icon: Settings, path: '/settings', roles: ['student', 'manager', 'admin'] },
];

export function DashboardSidebar({ onNewListing, mobileOpen, onMobileClose }: DashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  if (!user) return null;

  const handleNav = (path: string, roles: string[]) => {
    if (!roles.includes(user.role)) {
      addToast('Access restricted to your role', 'warning');
      return;
    }
    navigate(path);
    onMobileClose?.();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.avatar} alt={user.name} className="size-10 rounded-full object-cover border border-[#2A2A36]" />
          <div>
            <p className="text-sm font-semibold text-[#D4A843]">{user.name}</p>
            <p className="text-[10px] font-mono text-[#6B6358] tracking-wider">{user.role === 'student' ? 'OPERATIONAL OVERSIGHT' : user.role.toUpperCase()}</p>
          </div>
        </div>
        {user.role === 'student' && (
          <div className="border border-[#D4A843]/30 bg-[#D4A843]/5 rounded p-3 mb-5">
            <p className="text-[10px] font-mono text-[#A09888] tracking-wider">LOYALTY TIER</p>
            <p className="font-display italic text-[#D4A843] text-lg">{user.loyaltyTier}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono bg-[#D4A843]/20 text-[#D4A843] rounded">
              {user.loyaltyPoints.toLocaleString()} XP
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2">
        {user.role === 'student' && (
          <Link to="/dashboard" onClick={() => onMobileClose?.()}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors mb-0.5 ${
              location.pathname === '/dashboard'
                ? 'text-[#D4A843] bg-[#D4A843]/10 border-l-2 border-[#D4A843]'
                : 'text-[#A09888] hover:text-[#F0E8D8] hover:bg-white/5'}`}>
            <LayoutGrid className="size-4" /> Student Dashboard
          </Link>
        )}
        {NAV_ITEMS.map(item => {
          const allowed = item.roles.includes(user.role);
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => handleNav(item.path, item.roles)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded text-sm transition-colors mb-0.5 ${
                active ? 'text-[#D4A843] bg-[#D4A843]/10 border-l-2 border-[#D4A843]' :
                allowed ? 'text-[#A09888] hover:text-[#F0E8D8] hover:bg-white/5' :
                'text-[#3A3A42] cursor-not-allowed'}`}>
              <item.icon className="size-4" /> {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <button onClick={() => { onNewListing(); onMobileClose?.(); }}
          className="w-full py-2.5 text-xs font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded flex items-center justify-center gap-2 transition-colors">
          <Plus className="size-4" /> NEW LISTING
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#0D0D12] border-r border-[#1E1E2A] min-h-[calc(100vh-3.5rem)]">
        {sidebarContent}
      </aside>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={onMobileClose} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#0D0D12] border-r border-[#1E1E2A] overflow-y-auto">
            <div className="flex justify-end p-2">
              <button onClick={onMobileClose} className="p-2 text-[#A09888]" aria-label="Close sidebar"><X className="size-5" /></button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
