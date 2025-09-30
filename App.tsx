import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DesktopTabbar from './components/DesktopTabbar';
import BottomNavbar from './components/BottomNavbar';
import Footer from './components/Footer';
import JournalPage from './pages/JournalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore, applyThemeToDOM } from './store/appStore';
import { APP_NAME } from './constants';
import Icon from './components/common/Icon';
import navimage from './icon/navImage.png'
import ChatPopup from './components/ChatPopup';
import navimageDark from './icon/navImage_darkmode.png'

export type ViewId = 'journal' | 'analytics' | 'settings';

export interface TabItemConfig {
  viewId: ViewId;
  label: string;
  icon: string;
}

const AppContent: React.FC = () => {
  const theme = useAppStore(state => state.settings.theme);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Ensure theme is applied on initial load after Zustand rehydration
  useEffect(() => {
    const currentTheme = useAppStore.getState().settings.theme;
    applyThemeToDOM(currentTheme);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tabItems: TabItemConfig[] = [
    { viewId: 'journal', label: 'Journal', icon: 'calendar' },
    { viewId: 'analytics', label: 'Analytics', icon: 'barChart' },
    { viewId: 'settings', label: 'Settings', icon: 'settings' },
  ];

  // Determine current view based on URL path
  const currentPath = window.location.pathname;
  const currentView = (tabItems.find(item => `/${item.viewId}` === currentPath)?.viewId || 'journal') as ViewId;

  const handleNavigate = (viewId: ViewId) => {
    navigate(`/${viewId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-backgroundLight dark:bg-backgroundDark">
      <header className="sticky top-0 z-40 bg-cardLight dark:bg-cardDark shadow-soft-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <img src={navimage} className='h-12 dark:hidden' alt="Logo" />
          <img src={navimageDark} className='h-12 dark:block hidden' alt="Logo" />
          {currentView && !isMobile && <span className="text-xl text-textLight dark:text-textDark hidden md:block">{tabItems.find(item => item.viewId === currentView)?.label}</span>}
          <div className="md:hidden"> {/* Placeholder */}
          </div>
        </div>
        {!isMobile && <DesktopTabbar items={tabItems} currentView={currentView} navigateTo={handleNavigate} />}
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView} // Use currentView for transition key
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Routes>
              <Route path="/journal" element={<JournalPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<JournalPage />} /> {/* Default route */}
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      {isMobile && <BottomNavbar items={tabItems} currentView={currentView} navigateTo={handleNavigate} />}
      <ChatPopup />
    </div>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

export default App;