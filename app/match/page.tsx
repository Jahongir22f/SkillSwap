"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Match } from '@/models/Match';
import { User } from '@/models/User';
import { MatchCard } from '@/components/MatchCard';
import { Users, Search } from 'lucide-react';

export default function MatchPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<{ match: Match; otherUser: User }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;
      setLoading(true);

      try {
        const matchesRef = collection(db, 'matches');
        const q = query(matchesRef, where('users', 'array-contains', user.uid));
        const querySnapshot = await getDocs(q);
        
        const matchesData: { match: Match; otherUser: User }[] = [];
        
        for (const matchDoc of querySnapshot.docs) {
          const match = { id: matchDoc.id, ...matchDoc.data() } as Match;
          const otherUserId = match.users.find(id => id !== user.uid);
          
          if (otherUserId) {
            const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
            if (otherUserDoc.exists()) {
              matchesData.push({
                match,
                otherUser: { uid: otherUserId, ...otherUserDoc.data() } as User
              });
            }
          }
        }

        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">My Skill Matches</h1>
        <p className="text-gray-500 font-bold text-lg">People you've connected with for skill swapping.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-4xl h-40 animate-pulse border-2 border-secondary/20 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(({ match, otherUser }, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <MatchCard match={match} otherUser={otherUser} />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-32 warm-card border-2 border-dashed border-secondary max-w-2xl mx-auto">
          <div className="bg-secondary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
            <Search size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">No active matches</h3>
          <p className="text-gray-500 font-bold mb-10">Go to the home feed to find people to swap skills with.</p>
          <Link href="/home">
            <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-7 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 btn-hover-scale">
              Find Matches
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
