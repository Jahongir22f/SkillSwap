"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { SKILLS_LIST } from '@/models/Skill';
import { SkillChip } from '@/components/SkillChip';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Search } from 'lucide-react';

export default function Onboarding() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [offeredSkills, setOfferedSkills] = useState<string[]>([]);
  const [neededSkills, setNeededSkills] = useState<string[]>([]);
  const [city, setCity] = useState('Tashkent');
  const [bio, setBio] = useState('');
  const [search, setSearch] = useState('');

  const filteredSkills = SKILLS_LIST.filter(s => 
    s.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const toggleSkill = (skill: string, list: string[], setList: (s: string[]) => void) => {
    if (list.includes(skill)) {
      setList(list.filter(s => s !== skill));
    } else {
      setList([...list, skill]);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        bio,
        offeredSkills,
        neededSkills,
        location: { city },
        rating: 5.0, // Initial rating
        reviewCount: 0,
        certificates: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Initialize wallet
      await setDoc(doc(db, 'wallets', user.uid), {
        uid: user.uid,
        balance: 1.0, // Welcome bonus credit
        updatedAt: serverTimestamp(),
      });

      router.push('/home');
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-20 min-h-screen flex flex-col justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="flex justify-between items-center mb-8 max-w-xs mx-auto">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2.5 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-primary w-12' : 'bg-secondary w-6'
              }`}
            />
          ))}
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          {step === 1 ? "What can you teach?" : step === 2 ? "What do you want to learn?" : "Tell us about yourself"}
        </h1>
        <p className="text-gray-500 text-lg font-medium">
          {step === 1 ? "Select the skills you're proficient in and want to share." : 
           step === 2 ? "Select the skills you're looking to acquire." : 
           "Complete your profile to start matching."}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            key="step1"
            className="warm-card p-8 border border-white/50"
          >
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="text" 
                placeholder="Search skills..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold input-glow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2.5 mb-10 max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
              {filteredSkills.map(skill => (
                <SkillChip 
                  key={skill} 
                  skill={skill} 
                  variant={offeredSkills.includes(skill) ? 'offer' : 'default'}
                  onClick={() => toggleSkill(skill, offeredSkills, setOfferedSkills)}
                  className="px-5 py-2.5 text-sm font-black"
                />
              ))}
            </div>
            <Button 
              className="w-full py-8 text-xl font-black rounded-3xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
              disabled={offeredSkills.length === 0}
              onClick={() => { setStep(2); setSearch(''); }}
            >
              Continue <ChevronRight className="ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            key="step2"
            className="warm-card p-8 border border-white/50"
          >
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <input 
                type="text" 
                placeholder="Search skills..." 
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold input-glow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2.5 mb-10 max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
              {filteredSkills.map(skill => (
                <SkillChip 
                  key={skill} 
                  skill={skill} 
                  variant={neededSkills.includes(skill) ? 'want' : 'default'}
                  onClick={() => toggleSkill(skill, neededSkills, setNeededSkills)}
                  className="px-5 py-2.5 text-sm font-black"
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1 py-8 rounded-3xl font-black text-xl border-2 border-secondary" onClick={() => setStep(1)}>Back</Button>
              <Button 
                className="flex-[2] py-8 text-xl font-black rounded-3xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                disabled={neededSkills.length === 0}
                onClick={() => { setStep(3); setSearch(''); }}
              >
                Continue <ChevronRight className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            key="step3"
            className="warm-card p-10 border border-white/50"
          >
            <div className="space-y-8 mb-10">
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-widest">Select your city</label>
                <select 
                  className="w-full p-5 rounded-2xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold bg-white appearance-none input-glow"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option>Tashkent</option>
                  <option>Samarkand</option>
                  <option>Bukhara</option>
                  <option>Andijan</option>
                  <option>Namangan</option>
                  <option>Fergana</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-black text-gray-700 mb-3 uppercase tracking-widest">Short Bio</label>
                <textarea 
                  placeholder="Tell others about your experience and what you're looking for..."
                  className="w-full p-5 rounded-2xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold min-h-[160px] input-glow"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" className="flex-1 py-8 rounded-3xl font-black text-xl border-2 border-secondary" onClick={() => setStep(2)}>Back</Button>
              <Button 
                className="flex-[2] py-8 text-xl font-black rounded-3xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20"
                onClick={handleComplete}
              >
                Complete Profile <Check className="ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
