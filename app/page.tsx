"use client";

import { useAuth } from '@/lib/auth-context';
import { auth, db } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Star, Zap, Users, Sparkles, Video, Search as SearchIcon } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        router.push('/onboarding');
      } else {
        router.push('/home');
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (user && !loading) {
    router.push('/home');
    return null;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-warm-cream text-gray-900 font-sans overflow-x-hidden pt-20">
      {/* Hero Section */}
      <section id="hero" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-secondary/30 rounded-full blur-3xl opacity-50 -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-50 -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
          >
            <div className="inline-flex items-center space-x-2 bg-secondary text-primary px-5 py-2 rounded-full text-sm font-bold mb-8 shadow-sm">
              <Sparkles size={16} className="fill-primary" />
              <span>SkillSwap Marketplace is Live!</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.05] text-gray-900">
              Teach Skills. <br />
              <span className="text-primary">Earn Credits.</span> <br />
              Learn Free.
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
              The modern way to upgrade your career without spending a dime. Swap expertise with people worldwide using our credit system.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={handleLogin} 
                className="bg-primary hover:bg-primary/90 text-white px-10 py-8 rounded-4xl text-xl font-black shadow-xl shadow-primary/20 btn-hover-scale"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                className="px-10 py-8 rounded-4xl text-xl font-black border-2 border-white bg-white/50 backdrop-blur-sm hover:bg-white transition-all btn-hover-scale"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              >
                How it Works
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10 bg-white p-3 rounded-[3rem] shadow-2xl shadow-warm-shadow border border-white">
              <div className="bg-warm-peach rounded-[2.5rem] overflow-hidden aspect-square relative group">
                <Image 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
                  alt="Students collaborating"
                  fill
                  className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-6 bg-white p-5 rounded-3xl shadow-xl shadow-warm-shadow border border-white z-20 flex items-center space-x-4"
            >
              <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">Malika matched!</p>
                <p className="text-xs text-gray-500 font-bold">UX Design • Python</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black mb-6">How SkillSwap Works</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">A detailed guide to your first successful knowledge exchange.</p>
          </motion.div>
          
          <div className="relative">
            {/* Dotted Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dotted border-secondary -translate-y-1/2 -z-0" />
            
            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              <StepItem 
                num="1" 
                title="Personalize Profile" 
                desc="List the specific skills you can teach and what you want to learn. Add a bio to build trust." 
                icon={<Users size={32} className="text-primary" />}
              />
              <StepItem 
                num="2" 
                title="Smart Matching" 
                desc="Our algorithm finds experts who want to learn exactly what you offer. Send a swap proposal." 
                icon={<SearchIcon size={32} className="text-primary" />}
              />
              <StepItem 
                num="3" 
                title="Swap & Earn" 
                desc="Schedule a video session. Earn 1 credit for every hour you teach. Spend it to learn anything." 
                icon={<Video size={32} className="text-primary" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Explore Skills Section */}
      <section id="explore-skills" className="py-32 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">Explore Skills</h2>
              <p className="text-xl text-gray-500 max-w-xl font-medium">From Programming to Public Speaking, find anything you want to learn.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-3xl font-black shadow-lg shadow-primary/20 btn-hover-scale">
              View All 50+ Skills
            </Button>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {['Programming', 'UI/UX', 'Python', 'English', 'Photography', 'Marketing'].map((skill, i) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="warm-card p-8 flex flex-col items-center justify-center text-center group cursor-pointer"
              >
                <div className="w-16 h-16 bg-warm-peach rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Sparkles size={24} />
                </div>
                <h3 className="font-black text-gray-900">{skill}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="bg-primary rounded-[4rem] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between text-white overflow-hidden relative shadow-2xl shadow-primary/30"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="mb-12 md:mb-0 max-w-2xl relative z-10 text-center md:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">Ready to expand your horizon?</h2>
              <p className="text-white/80 text-xl font-medium mb-0">Join our community today and start swapping skills with experts worldwide.</p>
            </div>
            <Button 
              onClick={handleLogin}
              className="bg-white text-primary hover:bg-warm-cream px-12 py-10 rounded-4xl text-2xl font-black relative z-10 btn-hover-scale shadow-xl"
            >
              Sign Up Free
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-white border-t border-warm-peach/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-black text-2xl tracking-tight">KNowAI</span>
            </div>
            <p className="text-gray-400 font-bold text-sm">© 2026 KNowAI Marketplace. All rights reserved.</p>
            <div className="flex space-x-10 text-sm font-black text-gray-500">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const StepItem = ({ num, title, desc, icon }: { num: string, title: string, desc: string, icon: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="flex flex-col items-center text-center group"
  >
    <div className="relative mb-10">
      <div className="w-24 h-24 bg-warm-peach rounded-full flex items-center justify-center text-primary shadow-lg shadow-warm-shadow group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </div>
      <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-lg border-4 border-white z-20 shadow-md">
        {num}
      </div>
    </div>
    <h3 className="text-2xl font-black mb-5 text-gray-900">{title}</h3>
    <p className="text-gray-500 leading-relaxed font-medium px-4">{desc}</p>
  </motion.div>
);
