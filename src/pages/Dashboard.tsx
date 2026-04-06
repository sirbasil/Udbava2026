import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { ClaimItemModal } from '@/components/features/ClaimItemModal';
import { useAuthStore } from '@/stores/authStore';
import { useItemStore } from '@/stores/itemStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { getTxStatusStyle, getTxStatusLabel } from '@/lib/utils';
import type { Item } from '@/types';
import { Eye, CheckSquare, Square } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { transactions, items } = useItemStore();
  const { notifications } = useNotificationStore();
  const [claimItem, setClaimItem] = useState<Item | null>(null);

  if (!user) return null;

  // If manager/admin, redirect to command centre
  if (user.role !== 'student') {
    navigate('/command-centre', { replace: true });
    return null;
  }

  const myTransactions = transactions.filter(t => t.buyerId === user.id).slice(0, 5);
  const myListings = items.filter(i => i.sellerId === user.id).slice(0, 4);

  return (
    <ProtectedRoute allowedRoles={['student', 'manager', 'admin']}>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl lg:text-5xl text-[#F0E8D8] mb-1">Student Dashboard</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Recent Acquisitions */}
          <div className="xl:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display italic text-xl text-[#F0E8D8]">Recent Acquisitions</h2>
              <button onClick={() => navigate('/exchange')}
                className="px-3 py-1.5 text-[10px] font-mono tracking-wider border border-[#D4A843]/40 text-[#D4A843] hover:bg-[#D4A843]/10 transition-colors">
                VIEW ARCHIVE
              </button>
            </div>
            <div className="border border-[#2A2A36] bg-[#111116] rounded overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A36]">
                    <th className="text-left text-[10px] font-mono tracking-[0.15em] text-[#A09888] p-4">TRANSACTION ID</th>
                    <th className="text-left text-[10px] font-mono tracking-[0.15em] text-[#A09888] p-4">ARTIFACT NAME</th>
                    <th className="text-left text-[10px] font-mono tracking-[0.15em] text-[#A09888] p-4">STATUS</th>
                    <th className="text-left text-[10px] font-mono tracking-[0.15em] text-[#A09888] p-4 hidden sm:table-cell">PROVENANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {myTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm font-mono text-[#6B6358]">{tx.id}</td>
                      <td className="p-4 text-sm text-[#F0E8D8]">{tx.itemName}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm ${getTxStatusStyle(tx.status)}`}>
                          {getTxStatusLabel(tx.status)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-[#6B6358] italic hidden sm:table-cell">{tx.provenance}</td>
                    </tr>
                  ))}
                  {myTransactions.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-sm text-[#6B6358]">No acquisitions yet. Visit the Exchange to claim artifacts.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Listings */}
          <div className="xl:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display italic text-xl text-[#F0E8D8]">My Listings</h2>
              <span className="font-display text-2xl text-[#D4A843]">{String(myListings.length).padStart(2, '0')}</span>
            </div>
            <div className="space-y-3">
              {myListings.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-[#111116] border border-[#2A2A36] rounded p-3 hover:border-[#D4A843]/20 transition-colors">
                  <img src={item.images[0]} alt={item.name} className="size-12 rounded object-cover grayscale" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F0E8D8] font-medium truncate">{item.name}</p>
                    <p className="text-[10px] font-mono text-[#D4A843]">
                      {item.stock > 0 ? `ACTIVE BID: ${item.price} RC` : 'SOLD OUT'}
                    </p>
                  </div>
                </div>
              ))}
              {myListings.length === 0 && (
                <div className="text-center py-8 text-sm text-[#6B6358] bg-[#111116] border border-[#2A2A36] rounded">
                  No listings yet
                </div>
              )}
            </div>
          </div>

          {/* Transmission Logs */}
          <div className="xl:col-span-8">
            <h2 className="font-display italic text-xl text-[#F0E8D8] mb-4 flex items-center gap-3">
              Transmission Logs
              <span className="text-[#6B6358]"><Eye className="size-5" /></span>
            </h2>
            <div className="bg-[#111116] border border-[#2A2A36] rounded p-4 space-y-3">
              {[
                { label: 'ORDER DISPATCHES', checked: true },
                { label: 'MARKET VOLATILITY', checked: true },
                { label: 'ARTIFACT ALERTS', checked: false },
              ].map(log => (
                <div key={log.label} className="flex items-center justify-between py-1">
                  <span className="text-xs font-mono tracking-wider text-[#A09888]">{log.label}</span>
                  {log.checked ? (
                    <CheckSquare className="size-5 text-[#D4A843]" />
                  ) : (
                    <Square className="size-5 text-[#2A2A36]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notifications Panel */}
          <div className="xl:col-span-4">
            <h2 className="font-display italic text-xl text-[#F0E8D8] mb-4">Notifications</h2>
            <div className="space-y-2">
              {notifications.slice(0, 4).map(n => (
                <div key={n.id} className={`bg-[#111116] border border-[#2A2A36] rounded p-3 ${!n.read ? 'border-l-2 border-l-[#D4A843]' : ''}`}>
                  <p className="text-xs text-[#F0E8D8] font-medium">{n.title}</p>
                  <p className="text-[11px] text-[#6B6358] mt-0.5">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ClaimItemModal item={claimItem} isOpen={!!claimItem} onClose={() => setClaimItem(null)} />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
