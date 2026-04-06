import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { useItemStore } from '@/stores/itemStore';

const COLORS = ['#D4A843', '#42A5F5', '#4CAF50', '#FF9800', '#E53935', '#AB47BC', '#26A69A'];

const monthlyRevenue = [
  { month: 'Jul', revenue: 18200 }, { month: 'Aug', revenue: 22400 },
  { month: 'Sep', revenue: 19800 }, { month: 'Oct', revenue: 31200 },
  { month: 'Nov', revenue: 28600 }, { month: 'Dec', revenue: 25100 },
];

export default function Analytics() {
  const { items, transactions } = useItemStore();

  const categoryData = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      const cat = item.category.replace('_', ' ');
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const conditionData = Object.entries(
    items.reduce<Record<string, number>>((acc, item) => {
      acc[item.condition] = (acc[item.condition] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name: name.replace('_', ' ').toUpperCase(), count }));

  const totalRevenue = transactions.reduce((s, t) => s + t.amount, 0);
  const avgPrice = items.length > 0 ? items.reduce((s, i) => s + i.price, 0) / items.length : 0;

  return (
    <ProtectedRoute allowedRoles={['manager', 'admin']}>
      <DashboardLayout>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl text-[#F0E8D8] mb-1">Analytics</h1>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-6" />
        </motion.div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Items', value: items.length },
            { label: 'Transactions', value: transactions.length },
            { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}` },
            { label: 'Avg Price', value: `${Math.round(avgPrice)} RC` },
          ].map(s => (
            <div key={s.label} className="bg-[#111116] border border-[#2A2A36] rounded p-4">
              <p className="text-[10px] font-mono text-[#6B6358] tracking-wider">{s.label.toUpperCase()}</p>
              <p className="text-2xl font-display font-bold text-[#F0E8D8] mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <h3 className="font-display text-lg text-[#F0E8D8] mb-4">Revenue Trend</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <XAxis dataKey="month" tick={{ fill: '#6B6358', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2A2A36', borderRadius: 4, fontSize: 12 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#D4A843" strokeWidth={2} dot={{ fill: '#D4A843', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
            <h3 className="font-display text-lg text-[#F0E8D8] mb-4">Category Distribution</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2A2A36', borderRadius: 4, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Condition Breakdown */}
        <div className="bg-[#111116] border border-[#2A2A36] rounded p-5">
          <h3 className="font-display text-lg text-[#F0E8D8] mb-4">Condition Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditionData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: '#A09888', fontSize: 10, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#1C1C28', border: '1px solid #2A2A36', borderRadius: 4, fontSize: 12 }} />
                <Bar dataKey="count" fill="#D4A843" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
