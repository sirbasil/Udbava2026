import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

type Tab = 'login' | 'register';

const DEMO_ACCOUNTS = [
  { label: 'Student', email: 'julian@sru.edu.in', pw: 'demo123', role: 'student' },
  { label: 'Manager', email: 'sarah@retcom.edu', pw: 'demo123', role: 'manager' },
  { label: 'Admin', email: 'sterling@retcom.edu', pw: 'demo123', role: 'admin' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const { addToast } = useToastStore();
  const [tab, setTab] = useState<Tab>('login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPw: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (tab === 'register' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (tab === 'register' && form.password !== form.confirmPw) e.confirmPw = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    setTimeout(() => {
      if (tab === 'login') {
        const result = login(form.email, form.password);
        if (result.success) {
          addToast('Welcome back to the archives', 'success');
          navigate('/');
        } else {
          setErrors({ general: result.error || 'Login failed' });
          addToast(result.error || 'Login failed', 'error');
        }
      } else {
        const result = register(form.name, form.email, form.password);
        if (result.success) {
          addToast('Account created! Welcome to RetCom.', 'success');
          navigate('/');
        } else {
          setErrors({ general: result.error || 'Registration failed' });
          addToast(result.error || 'Registration failed', 'error');
        }
      }
      setLoading(false);
    }, 600);
  };

  const handleDemo = (email: string, pw: string) => {
    setLoading(true);
    setTimeout(() => {
      const result = login(email, pw);
      if (result.success) {
        addToast('Demo login successful', 'success');
        navigate('/');
      } else {
        addToast('Demo login failed', 'error');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,168,67,0.08) 0%, transparent 60%)'
      }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <span className="font-display italic text-4xl text-[#D4A843]">RetCom</span>
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#6B6358] mt-1">DIGITAL ARCHIVE ACCESS</p>
        </Link>

        <div className="bg-[#111116] border border-[#2A2A36] rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#2A2A36]">
            {(['login', 'register'] as Tab[]).map(t => (
              <button key={t} onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-3 text-xs font-mono tracking-wider transition-colors ${
                  tab === t ? 'text-[#D4A843] border-b-2 border-[#D4A843]' : 'text-[#6B6358] hover:text-[#A09888]'}`}>
                {t === 'login' ? 'SIGN IN' : 'REGISTER'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errors.general && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded">{errors.general}</div>
            )}

            {tab === 'register' && (
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">FULL NAME</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors"
                  placeholder="Your full name" />
                {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">EMAIL</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors"
                placeholder="you@sru.edu.in" />
              {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">PASSWORD</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors pr-10"
                  placeholder="••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6358] hover:text-[#A09888]">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && <p className="text-[10px] text-red-400 mt-1">{errors.password}</p>}
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-[10px] font-mono text-[#A09888] mb-1.5 tracking-wider">CONFIRM PASSWORD</label>
                <input type="password" value={form.confirmPw} onChange={e => setForm(p => ({ ...p, confirmPw: e.target.value }))}
                  className="w-full bg-[#0B0B0F] border border-[#2A2A36] rounded px-3 py-2.5 text-sm text-[#F0E8D8] placeholder-[#6B6358] outline-none focus:border-[#D4A843] transition-colors"
                  placeholder="••••••" />
                {errors.confirmPw && <p className="text-[10px] text-red-400 mt-1">{errors.confirmPw}</p>}
              </div>
            )}

            {tab === 'register' && (
              <p className="text-[10px] text-[#6B6358]">
                Students: use your <span className="text-[#D4A843]">@sru.edu.in</span> email. Staff: use <span className="text-[#D4A843]">@retcom.edu</span>.
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 text-sm font-mono font-semibold tracking-wider bg-[#D4A843] text-[#0B0B0F] hover:bg-[#E8B84D] rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="size-4 border-2 border-[#0B0B0F] border-t-transparent rounded-full animate-spin" /> :
                <>{tab === 'login' ? 'ACCESS ARCHIVES' : 'CREATE ACCOUNT'} <ArrowRight className="size-4" /></>}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="border-t border-[#2A2A36] p-6">
            <p className="text-[10px] font-mono text-[#6B6358] tracking-wider mb-3 text-center">QUICK ACCESS — DEMO ACCOUNTS</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map(d => (
                <button key={d.role} onClick={() => handleDemo(d.email, d.pw)} disabled={loading}
                  className="flex-1 py-2 text-[10px] font-mono tracking-wider border border-[#2A2A36] text-[#A09888] hover:border-[#D4A843] hover:text-[#D4A843] rounded transition-colors disabled:opacity-50">
                  {d.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
