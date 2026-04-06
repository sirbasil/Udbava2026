import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToastStore } from '@/stores/toastStore';
import { HelpCircle, MessageSquare, Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';

const FAQ = [
  {
    q: 'How do I list an item on the Exchange?',
    a: 'Navigate to the Exchange page and click "Submit Artefact", or use the "New Listing" button from your Dashboard sidebar. Fill in all required fields including 3 photos from different angles.',
  },
  {
    q: 'What does the "Claim Item" button do?',
    a: 'Claiming an item reserves it for purchase. The stock is decremented immediately and a transaction record is created. You will receive a confirmation notification.',
  },
  {
    q: 'How do loyalty points work?',
    a: 'You earn 10 XP per purchase and 5 XP per listing. Points accumulate to unlock tiers: Bronze (0), Silver (500), Gold (1000), and Platinum (2000). Higher tiers unlock perks like early access.',
  },
  {
    q: 'Can non-students use RetCom?',
    a: 'RetCom is restricted to SR University community. Students must use @sru.edu.in emails, and staff use @retcom.edu emails. External users cannot register.',
  },
  {
    q: 'How do I report a suspicious listing?',
    a: 'Click the "Report" button on any item listing modal. Our moderation team reviews all flagged items within 24 hours.',
  },
  {
    q: 'What happens if I receive a damaged item?',
    a: 'Submit a dispute through our Provenance page within 7 days of delivery. Provide photos and a description of the issue. Our team mediates all disputes fairly.',
  },
  {
    q: 'How do I access the Command Centre?',
    a: 'The Command Centre is available to Manager and Admin roles only. Students can access their Student Dashboard, which shows acquisitions, listings, and notifications.',
  },
];

export default function Support() {
  const { addToast } = useToastStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      addToast('Please fill in all required fields', 'warning');
      return;
    }
    addToast('Support ticket submitted. We will respond within 24 hours.', 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F]">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display italic text-4xl lg:text-5xl text-[#F0E8D8] mb-2">Support</h1>
          <p className="text-xs font-mono tracking-[0.2em] text-[#6B6358] mb-1">WE ARE HERE TO HELP</p>
          <div className="w-16 h-0.5 bg-[#D4A843] mb-10" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <HelpCircle className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-2">
              {FAQ.map((faq, i) => (
                <div key={i} className="bg-[#111116] border border-[#2A2A36] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left">
                    <span className="text-sm text-[#F0E8D8] font-medium pr-4">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp className="size-4 text-[#D4A843] shrink-0" />
                    ) : (
                      <ChevronDown className="size-4 text-[#6B6358] shrink-0" />
                    )}
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      className="px-4 pb-4">
                      <p className="text-sm text-[#A09888] leading-relaxed border-t border-[#2A2A36] pt-3">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <MessageSquare className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-xl text-[#F0E8D8]">Contact Us</h2>
            </div>
            <form onSubmit={handleSubmitContact} className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">NAME *</label>
                <input value={contactForm.name} onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors"
                  placeholder="Your name" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">EMAIL *</label>
                <input type="email" value={contactForm.email} onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors"
                  placeholder="you@sru.edu.in" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">SUBJECT</label>
                <input value={contactForm.subject} onChange={e => setContactForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors"
                  placeholder="What do you need help with?" />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">MESSAGE *</label>
                <textarea value={contactForm.message} onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] focus:border-[#D4A843] outline-none transition-colors resize-none"
                  placeholder="Describe your issue in detail..." />
              </div>
              <button type="submit"
                className="w-full py-2.5 text-sm font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors flex items-center justify-center gap-2">
                <Send className="size-4" /> SUBMIT TICKET
              </button>
            </form>

            <div className="bg-[#111116] border border-[#2A2A36] rounded-lg p-5 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="size-4 text-[#D4A843]" />
                <h3 className="text-xs font-mono text-[#A09888] tracking-wider">DIRECT CONTACT</h3>
              </div>
              <p className="text-sm text-[#A09888]">Email: <span className="text-[#D4A843]">support@retcom.edu</span></p>
              <p className="text-sm text-[#A09888] mt-1">Hours: Mon–Fri, 9 AM – 6 PM IST</p>
              <p className="text-sm text-[#A09888] mt-1">Response time: Within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
