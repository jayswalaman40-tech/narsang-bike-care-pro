import { useTranslation } from 'react-i18next';
import { useUIStore } from '../store/uiStore';

export default function Header() {
  const { toggleDrawer } = useUIStore();

  return (
    <header className="flex justify-between items-center py-4 px-2 w-full animate-fade-in z-20 sticky top-0 bg-[var(--app-bg)]/90 backdrop-blur-md border-b border-gray-900">
      <div className="flex items-center gap-3">
        {/* Simple Burger Menu Icon */}
        <button 
          onClick={toggleDrawer}
          className="p-2 text-white hover:text-primary-500 transition-colors"
        >
          <div className="w-6 h-0.5 bg-current mb-1.5"></div>
          <div className="w-4 h-0.5 bg-current mb-1.5"></div>
          <div className="w-6 h-0.5 bg-current"></div>
        </button>
        
        <h1 className="text-2xl font-display tracking-widest text-primary-500 m-0 leading-none">
          SNBC
        </h1>
      </div>

      <div className="flex items-center">
        <LangPill />
      </div>
    </header>
  );
}

// Small inline component for language switcher
function LangPill() {
  const { i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();

  const toggleLanguage = () => {
    const langs: ('en' | 'hi' | 'gu')[] = ['en', 'hi', 'gu'];
    const nextIdx = (langs.indexOf(language) + 1) % langs.length;
    const nextLang = langs[nextIdx];
    i18n.changeLanguage(nextLang);
    setLanguage(nextLang);
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 flex items-center gap-1 hover:bg-gray-700 transition"
    >
      <span className="text-xs font-bold text-gray-300 uppercase">{language}</span>
    </button>
  );
}
