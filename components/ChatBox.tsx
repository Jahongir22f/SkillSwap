"use client";

import { Message } from '@/models/Message';
import { User } from '@/models/User';
import { Button } from './ui/button';
import { Send, Image as ImageIcon, Video, Calendar, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Image from 'next/image';

interface ChatBoxProps {
  messages: Message[];
  currentUser: User;
  otherUser: User;
  onSendMessage: (text: string) => void;
  onStartVideoCall?: () => void;
  onScheduleSession?: () => void;
}

export const ChatBox = ({ 
  messages, 
  currentUser, 
  otherUser, 
  onSendMessage, 
  onStartVideoCall,
  onScheduleSession
}: ChatBoxProps) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full warm-card border-white/50 shadow-2xl shadow-warm-shadow overflow-hidden">
      {/* Header */}
      <div className="p-6 nav-frosted flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary font-black overflow-hidden shadow-sm">
            {otherUser.photoURL ? (
              <Image src={otherUser.photoURL} alt={otherUser.displayName} width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              otherUser.displayName.charAt(0)
            )}
          </div>
          <div>
            <h4 className="font-black text-gray-900 leading-tight text-lg">{otherUser.displayName}</h4>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-gray-400 hover:text-primary hover:bg-secondary/30 transition-all" onClick={onStartVideoCall}>
            <Video size={22} />
          </Button>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-gray-400 hover:text-primary hover:bg-secondary/30 transition-all" onClick={onScheduleSession}>
            <Calendar size={22} />
          </Button>
          <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-secondary/30 transition-all">
            <MoreVertical size={22} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-warm-cream/30 scrollbar-hide">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUser.uid;
          return (
            <motion.div 
              key={msg.id || idx} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex", isMe ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[80%] px-6 py-4 rounded-[2rem] text-base shadow-sm font-medium",
                isMe 
                  ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                  : "bg-white text-gray-800 border border-secondary/20 rounded-tl-none"
              )}>
                <p className="leading-relaxed">{msg.text}</p>
                <p className={cn(
                  "text-[10px] mt-2 font-black uppercase tracking-widest",
                  isMe ? "text-white/70" : "text-gray-400"
                )}>
                  {msg.createdAt?.seconds ? format(new Date(msg.createdAt.seconds * 1000), 'HH:mm') : 'Just now'}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-secondary/10 bg-white">
        <div className="flex items-center space-x-3 bg-secondary/30 px-5 py-3 rounded-[2rem] focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300">
          <Button variant="ghost" size="icon" className="text-gray-400 p-0 hover:bg-transparent hover:text-primary transition-colors">
            <ImageIcon size={22} />
          </Button>
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-grow bg-transparent border-none focus:ring-0 text-base py-2 font-bold placeholder:text-gray-400"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className={cn(
              "rounded-2xl w-12 h-12 transition-all duration-300 shadow-lg",
              inputText.trim() 
                ? "bg-primary text-white shadow-primary/30 scale-100" 
                : "bg-gray-200 text-gray-400 scale-90"
            )}
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
