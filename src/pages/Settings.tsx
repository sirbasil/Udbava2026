import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { User, Shield, Bell, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();
  const [name, setName] = useState(user?.name || '');
  const [notifications, setNotifications] = useState({
    orders: true,
    market: true,
    alerts: false,
  });

  const handleSave = () => {
    addToast('Settings saved successfully', 'success');
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl text-[#F0E8D8] mb-1">Settings</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
          {/* Profile */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <div className="flex items-center gap-2 mb-4">
              <User className="size-4 text-[#D4A843]" />
              <h3 className="text-xs font-mono tracking-wider text-[#A09888]">PROFILE</h3>
            </div>
            <div className="flex items-center gap-4 mb-5">
              <img src={user.avatar} alt={user.name} className="size-16 rounded-full object-cover border-2 border-[#2A2A36]" />
              <div>
                <p className="text-sm text-[#F0E8D8] font-semibold">{user.name}</p>
                <p className="text-xs text-[#6B6358] font-mono">{user.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-mono bg-[#D4A843]/20 text-[#D4A843] rounded">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">DISPLAY NAME</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] focus:border-[#D4A843] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">EMAIL</label>
                <input value={user.email} disabled
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#6B6358] cursor-not-allowed" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-4 text-[#D4A843]" />
              <h3 className="text-xs font-mono tracking-wider text-[#A09888]">SECURITY</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">CURRENT PASSWORD</label>
                <input type="password" placeholder="••••••"
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5">NEW PASSWORD</label>
                <input type="password" placeholder="••••••"
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="size-4 text-[#D4A843]" />
              <h3 className="text-xs font-mono tracking-wider text-[#A09888]">NOTIFICATIONS</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(notifications).map(([key, val]) => (
                <label key={key} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-[#A09888] capitalize">{key.replace('_', ' ')} Notifications</span>
                  <button onClick={() => setNotifications(p => ({ ...p, [key]: !val }))}
                    className={`w-10 h-5 rounded-full transition-colors relative ${val ? 'bg-[#D4A843]' : 'bg-[#2A2A36]'}`}>
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${val ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="size-4 text-[#D4A843]" />
              <h3 className="text-xs font-mono tracking-wider text-[#A09888]">ACCOUNT INFO</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#6B6358]">Member Since</span><span className="text-[#F0E8D8] font-mono">{user.joinedAt}</span></div>
              <div className="flex justify-between"><span className="text-[#6B6358]">Loyalty Points</span><span className="text-[#D4A843] font-mono">{user.loyaltyPoints} XP</span></div>
              <div className="flex justify-between"><span className="text-[#6B6358]">Tier</span><span className="text-[#F0E8D8]">{user.loyaltyTier}</span></div>
            </div>
          </div>
        </div>

        <button onClick={handleSave}
          className="mt-6 px-8 py-2.5 text-sm font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors">
          SAVE CHANGES
        </button>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
