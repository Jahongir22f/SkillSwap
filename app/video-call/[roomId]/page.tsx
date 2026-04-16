"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { X, Clock } from 'lucide-react';

export default function VideoCallPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [startTime] = useState(Date.now());
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!user || !roomId || !containerRef.current) return;

    const initZego = async () => {
      // In a real app, you would get these from environment variables
      const appID = 123456789; // Placeholder
      const serverSecret = "your_server_secret"; // Placeholder

      try {
        const { ZegoUIKitPrebuilt } = await import('@zegocloud/zego-uikit-prebuilt');
        
        // Generate Kit Token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID, 
          serverSecret, 
          roomId as string, 
          user.uid, 
          user.displayName || "User"
        );

        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // Start the call
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: 'Personal link',
              url: window.location.protocol + '//' + window.location.host + window.location.pathname + '?roomID=' + roomId,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton: true,
          onLeaveRoom: () => {
            const endTime = Date.now();
            const callDuration = Math.floor((endTime - startTime) / 1000 / 60); // in minutes
            router.push(`/wallet?sessionEnded=true&duration=${callDuration}`);
          }
        });
      } catch (error) {
        console.error("Zego initialization failed:", error);
      }
    };

    initZego();

    const timer = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [user, roomId, router, startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-950 z-[100] flex flex-col font-sans">
      {/* Header */}
      <div className="p-6 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5 text-white z-10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            <span className="font-black text-sm uppercase tracking-widest text-emerald-400">Live Session</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
            <Clock size={18} className="text-primary" />
            <span className="font-black font-mono text-lg tracking-tight text-white/90">{formatDuration(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right mr-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-0.5">Teaching</p>
            <p className="text-sm font-bold text-white/70">UX Design &bull; Malika</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-12 h-12 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-rose-500 transition-all duration-300 shadow-lg border border-white/10"
            onClick={() => router.back()}
          >
            <X size={24} />
          </Button>
        </div>
      </div>
      
      {/* Main Video Area */}
      <div className="flex-grow relative bg-gray-950 overflow-hidden">
        <div ref={containerRef} className="w-full h-full zego-container" />
        
        {/* Floating Controls Overlay (Optional if Zego handles it) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-6 z-20">
          {/* Custom controls could go here if Zego UI is disabled */}
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-8 bg-black/40 backdrop-blur-xl border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto flex items-center justify-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
            <Clock size={20} />
          </div>
          <p className="text-gray-400 text-sm font-bold leading-relaxed">
            You're currently earning credits. <span className="text-white">60 minutes of teaching = 1.0 credit.</span> 
            Keep the conversation flowing!
          </p>
        </div>
      </div>

      <style jsx global>{`
        .zego-container .zego-layout-grid {
          background: transparent !important;
        }
        .zego-container .zego-video-view {
          border-radius: 2rem !important;
          overflow: hidden !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
