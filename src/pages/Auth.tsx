import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Wrench, LogIn, Mail, Lock } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="w-full max-w-sm z-10 animate-slide-up">
        <div className="flex flex-col items-center mb-10">
           <div className="w-20 h-20 bg-primary-500 rounded-2xl flex items-center justify-center shadow-glow mb-4 transform -rotate-6">
             <Wrench size={40} className="text-white transform rotate-6" />
           </div>
           <h1 className="text-3xl font-display tracking-widest text-primary-500 uppercase">Shri Narsang</h1>
           <h2 className="text-xl font-display tracking-wider text-white uppercase">Bike Care</h2>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-md shadow-card">
           <div>
             <label className="input-label ml-0 mb-2 flex items-center gap-2"><Mail size={14}/> Email Address</label>
             <input 
               type="email" 
               required
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="input-base bg-gray-950 border-gray-800" 
             />
           </div>
           
           <div>
             <label className="input-label ml-0 mb-2 flex items-center gap-2"><Lock size={14}/> Password</label>
             <input 
               type="password" 
               required
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="input-base bg-gray-950 border-gray-800 font-mono tracking-widest" 
             />
           </div>

           {errorMsg && (
             <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-bold text-center">
               {errorMsg}
             </div>
           )}

           <button 
             type="submit" 
             disabled={loading}
             className="btn-primary mt-2 shadow-glow"
           >
             {loading ? (
               <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin mx-auto"></div>
             ) : (
               <><LogIn size={20} /> LOGIN</>
             )}
           </button>
        </form>
        
        <p className="text-center text-gray-500 font-sans text-xs tracking-widest uppercase mt-8 opacity-50">
          Internal Garage Management System
        </p>
      </div>
    </div>
  );
}
