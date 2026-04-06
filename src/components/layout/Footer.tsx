import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { label: 'PROVENANCE', path: '/provenance' },
  { label: 'TERMS', path: '/terms' },
  { label: 'PRIVACY', path: '/privacy' },
  { label: 'SUPPORT', path: '/support' },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1E1E2A] bg-[#0B0B0F] mt-auto">
      <div className="px-6 py-8">
        <div className="flex justify-center gap-8 mb-5">
          {FOOTER_LINKS.map(l => (
            <Link key={l.label} to={l.path}
              className="text-[10px] font-mono tracking-[0.15em] text-[#6B6358] hover:text-[#D4A843] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="w-12 h-px bg-[#2A2A36] mx-auto mb-4" />
        <p className="text-center font-display italic text-[#D4A843] text-sm mb-2">RetCom Digital Archive</p>
        <p className="text-center text-[10px] font-mono text-[#6B6358] tracking-wider">
          © 1924-2024 RETCOM DIGITAL ARCHIVE. ALL RIGHTS RESERVED.
        </p>
        <div className="flex justify-center gap-1.5 mt-4">
          <div className="size-1.5 rounded-full bg-[#D4A843]" />
          <div className="size-1.5 rounded-full bg-[#6B6358]" />
          <div className="size-1.5 rounded-full bg-[#6B6358]" />
        </div>
      </div>
    </footer>
  );
}
