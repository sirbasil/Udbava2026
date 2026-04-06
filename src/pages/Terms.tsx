import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing and using RetCom, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately. RetCom reserves the right to modify these terms at any time.',
  },
  {
    title: '2. Eligibility',
    content: 'RetCom is exclusively available to students and staff of SR University. Students must register with a valid @sru.edu.in email address. Staff members must use their @retcom.edu credentials. Unauthorized accounts will be terminated.',
  },
  {
    title: '3. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You must not share your account with others. Any activity under your account is your responsibility. Report unauthorized access immediately.',
  },
  {
    title: '4. Listings & Transactions',
    content: 'All listings must accurately describe the item being sold. Sellers must provide at least 3 images from different angles. Misrepresentation of item condition is grounds for account suspension. RetCom uses RC (RetCom Credits) as the platform currency.',
  },
  {
    title: '5. Prohibited Items',
    content: 'The following items may not be listed: counterfeit goods, stolen property, hazardous materials, controlled substances, weapons, and any items prohibited by SR University policy or applicable law.',
  },
  {
    title: '6. Intellectual Property',
    content: 'All content on RetCom, including the platform design, logos, and text, is the property of RetCom Digital Archive. Users retain ownership of their uploaded images and descriptions but grant RetCom a license to display them.',
  },
  {
    title: '7. Limitation of Liability',
    content: 'RetCom facilitates transactions between users but is not a party to any sale. We do not guarantee the quality, safety, or legality of listed items. Disputes between users should be resolved through our mediation process.',
  },
  {
    title: '8. Termination',
    content: 'RetCom may suspend or terminate accounts that violate these terms, engage in fraudulent activity, or receive multiple verified complaints. Terminated users may appeal through the support channel.',
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">Terms of Service</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">LAST UPDATED: APRIL 2026</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-10" />
        </motion.div>

        <div className="space-y-6">
          {SECTIONS.map(s => (
            <section key={s.title} className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5">
              <h2 className="font-display text-lg text-[#F0E8D8] mb-2">{s.title}</h2>
              <p className="text-sm text-[#A09888] leading-relaxed">{s.content}</p>
            </section>
          ))}
        </div>

        <p className="text-xs text-[#6B6358] text-center mt-10 font-mono">
          For questions about these terms, contact support@retcom.edu
        </p>
      </div>
    </div>
  );
}
