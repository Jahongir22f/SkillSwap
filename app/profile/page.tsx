"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '@/models/User';
import { SkillChip } from '@/components/SkillChip';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Award, Settings, Edit3, Camera, LogOut } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || '');

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio,
        updatedAt: new Date()
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header Profile */}
      <div className="warm-card border-white/50 overflow-hidden mb-12 shadow-2xl shadow-warm-shadow">
        <div className="h-48 bg-gradient-to-br from-primary to-accent relative">
          <Button 
            variant="ghost" 
            className="absolute top-8 right-8 text-white hover:bg-white/20 rounded-2xl font-black text-sm px-6 backdrop-blur-md border border-white/10"
            onClick={() => logout()}
          >
            <LogOut size={20} className="mr-2" />
            Sign Out
          </Button>
        </div>
        <div className="px-10 pb-12 -mt-20 relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="flex flex-col md:flex-row md:items-end space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <div className="w-full h-full rounded-[3.5rem] border-8 border-white bg-secondary flex items-center justify-center text-primary text-6xl font-black overflow-hidden shadow-2xl relative">
                  {user.photoURL ? (
                    <Image src={user.photoURL} alt={user.displayName} fill className="object-cover" />
                  ) : (
                    user.displayName.charAt(0)
                  )}
                </div>
                <button className="absolute bottom-4 right-4 bg-white p-3.5 rounded-2xl shadow-xl border border-secondary text-primary hover:scale-110 transition-transform duration-300">
                  <Camera size={24} />
                </button>
              </div>
              <div className="mb-4">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{user.displayName}</h1>
                <div className="flex flex-wrap items-center gap-6 text-gray-400 font-bold">
                  <div className="flex items-center bg-secondary/30 px-4 py-1.5 rounded-full border border-secondary/20">
                    <MapPin size={18} className="mr-2 text-primary" />
                    <span className="text-sm text-gray-700">{user.location.city}</span>
                  </div>
                  <div className="flex items-center bg-primary/10 px-4 py-1.5 rounded-full border border-primary/10 text-primary">
                    <Star size={18} className="mr-2 fill-primary" />
                    <span className="text-sm font-black">{user.rating.toFixed(1)} <span className="text-gray-400 font-medium ml-1">({user.reviewCount} reviews)</span></span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-4">
              <Button 
                variant="outline" 
                className="rounded-2xl h-14 px-8 border-2 border-secondary font-black text-gray-700 space-x-2 btn-hover-scale"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 size={20} className="text-primary" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </Button>
              <Button variant="outline" size="icon" className="rounded-2xl h-14 w-14 border-2 border-secondary text-gray-400 hover:text-primary btn-hover-scale">
                <Settings size={24} />
              </Button>
            </div>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest text-sm">About Me</h3>
                {isEditing ? (
                  <div className="space-y-6">
                    <textarea 
                      className="w-full p-6 rounded-3xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none min-h-[160px] font-bold input-glow transition-all"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <Button onClick={handleUpdateProfile} className="bg-primary hover:bg-primary/90 text-white px-10 py-6 rounded-2xl font-black shadow-xl shadow-primary/20">
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-lg leading-relaxed bg-warm-cream/50 p-8 rounded-[2.5rem] border-2 border-secondary/20 font-medium italic">
                    {user.bio || "No bio added yet. Tell people about your expertise and what you want to learn!"}
                  </p>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-10">
                <div className="warm-card p-8 border border-secondary/10 bg-white/50">
                  <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-6">Skills I Offer</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.offeredSkills.map(skill => (
                      <SkillChip key={skill} skill={skill} variant="offer" className="px-5 py-2.5 text-sm font-black" />
                    ))}
                  </div>
                </div>
                <div className="warm-card p-8 border border-accent/10 bg-white/50">
                  <h3 className="text-xs font-black text-accent uppercase tracking-widest mb-6">Skills I Want</h3>
                  <div className="flex flex-wrap gap-3">
                    {user.neededSkills.map(skill => (
                      <SkillChip key={skill} skill={skill} variant="want" className="px-5 py-2.5 text-sm font-black" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="warm-card p-8 border border-secondary/10">
                <h3 className="text-xs font-black text-gray-900 mb-6 uppercase tracking-widest">Certificates</h3>
                <div className="space-y-4">
                  {user.certificates.length > 0 ? (
                    user.certificates.map((cert, idx) => (
                      <div key={idx} className="flex items-center p-5 bg-warm-cream rounded-2xl border border-secondary/30 shadow-sm group">
                        <div className="p-3 bg-white rounded-xl text-primary mr-4 shadow-sm group-hover:rotate-6 transition-transform">
                          <Award size={24} />
                        </div>
                        <span className="text-sm font-black text-gray-700">{cert}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center border-2 border-dashed border-secondary/30 rounded-[2.5rem] bg-secondary/5">
                      <Award size={40} className="mx-auto text-secondary mb-4 opacity-50" />
                      <p className="text-xs text-gray-400 font-black uppercase tracking-widest">No certificates verified yet.</p>
                    </div>
                  )}
                  <Button variant="ghost" className="w-full text-primary text-sm font-black hover:bg-secondary/20 rounded-2xl py-6 mt-4">
                    + Add Certificate
                  </Button>
                </div>
              </div>

              <div className="bg-primary p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-2xl font-black mb-3 relative z-10">Invite Friends</h3>
                <p className="text-sm text-white/80 font-bold mb-8 relative z-10 leading-relaxed">Earn <span className="text-white">0.5 bonus credits</span> for every friend who joins.</p>
                <Button className="w-full bg-white text-primary hover:bg-warm-cream text-sm font-black py-4 h-14 rounded-2xl relative z-10 shadow-lg btn-hover-scale">
                  Share Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
