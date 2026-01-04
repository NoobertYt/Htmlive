
import React from 'react';
import { User, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenAuth, onToggleHistory, isHistoryOpen }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => isHistoryOpen && onToggleHistory()}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            H
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white uppercase">
            HTML<span className="text-indigo-500">IVE</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          {!isHistoryOpen && <a href="#features" className="hover:text-white transition-colors">Возможности</a>}
          {user && (
            <button 
              onClick={onToggleHistory}
              className={`transition-colors ${isHistoryOpen ? 'text-indigo-400 font-bold' : 'hover:text-white'}`}
            >
              {isHistoryOpen ? '← На главную' : 'Мои заявки'}
            </button>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs text-slate-300 font-bold truncate max-w-[150px]">
                  {user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">ID: {user.uid.substring(0,6)}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-red-400 hover:text-red-300 px-4 py-2 transition-colors border border-red-900/30 rounded-xl bg-red-950/10"
              >
                Выйти
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
