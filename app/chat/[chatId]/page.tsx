"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { Message, Chat } from '@/models/Message';
import { User } from '@/models/User';
import { ChatBox } from '@/components/ChatBox';

export default function ChatDetailPage() {
  const { chatId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !chatId) return;

    const fetchOtherUser = async () => {
      const chatDoc = await getDoc(doc(db, 'chats', chatId as string));
      if (chatDoc.exists()) {
        const chatData = chatDoc.data() as Chat;
        const otherId = chatData.participants.find(id => id !== user.uid);
        if (otherId) {
          const uDoc = await getDoc(doc(db, 'users', otherId));
          if (uDoc.exists()) {
            setOtherUser({ uid: otherId, ...uDoc.data() } as User);
          }
        }
      }
      setLoading(false);
    };

    fetchOtherUser();

    const messagesRef = collection(db, 'chats', chatId as string, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [user, chatId]);

  const handleSendMessage = async (text: string) => {
    if (!user || !chatId) return;

    const messageData = {
      chatId: chatId as string,
      senderId: user.uid,
      text,
      type: 'text',
      createdAt: serverTimestamp(),
      read: false,
    };

    await addDoc(collection(db, 'chats', chatId as string, 'messages'), messageData);

    // Update last message in chat
    await updateDoc(doc(db, 'chats', chatId as string), {
      lastMessage: {
        text,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });
  };

  const handleStartVideoCall = () => {
    // Generate a room ID and redirect
    const roomId = `room_${chatId}`;
    router.push(`/video-call/${roomId}`);
  };

  if (loading || !otherUser || !user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-100px)] py-4 px-4">
      <ChatBox 
        messages={messages}
        currentUser={user}
        otherUser={otherUser}
        onSendMessage={handleSendMessage}
        onStartVideoCall={handleStartVideoCall}
        onScheduleSession={() => alert("Scheduling feature coming soon!")}
      />
    </div>
  );
}
