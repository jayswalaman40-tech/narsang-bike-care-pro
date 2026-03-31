import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'hi', label: 'हि', flag: '🇮🇳', name: 'हिंदी' },
    { code: 'gu', label: 'ગુ', flag: '🇮🇳', name: 'ગુજરાતી' }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const toggleMenu = () => setIsOpen(!isOpen);
  const setLang = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <div className="lang-dot" onClick={toggleMenu}>
        🌐 <span>{currentLang.label}</span>
      </div>
      
      <div className={`lang-popup ${isOpen ? 'open' : ''}`}>
        {languages.map(lang => (
          <div 
            key={lang.code}
            className={`lang-opt ${i18n.language === lang.code ? 'active' : ''}`}
            onClick={() => setLang(lang.code)}
          >
            <span className="flag">{lang.flag}</span> {lang.name}
          </div>
        ))}
      </div>

      {isOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 996 }} 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};

export default LanguageSwitcher;
