/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { generateOutreachDM, generateClientPersona, generateObjectionResponse, generateContentIdeas, generateFollowUpSequence } from './services/geminiService';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Users, 
  DollarSign, 
  Briefcase, 
  Search, 
  Brain, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Zap, 
  ShieldAlert,
  Send,
  ExternalLink,
  Menu,
  X,
  TrendingUp,
  Target,
  ArrowUpRight,
  Info,
  Lightbulb,
  BarChart3,
  PieChart as PieChartIcon,
  Layers,
  Film,
  Play,
  Sparkles,
  Lock,
  Clock,
  Share2,
  Globe2,
  AlertTriangle,
  FileText,
  Copy,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { cn } from './lib/utils';
import { useLocalStorage } from './lib/useLocalStorage';
import { 
  ROADMAP_DATA, 
  DM_TEMPLATES, 
  TOOLS, 
  PLATFORMS, 
  OUTREACH_METHODS, 
  OUTREACH_CHALLENGES, 
  PROJECT_TEMPLATES,
  NICHES,
  FOLLOW_UP_SEQUENCES,
  OBJECTIONS,
  PORTFOLIO_CHECKLIST,
  INITIAL_INTL_RATES,
  BASE_DM_TEMPLATES,
  WEEK2_ROADMAP_DATA
} from './data';
import { 
  Task, 
  DayPlan, 
  Client, 
  Transaction, 
  Tool, 
  Platform, 
  OutreachMethod, 
  OutreachChallenge, 
  ProjectTemplate,
  UserProfile,
  RatePackage,
  FollowUpStep,
  Objection
} from './types';
import { auth, db } from './lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useFirestore, useRoadmap, useProfile, useWeek2Roadmap } from './lib/useFirestore';


// --- License Keys ---
const VALID_LICENSE_KEYS = [
  "DMP-55E2413E-3B27", "DMP-DF0B8505-DF71", "DMP-D971EA4E-0447",
  "DMP-72B94FA0-E221", "DMP-B7AEDC95-684A", "DMP-5180B3B7-D2A6",
  "DMP-456E7DA5-378D", "DMP-1FA965EE-8C6E", "DMP-CFF04F42-C86D",
  "DMP-B18B8F44-EC85", "DMP-D6E787A6-383C", "DMP-9BE95289-95EC",
  "DMP-CB34907A-5263", "DMP-E0728BC8-A9BC", "DMP-DB8117AF-205D",
  "DMP-21278DE2-EACF", "DMP-CCFB0343-CBBD", "DMP-D9D4C4BD-6148",
  "DMP-8F9B54FB-3417", "DMP-30E6B4DE-1251", "DMP-8F3ABBE6-00A5",
  "DMP-CA1A796B-8F3E", "DMP-FADF88A5-54E3", "DMP-13DCF8DC-14D7",
  "DMP-77911D12-E0AD", "DMP-7BB94B39-337F", "DMP-9A9E0D88-B358",
  "DMP-7C37785D-391E", "DMP-28DFD7EE-8365", "DMP-56BAFC18-EF82",
  "DMP-07D171E1-CAB8", "DMP-79720DC4-4424", "DMP-52F17B6F-4213",
  "DMP-3ACC3A71-C5D5", "DMP-3F405711-7A99", "DMP-F0664F40-18C4",
  "DMP-B251F535-B3C5", "DMP-7CDA5775-22CE", "DMP-FA72CF4E-1046",
  "DMP-B6E27C16-FCE0", "DMP-192764EB-FABA", "DMP-2BFACB52-CF98",
  "DMP-7608B4F5-4C61", "DMP-4DA5594A-CE9F", "DMP-B417E160-B7CF",
  "DMP-5CD48A43-4544", "DMP-8D4F958A-D069", "DMP-880E948D-40E0",
  "DMP-FB381547-7FE2", "DMP-D1AB9D6C-8EAD",
  "T7YA9-XYM04-4KOHP-9KK4I-BAQQQ", "MENN-HQ0001-FREE"
];

// --- License Gate Component ---
const LicenseGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async () => {
    setChecking(true);
    setError('');
    try {
      const trimmed = key.trim().toUpperCase();

      // Step 1: Check valid key list
      if (!VALID_LICENSE_KEYS.includes(trimmed)) {
        setError('Invalid license key. Purchase access at the link below.');
        setChecking(false);
        return;
      }

      // Step 2: Check Firebase if already used
      const keyRef = doc(db, 'licenseKeys', trimmed);
      const keySnap = await getDoc(keyRef);

      if (keySnap.exists() && keySnap.data().used) {
        setError('This key is already activated on another device. Contact support.');
        setChecking(false);
        return;
      }

      // Step 3: Mark as used in Firebase
      await setDoc(keyRef, {
        used: true,
        activatedAt: new Date().toISOString(),
        deviceInfo: navigator.userAgent.slice(0, 100)
      });

      // Step 4: Unlock
      localStorage.setItem('dm_license_key', trimmed);
      onUnlock();

    } catch (e) {
      console.error(e);
      setError('Connection error. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_0%,_rgba(16,185,129,0.1),_transparent_70%)]">
      <div className="max-w-md w-full space-y-10 text-center relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="space-y-4">
          <div className="inline-flex p-4 bg-zinc-900 ring-1 ring-white/10 rounded-3xl mb-4">
            <Lock className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-5xl font-black text-white italic tracking-tight uppercase leading-none">
            DM<span className="text-emerald-500">.</span>PROTOCOL
          </h1>
          <p className="text-zinc-500 text-base font-medium">
            Enter your license key to access the system.
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="DMP-XXXXXXXX-XXXX"
            className="w-full h-16 bg-zinc-900 border border-white/10 rounded-2xl px-6 text-white font-mono text-center text-lg tracking-widest focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
          />
          {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={checking || !key.trim()}
            className="w-full h-16 bg-emerald-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {checking ? (
              <div className="w-5 h-5 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            ) : (
              <><Zap className="w-5 h-5" /> Unlock Access</>
            )}
          </button>
          <p className="text-zinc-700 text-xs">
            No key?{' '}
            <a href="https://client-forgex.vercel.app" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
              Purchase here →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Auth Component ---

const Login = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_0%,_rgba(16,185,129,0.1),_transparent_70%)]">
      <div className="max-w-md w-full space-y-12 text-center relative">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-zinc-900 ring-1 ring-white/10 rounded-3xl glow-emerald mb-8">
            <Zap className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-6xl font-black text-white font-display italic tracking-tight uppercase leading-none">
            DM<span className="text-emerald-500">.</span>PROTOCOL
          </h1>
          <p className="text-zinc-500 text-lg font-medium tracking-tight">
            Authorization Required. Access the proprietary client acquisition engine.
          </p>
        </div>

        <button 
          onClick={signInWithGoogle}
          className="w-full h-20 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group"
        >
          <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 rounded-lg group-hover:bg-emerald-500 transition-colors">
            <Target className="w-4 h-4 text-white group-hover:text-black" />
          </div>
          Sign In with Google
        </button>

        <div className="pt-12 flex items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1 italic">Status</p>
            <p className="text-xs font-mono font-bold text-red-500/50 uppercase">Ready</p>
          </div>
          <div className="w-px h-10 bg-white/5" />
          <div className="text-center">
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1 italic">Security</p>
            <p className="text-xs font-mono font-bold text-zinc-500 uppercase">Secure Login</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Components ---

const ProgressBar = ({ progress, color = "bg-emerald-500" }: { progress: number, color?: string }) => (
  <div className="w-full bg-zinc-900/80 rounded-full h-1 overflow-hidden ring-1 ring-white/5">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full relative overflow-hidden", color)}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_2s_infinite]" />
    </motion.div>
  </div>
);

