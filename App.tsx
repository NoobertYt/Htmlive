
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import RequestHistory from './components/RequestHistory';
import Footer from './components/Footer';
import PreviewModal from './components/PreviewModal';
import AuthModal from './components/AuthModal';
import { ProjectState } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

const App: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<ProjectState | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setShowHistory(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUploadComplete = (project: ProjectState) => {
    // В этой версии мы не открываем превью сразу, так как сайт еще на модерации
    alert("Заявка успешно отправлена! Вы можете отслеживать её статус в истории.");
    setShowHistory(true);
  };

  const openAuth = () => setIsAuthModalOpen(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      <Header 
        user={user} 
        onOpenAuth={openAuth} 
        onToggleHistory={() => setShowHistory(!showHistory)}
        isHistoryOpen={showHistory}
      />
      
      <main className="flex-grow">
        {showHistory && user ? (
          <RequestHistory user={user} />
        ) : (
          <>
            <Hero onUploadComplete={handleUploadComplete} user={user} onOpenAuth={openAuth} />
            <Features />
          </>
        )}
      </main>

      <Footer />

      {currentProject && isPreviewOpen && (
        <PreviewModal 
          project={currentProject} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
