
import React, { useState } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Неверный email или пароль. Попробуйте еще раз или зарегистрируйтесь.';
      case 'auth/email-already-in-use':
        return 'Этот email уже зарегистрирован. Попробуйте войти.';
      case 'auth/weak-password':
        return 'Пароль слишком простой (минимум 6 символов).';
      case 'auth/invalid-email':
        return 'Некорректный формат email.';
      case 'auth/user-disabled':
        return 'Аккаунт заблокирован.';
      case 'auth/too-many-requests':
        return 'Слишком много попыток. Попробуйте позже.';
      default:
        return 'Произошла ошибка при авторизации. Проверьте данные.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Очищаем email от случайных пробелов
    const cleanEmail = email.trim();
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      } else {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error Code:", err.code);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Декоративное свечение */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'С возвращением' : 'Создать аккаунт'}</h2>
        <p className="text-slate-400 mb-8 text-sm">
          {isLogin ? 'Войдите в свой профиль HTMLIVE' : 'Присоединяйтесь к сообществу HTMLIVE'}
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Ваш Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-[0.2em]">Пароль</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2
              ${loading ? 'bg-slate-800 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20'}
            `}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'ОБРАБОТКА...' : (isLogin ? 'ВОЙТИ В АККАУНТ' : 'ЗАРЕГИСТРИРОВАТЬСЯ')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            {isLogin ? 'Ещё нет аккаунта?' : 'Уже зарегистрированы?'}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors underline underline-offset-4 decoration-indigo-500/30"
            >
              {isLogin ? 'Создать профиль' : 'Войти'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
