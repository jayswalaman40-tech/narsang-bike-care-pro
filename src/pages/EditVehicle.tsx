import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useVehicleStore } from '../store/vehicleStore';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  time: string;
}

const EditVehicle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { selectedVehicle, getVehicleById, updateVehicle, isLoading } = useVehicleStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      getVehicleById(id);
    }
  }, [id, getVehicleById]);

  useEffect(() => {
    if (selectedVehicle && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: `${t('edit.mode', 'EDITING')}: ${selectedVehicle.number_plate}`,
          sender: 'bot',
          time: '9:41 AM'
        },
        {
          id: 2,
          text: t('edit.prompt', 'What to change? e.g. "estimate 3000 karo"'),
          sender: 'bot',
          time: '9:41 AM'
        }
      ]);
    }
  }, [selectedVehicle, t, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (isLoading || !selectedVehicle) {
    return <div className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  const v = selectedVehicle;

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Mock processing
    setTimeout(async () => {
      setIsTyping(false);
      const text = userMsg.text.toLowerCase();
      let response = "I didn't quite catch that. Try 'estimate 3000' or 'change problem to...'";
      
      try {
        if (text.includes('estimate') || text.includes('budget') || text.includes('cost')) {
          const num = text.match(/\d+/);
          if (num) {
            await updateVehicle(v.id, { estimate: Number(num[0]) });
            response = `Got it. Updating estimate to ₹${num[0]}... Updates applied! ✅`;
          }
        } else if (text.includes('problem') || text.includes('saat') || text.includes('issue')) {
          const newProb = userMsg.text.split(/problem|to|issue/i).pop()?.trim();
          if (newProb) {
            await updateVehicle(v.id, { problem: newProb });
            response = `Updating problem description to: "${newProb}"... Done! ✅`;
          }
        } else if (text.includes('done') || text.includes('save') || text.includes('back')) {
          navigate(`/vehicle/${v.id}`);
          return;
        }

        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } catch (err: any) {
         setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Error updating: " + err.message,
          sender: 'bot',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    }, 1000);
  };

  return (
    <div className="screen active" id="s-edit">
      <div className="sbar"><span className="t" style={{ color: 'var(--dk)' }}>9:41</span></div>
      <div className="hdr">
        <button className="bk" onClick={() => navigate(`/vehicle/${v.id}`)}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </button>
        <div className="hdr-t">{t('edit.title', 'Quick Edit')}</div>
        <button className="sm bw" onClick={() => navigate(`/vehicle/${v.id}`)}>
          {t('btn.save', 'Done')}
        </button>
      </div>

      <div className="cnt chat-wrap" ref={scrollRef} style={{ paddingBottom: '160px' }}>
        {messages.map(m => (
          <React.Fragment key={m.id}>
            <div className={`bub ${m.sender === 'bot' ? 'bb' : 'bu'}`}>
              {m.text}
            </div>
            <div className={`bt ${m.sender === 'user' ? 'r' : ''}`}>{m.time}</div>
          </React.Fragment>
        ))}
        
        {isTyping && (
          <div className="bub bb">
            <div className="dot"></div> <div className="dot"></div> <div className="dot"></div>
          </div>
        )}
      </div>

      <div className="chat-bar">
        <button className="cbtn cmic">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
        <input 
          className="cinp" 
          placeholder={t('edit.placeholder', 'Type message...')} 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="cbtn" onClick={handleSend} style={{ opacity: inputValue.trim() ? 1 : 0.6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      <div className="bnav">
        <button className="ni" onClick={() => navigate('/intake')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>{t('nav.intake')}</span>
        </button>
        <button className="ni on" onClick={() => navigate('/dashboard')}>
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          <span>{t('nav.jobs')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/report')}>
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
          <span>{t('nav.report')}</span>
        </button>
        <button className="ni" onClick={() => navigate('/follow-up')}>
          <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="13" y2="14" /></svg>
          <span>{t('nav.followup')}</span>
        </button>
      </div>
    </div>
  );
};

export default EditVehicle;
