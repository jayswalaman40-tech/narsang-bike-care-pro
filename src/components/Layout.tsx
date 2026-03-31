import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="phone">
      <LanguageSwitcher />
      {children}
    </div>
  );
};

export default Layout;