const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) => (
  <div 
    {...props} 
    className={cn(
      "relative group transition-all duration-500",
      "p-8 rounded-[32px] bg-zinc-950/80 border border-white/5",
      "hover:border-emerald-500/20 hover:shadow-[0_20px_80px_-20px_rgba(16,185,129,0.1)]",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] pointer-events-none" />
    {children}
  </div>
);

const SectionHeading = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon: any }) => (
  <div className="mb-16 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-1 hidden md:block bg-emerald-500/30 rounded-full" />
      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] font-mono leading-none">Access: Authorized</span>
    </div>
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-900 ring-1 ring-white/10 rounded-2xl glow-emerald shrink-0">
            <Icon className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white font-display leading-[0.9] italic uppercase">
            {title}<span className="text-emerald-500">.</span>
          </h1>
        </div>
        {subtitle && <p className="text-zinc-500 text-lg md:text-xl font-medium leading-relaxed max-w-xl">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-6 pb-2">
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1 italic">Version</p>
          <p className="text-xs font-mono font-bold text-emerald-500/50 uppercase">v1.0</p>
        </div>
        <div className="w-px h-10 bg-white/5" />
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-1 italic">System</p>
          <p className="text-xs font-mono font-bold text-zinc-500 uppercase">7-Day System</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Sections ---

const Dashboard = ({ roadmapState, clients, transactions, setActiveTab }: any) => {
  const completedTasks = useMemo(() => {
    let count = 0;
    roadmapState.forEach((day: DayPlan) => {
      day.tasks.forEach((t: Task) => { if (t.completed) count++; });
    });
    return count;
  }, [roadmapState]);

  const totalTasks = useMemo(() => {
    let count = 0;
    roadmapState.forEach((day: DayPlan) => count += day.tasks.length);
    return count;
  }, [roadmapState]);

  const totalEarned = useMemo(() => {
    return transactions
      .filter((t: Transaction) => t.type === 'income')
      .reduce((acc: number, t: Transaction) => acc + t.amount, 0);
  }, [transactions]);

  const overallProgress = Math.round((completedTasks / totalTasks) * 100) || 0;

  const outreachStats = useMemo(() => {
    const contacted = clients.filter((c: Client) => c.status !== 'Cold').length;
    const replied = clients.filter((c: Client) => c.status === 'Replied' || c.status === 'Closed').length;
    const closed = clients.filter((c: Client) => c.status === 'Closed').length;
    
    return { contacted, replied, closed };
  }, [clients]);

  const handleResume = () => {
    const incompleteDayIndex = roadmapState.findIndex((d: any) => d.tasks.some((t: any) => !t.completed));
    const dayToScroll = incompleteDayIndex !== -1 ? incompleteDayIndex + 1 : 7;
    
    setActiveTab('roadmap');
    
    setTimeout(() => {
      const element = document.getElementById(`day-${dayToScroll}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Dashboard" 
        subtitle="Operational overview of your outreach engine. All systems nominal. Proceed to maximize output."
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Card className="flex flex-col justify-between group/stat overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/stat:opacity-20 transition-opacity">
            <Zap className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 font-mono italic">Efficiency Index</p>
            <div className="flex items-baseline gap-3">
              <h3 className="text-6xl font-black text-white font-display tracking-tighter leading-none italic">{completedTasks}</h3>
              <p className="text-zinc-700 text-sm font-black uppercase tracking-widest font-mono">/ {totalTasks} ops</p>
            </div>
          </div>
          <div className="mt-12 relative">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Daily System</span>
              <span className="text-xs font-mono font-bold text-emerald-500">{Math.round((completedTasks/totalTasks)*100)}%</span>
            </div>
            <ProgressBar progress={(completedTasks/totalTasks)*100} color="bg-emerald-500" />
          </div>
        </Card>

        <Card className="flex flex-col justify-between group/stat overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/stat:opacity-20 transition-opacity">
            <Target className="w-16 h-16 text-blue-500" />
          </div>
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-mono italic">Market Penetration</p>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 ring-1 ring-blue-500/30">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Tracking</span>
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-6xl font-black text-blue-400 font-display tracking-tighter leading-none italic">{outreachStats.closed}</h3>
              <p className="text-zinc-700 text-sm font-black uppercase tracking-widest font-mono">Closures</p>
            </div>
          </div>
          <div className="mt-12 relative space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-none">Response Flux: {outreachStats.replied}</span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">{outreachStats.contacted > 0 ? Math.round((outreachStats.replied / outreachStats.contacted) * 100) : 0}% Yield</span>
            </div>
            <div className="flex gap-2 h-1.5">
               <div className="flex-[2] bg-zinc-900 rounded-full h-full ring-1 ring-white/5 overflow-hidden">
                  <div className="h-full bg-blue-500/40 w-full" />
               </div>
               <div className="flex-[3] bg-zinc-900 rounded-full h-full ring-1 ring-white/5 overflow-hidden">
                  <div className="h-full bg-emerald-500/40 w-full shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
               </div>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-between group/stat overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/stat:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-emerald-500" />
          </div>
          <div className="relative">
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-mono italic mb-4">Capital Generation</p>
            <h3 className="text-5xl font-black text-white font-display tracking-tighter italic leading-none truncate">${totalEarned.toLocaleString()}</h3>
          </div>
          <div className="mt-12 relative">
             <div className="flex justify-between items-center mb-3">
               <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Growth Vector</span>
               <span className="text-xs font-mono font-bold text-emerald-400">+{Math.round((totalEarned / 1000) * 100)}%</span>
             </div>
             <ProgressBar progress={(totalEarned/1000)*100} color="bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
          </div>
        </Card>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-emerald-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
        <div className="relative bg-zinc-950/90 border border-white/5 rounded-[32px] p-12 flex flex-col md:flex-row items-center justify-between gap-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(16,185,129,0.05),_transparent_70%)] -z-10"></div>
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] font-mono">
              Engine Status: Optimized
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white font-display italic tracking-tight leading-[0.9] uppercase">The Performance <span className="text-emerald-500">Roadmap.</span></h2>
            <p className="text-zinc-500 text-xl font-medium leading-relaxed">Execute the next high-leverage task to force your first client win. High-value results demand radical intentionality.</p>
            <div className="flex items-center gap-8">
              <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="stroke-zinc-900"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${overallProgress}, 100` }}
                      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                      className="stroke-emerald-500"
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl font-black text-white font-display italic leading-none">{overallProgress}<span className="text-[12px] font-bold text-emerald-500/50 not-italic ml-0.5">%</span></p>
                  </div>
              </div>
              <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse"></div>
                   <p className="text-xs font-black text-zinc-300 uppercase tracking-widest italic">Progress Saved</p>
                 </div>
                 <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest font-mono">Est. Completion: 96:00:00</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleResume}
            className="relative group/btn h-20 px-12 bg-white text-black rounded-[24px] font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] shrink-0 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Continue Day {roadmapState.findIndex((d: any) => d.tasks.some((t: any) => !t.completed)) + 1 || 7}
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/40 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const Roadmap = ({ roadmapState, toggleTask }: { roadmapState: DayPlan[], toggleTask: (dayIndex: number, taskId: string) => void }) => {
  return (
    <div className="space-y-16">
      <SectionHeading 
        title="7-Day Plan" 
        subtitle="A high-velocity operational plan designed for immediate market penetration. Execute every cycle."
        icon={Map}
      />
      
      <div className="space-y-24 relative">
        {roadmapState.map((day: DayPlan, idx: number) => {
          const completedCount = day.tasks.filter(t => t.completed).length;
          const progress = (completedCount / day.tasks.length) * 100;

          return (
            <motion.div 
              key={day.day}
              id={`day-${day.day}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-72 shrink-0">
                  <div className="relative group/day">
                    <div className="absolute -inset-2 bg-emerald-500/20 blur-xl opacity-0 group-hover/day:opacity-100 transition-opacity"></div>
                    <div 
                      className="relative w-20 h-20 rounded-[24px] flex items-center justify-center text-3xl font-black text-white font-display italic transition-transform group-hover/day:scale-110"
                      style={{ backgroundColor: day.color }}
                    >
                      0{day.day}
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{day.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-mono italic">{day.theme}</p>
                  </div>
                  
                  <div className="mt-10 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      <span>Save Progress</span>
                      <span className="font-mono">{Math.round(progress)}%</span>
                    </div>
                    <ProgressBar progress={progress} color="bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                  </div>
                </div>

                <div className="flex-1 space-y-8">
                  <div className="bg-zinc-950/80 border border-white/5 rounded-[40px] p-8 space-y-4 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-6 py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-[20px] border-b border-l border-red-500/20">
                      DAILY MINIMUM: 20 DMs
                    </div>
                    {day.tasks.map((task) => (
                      <div 
                        key={task.id}
                        onClick={() => toggleTask(idx, task.id)}
                        className={cn(
                          "group/task flex items-center gap-6 p-6 rounded-[24px] cursor-pointer transition-all duration-300",
                          task.completed 
                            ? "bg-emerald-500/5 border border-emerald-500/20" 
                            : "bg-black/40 border border-transparent hover:bg-white/5 hover:border-white/10"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                          task.completed ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-zinc-900 ring-1 ring-white/5 group-hover/task:ring-white/20"
                        )}>
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-black" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-700 group-hover/task:text-zinc-500" />
                          )}
                        </div>
                        <span className={cn(
                          "text-xl font-medium transition-all duration-500 leading-tight",
                          task.completed ? "text-zinc-600 line-through" : "text-white group-hover/task:translate-x-1"
                        )}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-8 flex items-start gap-6 hover:bg-amber-500/[0.08] transition-colors group/tip">
                    <div className="p-3 bg-amber-500/10 rounded-2xl shrink-0 group-hover/tip:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2 italic font-mono">Pro Tip</p>
                      <p className="text-zinc-300 text-lg font-medium italic leading-relaxed">"{day.proTip}"</p>
                    </div>
                  </div>
                </div>
              </div>
              {idx < roadmapState.length - 1 && (
                <div className="hidden lg:block absolute left-10 top-28 bottom-[-64px] w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const Week2Protocol = ({ week2State, toggleTask, clients }: { week2State: DayPlan[], toggleTask: (dayIndex: number, taskId: string) => void, clients: Client[] }) => {
  return (
    <div className="space-y-16 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <SectionHeading 
          title="Week 2 Plan" 
          subtitle="No Client Yet? The Game Isn't Over. Week 2 is where it actually happens."
          icon={RefreshCw}
        />
        <div className="mb-16">
          <Card className="py-4 px-8 bg-emerald-500/10 border-emerald-500/20 glow-emerald">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1 italic">Total Outreach Intensity</p>
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase whitespace-nowrap">
              {clients.length} DMs SENT <span className="text-[10px] opacity-50 not-italic ml-2">ESTIMATED</span>
            </h3>
          </Card>
        </div>
      </div>

      {/* SECTION 1 - Why Week 1 Rarely Closes */}
      <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-3">
        <Info className="w-6 h-6 text-emerald-500" />
        Why Week 1 Rarely Closes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          "Cold DMs take 5-14 days average to get a reply",
          "Clients need to see you 2-3 times before trusting you",
          "Free trial offer needs follow-through not just sending",
          "Your portfolio gets stronger every day you practice"
        ].map((item, i) => (
          <Card key={i} className="p-8 border-white/5 bg-zinc-950/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500 font-black">
              0{i+1}
            </div>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">"{item}"</p>
          </Card>
        ))}
      </div>

      {/* SECTION 2 - Your Week 2 Daily Actions */}
      <div className="space-y-12">
        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <Zap className="w-6 h-6 text-emerald-500" />
          Your Week 2 Daily Actions
        </h3>
        
        <div className="space-y-24 relative">
          {week2State.map((day: DayPlan, idx: number) => {
            const completedCount = day.tasks.filter(t => t.completed).length;
            const progress = (completedCount / day.tasks.length) * 100;

            return (
              <motion.div 
                key={day.day}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="lg:w-72 shrink-0">
                    <div className="relative group/day">
                      <div className="absolute -inset-2 bg-emerald-500/20 blur-xl opacity-0 group-hover/day:opacity-100 transition-opacity"></div>
                      <div 
                        className="relative w-20 h-20 rounded-[24px] flex items-center justify-center text-3xl font-black text-white font-display italic transition-transform group-hover/day:scale-110"
                        style={{ backgroundColor: day.color }}
                      >
                        {day.day < 10 ? `0${day.day}` : day.day}
                      </div>
                    </div>
                    <div className="mt-8 space-y-2">
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{day.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] font-mono italic">{day.theme}</p>
                    </div>
                    
                    <div className="mt-10 space-y-3">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-600">
                        <span>Save Progress</span>
                        <span className="font-mono">{Math.round(progress)}%</span>
                      </div>
                      <ProgressBar progress={progress} color="bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-8">
                    <div className="bg-zinc-950/80 border border-white/5 rounded-[40px] p-8 space-y-4 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 px-6 py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-[20px] border-b border-l border-red-500/20">
                        DAILY MINIMUM: 20 DMs
                      </div>
                      {day.tasks.map((task) => (
                        <div 
                          key={task.id}
                          onClick={() => toggleTask(idx, task.id)}
                          className={cn(
                            "group/task flex items-center gap-6 p-6 rounded-[24px] cursor-pointer transition-all duration-300",
                            task.completed 
                              ? "bg-emerald-500/5 border border-emerald-500/20" 
                              : "bg-black/40 border border-transparent hover:bg-white/5 hover:border-white/10"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
                            task.completed ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-zinc-900 ring-1 ring-white/5 group-hover/task:ring-white/20"
                          )}>
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-black" />
                            ) : (
                              <Circle className="w-5 h-5 text-zinc-700 group-hover/task:text-zinc-500" />
                            )}
                          </div>
                          <span className={cn(
                            "text-xl font-medium transition-all duration-500 leading-tight",
                            task.completed ? "text-zinc-600 line-through" : "text-white group-hover/task:translate-x-1"
                          )}>
                            {task.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900 border border-white/5 rounded-[32px] p-8 flex items-start gap-6 group/tip">
                      <div className="p-3 bg-zinc-800 rounded-2xl shrink-0 group-hover/tip:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 italic font-mono">Pro Tip</p>
                        <p className="text-zinc-300 text-lg font-medium italic leading-relaxed">"{day.proTip}"</p>
                      </div>
                    </div>
                  </div>
                </div>
                {idx < week2State.length - 1 && (
                  <div className="hidden lg:block absolute left-10 top-28 bottom-[-64px] w-px bg-gradient-to-b from-emerald-500/50 via-emerald-500/10 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3 - Mindset Reset */}
      <div className="space-y-12">
        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
          <Brain className="w-6 h-6 text-emerald-500" />
          Mindset Reset
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "0 Replies ≠ Failure", text: "50 DMs with 0 replies is data, not failure. Change your hook, not your dream." },
            { title: "Free Trial = Your Proof", text: "1 free trial delivered well is your first testimonial. That makes the next client easier." },
            { title: "The Real Problem", text: "Day 14 with no client = completely normal. Day 14 with no effort = the actual problem." }
          ].map((card, i) => (
            <Card key={i} className="p-10 bg-zinc-950/80 border-emerald-500/10 hover:border-emerald-500/30 ring-1 ring-emerald-500/20">
               <h4 className="text-xl font-black text-emerald-400 uppercase tracking-tighter italic mb-4">{card.title}</h4>
               <p className="text-zinc-400 text-sm font-medium leading-relaxed italic">{card.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const DMLibrary = ({ profile }: { profile: UserProfile | null }) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(text);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const getCustomizedTemplates = () => {
    if (!profile?.niche) return DM_TEMPLATES;
    const nicheData = NICHES.find(n => n.id === profile.niche);
    return BASE_DM_TEMPLATES.map(cat => ({
      ...cat,
      templates: cat.templates.map(t => 
        t.replace(/\[Niche\]/g, nicheData?.name || '[Niche]')
         .replace(/\[Technique\]/g, 'dynamic motion graphics')
      )
    }));
  };

  const templates = getCustomizedTemplates();

  return (
    <div className="space-y-12">
      <SectionHeading 
        title={`${templates.reduce((acc, curr) => acc + curr.templates.length, 0)} Script Database`} 
        subtitle="High-conversion direct response templates designed to penetrate crowded inboxes and demand attention."
        icon={MessageSquare}
      />

      <div className="space-y-16">
        {templates.map((group) => (
          <div key={group.category} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-900"></div>
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-2">
                {group.category} <span className="text-[8px] opacity-30 text-white font-mono">[{group.templates.length}]</span>
              </h3>
              <div className="h-px flex-1 bg-zinc-900"></div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {group.templates.map((template, i) => (
                <Card key={i} className="group relative pr-20 bg-black/60 border-white/5 hover:border-emerald-500/20">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/10 group-hover:bg-emerald-500/50 transition-colors rounded-l-2xl" />
                  <p className="text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap text-[15px]">{template}</p>
                  <button 
                    onClick={() => copyToClipboard(template)}
                    className="absolute top-8 right-8 p-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl ring-1 ring-white/5 transition-all group/btn"
                  >
                    {copySuccess === template ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Plus className="w-5 h-5 group-hover/btn:rotate-0 rotate-45 transform transition-transform duration-300" />
                    )}
                    {copySuccess === template && (
                      <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-zinc-950 ring-1 ring-emerald-500/30 px-3 py-1 rounded-full whitespace-nowrap"
                      >
                        Copied to Sync
                      </motion.span>
                    )}
                  </button>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientTracker = ({ clients, addClient, updateClient, deleteClient }: any) => {
  const handleAddClient = () => {
    const newClient: Client = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Lead',
      niche: '',
      status: 'Cold',
      contactInfo: '',
      leadSource: 'Instagram',
      dateContacted: new Date().toISOString().split('T')[0],
      followUpDate: '',
      notes: '',
      paymentReceived: false
    };
    addClient(newClient);
  };

  const updateClientInternal = (id: string, field: keyof Client, value: any) => {
    updateClient(id, { [field]: value });
  };

  return (
    <div className="space-y-12">
       <div className="flex justify-between items-end gap-8">
        <SectionHeading 
          title="Leads Intelligence Hub" 
          subtitle="Manage your pipeline from initial contact to secured payment. Your business growth is measured in these rows."
          icon={Users}
        />
        <button 
          onClick={handleAddClient}
          className="bg-emerald-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-2xl shadow-emerald-500/20 active:scale-95 mb-10"
        >
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      <div className="bg-zinc-950/50 ring-1 ring-white/5 rounded-[32px] overflow-hidden shadow-2xl border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-zinc-900/50 text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-black italic">
                <th className="px-6 py-6 ring-1 ring-white/5">Lead Target</th>
                <th className="px-6 py-6 ring-1 ring-white/5">Industry</th>
                <th className="px-6 py-6 ring-1 ring-white/5">Endpoint</th>
                <th className="px-6 py-6 ring-1 ring-white/5 text-center">Protocol</th>
                <th className="px-6 py-6 ring-1 ring-white/5">Status</th>
                <th className="px-6 py-6 ring-1 ring-white/5">Event History</th>
                <th className="px-6 py-6 ring-1 ring-white/5">Financials</th>
                <th className="px-6 py-6 ring-1 ring-white/5"></th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {clients.map((client: Client) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="border-b border-white/5 group hover:bg-emerald-500/[0.02] transition-colors"
                  >
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <input 
                        className="bg-transparent text-white outline-none w-full font-black text-sm uppercase tracking-tight focus:text-emerald-400 transition-colors"
                        value={client.name}
                        onChange={(e) => updateClientInternal(client.id, 'name', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <input 
                        className="bg-transparent text-zinc-400 outline-none w-full text-xs font-bold uppercase tracking-widest placeholder:text-zinc-800"
                        value={client.niche}
                        placeholder="UNASSIGNED"
                        onChange={(e) => updateClientInternal(client.id, 'niche', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <input 
                        className="bg-transparent text-zinc-600 outline-none w-full text-[10px] font-mono italic placeholder:text-zinc-800"
                        value={client.contactInfo}
                        placeholder="NO LINK PROVIDED"
                        onChange={(e) => updateClientInternal(client.id, 'contactInfo', e.target.value)}
                      />
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <select 
                        className="bg-zinc-900/50 text-[9px] font-black text-zinc-500 rounded-lg px-3 py-2 outline-none border border-white/10 uppercase tracking-widest"
                        value={client.leadSource}
                        onChange={(e) => updateClientInternal(client.id, 'leadSource', e.target.value)}
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="YouTube">YouTube</option>
                        <option value="Fiverr">Fiverr</option>
                        <option value="Upwork">Upwork</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Reddit">Reddit</option>
                        <option value="Other">Other</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <select 
                        className={cn(
                          "text-[9px] rounded-lg px-3 py-2 outline-none border font-black uppercase tracking-widest w-full",
                          client.status === 'Cold' ? "bg-zinc-900/50 text-zinc-600 border-white/5" :
                          client.status === 'Contacted' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                          client.status === 'Replied' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}
                        value={client.status}
                        onChange={(e) => updateClientInternal(client.id, 'status', e.target.value)}
                      >
                        <option value="Cold">Phase 0: Cold</option>
                        <option value="Contacted">Phase 1: Contacted</option>
                        <option value="Replied">Phase 2: Engaged</option>
                        <option value="Closed">Phase 3: Secured</option>
                      </select>
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Entry</span>
                          <input 
                            type="date"
                            className="bg-transparent text-zinc-500 text-[10px] font-mono outline-none"
                            value={client.dateContacted}
                            onChange={(e) => updateClientInternal(client.id, 'dateContacted', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Next</span>
                          <input 
                            type="date"
                            className="bg-transparent text-emerald-500/50 text-[10px] font-mono outline-none"
                            value={client.followUpDate}
                            onChange={(e) => updateClientInternal(client.id, 'followUpDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 ring-1 ring-white/5">
                      <button 
                        onClick={() => updateClientInternal(client.id, 'paymentReceived', !client.paymentReceived)}
                        className={cn(
                          "w-12 h-6 mx-auto rounded-full ring-1 relative transition-all duration-300",
                          client.paymentReceived ? "bg-emerald-500/20 ring-emerald-500/50" : "bg-zinc-900 ring-white/10"
                        )}
                      >
                        <motion.div 
                          animate={{ x: client.paymentReceived ? 24 : 4 }}
                          className={cn(
                            "absolute top-1 w-4 h-4 rounded-full shadow-lg",
                            client.paymentReceived ? "bg-emerald-400" : "bg-zinc-700"
                          )}
                        />
                      </button>
                    </td>
                    <td className="px-6 py-6 text-right ring-1 ring-white/5">
                      <button 
                        onClick={() => deleteClient(client.id)}
                        className="text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {clients.length === 0 && (
            <div className="p-20 text-center space-y-4">
               <Users className="w-12 h-12 text-zinc-800 mx-auto" />
               <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No active assets detected. Initiate your first lead scan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EarningsTracker = ({ transactions, addTransaction, updateTransaction, deleteTransaction }: any) => {
  const handleAddTransaction = (type: 'income' | 'expense') => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: type === 'income' ? 'Client Payment' : 'Tool Subscription',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      method: type === 'income' ? 'Stripe' : ''
    };
    addTransaction(newTx);
  };

  const totalIncome = transactions
    .filter((t: Transaction) => t.type === 'income')
    .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((acc: number, t: Transaction) => acc + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Earnings" 
        subtitle="Track your business revenue and operational costs with precision. Focus on the only metric that matters: net profit."
        icon={DollarSign}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="bg-emerald-500/5 border-emerald-500/20 p-8 glow-emerald">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">Gross Revenue</p>
          <h3 className="text-4xl font-black text-white">${totalIncome.toLocaleString()}</h3>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20 p-8">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-2">Operational Costs</p>
          <h3 className="text-4xl font-black text-white">${totalExpenses.toLocaleString()}</h3>
        </Card>
        <Card className="bg-white/5 border-white/10 p-8">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Net Surplus</p>
          <h3 className="text-4xl font-black text-white">${netProfit.toLocaleString()}</h3>
        </Card>
      </div>

      <div className="flex gap-6">
        <button onClick={() => handleAddTransaction('income')} className="flex-1 bg-emerald-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-emerald-500/20 active:scale-95">
          <ArrowUpRight className="w-5 h-5" /> Receive Capital
        </button>
        <button onClick={() => handleAddTransaction('expense')} className="flex-1 bg-zinc-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all ring-1 ring-white/10 active:scale-95">
          <Plus className="w-5 h-5" /> Log Expenditure
        </button>
      </div>

      <div className="bg-zinc-950/50 ring-1 ring-white/5 rounded-[32px] overflow-hidden">
        <div className="bg-zinc-900/50 px-8 py-4 border-b border-white/5 flex justify-between items-center text-[10px] font-black text-zinc-600 uppercase tracking-widest">
           <span>Transaction Detail</span>
           <span>Quantum (USD)</span>
        </div>
        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {transactions.map((t: Transaction) => (
              <motion.div 
                key={t.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="group px-8 py-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-6 flex-1">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center ring-1",
                     t.type === 'income' ? "bg-emerald-500/10 ring-emerald-500/30" : "bg-red-500/10 ring-red-500/30"
                   )}>
                     {t.type === 'income' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <DollarSign className="w-5 h-5 text-red-500" />}
                   </div>
                   <div className="flex-1 space-y-1">
                      <input 
                        className="bg-transparent text-white outline-none w-full text-lg font-black uppercase tracking-tight focus:text-emerald-400"
                        value={t.name}
                        onChange={(e) => updateTransaction(t.id, { name: e.target.value })}
                      />
                      <div className="flex gap-6 items-center">
                         <input 
                          type="date"
                          className="bg-transparent text-zinc-600 text-[10px] font-mono outline-none"
                          value={t.date}
                          onChange={(e) => updateTransaction(t.id, { date: e.target.value })}
                         />
                         {t.type === 'income' && (
                           <input 
                            className="bg-transparent text-zinc-400 text-[10px] font-black uppercase tracking-widest border-l border-zinc-800 pl-6"
                            value={t.method}
                            placeholder="SOURCE PROTOCOL"
                            onChange={(e) => updateTransaction(t.id, { method: e.target.value })}
                          />
                         )}
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-8">
                   <div className="flex items-center gap-3">
                      <span className={cn("font-mono text-xl font-bold", t.type === 'income' ? "text-emerald-500" : "text-red-500")}>
                        {t.type === 'income' ? '+' : '-'}$
                      </span>
                      <input 
                        type="number"
                        className={cn(
                          "bg-transparent font-mono text-2xl font-black outline-none w-32 text-right",
                          t.type === 'income' ? "text-emerald-500" : "text-red-500"
                        )}
                        value={t.amount}
                        onChange={(e) => updateTransaction(t.id, { amount: Number(e.target.value) })}
                      />
                   </div>
                   <button 
                    onClick={() => deleteTransaction(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-800 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Resources = () => {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Asset Ecosystem" 
        subtitle="A curated stack of enterprise-grade tools to optimize your workflow and reduce overhead to zero."
        icon={Briefcase}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map(category => (
          <div key={category} className="space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {category}
            </h3>
            <div className="space-y-4">
              {TOOLS.filter(t => t.category === category).map(tool => (
                <a 
                  key={tool.name}
                  href={tool.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group p-8 bg-zinc-950 border border-white/5 rounded-3xl hover:border-emerald-500/30 transition-all shadow-xl hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter italic">{tool.name}</h4>
                    <div className={cn(
                      "text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ring-1",
                      tool.cost.includes('Free') ? "bg-emerald-500/10 text-emerald-500 ring-emerald-500/20" : "bg-zinc-800 text-zinc-500 ring-white/5"
                    )}>
                      {tool.cost}
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition-colors font-medium">{tool.useCase}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientFind = () => {
  return (
    <div className="space-y-12">
      <SectionHeading 
        title="Market Penetration Maps" 
        subtitle="Zeroing in on high-value digital territories where creators are searching for specialized talent."
        icon={Search}
      />

      <div className="grid grid-cols-1 gap-8">
        {PLATFORMS.map((platform) => (
          <Card key={platform.name} className={cn(
            "relative overflow-hidden p-10",
            platform.bestForBeginners && "ring-1 ring-emerald-500/30 border-emerald-500/10"
          )}>
            {platform.bestForBeginners && (
              <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-2xl">
                HIGH CONVERSION: BEGINNER RECOMMENDED
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-12">
              <div className="md:w-56 shrink-0 space-y-6">
                 <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{platform.name}</h3>
                 <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl ring-1 ring-white/5">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Friction Level</p>
                      <span className={cn(
                        "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                        platform.difficulty === 'Low' ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : 
                        platform.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20" : "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      )}>{platform.difficulty} Difficulty</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl ring-1 ring-white/5">
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Engagement Cycle</p>
                      <span className="text-white font-mono text-xs font-bold">{platform.expectedResponse}</span>
                    </div>
                 </div>
              </div>
              <div className="flex-1 bg-black/40 rounded-3xl p-8 ring-1 ring-white/5 relative">
                 <div className="absolute -top-3 -left-3 p-2 bg-zinc-900 border border-white/10 rounded-xl">
                   <Target className="w-4 h-4 text-emerald-500" />
                 </div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Strategic Execution</p>
                 <p className="text-zinc-300 text-xl font-medium leading-relaxed tracking-tight">{platform.strategy}</p>
                 {platform.name === 'Fiverr' && (
                   <div className="mt-8 p-6 bg-zinc-950 border border-emerald-500/10 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10" />
                      <p className="text-xs font-black text-white mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                         <Zap className="w-4 h-4 text-emerald-500" /> Tips
                      </p>
                      <ul className="text-sm text-zinc-500 space-y-4">
                        <li className="flex gap-3">
                          <span className="text-emerald-500 font-black">01</span>
                          <span>Maintain 100% uptime by staying active in search intervals.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-emerald-500 font-black">02</span>
                          <span>Mandatory video thumbnails: Leverage your core product to sell yourself.</span>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-emerald-500 font-black">03</span>
                          <span>Loss-leader pricing (First 3): Buying reviews with labor to secure ranking.</span>
                        </li>
                      </ul>
                   </div>
                 )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const RateCardManager = () => {
  const PACKAGES = [
    { id: 'pkg1', name: 'Free Trial', price: '0', desc: '1 Reel edit — sample work' },
    { id: 'pkg2', name: 'Starter', price: '25', desc: '3 Reels' },
    { id: 'pkg3', name: 'Basic', price: '75', desc: '8 Reels per month' },
    { id: 'pkg4', name: 'Standard', price: '149', desc: '15 Reels + 1 Long-form per month' },
  ];

  return (
    <div className="space-y-16 pb-24">
      <SectionHeading
        title="Rate Card"
        subtitle="Your standardized pricing. Share this with every prospect. Don't negotiate—dictate."
        icon={DollarSign}
      />
      <div className="max-w-3xl">
        <Card className="p-10 border-white/5 bg-zinc-950/50">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3 mb-8">
            <Globe2 className="w-5 h-5 text-emerald-500" />
            Service Packages
          </h3>
          <div className="space-y-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className="p-6 bg-zinc-900/50 rounded-2xl border border-white/5 flex justify-between items-center hover:border-emerald-500/20 transition-all">
                <div>
                  <p className="text-white font-black uppercase text-sm">{pkg.name}</p>
                  <p className="text-zinc-500 text-xs mt-1">{pkg.desc}</p>
                </div>
                <span className="text-emerald-500 font-black text-xl">${pkg.price}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ClosingTools = ({ profile }: { profile: UserProfile | null }) => {
  if (!profile) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-16 pb-24">
      <SectionHeading 
        title="Close Clients" 
        subtitle="Protocol overrides for common sales objections. Hard-pivot from rejection to retention."
        icon={Target}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Objection Library */}
        <Card className="p-10 border-white/5 bg-zinc-950/50">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
             <MessageSquare className="w-5 h-5 text-emerald-500" />
             Objection Pulse (Library)
          </h3>
          <div className="space-y-4">
             {OBJECTIONS.map((obj, i) => (
               <div key={i} className="p-6 bg-zinc-900 border border-white/5 rounded-2xl space-y-4 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                  <div className="flex items-center gap-3 text-red-500 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest italic leading-none font-mono">Trigger: {obj.trigger}</p>
                  </div>
                  <p className="text-sm font-medium text-zinc-300 leading-relaxed italic">"{obj.response}"</p>
                  <button 
                    onClick={() => copyToClipboard(obj.response)}
                    className="w-full py-3 bg-zinc-800 hover:bg-emerald-500 hover:text-black transition-all rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    <Copy className="w-3 h-3" /> Copy Sequence
                  </button>
               </div>
             ))}
          </div>
        </Card>

        {/* Scope Generator */}
        <Card className="p-10 border-white/5 bg-zinc-950/50 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl -z-10" />
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
             <FileText className="w-5 h-5 text-emerald-500" />
             Scope Architect
          </h3>
          <div className="space-y-8">
             <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl italic text-[13px] leading-relaxed text-zinc-300 font-medium">
                "Speed kills. Sending a clear scope template (Timeline, Deliverables, Price) within 15 minutes of a 'Yes' increases closing rate by 40%. Don't wait for a contract—send the scope."
             </div>
             
             <div className="space-y-6">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Template_Output</p>
                <div className="p-8 bg-black border border-white/5 rounded-3xl font-mono text-[11px] leading-relaxed text-zinc-400 space-y-4">
                   <p className="text-emerald-500 font-bold tracking-tight">PROJECT BATTLE-PLAN:</p>
                   <p><span className="text-zinc-600">CLIENT:</span> [Prospect Name]</p>
                   <p><span className="text-zinc-600">DELIVERABLES:</span> 15x Reels + 1 Long-form Edit</p>
                   <p><span className="text-zinc-600">TIMELINE:</span> First draft in 48 hours.</p>
                   <p><span className="text-zinc-600">INVESTMENT:</span> ${profile.intlRateCard?.[3]?.price || '149'} USD (50% Upfront)</p>
                   <p className="text-[10px] text-zinc-800 mt-10">--- GENERATED_BY_LAUNCHPAD_v1.0 ---</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(`PROJECT BATTLE-PLAN:\nCLIENT: [Name]\nDELIVERABLES: 15x Reels + 1 Long-form Edit\nTIMELINE: First draft in 48 hours.\nINVESTMENT: $${profile.intlRateCard?.[3]?.price || '149'} USD\n\nNext steps: Confirm scope and I'll send the onboarding link.`)}
                  className="w-full py-4 bg-white text-black hover:bg-emerald-500 transition-all rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-black/40"
                >
                  <Copy className="w-4 h-4" /> Copy Scope Template
                </button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const OutreachHub = ({ clients, profile, updateProfile }: { clients: Client[], profile: UserProfile | null, updateProfile: (u: Partial<UserProfile>) => Promise<void> }) => {
  const [selectedNiche, setSelectedNiche] = useState(profile?.niche || '');
  const [niche, setNiche] = useState(profile?.niche || '');
  const [offering, setOffering] = useState('');
  const [objection, setObjection] = useState('');
  const [generatedObjectionResponse, setGeneratedObjectionResponse] = useState<string | null>(null);
  const [isGeneratingObjection, setIsGeneratingObjection] = useState(false);
  const [generatedPersona, setGeneratedPersona] = useState<string | null>(null);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [nicheForIdeas, setNicheForIdeas] = useState('');
  const [contentIdeas, setContentIdeas] = useState<any[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [generatedDM, setGeneratedDM] = useState<string | null>(null);
  const [isGeneratingDM, setIsGeneratingDM] = useState(false);
  const [prospectName, setProspectName] = useState('');
  const [showProspectWarning, setShowProspectWarning] = useState(false);
  const [isGeneratingFollowUps, setIsGeneratingFollowUps] = useState(false);
  const [generatedFollowUps, setGeneratedFollowUps] = useState<FollowUpStep[] | null>(null);

  const handleNicheChange = (nicheId: string) => {
    setSelectedNiche(nicheId);
    setNiche(NICHES.find(n => n.id === nicheId)?.name || nicheId);
    updateProfile({ niche: nicheId });
  };

  const handleGeneratePersona = async () => {
    if (!niche || !offering) return;
    setIsGeneratingPersona(true);
    try {
      const text = await generateClientPersona(niche);
      setGeneratedPersona(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPersona(false);
    }
  };

  const handleGenerateObjection = async () => {
    if (!objection || !niche || !offering) return;
    setIsGeneratingObjection(true);
    try {
      const text = await generateObjectionResponse(objection, niche, offering);
      setGeneratedObjectionResponse(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingObjection(false);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!nicheForIdeas) return;
    setIsGeneratingIdeas(true);
    try {
      const text = await generateContentIdeas(nicheForIdeas);
      const cleanedText = text.replace(/```json|```/g, '').trim();
      try {
        setContentIdeas(JSON.parse(cleanedText));
      } catch (err) {
        console.warn("Gemini didn't return JSON, falling back to basic parsing", err);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  const handleGenerateDM = async () => {
    if (!niche || !offering) return;
    setIsGeneratingDM(true);
    try {
      const text = await generateOutreachDM(niche, offering);
      setGeneratedDM(text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDM(false);
    }
  };

  const handleGenerateFollowUps = async () => {
    if (!prospectName) {
      setShowProspectWarning(true);
      return;
    }
    if (!selectedNiche) return;
    
    setShowProspectWarning(false);
    setIsGeneratingFollowUps(true);
    try {
      const nicheData = NICHES.find(n => n.id === selectedNiche);
      const text = await generateFollowUpSequence(nicheData?.name || selectedNiche, prospectName);
      const cleanedText = text.replace(/```json|```/g, '').trim();
      setGeneratedFollowUps(JSON.parse(cleanedText));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingFollowUps(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-16 pb-24">
      <SectionHeading 
        title="Send DMs" 
        subtitle="High-frequency communication sequences optimized for creator-market penetration. Dominate the inbox."
        icon={Send}
      />

      {/* Niche Selector */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {NICHES.map((n) => (
          <button
            key={n.id}
            onClick={() => handleNicheChange(n.id)}
            className={cn(
              "p-6 rounded-2xl border transition-all text-left group relative overflow-hidden",
              selectedNiche === n.id 
                ? "bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/20" 
                : "bg-zinc-950 border-white/5 hover:border-white/10"
            )}
          >
            {selectedNiche === n.id && (
              <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500/10 rounded-bl-full flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            )}
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1 italic">Sector_Link</p>
            <p className={cn("text-xs font-black uppercase tracking-tight font-mono", selectedNiche === n.id ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300")}>{n.name}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Follow Up Protocol */}
        <div className="md:col-span-2 space-y-10">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                <Clock className="w-6 h-6 text-emerald-500" /> 3-Day Follow-Up Sequence
              </h3>
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono italic">
                Active_Automation_v{selectedNiche ? '2' : '0'}
              </div>
           </div>
           
           {!selectedNiche ? (
              <Card className="p-20 flex flex-col items-center justify-center border-dashed border-white/5 opacity-50 bg-zinc-950/20">
                 <Lock className="w-8 h-8 text-zinc-800 mb-6" />
                 <p className="text-sm font-black text-zinc-700 uppercase tracking-widest">Select your niche to generate follow-up messages</p>
              </Card>
           ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic font-mono">Enter Prospect Name to Generate</label>
                      {showProspectWarning && (
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> NAME_REQUIRED_PROTOCOL_ABORTED
                        </span>
                      )}
                    </div>
                    <input 
                      className={cn(
                        "w-full bg-black/40 border rounded-2xl px-6 py-4 text-sm text-white outline-none transition-all placeholder:text-zinc-800",
                        showProspectWarning ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-white/5 focus:border-emerald-500/50"
                      )}
                      placeholder="e.g. Graham Stephan"
                      value={prospectName}
                      onChange={(e) => {
                        setProspectName(e.target.value);
                        if (e.target.value) setShowProspectWarning(false);
                      }}
                    />
                  </div>
                  <button 
                    onClick={handleGenerateFollowUps}
                    disabled={isGeneratingFollowUps}
                    className={cn(
                      "h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all",
                      isGeneratingFollowUps ? "bg-zinc-900 text-zinc-700 cursor-wait" : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
                    )}
                  >
                    {isGeneratingFollowUps ? <div className="w-4 h-4 rounded-full border-[3px] border-emerald-950 border-t-white animate-spin" /> : <Zap className="w-4 h-4" />}
                    {isGeneratingFollowUps ? "Generating..." : "Generate Follow-Ups"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(generatedFollowUps || FOLLOW_UP_SEQUENCES[selectedNiche])?.map((step: any, sIdx: number) => (
                      <Card key={sIdx} className="p-8 bg-zinc-950 italic relative overflow-hidden group border border-white/5">
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                        <div className="flex items-center justify-between mb-8">
                            <div className="px-3 py-1 bg-zinc-900 rounded-lg text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-white/5">Day {step.day}</div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none font-mono">{step.type}</p>
                        </div>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-10">"{step.script}"</p>
                        <button 
                            onClick={() => copyToClipboard(step.script)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white text-zinc-400 hover:text-black rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                        >
                            <Copy className="w-3.5 h-3.5" /> Execute Copy
                        </button>
                      </Card>
                    ))}
                </div>
             </div>
           )}
        </div>

        {/* Outreach Pipeline Visualization */}
        <div className="md:col-span-2 space-y-10">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
               <BarChart3 className="w-6 h-6 text-emerald-500" /> Pipeline Flux
             </h3>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full ring-1 ring-white/10 text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono italic">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Auto-Saving
             </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <Card className="lg:col-span-2 p-10 h-[380px]">
               <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-10 italic font-mono">Archive_Distribution</p>
               <div className="h-full w-full pb-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={[
                     { name: 'COLD', value: clients.filter(c => c.status === 'Cold').length, color: '#18181b' },
                     { name: 'SENT', value: clients.filter(c => c.status === 'Contacted').length, color: '#3b82f6' },
                     { name: 'REPLIED', value: clients.filter(c => c.status === 'Replied').length, color: '#f59e0b' },
                     { name: 'CLOSED', value: clients.filter(c => c.status === 'Closed').length, color: '#10b981' }
                   ]}>
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#3f3f46', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} dy={15} />
                     <Tooltip 
                       cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           return (
                             <div className="bg-zinc-950/90 backdrop-blur-2xl border border-white/5 p-6 rounded-[24px] shadow-3xl">
                               <p className="text-[9px] font-black text-zinc-600 uppercase mb-3 italic tracking-widest">{payload[0].payload.name}_STATUS</p>
                               <p className="text-4xl font-black text-white italic leading-none">{payload[0].value}<span className="text-[11px] font-bold text-zinc-700 not-italic ml-2 uppercase tracking-widest">Ops</span></p>
                             </div>
                           );
                         }
                         return null;
                       }}
                     />
                     <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={64}>
                       {[
                         { name: 'COLD', color: '#18181b' },
                         { name: 'SENT', color: '#3b82f6' },
                         { name: 'REPLIED', color: '#f59e0b' },
                         { name: 'CLOSED', color: '#10b981' }
                       ].map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card className="p-10 flex flex-col justify-between overflow-hidden relative">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <TrendingUp className="w-32 h-32" />
               </div>
               <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-10 italic font-mono relative">Conversion_Multipliers</p>
               <div className="space-y-10 relative">
                  {[
                    { label: 'Market Access', val: clients.length > 0 ? (clients.filter(c => c.status !== 'Cold').length / clients.length) * 100 : 0, color: 'bg-emerald-500/40', icon: Target },
                    { label: 'Response Flux', val: clients.filter(c => c.status !== 'Cold').length > 0 ? (clients.filter(c => c.status === 'Replied' || c.status === 'Closed').length / clients.filter(c => c.status !== 'Cold').length) * 100 : 0, color: 'bg-emerald-500/60', icon: Zap },
                    { label: 'Closure Velocity', val: clients.filter(c => c.status === 'Replied' || c.status === 'Closed').length > 0 ? (clients.filter(c => c.status === 'Closed').length / clients.filter(c => c.status === 'Replied' || c.status === 'Closed').length) * 100 : 0, color: 'bg-emerald-500', icon: TrendingUp }
                  ].map((stat, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <stat.icon className="w-4 h-4 text-zinc-700" />
                             <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.1em]">{stat.label}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-white tracking-widest">{Math.round(stat.val)}%</span>
                       </div>
                       <ProgressBar progress={stat.val} color={stat.color} />
                    </div>
                  ))}
               </div>
               <div className="mt-12 pt-8 border-t border-white/5 relative">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic font-mono flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> System_Integrity: 100%
                  </p>
               </div>
            </Card>
          </div>
        </div>

        {/* AI Conversion Matrix */}
        <Card className="bg-zinc-950/40 relative group overflow-hidden border-emerald-500/10">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/5 flex items-center justify-center glow-emerald ring-1 ring-emerald-500/20">
               <Sparkles className="w-6 h-6 text-emerald-500" />
             </div>
          </div>
          <div className="space-y-10 relative">
            <div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 font-mono italic">Module_01</p>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none font-display">Conversion <span className="text-emerald-500">Matrix.</span></h3>
               <p className="text-sm text-zinc-600 font-medium tracking-tight mt-3">Synthesize hyper-targeted psychological outreach assets.</p>
            </div>
            
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic font-mono">Target_Sector</label>
                    <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Required</span>
                  </div>
                  <input 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium"
                    placeholder="e.g. Fintech Founders"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic font-mono">Market_Offering</label>
                    <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Required</span>
                  </div>
                  <input 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium"
                    placeholder="e.g. AI-Assisted Narrative Editing"
                    value={offering}
                    onChange={(e) => setOffering(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleGeneratePersona}
                  disabled={isGeneratingPersona || !niche || !offering}
                  className={cn(
                    "flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_-20px_rgba(255,255,255,0.1)]",
                    isGeneratingPersona ? "bg-zinc-900 border border-white/5 text-zinc-700 cursor-wait" : "bg-white text-black hover:bg-emerald-500 active:scale-95"
                  )}
                >
                  {isGeneratingPersona ? <div className="w-5 h-5 rounded-full border-[3px] border-zinc-800 border-t-white animate-spin" /> : <Search className="w-5 h-5" />}
                  {isGeneratingPersona ? "Analyzing..." : "Shed Sector Intel"}
                </button>
                <button 
                  onClick={handleGenerateDM}
                  disabled={isGeneratingDM || !niche || !offering}
                  className={cn(
                    "flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_-20px_rgba(16,185,129,0.2)]",
                    isGeneratingDM ? "bg-zinc-900 border border-white/5 text-zinc-700 cursor-wait" : "bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95"
                  )}
                >
                  {isGeneratingDM ? <div className="w-5 h-5 rounded-full border-[3px] border-emerald-950 border-t-white animate-spin" /> : <Zap className="w-5 h-5" />}
                  {isGeneratingDM ? "Generating..." : "Generate DM"}
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {(generatedPersona || generatedDM) && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 space-y-10"
              >
                {generatedPersona && (
                  <div className="bg-emerald-500/5 rounded-[32px] p-10 ring-1 ring-emerald-500/20 relative group/intel">
                    <div className="absolute top-0 right-0 p-6 flex items-center gap-3">
                       <span className="text-[8px] font-black text-emerald-500/30 uppercase tracking-[0.3em] font-mono group-hover/intel:text-emerald-500 transition-colors">Sector_DNA</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                    </div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 font-mono italic">Market_Psychology_Xray</p>
                    <div className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                        {generatedPersona}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(generatedPersona)}
                      className="mt-8 flex items-center gap-3 text-[10px] font-black text-emerald-500/50 uppercase tracking-widest hover:text-emerald-500 transition-colors bg-black/40 px-5 py-2 rounded-xl ring-1 ring-emerald-500/20"
                    >
                      <Plus className="w-4 h-4" /> Add to Tracker
                    </button>
                  </div>
                )}
                {generatedDM && (
                  <div className="bg-black/60 rounded-[32px] p-10 border border-emerald-500/10 relative group/dm hover:shadow-[0_0_80px_rgba(16,185,129,0.05)] transition-all">
                    <div className="absolute top-6 right-8">
                       <Zap className="w-5 h-5 text-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6 font-mono italic">Output: Surgical_Outreach_Script</p>
                    <div className="text-white text-xl leading-relaxed whitespace-pre-wrap font-display italic tracking-tight mb-8">
                        "{generatedDM}"
                    </div>
                    <button 
                      onClick={() => copyToClipboard(generatedDM)}
                      className="w-full flex items-center justify-center gap-3 h-14 bg-emerald-500 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-2xl shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Copy DM
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Objection Crusher Module */}
        <Card className="bg-zinc-950/40 relative group overflow-hidden border-blue-500/10">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-12 h-12 rounded-2xl bg-blue-500/5 flex items-center justify-center glow-blue ring-1 ring-blue-500/20">
               <ShieldAlert className="w-6 h-6 text-blue-500" />
             </div>
          </div>
          <div className="space-y-10 relative h-full flex flex-col">
            <div>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 font-mono italic">Module_02</p>
               <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none font-display">Objection <span className="text-blue-500">Crusher.</span></h3>
               <p className="text-sm text-zinc-600 font-medium tracking-tight mt-3">Neutralize high-friction market resistance instantly.</p>
            </div>
            
            <div className="space-y-8 flex-1 flex flex-col justify-between pt-4">
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic font-mono">Market_Backlash</label>
                  </div>
                  <textarea 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-sm text-white focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-800 font-medium min-h-[140px] resize-none"
                    placeholder="Paste the objection here (e.g. We don't have budget for this right now)"
                    value={objection}
                    onChange={(e) => setObjection(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                onClick={handleGenerateObjection}
                disabled={isGeneratingObjection || !objection || !niche || !offering}
                className={cn(
                  "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all shadow-3xl",
                  isGeneratingObjection ? "bg-zinc-900 border border-white/5 text-zinc-700 cursor-wait" : "bg-white text-black hover:bg-blue-500 active:scale-95"
                )}
              >
                {isGeneratingObjection ? <div className="w-5 h-5 rounded-full border-[3px] border-zinc-800 border-t-white animate-spin" /> : <X className="w-5 h-5" />}
                {isGeneratingObjection ? "Calculating Counter..." : "Crush Resistance"}
              </button>
            </div>

            <AnimatePresence>
              {generatedObjectionResponse && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-12"
                >
                  <div className="bg-blue-500/5 rounded-[32px] p-10 ring-1 ring-blue-500/20 relative shadow-2xl">
                    <div className="absolute top-6 right-8">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Validated</span>
                       </div>
                    </div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6 font-mono italic">Objection Reply</p>
                    <div className="text-zinc-300 text-[15px] leading-relaxed whitespace-pre-wrap font-medium italic">
                        "{generatedObjectionResponse}"
                    </div>
                    <button 
                      onClick={() => copyToClipboard(generatedObjectionResponse)}
                      className="mt-10 w-full flex items-center justify-center gap-3 h-14 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all ring-1 ring-white/10"
                    >
                      <Plus className="w-4 h-4" /> Load_Into_Terminal
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        {/* Tactical Content Architect */}
        <div className="md:col-span-2">
           <Card className="bg-zinc-950/40 border-purple-500/10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/[0.03] to-transparent pointer-events-none" />
              <div className="space-y-12 relative">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3 font-mono italic">Module_03</p>
                  <h3 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none font-display mb-6">Tactical Content <span className="text-purple-500">Architect.</span></h3>
                  <p className="text-lg text-zinc-500 font-medium leading-relaxed max-w-2xl">Deploy narrative assets that build authority and force market interest. High-leverage storytelling for elite operators.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-end">
                  <div className="flex-1 space-y-4 w-full">
                    <label className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] pl-1 font-mono italic">Target_Niche_Input</label>
                    <input 
                      className="w-full bg-black/60 border border-white/5 rounded-[24px] px-8 py-6 text-xl text-white focus:border-purple-500/50 outline-none transition-all placeholder:text-zinc-800 font-black tracking-tight"
                      placeholder="e.g. Luxury Real Estate Agents"
                      value={nicheForIdeas}
                      onChange={(e) => setNicheForIdeas(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleGenerateIdeas}
                    disabled={isGeneratingIdeas || !nicheForIdeas}
                    className={cn(
                      "lg:w-80 h-[84px] rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-3xl shrink-0",
                      isGeneratingIdeas ? "bg-zinc-900 text-zinc-700 cursor-wait" : "bg-white text-black hover:bg-purple-500 active:scale-95"
                    )}
                  >
                    {isGeneratingIdeas ? <div className="w-6 h-6 rounded-full border-[3px] border-zinc-800 border-t-white animate-spin" /> : <Briefcase className="w-6 h-6" />}
                    {isGeneratingIdeas ? "Mapping Narrative..." : "Scan Architecture"}
                  </button>
                </div>

                <AnimatePresence>
                  {contentIdeas.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
                    >
                      {contentIdeas.map((idea: any, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-black/60 border border-purple-500/10 rounded-[32px] p-10 hover:border-purple-500/40 transition-all group/idea hover:-translate-y-2 flex flex-col justify-between"
                        >
                           <div>
                             <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 ring-1 ring-purple-500/20 group-hover/idea:bg-purple-500 transition-all duration-500 group-hover/idea:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                               <span className="text-xl font-black text-purple-500 group-hover/idea:text-black font-display italic">{i+1}</span>
                             </div>
                             <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4 leading-tight group-hover:text-purple-400 transition-colors">{idea.title}</h4>
                             <p className="text-sm text-zinc-500 leading-relaxed font-medium mb-8 italic">"{idea.hook}"</p>
                           </div>
                           <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest font-mono">Format: High_Impact_REEL</span>
                              <button 
                                onClick={() => copyToClipboard(`TITLE: ${idea.title}\nHOOK: ${idea.hook}`)}
                                className="p-2 bg-white/5 hover:bg-purple-500 text-zinc-600 hover:text-black rounded-lg transition-all"
                                title="Copy Idea Architecture"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                           </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

const Mindset = () => {
  return (
    <div className="space-y-24 pb-24">
      <SectionHeading 
        title="Psychological Fortification" 
        subtitle="Upgrading the mental firmware required for high-stakes business operations. In-built immunity to rejection and market noise."
        icon={Brain}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-10">
          <h3 className="text-sm font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Fatal System Errors (Week 1)
          </h3>
          <ul className="space-y-8">
            {[
              "Over-investing in expensive software/gear before winning a client.",
              "Spending 10+ hours on a single edit for a portfolio that will never be seen.",
              "Taking silence from a prospect personally—80% of sales are in the follow-up.",
              "Not niching down: 'I edit anything' translates to 'I'm a generalist who is cheap.'",
              "Waiting for clients to find you instead of hunting for them (Outreach > Inbound)."
            ].map((err, i) => (
              <li key={i} className="flex gap-6 group">
                <span className="text-[10px] font-black text-zinc-800 mt-2">ERR_0{i+1}</span>
                <p className="text-zinc-400 text-xl font-medium leading-relaxed tracking-tight group-hover:text-zinc-200 transition-colors uppercase italic">{err}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-10">
          <h3 className="text-sm font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Quick Tips
          </h3>
          <ul className="space-y-8">
            {[
              "Quantity First: In Week 1, sending 100 DMs is better than sending 5 perfect ones.",
              "Value Obsession: Don't charge for 'video editing', charge for 'saving the creator time'.",
              "Radical Ownership: If they didn't reply, your hook wasn't good enough. Improve it.",
              "The 50/50 Rule: Spend 50% of your time editing and 50% hunting for new business.",
              "Speed is Pricing: The faster you reply and deliver, the more you can charge."
            ].map((rule, i) => (
              <li key={i} className="flex gap-6 group">
                <span className="text-[10px] font-black text-emerald-500 mt-2">CTRL_0{i+1}</span>
                <p className="text-zinc-400 text-xl font-medium leading-relaxed tracking-tight group-hover:text-zinc-200 transition-colors uppercase">{rule}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Card className="bg-zinc-950 p-12 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] -z-10 group-hover:bg-emerald-500/10 transition-all duration-1000" />
        <div className="max-w-3xl">
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-6">Recalibration: Silence is Information</h3>
          <p className="text-zinc-500 mb-12 text-lg font-medium leading-relaxed">If 7 days pass with zero replies, the market is giving you data. Do not abandon the mission—adjust the parameters.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { title: "Hook Calibration", desc: "Your opening statement is generic. Use specific observations from their latest content.", color: "text-blue-500" },
               { title: "Proof Validation", desc: "Show, don't tell. Remix a clip better than their previous one to prove utility.", color: "text-purple-500" },
               { title: "Quantum of Action", desc: "Low earners send 5. High earners send 30. Force the numbers until the law of averages bites.", color: "text-emerald-500" }
             ].map((param, i) => (
               <div key={i} className="space-y-3">
                 <p className={cn("text-[10px] font-black uppercase tracking-widest", param.color)}>{param.title}</p>
                 <p className="text-xs text-zinc-600 font-bold leading-relaxed">{param.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

const PortfolioManager = ({ profile, updateProfile }: { profile: UserProfile | null, updateProfile: (u: Partial<UserProfile>) => Promise<void> }) => {
  if (!profile) return null;

  const handleToggleChecklist = (id: string) => {
    const list = profile.portfolioChecklist || [];
    const newList = list.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    updateProfile({ portfolioChecklist: newList });
  };

  const handleUpdateLink = (index: number, value: string) => {
    const links = [...(profile.portfolioLinks || ['', '', ''])];
    links[index] = value;
    updateProfile({ portfolioLinks: links });
  };

  return (
    <div className="space-y-16 pb-24">
      <SectionHeading 
        title="Portfolio Ops" 
        subtitle="Weaponizing your skills into proof-of-concept assets. The market only respects what they can see."
        icon={Briefcase}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Checklist */}
        <Card className="p-10 border-white/5 bg-zinc-950/50">
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Sample Edit Checklist
          </h3>
          <div className="space-y-4">
            {PORTFOLIO_CHECKLIST.map((item) => {
              const isCompleted = profile.portfolioChecklist?.find(c => c.id === item.id)?.completed;
              return (
                <div 
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={cn(
                    "p-6 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                    isCompleted ? "bg-emerald-500/10 border-emerald-500/20" : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-md border flex items-center justify-center transition-all",
                      isCompleted ? "bg-emerald-500 border-emerald-500 text-black" : "border-zinc-700 bg-zinc-800"
                    )}>
                      {isCompleted && <Zap className="w-4 h-4 fill-current" />}
                    </div>
                    <div>
                      <p className={cn("font-bold text-sm uppercase tracking-tight", isCompleted ? "text-emerald-400" : "text-zinc-400")}>{item.title}</p>
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest leading-none mt-1">{item.description}</p>
                    </div>
                  </div>
                  <div className="text-[9px] font-black text-zinc-800 uppercase group-hover:text-zinc-600">
                    {isCompleted ? "VERIFIED" : "PENDING"}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Link Generator */}
        <Card className="p-10 border-white/5 bg-zinc-950/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10" />
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-8 flex items-center gap-3">
            <Share2 className="w-5 h-5 text-emerald-500" />
            Portfolio Terminal
          </h3>
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic">Active_Uplinks (Links)</p>
              {(profile.portfolioLinks || ['', '', '']).map((link, i) => (
                <div key={i} className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-zinc-700 font-mono">0x{i+1}</span>
                  <input 
                    type="text"
                    value={link}
                    placeholder="https://vimeo.com/..."
                    onChange={(e) => handleUpdateLink(i, e.target.value)}
                    className="w-full bg-zinc-900/80 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-xs font-mono text-emerald-400 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Share Portfolio</p>
                <button 
                  className="px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
                  onClick={() => {
                    const text = `Check out my portfolio for ${profile.niche || 'Video Editing'}:\n${(profile.portfolioLinks || []).filter(l => l).join('\n')}`;
                    navigator.clipboard.writeText(text);
                  }}
                >
                  Generate & Copy
                </button>
              </div>
              <div className="p-4 bg-black border border-white/5 rounded-xl">
                 <p className="text-[9px] font-mono text-zinc-600 italic leading-relaxed">
                   "Your portfolio isn't a gallery; it's a weapon. Three high-quality links are better than 50 mediocre exports. Use the generator to standardize your pitch."
                 </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ProjectTemplates = () => {
  return (
    <div className="space-y-16 pb-24">
      <SectionHeading 
        title="Production Engine" 
        subtitle="Standardized track architectures and effect configurations for elite-tier visual assets. Master the timeline."
        icon={Layers}
      />

      <div className="grid grid-cols-1 gap-16">
        {PROJECT_TEMPLATES.map((template) => (
          <Card key={template.id} className="p-0 overflow-hidden ring-1 ring-white/5 border-none shadow-3xl">
            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {/* Left Column: Info */}
              <div className="lg:w-96 p-12 space-y-10 shrink-0 bg-zinc-950/50 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50" />
                <div className="space-y-4">
                  <div className="px-4 py-1.5 bg-emerald-500/5 rounded-full border border-emerald-500/10 text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] inline-block font-mono">
                    {template.videoType} Architecture
                  </div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter leading-none uppercase font-display">{template.name}</h3>
                </div>
                <p className="text-zinc-500 text-lg font-medium leading-relaxed">{template.description}</p>
                
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic leading-none font-mono">Effect Chain_Stack</p>
                  <div className="flex flex-wrap gap-2.5">
                    {template.commonEffects.map((effect, i) => (
                      <span key={i} className="px-4 py-1.5 bg-zinc-900 rounded-xl text-[10px] font-black text-zinc-400 ring-1 ring-white/5 uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                   <div className="flex items-start gap-5 p-6 bg-amber-500/5 rounded-[24px] ring-1 ring-amber-500/20 group/tip">
                      <div className="p-3 bg-amber-500/10 rounded-xl shrink-0 group-hover/tip:rotate-12 transition-transform">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1 italic font-mono">Editor's Axiom</p>
                        <p className="text-xs text-zinc-400 font-medium italic leading-relaxed">"{template.proTip}"</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: Timeline/Track Layout */}
              <div className="flex-1 p-12 bg-black/60 relative">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4 text-zinc-500">
                     <Film className="w-6 h-6" />
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] font-mono italic">Timeline_Config_0x{template.id}</p>
                   </div>
                   <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   </div>
                </div>

                <div className="space-y-4">
                  {template.trackLayout.map((track, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.6 }}
                      className="group/track flex items-center gap-8 p-6 bg-zinc-950/50 rounded-3xl ring-1 ring-white/5 hover:ring-emerald-500/20 transition-all cursor-pointer overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover/track:opacity-100 transition-opacity" />
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs ring-1 shrink-0 relative z-10",
                        track.type === 'Video' ? "bg-blue-500/10 text-blue-400 ring-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.1)]" :
                        track.type === 'Audio' ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]" :
                        track.type === 'Graphics' ? "bg-purple-500/10 text-purple-400 ring-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.1)]" :
                        "bg-amber-500/10 text-amber-400 ring-amber-500/30"
                      )}>
                        {track.type.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0 relative z-10">
                         <div className="flex items-center gap-4 mb-1">
                            <p className="text-lg font-black text-white uppercase italic tracking-tighter truncate group-hover:text-emerald-400 transition-colors">{track.name}</p>
                            <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest font-mono">[{track.type}]</span>
                         </div>
                         <p className="text-xs text-zinc-500 truncate font-medium">{track.description}</p>
                      </div>
                      <div className="flex-1 hidden md:block h-px bg-zinc-800 relative overflow-hidden self-center mx-8">
                         <div className="absolute inset-y-[-2px] left-0 bg-white/20 w-1/3 rounded-full opacity-50 group-hover/track:bg-emerald-500 transition-all duration-700" style={{ left: `${i * 12 + 10}%`, width: `${25 + (i % 4) * 15}%` }}></div>
                      </div>
                      <div className="text-[10px] font-mono text-zinc-800 font-bold hidden xl:block uppercase">Saved</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CommandStrip = ({ activeTab, user }: { activeTab: string, user: any }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between px-10 py-4 bg-zinc-950/50 border-b border-white/5 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-10">
        <div className="flex flex-col">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 font-mono italic">Sector_Path</p>
          <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest leading-none">ROOT / {activeTab.replace('_', ' ')}</p>
        </div>
        <div className="hidden md:flex flex-col">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 font-mono italic">Neural_Link</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-widest leading-none">Uplink Stable</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 font-mono italic">Your Name</p>
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-tighter truncate max-w-[120px]">
            {user?.displayName || user?.email || 'GUEST'}
          </p>
        </div>

        <button 
          onClick={() => signOut(auth)}
          className="p-3 bg-zinc-900 border border-white/5 rounded-2xl hover:bg-zinc-800 hover:text-red-400 transition-all text-zinc-500 group"
          title="Sign Out"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="flex flex-col items-end">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1 font-mono italic">Time</p>
          <p className="text-xs font-mono font-bold text-white uppercase tracking-tighter">
            {time.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center glow-emerald">
          <Zap className="w-5 h-5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, authLoading] = useAuthState(auth);
  const [isLicensed, setIsLicensed] = useState(() => {
    const saved = localStorage.getItem('dm_license_key');
    return saved ? VALID_LICENSE_KEYS.includes(saved) : false;
  });
  
  // Persistence
  const { data: clients, add: addClient, update: updateClientDoc, remove: removeClient } = useFirestore<Client>('clients');
  const { data: transactions, add: addTransaction, update: updateTransactionDoc, remove: removeTransaction } = useFirestore<Transaction>('transactions');
  const { roadmap: roadmapDataDb, loading: roadmapLoading, updateDay } = useRoadmap();
  const { roadmap: week2RoadmapDataDb, loading: week2Loading, updateDay: updateWeek2Day } = useWeek2Roadmap();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  // Combine static data with Firestore progress
  const roadmapState = useMemo(() => {
    return ROADMAP_DATA.map((dayPlan) => {
      const dbDay = roadmapDataDb.find((d: any) => d.day === dayPlan.day);
      if (!dbDay) return dayPlan;
      return {
        ...dayPlan,
        tasks: dayPlan.tasks.map(t => {
          const dbTask = dbDay.tasks.find((dt: any) => dt.id === t.id);
          return { ...t, completed: dbTask ? dbTask.completed : t.completed };
        })
      };
    });
  }, [roadmapDataDb]);

  const week2State = useMemo(() => {
    return WEEK2_ROADMAP_DATA.map((dayPlan) => {
      const dbDay = week2RoadmapDataDb.find((d: any) => d.day === dayPlan.day);
      if (!dbDay) return dayPlan;
      return {
        ...dayPlan,
        tasks: dayPlan.tasks.map(t => {
          const dbTask = dbDay.tasks.find((dt: any) => dt.id === t.id);
          return { ...t, completed: dbTask ? dbTask.completed : t.completed };
        })
      };
    });
  }, [week2RoadmapDataDb]);

  const toggleTask = async (dayIndex: number, taskId: string) => {
    const day = roadmapState[dayIndex];
    if (!day) return;
    const tasks = day.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    await updateDay(day.day - 1, tasks);
  };

  const toggleWeek2Task = async (dayIndex: number, taskId: string) => {
    const day = week2State[dayIndex];
    if (!day) return;
    const tasks = day.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    await updateWeek2Day(dayIndex, tasks);
  };

  const isWeek1Complete = useMemo(() => {
    return roadmapState.every(day => day.tasks.every(task => task.completed));
  }, [roadmapState]);

  const [showUnlockBanner, setShowUnlockBanner] = useState(false);
  const [lastCompleteState, setLastCompleteState] = useState(false);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (roadmapLoading) return;

    if (isWeek1Complete) {
      if (!lastCompleteState) {
        if (!initialLoadRef.current) {
          setShowUnlockBanner(true);
        }
        setLastCompleteState(true);
      }
    } else {
      if (lastCompleteState) {
        setLastCompleteState(false);
        if (activeTab === 'week2') {
          setActiveTab('dashboard');
        }
      }
    }
    initialLoadRef.current = false;
  }, [isWeek1Complete, roadmapLoading, activeTab, lastCompleteState]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: '7-Day Plan', icon: Map },
    ...(isWeek1Complete ? [{ id: 'week2', label: 'Week 2 Plan', icon: RefreshCw }] : []),
    { id: 'portfolio', label: 'Portfolio Ops', icon: Briefcase },
    { id: 'pricing', label: 'Rate Cards', icon: DollarSign },
    { id: 'outreach_hub', label: 'Send DMs', icon: Send },
    { id: 'closing', label: 'Close Clients', icon: Target },
    { id: 'clients', label: 'My Clients', icon: Users },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp },
    { id: 'templates', label: 'Templates', icon: Layers },
    { id: 'dms', label: 'DM Scripts', icon: MessageSquare },
    { id: 'resources', label: 'Resources', icon: Briefcase },
    { id: 'find', label: 'Find Clients', icon: Search },
    { id: 'mindset', label: 'Psychology', icon: Brain },
  ];

  const renderContent = () => {
    if (roadmapLoading || profileLoading) return (
      <div className="h-full flex items-center justify-center p-20">
         <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );

    switch (activeTab) {
      case 'dashboard': return <Dashboard roadmapState={roadmapState} clients={clients} transactions={transactions} setActiveTab={setActiveTab} />;
      case 'roadmap': return <Roadmap roadmapState={roadmapState} toggleTask={toggleTask} />;
      case 'week2': return <Week2Protocol week2State={week2State} toggleTask={toggleWeek2Task} clients={clients} />;
      case 'portfolio': return <PortfolioManager profile={profile} updateProfile={updateProfile} />;
      case 'pricing': return <RateCardManager />;
      case 'templates': return <ProjectTemplates />;
      case 'dms': return <DMLibrary profile={profile} />;
      case 'clients': return <ClientTracker clients={clients} addClient={addClient} updateClient={updateClientDoc} deleteClient={removeClient} />;
      case 'outreach_hub': return <OutreachHub clients={clients} profile={profile} updateProfile={updateProfile} />;
      case 'closing': return <ClosingTools profile={profile} />;
      case 'earnings': return <EarningsTracker transactions={transactions} addTransaction={addTransaction} updateTransaction={updateTransactionDoc} deleteTransaction={removeTransaction} />;
      case 'resources': return <Resources />;
      case 'find': return <ClientFind />;
      case 'mindset': return <Mindset />;
      default: return <Dashboard roadmapState={roadmapState} clients={clients} transactions={transactions} />;
    }
  };

  if (!isLicensed) return <LicenseGate onUnlock={() => setIsLicensed(true)} />;

  if (authLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
       <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
    </div>
  );

  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans selection:bg-emerald-500 selection:text-black">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-6 right-6 z-50 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-80 bg-zinc-950 border-r border-white/5 transition-transform duration-500 ease-[0.16, 1, 0.3, 1] transform lg:translate-x-0 lg:static lg:block shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-10">
          <div className="flex items-center gap-4 px-2 mb-16 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-12 h-12 bg-emerald-500/10 ring-1 ring-emerald-500/30 rounded-2xl flex items-center justify-center glow-emerald hover:rotate-12 transition-transform duration-500">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="font-black text-white text-2xl tracking-tighter uppercase italic leading-none font-display">20 DM<span className="text-emerald-500">.SYS</span></h1>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-[8px] text-zinc-500 font-extrabold uppercase tracking-[0.2em] font-mono leading-none">Auth: Root_Access_V1</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <p className="px-5 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-6 italic leading-none">System_Modules</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all group relative overflow-hidden",
                  activeTab === item.id 
                    ? "text-white bg-white/5 ring-1 ring-white/10 translate-x-1" 
                    : "text-zinc-600 hover:text-zinc-300 hover:bg-white/5"
                )}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-rail"
                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_15px_rgba(16,185,129,1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                )}
                <item.icon className={cn(
                  "w-5 h-5 transition-all duration-300 group-hover:rotate-6",
                  activeTab === item.id ? "text-emerald-500" : "text-zinc-800 group-hover:text-zinc-600"
                )} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="p-6 bg-zinc-900/40 border border-white/5 rounded-[32px] space-y-6">
               <div className="flex justify-between items-center px-1">
                 <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">User_Session</p>
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/30" />
               </div>
               <div className="flex items-center gap-4">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || "User"} className="w-10 h-10 rounded-full ring-1 ring-white/5" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 ring-1 ring-white/5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-white uppercase tracking-tight truncate">{user.displayName || "Elite Editor"}</p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest truncate">{user.email}</p>
                  </div>
               </div>
               <button 
                onClick={() => signOut(auth)}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-black/20"
               >
                 <X className="w-3 h-3" /> Terminate_Session
               </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen relative">
        <AnimatePresence>
          {showUnlockBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              className="fixed top-10 left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl px-6 pointer-events-none"
            >
              <div className="bg-emerald-500 text-black p-8 rounded-[40px] shadow-[0_30px_60px_rgba(16,185,129,0.4)] flex items-center justify-between gap-8 border-b-8 border-emerald-700 pointer-events-auto">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black/10 rounded-[24px] flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin-slow" />
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic tracking-tighter text-2xl leading-none">Week 1 Complete</h4>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-2 opacity-80">Week 2 Plan Unlocked!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowUnlockBanner(false)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-black/10 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <CommandStrip activeTab={activeTab} user={user} />
        
        <div className="max-w-6xl mx-auto px-10 py-16 lg:px-20 relative">
          {/* Subtle page-load flare */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Subtle decorative elements */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full -z-10 pointer-events-none opacity-50" />
        <div className="fixed bottom-0 left-72 w-[400px] h-[400px] bg-blue-500/10 blur-[130px] rounded-full -z-10 pointer-events-none opacity-50" />
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />
      </main>
    </div>
  );
}
