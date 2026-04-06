import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <p className="font-display italic text-8xl text-[#D4A843] mb-4">404</p>
        <h1 className="font-display text-2xl text-[#F0E8D8] mb-2">Archive Not Found</h1>
        <p className="text-sm text-[#6B6358] mb-8 leading-relaxed">
          The artifact you seek has been lost to the archives. It may have been relocated or never existed in our records.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors">
            <Home className="size-4" /> RETURN HOME
          </Link>
          <Link to="/exchange"
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-wider border border-[#2A2A36] text-[#A09888] hover:border-[#D4A843] hover:text-[#D4A843] rounded transition-colors">
            <ArrowLeft className="size-4" /> EXCHANGE
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
