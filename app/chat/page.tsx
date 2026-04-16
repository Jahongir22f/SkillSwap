"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Chat } from '@/models/Message';
import { User } from '@/models/User';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { MessageSquare } from 'lucide-react';

export default function ChatListPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<{ chat: Chat; otherUser: User }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', user.uid), orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList: { chat: Chat; otherUser: User }[] = [];
      
      for (const chatDoc of snapshot.docs) {
        const chatData = { id: chatDoc.id, ...chatDoc.data() } as Chat;
        const otherUserId = chatData.participants.find(id => id !== user.uid);
        
        if (otherUserId) {
          const otherUserDoc = await getDoc(doc(db, 'users', otherUserId));
          if (otherUserDoc.exists()) {
            chatList.push({
              chat: chatData,
              otherUser: { uid: otherUserId, ...otherUserDoc.data() } as User
            });
          }
        }
      }
      setChats(chatList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Messages</h1>
        <p className="text-gray-500 font-bold text-lg">Connect and coordinate with your skill swap partners.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-4xl h-28 animate-pulse border-2 border-secondary/20 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="warm-card border border-white/50 overflow-hidden shadow-2xl shadow-warm-shadow">
          {chats.length > 0 ? (
            <div className="divide-y-2 divide-secondary/10">
              {chats.map(({ chat, otherUser }, i) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/chat/${chat.id}`}>
                    <div className="p-8 flex items-center space-x-6 hover:bg-warm-cream transition-all cursor-pointer group">
                      <div className="w-16 h-16 rounded-[2rem] bg-secondary flex-shrink-0 flex items-center justify-center text-primary text-2xl font-black overflow-hidden relative shadow-lg group-hover:rotate-3 transition-transform">
                        {otherUser.photoURL ? (
                          <Image src={otherUser.photoURL} alt={otherUser.displayName} fill className="object-cover" />
                        ) : (
                          otherUser.displayName.charAt(0)
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-black text-xl text-gray-900 truncate group-hover:text-primary transition-colors">{otherUser.displayName}</h4>
                          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                            {chat.updatedAt?.seconds ? format(new Date(chat.updatedAt.seconds * 1000), 'MMM d') : ''}
                          </span>
                        </div>
                        <p className="text-base text-gray-500 font-medium truncate">
                          {chat.lastMessage?.senderId === user?.uid ? (
                            <span className="text-primary font-bold">You: </span>
                          ) : ''}
                          {chat.lastMessage?.text || 'Start a conversation'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-32 text-center">
              <div className="bg-secondary w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-primary shadow-inner">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">No messages yet</h3>
              <p className="text-gray-500 font-bold mb-10">Start matching with people to begin chatting.</p>
              <Link href="/home">
                <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-7 rounded-2xl text-xl font-black shadow-xl shadow-primary/20 btn-hover-scale">
                  Explore People
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
