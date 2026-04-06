import { motion } from 'framer-motion';
import { Lock, Eye, Database, Trash2 } from 'lucide-react';

const SECTIONS = [
  {
    icon: Database,
    title: 'Data Collection',
    content: 'We collect your name, email address, and university affiliation when you register. Transaction data, listing details, and usage analytics are collected during platform use. Images uploaded for listings are stored securely.',
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    content: 'Your data is used to facilitate transactions, personalize your experience, calculate loyalty points, and improve platform functionality. We never sell your personal data to third parties. Aggregated, anonymized data may be used for campus research.',
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: 'All passwords are hashed using industry-standard encryption. Communications are protected via SSL/TLS. We implement role-based access controls to limit data exposure. Regular security audits are performed on our systems.',
  },
  {
    icon: Trash2,
    title: 'Data Retention & Deletion',
    content: 'Account data is retained as long as your account is active. Transaction records are kept for 2 years for dispute resolution. You can request account deletion through Settings — all personal data will be removed within 30 days.',
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">Privacy Policy</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">YOUR DATA, YOUR RIGHTS</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-10" />
        </motion.div>

        <div className="space-y-6">
          {SECTIONS.map(s => (
            <section key={s.title} className="bg-[#111116] border border-[#2A2A36] rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <s.icon className="size-5 text-[#D4A843]" />
                <h2 className="font-display text-xl text-[#F0E8D8]">{s.title}</h2>
              </div>
              <p className="text-sm text-[#A09888] leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>

        <div className="bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-lg p-5 mt-8">
          <h3 className="font-display text-lg text-[#D4A843] mb-2">Your Rights</h3>
          <ul className="space-y-1.5 text-sm text-[#A09888]">
            <li>• Access a copy of all personal data we hold about you</li>
            <li>• Request correction of inaccurate personal data</li>
            <li>• Request deletion of your account and all associated data</li>
            <li>• Opt out of non-essential data collection</li>
            <li>• File a complaint with the university data protection officer</li>
          </ul>
        </div>

        <p className="text-xs text-[#6B6358] text-center mt-10 font-mono">
          For privacy inquiries, contact privacy@retcom.edu
        </p>
      </div>
    </div>
  );
}
