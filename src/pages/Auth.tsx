import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function Auth() {
  const { t } = useTranslation();
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
    <div className="screen active" style={{ background: '#0a0a0a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      {/* SHADOW GLOW */}
      <div style={{ position: 'absolute', top: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle,rgba(232,89,12,.15) 0%,transparent 70%)', pointerEvents: 'none' }}></div>

      <div style={{ width: '100%', maxWidth: '340px', zIndex: 10, textAlign: 'center' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'linear-gradient(135deg,#E8590C,#ff7c35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', boxShadow: '0 8px 24px rgba(232,89,12,.4)' }}>
          🛵
        </div>
        
        <h1 style={{ fontFamily: "'Bebas Neue',cursive", fontSize: '36px', color: '#fff', letterSpacing: '3px', marginBottom: '4px' }}>
          {t('app.name')}
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,.5)', marginBottom: '32px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Garage Management System
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,.03)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Address</label>
            <input 
              type="email" 
              className="inp" 
              style={{ background: 'rgba(0,0,0,.3)', border: '1.5px solid rgba(255,255,255,.1)', color: '#fff' }}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,.4)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
            <input 
              type="password" 
              className="inp" 
              style={{ background: 'rgba(0,0,0,.3)', border: '1.5px solid rgba(255,255,255,.1)', color: '#fff', fontFamily: 'monospace' }}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '8px', color: '#ef4444', fontSize: '12px' }}>
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn bo"
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
