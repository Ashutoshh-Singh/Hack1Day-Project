import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatDrawer from './components/ChatDrawer';
import LandingPage from './pages/LandingPage';
import OnboardingForm from './pages/OnboardingForm';
import ResultsPage from './pages/ResultsPage';
import SchemeDetailsPage from './pages/SchemeDetailsPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [resultsData, setResultsData] = useState(() => {
    try {
      const savedProfile = sessionStorage.getItem('right2know_profile');
      const savedMatches = sessionStorage.getItem('right2know_matches');
      return {
        profile: savedProfile ? JSON.parse(savedProfile) : null,
        matches: savedMatches ? JSON.parse(savedMatches) : [],
        count: savedMatches ? JSON.parse(savedMatches).length : 0
      };
    } catch (e) {
      return { profile: null, matches: [], count: 0 };
    }
  });

  const handleOpenAiChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseAiChat = () => {
    setIsChatOpen(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-surface-base text-slate-800">
        
        {/* Persistent Top Navigation Bar */}
        <Navbar onOpenAiChat={handleOpenAiChat} />

        {/* Dynamic Route Pages */}
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={<LandingPage onOpenAiChat={handleOpenAiChat} />} 
            />
            <Route 
              path="/eligibility" 
              element={<OnboardingForm setResultsData={setResultsData} />} 
            />
            <Route 
              path="/results" 
              element={
                <ResultsPage 
                  resultsData={resultsData} 
                  onOpenAiChat={handleOpenAiChat} 
                />
              } 
            />
            <Route 
              path="/scholarships/:id" 
              element={<SchemeDetailsPage onOpenAiChat={handleOpenAiChat} />} 
            />
            <Route 
              path="*" 
              element={<NotFoundPage />} 
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer onOpenAiChat={handleOpenAiChat} />

        {/* Global Slide-In AI Guidance Assistant */}
        <ChatDrawer
          isOpen={isChatOpen}
          onClose={handleCloseAiChat}
          profile={resultsData?.profile}
          schemes={resultsData?.matches || []}
        />

      </div>
    </BrowserRouter>
  );
}
