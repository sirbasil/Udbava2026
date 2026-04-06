import { motion } from 'framer-motion';
import { Shield, CheckCircle, FileText, Users } from 'lucide-react';

export default function Provenance() {
  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">Provenance</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">AUTHENTICATION & VERIFICATION PROTOCOL</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-10" />
        </motion.div>

        <div className="space-y-8">
          <section className="bg-[#111116] border border-[#2A2A36] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Our Verification Process</h2>
            </div>
            <p className="text-sm text-[#A09888] leading-relaxed mb-4">
              Every artifact listed on RetCom undergoes a rigorous verification process to ensure authenticity and quality.
              Our team of campus archivists reviews each submission before it appears on the Exchange.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '01', title: 'Submission', desc: 'Seller provides detailed photos, condition report, and provenance history.' },
                { step: '02', title: 'Review', desc: 'Our archivists verify authenticity, inspect images, and validate seller credentials.' },
                { step: '03', title: 'Certification', desc: 'Approved artifacts receive an authentication badge and are listed on the Exchange.' },
              ].map(s => (
                <div key={s.step} className="bg-[#0B0B0F] border border-[#2A2A36] rounded p-4">
                  <span className="text-2xl font-display font-bold text-[#D4A843]">{s.step}</span>
                  <h3 className="text-sm text-[#F0E8D8] font-semibold mt-2 mb-1">{s.title}</h3>
                  <p className="text-xs text-[#6B6358] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#111116] border border-[#2A2A36] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Condition Standards</h2>
            </div>
            <div className="space-y-3">
              {[
                { label: 'New', desc: 'Unused, with original packaging. No defects or signs of handling.', color: 'text-amber-400' },
                { label: 'Like New', desc: 'Minimal use with no visible wear. Includes all original components.', color: 'text-emerald-400' },
                { label: 'Good', desc: 'Normal use with minor cosmetic wear. Fully functional. May lack original packaging.', color: 'text-sky-400' },
                { label: 'Fair', desc: 'Visible wear and use marks. Functional but shows age. Priced accordingly.', color: 'text-zinc-400' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3 bg-[#0B0B0F] rounded p-3">
                  <span className={`text-xs font-mono font-semibold ${c.color} w-20 shrink-0`}>{c.label.toUpperCase()}</span>
                  <p className="text-sm text-[#A09888]">{c.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#111116] border border-[#2A2A36] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Dispute Resolution</h2>
            </div>
            <p className="text-sm text-[#A09888] leading-relaxed mb-3">
              In the rare case of a dispute, RetCom provides a fair resolution process. Both buyers and sellers can submit evidence within 7 days of delivery. Our team reviews all claims impartially.
            </p>
            <p className="text-sm text-[#A09888] leading-relaxed">
              For urgent concerns, flag the item through the Exchange or contact our support team directly.
            </p>
          </section>

          <section className="bg-[#111116] border border-[#2A2A36] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Seller Trust System</h2>
            </div>
            <p className="text-sm text-[#A09888] leading-relaxed">
              Every seller is linked to their verified student or staff ID. Seller ratings are based on transaction history, item accuracy, and buyer feedback. Repeated violations result in suspension from the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
