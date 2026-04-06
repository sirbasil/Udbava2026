import { TrendingUp, Package, Zap, Shield } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  trending: TrendingUp,
  package: Package,
  zap: Zap,
  shield: Shield,
};

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: string;
}

export function StatCard({ label, value, sub, icon }: StatCardProps) {
  const Icon = iconMap[icon] || Package;

  return (
    <div className="relative border border-[#2A2A36] bg-[#111116] p-5 group hover:border-[#D4A843]/30 transition-colors">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#D4A843]/50" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#D4A843]/50" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#D4A843]/50" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#D4A843]/50" />

      <p className="text-[10px] font-mono tracking-[0.15em] text-[#A09888] mb-2">{label}</p>
      <p className="text-3xl font-display font-bold text-[#F0E8D8] mb-2">{value}</p>
      <div className="flex items-center gap-1.5 text-xs text-[#D4A843]">
        <Icon className="size-3.5" />
        <span>{sub}</span>
      </div>
    </div>
  );
}
