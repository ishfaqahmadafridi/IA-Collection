import React from 'react';
import TopBar from './TopBar';
import LogoNav from './LogoNav';

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500 bg-background text-foreground border-b border-border shadow-sm">
      <TopBar />
      <LogoNav />
    </header>
  );
}
