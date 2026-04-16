"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from '@/models/User';
import { calculateCompatibilityScore } from '@/lib/matchingAlgorithm';
import { UserCard } from '@/components/UserCard';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeFeed() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<{ user: User; score: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Recommended');

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // In a real app, we'd use a more sophisticated query
        // For now, get users who have skills this user wants
        const usersRef = collection(db, 'users');
        const q = query(usersRef, limit(20));
        const querySnapshot = await getDocs(q);
        
        const recs: { user: User; score: number }[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as User;
          if (userData.uid !== user.uid) {
            const score = calculateCompatibilityScore(user, userData);
            recs.push({ user: userData, score });
          }
        });

        // Sort by score
        recs.sort((a, b) => b.score - a.score);
        setRecommendations(recs);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  const handleProposeSwap = async (otherUserId: string) => {
    if (!user) return;
    try {
      // Create a match proposal
      const matchesRef = collection(db, 'matches');
      await addDoc(matchesRef, {
        users: [user.uid, otherUserId],
        status: 'pending',
        createdAt: serverTimestamp(),
        compatibilityScore: recommendations.find(r => r.user.uid === otherUserId)?.score || 0,
        matchedSkills: [], // In real app, calculate this
      });
      alert("Swap proposal sent!");
    } catch (error) {
      console.error("Error proposing swap:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Search & Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="relative flex-grow max-w-3xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={24} />
          <input 
            type="text" 
            placeholder="Search skills, people, or topics..." 
            className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold input-glow bg-white shadow-sm"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="rounded-2xl border-2 border-secondary bg-white space-x-2 h-14 px-6 font-black text-gray-700 hover:border-primary/30">
            <Filter size={20} className="text-primary" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="rounded-2xl border-2 border-secondary bg-white space-x-2 h-14 px-6 font-black text-gray-700 hover:border-primary/30">
            <MapPin size={20} className="text-primary" />
            <span>{user?.location.city || 'Location'}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-10 border-b-2 border-secondary/30 mb-12 overflow-x-auto whitespace-nowrap scrollbar-hide pb-0.5">
        {['Recommended', 'Near You', 'Top Rated', 'Newest'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-5 text-base font-black transition-all relative ${
              activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full" 
              />
            )}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="bg-white rounded-4xl h-[450px] animate-pulse border-2 border-secondary/20 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.user.uid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <UserCard 
                user={rec.user} 
                compatibilityScore={rec.score}
                onSwapProposal={handleProposeSwap}
              />
            </motion.div>
          ))}
        </div>
      )}

      {!loading && recommendations.length === 0 && (
        <div className="text-center py-32 warm-card border-2 border-dashed border-secondary max-w-2xl mx-auto">
          <div className="bg-secondary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
            <Users size={40} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">No matches found yet</h3>
          <p className="text-gray-500 font-bold max-w-xs mx-auto">Try updating your skills or expanding your search to find more experts.</p>
        </div>
      )}
    </div>
  );
}
