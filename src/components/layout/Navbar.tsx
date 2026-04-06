import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Camera, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useItemStore } from '@/stores/itemStore';
import { NAV_LINKS } from '@/constants/config';
import { useToastStore } from '@/stores/toastStore';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { notifications, markAllRead, unreadCount } = useNotificationStore();
  const { searchQuery, setSearchQuery } = useItemStore();
  const { addToast } = useToastStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const isExchange = location.pathname === '/exchange';

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = (path: string) => {
    if (path === '/dashboard') {
      if (!isAuthenticated) {
        navigate('/login');
        setMobileOpen(false);
        return;
      }
      if (user && (user.role === 'manager' || user.role === 'admin')) {
        navigate('/command-centre');
        setMobileOpen(false);
        return;
      }
    }
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    addToast('Logged out successfully', 'info');
    navigate('/');
  };

  const count = unreadCount();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0F]/95 backdrop-blur-md border-b border-[#1E1E2A]">
      <nav className="flex items-center justify-between px-4 lg:px-8 h-14">
        <Link to="/" className="font-display italic text-xl text-[#D4A843] font-bold shrink-0">RetCom</Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => handleNavClick(l.path)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors ${location.pathname === l.path ? 'text-[#D4A843]' : 'text-[#A09888] hover:text-[#F0E8D8]'}`}>
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isExchange && (
            <div className="hidden sm:flex items-center bg-[#141418] border border-[#2A2A36] rounded px-3 py-1.5 gap-2 w-56">
              <Search className="size-3.5 text-[#6B6358]" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search the archives..."
                className="bg-transparent text-xs text-[#F0E8D8] placeholder-[#6B6358] outline-none w-full" />
            </div>
          )}

          <button onClick={() => {
            if (!isAuthenticated) { navigate('/login'); return; }
            addToast('Camera capture — use New Listing to upload item photos', 'info');
          }} className="p-2 text-[#A09888] hover:text-[#D4A843] transition-colors" aria-label="Camera">
            <Camera className="size-4" />
          </button>

          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)} className="p-2 text-[#A09888] hover:text-[#D4A843] transition-colors relative" aria-label="Notifications">
              <Bell className="size-4" />
              {count > 0 && <span className="absolute top-1 right-1 size-2 bg-[#D4A843] rounded-full" />}
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 bg-[#141418] border border-[#2A2A36] rounded-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#2A2A36]">
                  <span className="text-xs font-mono text-[#A09888]">NOTIFICATIONS</span>
                  <button onClick={markAllRead} className="text-[10px] font-mono text-[#D4A843] hover:underline">MARK ALL READ</button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n.id} className={`px-3 py-2.5 border-b border-[#1E1E2A] ${!n.read ? 'bg-[#D4A843]/5' : ''}`}>
                      <p className="text-xs text-[#F0E8D8] font-medium">{n.title}</p>
                      <p className="text-[11px] text-[#6B6358] mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && user ? (
            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="size-8 rounded-full overflow-hidden border-2 border-[#2A2A36] hover:border-[#D4A843] transition-colors">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#141418] border border-[#2A2A36] rounded-lg shadow-2xl overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-[#2A2A36]">
                    <p className="text-sm text-[#F0E8D8] font-medium">{user.name}</p>
                    <p className="text-[10px] font-mono text-[#D4A843]">{user.role.toUpperCase()}</p>
                  </div>
                  <button onClick={() => { navigate('/dashboard'); setProfileOpen(false); }}
                    className="w-full px-3 py-2 text-xs text-left text-[#A09888] hover:text-[#F0E8D8] hover:bg-white/5 transition-colors">Dashboard</button>
                  <button onClick={handleLogout}
                    className="w-full px-3 py-2 text-xs text-left text-red-400 hover:bg-red-500/5 transition-colors flex items-center gap-2">
                    <LogOut className="size-3" /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="size-8 rounded-full bg-[#D4A843] flex items-center justify-center text-[#0B0B0F] hover:bg-[#E8B84D] transition-colors">
              <span className="text-xs font-bold">RC</span>
            </Link>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#A09888]" aria-label="Menu">
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#1E1E2A] bg-[#0B0B0F] px-4 pb-4">
          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => handleNavClick(l.path)}
              className={`block w-full text-left py-2.5 text-sm font-mono ${location.pathname === l.path ? 'text-[#D4A843]' : 'text-[#A09888]'}`}>
              {l.label}
            </button>
          ))}
          {isExchange && (
            <div className="flex items-center bg-[#141418] border border-[#2A2A36] rounded px-3 py-2 gap-2 mt-2">
              <Search className="size-3.5 text-[#6B6358]" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
                className="bg-transparent text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none w-full" />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
