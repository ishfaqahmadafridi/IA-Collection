import React, { useEffect } from 'react';
import { useUiStore } from '../../stores/ui/uiStore';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import HomeContent from './HomeContent';
import SearchDialog from '../search/SearchDialog';

export default function Home() {
  const currentPage = useUiStore((state) => state.currentPage);
  const isSearchDialogOpen = useUiStore((state) => state.isSearchDialogOpen);
  const setSearchDialogOpen = useUiStore((state) => state.setSearchDialogOpen);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const isAdminPage = currentPage === 'admin';

  if (isAdminPage) {
    return <HomeContent page={currentPage} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow">
        <HomeContent page={currentPage} />
      </main>
      <Footer />
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
      />
    </div>
  );
}
