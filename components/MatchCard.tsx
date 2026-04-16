"use client";

import { User } from '@/models/User';
import { Match } from '@/models/Match';
import { Button } from './ui/button';
import { MessageSquare, Calendar, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface MatchCardProps {
  match: Match;
  otherUser: User;
}

export const MatchCard = ({ match, otherUser }: MatchCardProps) => {
  return (
    <div className="warm-card p-6 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 border border-white/50">
      <div className="relative w-24 h-24 flex-shrink-0 group">
        {otherUser.photoURL ? (
          <Image 
            src={otherUser.photoURL} 
            alt={otherUser.displayName} 
            fill 
            className="rounded-3xl object-cover shadow-lg shadow-warm-shadow group-hover:rotate-3 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full rounded-3xl bg-secondary flex items-center justify-center text-primary text-3xl font-black shadow-lg shadow-warm-shadow group-hover:rotate-3 transition-transform duration-300">
            {otherUser.displayName.charAt(0)}
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 bg-primary w-6 h-6 rounded-full border-4 border-white shadow-md"></div>
      </div>

      <div className="flex-grow text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h4 className="font-black text-gray-900 text-xl mb-1">{otherUser.displayName}</h4>
            <p className="text-gray-400 text-sm font-bold">
              Matched on <span className="text-primary">{match.matchedSkills.join(' & ')}</span>
            </p>
          </div>
          <div className="mt-3 md:mt-0">
            <span className="bg-secondary/50 text-primary text-xs font-black px-4 py-2 rounded-2xl border border-primary/10">
              {match.compatibilityScore}% Compatibility
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
          <Link href={`/chat/${match.id}`}>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 py-3 font-black space-x-2 shadow-lg shadow-primary/20">
              <MessageSquare size={18} />
              <span>Chat</span>
            </Button>
          </Link>
          <Button size="sm" variant="outline" className="rounded-2xl px-6 py-3 font-black space-x-2 border-secondary text-primary hover:bg-secondary/20">
            <Calendar size={18} />
            <span>Schedule</span>
          </Button>
          <Button size="sm" variant="ghost" className="rounded-2xl w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary hover:bg-secondary/20">
            <MoreHorizontal size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
