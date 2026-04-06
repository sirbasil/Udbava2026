import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { StatCard } from '@/components/features/StatCard';
import { COMMAND_STATS, YIELD_DATA, SEED_INVENTORY, SEED_ALERTS, SEED_ACTIVITY } from '@/constants/mockData';
import { formatPrice } from '@/lib/utils';
import { AlertTriangle, Info } from 'lucide-react';

const inventoryStatusStyle: Record<string, string> = {
  stable: 'bg-emerald-500/20 text-emerald-400',
  in_transit: 'bg-sky-500/20 text-sky-400',
  low_stock: 'bg-amber-500/20 text-amber-400',
  depleted: 'bg-red-500/20 text-red-400',
};

const inventoryStatusLabel: Record<string, string> = {
  stable: 'STABLE',
  in_transit: 'IN TRANSIT',
  low_stock: 'LOW STOCK',
  depleted: 'DEPLETED',
};

const activityDot: Record<string, string> = {
  admin: 'bg-sky-400',
  system: 'bg-[#6B6358]',
  user: 'bg-[#D4A843]',
};

export default function CommandCentre() {
  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl lg:text-5xl text-[#F0E8D8] mb-1">Command Centre</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-8" />
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {COMMAND_STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
          {/* Yield Projections */}
          <div className="xl:col-span-8 bg-[#111116] border border-[#2A2A36] rounded p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl text-[#F0E8D8]">Yield Projections</h2>
                <p className="text-[10px] font-mono text-[#6B6358] tracking-wider mt-0.5">QUARTERLY PERFORMANCE MATRIX</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-[#D4A843] rounded-sm" />
                  <span className="text-[10px] font-mono text-[#D4A843]">PRIMARY</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-sky-500 rounded-sm" />
                  <span className="text-[10px] font-mono text-sky-400">SECONDARY</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={YIELD_DATA} barCategoryGap="20%">
                  <XAxis dataKey="month" tick={{ fill: '#6B6358', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2A2A36', borderRadius: 4, fontSize: 12, fontFamily: 'IBM Plex Mono' }}
                    itemStyle={{ color: '#F0E8D8' }}
                    labelStyle={{ color: '#A09888' }}
                  />
                  <Bar dataKey="primary" fill="#D4A843" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="secondary" fill="#42A5F5" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="xl:col-span-4 bg-[#111116] border border-[#2A2A36] rounded p-5">
            <h2 className="font-display text-xl text-[#F0E8D8] mb-4">Critical Alerts</h2>
            <div className="space-y-4">
              {SEED_ALERTS.map(alert => (
                <div key={alert.id} className="bg-[#0B0B0F] border border-[#2A2A36] rounded p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    {alert.type === 'stock_depletion' ? (
                      <AlertTriangle className="size-4 text-[#E53935]" />
                    ) : (
                      <Info className="size-4 text-[#D4A843]" />
                    )}
                    <span className={`text-[10px] font-mono font-bold tracking-wider ${alert.type === 'stock_depletion' ? 'text-[#E53935]' : 'text-[#D4A843]'}`}>
                      {alert.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#A09888] leading-relaxed">{alert.message}</p>
                  <p className="text-[10px] text-[#6B6358] mt-2 font-mono">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Inventory Manifest */}
          <div className="xl:col-span-7">
            <div className="bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-t px-5 py-3">
              <h3 className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#D4A843]">PRIMARY INVENTORY MANIFEST</h3>
            </div>
            <div className="bg-[#111116] border border-t-0 border-[#2A2A36] rounded-b overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A36]">
                    <th className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">REFERENCE ID</th>
                    <th className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">ASSET DESIGNATION</th>
                    <th className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">STATUS</th>
                    <th className="text-right text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">VALUATION</th>
                  </tr>
                </thead>
                <tbody>
                  {SEED_INVENTORY.map(inv => (
                    <tr key={inv.referenceId} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 text-sm font-mono text-[#6B6358]">{inv.referenceId}</td>
                      <td className="p-4 text-sm text-[#F0E8D8]">{inv.name}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm ${inventoryStatusStyle[inv.status]}`}>
                          {inventoryStatusLabel[inv.status]}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-mono text-[#F0E8D8] text-right tabular-nums">${formatPrice(inv.valuation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="xl:col-span-5 space-y-6">
            {/* Infrastructure Status */}
            <div className="relative rounded overflow-hidden h-48">
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=350&fit=crop"
                alt="Infrastructure"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] font-mono text-[#D4A843] tracking-wider">INFRASTRUCTURE STATUS</p>
                <p className="font-display text-lg text-[#F0E8D8]">Central Node: Active</p>
              </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
              <h3 className="text-xs font-mono font-bold tracking-[0.12em] text-[#A09888] mb-4">ACTIVITY STREAM</h3>
              <div className="space-y-4">
                {SEED_ACTIVITY.map(log => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={`size-2 rounded-full mt-1.5 shrink-0 ${activityDot[log.type]}`} />
                    <div>
                      <p className="text-xs text-[#A09888] leading-relaxed">
                        {log.highlight ? (
                          <>
                            {log.message.split(log.highlight)[0]}
                            <span className="text-[#D4A843] italic">{log.highlight}</span>
                            {log.message.split(log.highlight)[1]}
                          </>
                        ) : log.message}
                      </p>
                      <p className="text-[10px] text-[#6B6358] mt-0.5 font-mono">{log.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
