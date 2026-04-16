"use client";

import { Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface CreditBalanceProps {
  balance: number;
  earned?: number;
  spent?: number;
}

export const CreditBalance = ({ balance, earned = 0, spent = 0 }: CreditBalanceProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-primary to-accent p-8 rounded-[2.5rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
            <WalletIcon size={28} />
          </div>
          <span className="text-xs font-black bg-white/20 px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-widest">Total Balance</span>
        </div>
        <div className="text-5xl font-black mb-2 relative z-10 tracking-tight">{balance.toFixed(2)}</div>
        <p className="text-white/80 text-sm font-bold relative z-10 uppercase tracking-widest">Available Credits</p>
      </div>

      <div className="warm-card p-8 flex items-center space-x-6 border border-white/50">
        <div className="p-4 bg-secondary rounded-2xl text-primary shadow-sm group-hover:rotate-6 transition-transform">
          <TrendingUp size={32} />
        </div>
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Credits Earned</p>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{earned.toFixed(2)}</p>
        </div>
      </div>

      <div className="warm-card p-8 flex items-center space-x-6 border border-white/50">
        <div className="p-4 bg-accent/10 rounded-2xl text-accent shadow-sm group-hover:-rotate-6 transition-transform">
          <TrendingDown size={32} />
        </div>
        <div>
          <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Credits Spent</p>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{spent.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};
