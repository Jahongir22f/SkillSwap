"use client";

import { User } from '@/models/User';
import { SkillChip } from './SkillChip';
import { Button } from './ui/button';
import { MapPin, Star, Zap } from 'lucide-react';
import Image from 'next/image';

interface UserCardProps {
  user: User;
  compatibilityScore?: number;
  onSwapProposal?: (userId: string) => void;
}

export const UserCard = ({ user, compatibilityScore, onSwapProposal }: UserCardProps) => {
  return (
    <div className="warm-card group overflow-hidden border border-white/50">
      <div className="relative h-56 w-full overflow-hidden">
        {user.photoURL ? (
          <Image 
            src={user.photoURL} 
            alt={user.displayName} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-5xl font-black">
            {user.displayName.charAt(0)}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {compatibilityScore !== undefined && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg border border-primary/20">
            <Zap size={16} className="text-primary fill-primary animate-pulse" />
            <span className="text-sm font-black text-primary">{compatibilityScore}% match</span>
          </div>
        )}

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm border border-white/50">
          <Star size={14} className="fill-primary text-primary" />
          <span className="text-sm font-black text-gray-900">{user.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="font-black text-xl text-gray-900 group-hover:text-primary transition-colors">{user.displayName}</h3>
          <div className="flex items-center text-gray-400 text-sm mt-1 font-bold">
            <MapPin size={14} className="mr-1.5 text-primary" />
            <span>{user.location.city}</span>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2.5">Offers</p>
            <div className="flex flex-wrap gap-2">
              {user.offeredSkills.slice(0, 3).map(skill => (
                <SkillChip key={skill} skill={skill} variant="offer" className="px-3 py-1 text-xs font-bold" />
              ))}
              {user.offeredSkills.length > 3 && (
                <div className="h-7 px-2 flex items-center justify-center bg-secondary/50 rounded-lg text-[10px] font-black text-primary">
                  +{user.offeredSkills.length - 3}
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-2.5">Wants</p>
            <div className="flex flex-wrap gap-2">
              {user.neededSkills.slice(0, 3).map(skill => (
                <SkillChip key={skill} skill={skill} variant="want" className="px-3 py-1 text-xs font-bold" />
              ))}
              {user.neededSkills.length > 3 && (
                <div className="h-7 px-2 flex items-center justify-center bg-accent/10 rounded-lg text-[10px] font-black text-accent">
                  +{user.neededSkills.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button 
          className="w-full mt-8 bg-primary hover:bg-primary/90 text-white rounded-2xl py-6 font-black text-base shadow-xl shadow-primary/20"
          onClick={() => onSwapProposal?.(user.uid)}
        >
          Propose Skill Swap
        </Button>
      </div>
    </div>
  );
};
