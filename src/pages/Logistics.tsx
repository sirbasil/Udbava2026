import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { useItemStore } from '@/stores/itemStore';
import { getTxStatusStyle, getTxStatusLabel } from '@/lib/utils';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const statusIcon: Record<string, React.ElementType> = {
  pending: Clock,
  in_transit: Truck,
  authenticated: CheckCircle,
  delivered: Package,
};

export default function Logistics() {
  const { transactions } = useItemStore();

  const statusCounts = transactions.reduce<Record<string, number>>((acc, tx) => {
    acc[tx.status] = (acc[tx.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl text-[#F0E8D8] mb-1">Logistics</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-6" />
        </motion.div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {['pending', 'in_transit', 'authenticated', 'delivered'].map(status => {
            const Icon = statusIcon[status] || Package;
            return (
              <div key={status} className="bg-[#111116] border border-[#2A2A36] rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="size-4 text-[#D4A843]" />
                  <span className="text-[10px] font-mono text-[#A09888] tracking-wider">{status.replace('_', ' ').toUpperCase()}</span>
                </div>
                <p className="text-3xl font-display font-bold text-[#F0E8D8]">{statusCounts[status] || 0}</p>
              </div>
            );
          })}
        </div>

        {/* Transaction Tracking */}
        <div className="bg-[#111116] border border-[#2A2A36] rounded overflow-hidden">
          <div className="bg-[#D4A843]/10 border-b border-[#D4A843]/30 px-5 py-3">
            <h3 className="text-[10px] font-mono font-bold tracking-[0.15em] text-[#D4A843]">SHIPMENT TRACKER</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-[#2A2A36]">
                  {['TRACKING ID', 'ARTIFACT', 'STATUS', 'PROVENANCE', 'DATE'].map(h => (
                    <th key={h} className="text-left text-[10px] font-mono tracking-[0.12em] text-[#A09888] p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b border-[#1E1E2A] hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-sm font-mono text-[#6B6358]">{tx.id}</td>
                    <td className="p-4 text-sm text-[#F0E8D8]">{tx.itemName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded-sm ${getTxStatusStyle(tx.status)}`}>
                        {getTxStatusLabel(tx.status)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#6B6358] italic">{tx.provenance}</td>
                    <td className="p-4 text-xs font-mono text-[#6B6358]">{tx.createdAt}</td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-[#6B6358]">No shipments to track</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
