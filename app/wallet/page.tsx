"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Wallet, Transaction } from '@/models/Wallet';
import { CreditBalance } from '@/components/CreditBalance';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Gift, History } from 'lucide-react';

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Fetch wallet balance
    const unsubscribeWallet = onSnapshot(doc(db, 'wallets', user.uid), (doc) => {
      if (doc.exists()) {
        setWallet(doc.data() as Wallet);
      }
    });

    // Fetch transactions
    const q = query(
      collection(db, 'wallets', user.uid, 'transactions'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeTransactions = onSnapshot(q, (snapshot) => {
      const txs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
      setTransactions(txs);
      setLoading(false);
    });

    return () => {
      unsubscribeWallet();
      unsubscribeTransactions();
    };
  }, [user]);

  const earned = transactions
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.amount, 0);

  const spent = transactions
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">My Wallet</h1>
        <p className="text-gray-500 font-bold text-lg">Manage your skill swap credits and view session history.</p>
      </div>

      <CreditBalance 
        balance={wallet?.balance || 0} 
        earned={earned}
        spent={spent}
      />

      <div className="mt-16">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-secondary rounded-xl text-primary shadow-sm">
            <History size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Transaction History</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-white rounded-4xl h-24 animate-pulse border-2 border-secondary/20 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="warm-card border border-white/50 overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y-2 divide-secondary/10">
                {transactions.map((tx, i) => (
                  <motion.div 
                    key={tx.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-8 flex items-center justify-between hover:bg-warm-cream transition-colors group"
                  >
                    <div className="flex items-center space-x-6">
                      <div className={`p-4 rounded-2xl shadow-sm transition-transform group-hover:scale-110 ${
                        tx.type === 'earn' ? 'bg-secondary text-primary' : 
                        tx.type === 'spend' ? 'bg-accent/10 text-accent' : 
                        'bg-warm-peach text-primary'
                      }`}>
                        {tx.type === 'earn' ? <TrendingUp size={24} /> : 
                         tx.type === 'spend' ? <TrendingDown size={24} /> : 
                         <Gift size={24} />}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-base mb-1">{tx.description}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                          {tx.createdAt?.seconds ? format(new Date(tx.createdAt.seconds * 1000), 'MMM d, yyyy • HH:mm') : 'Processing...'}
                        </p>
                      </div>
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${
                      tx.amount > 0 ? 'text-primary' : 'text-accent'
                    }`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center">
                <div className="bg-secondary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                  <History size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">No transactions yet</h3>
                <p className="text-gray-500 font-bold max-w-xs mx-auto">Your credits and session history will appear here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
