
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface SiteRequest {
  id: string;
  name: string;
  status: 'pending' | 'live';
  url: string;
  createdAt: any;
  description: string;
}

const RequestHistory: React.FC<{ user: User }> = ({ user }) => {
  const [requests, setRequests] = useState<SiteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "siteRequests"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SiteRequest[];
      setRequests(data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleDeleteRequest = async (requestId: string, name: string) => {
    if (window.confirm(`Вы действительно хотите запросить удаление проекта "${name}"?`)) {
      try {
        await addDoc(collection(db, "deletionRequests"), {
          originalRequestId: requestId,
          siteName: name,
          userId: user.uid,
          userEmail: user.email,
          requestedAt: serverTimestamp(),
          status: 'pending'
        });
        alert('Заявка на удаление успешно отправлена модератору.');
      } catch (e) {
        alert('Ошибка при отправке заявки.');
      }
    }
  };

  return (
    <section className="py-12 container mx-auto px-4 max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-2">Мои проекты</h2>
          <p className="text-slate-400">Список ваших заявок на хостинг и их текущий статус.</p>
        </div>
        <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-mono text-slate-500 shadow-inner">
          ACT_SITES: {requests.length}
        </div>
      </div>

      <div className="mb-8 p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center gap-5 shadow-glow shadow-indigo-500/5">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-indigo-400 font-bold uppercase tracking-wider mr-2 text-xs">Внимание:</span> 
          В бесплатной версии проекты удаляются автоматически через <span className="text-white font-bold">24 часа</span> после публикации. Сохраняйте локальные копии!
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Загружаем базу данных...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-24 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-[3rem]">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          </div>
          <p className="text-slate-500 text-lg mb-2">У вас пока нет активных заявок</p>
          <p className="text-slate-600 text-sm">Создайте первый проект на главной странице.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => {
            const isLive = req.status === 'live' || (req.url && req.url.trim().length > 0);
            return (
              <div key={req.id} className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2rem] hover:border-slate-700 hover:bg-slate-900/80 transition-all group flex flex-wrap items-center justify-between gap-8 backdrop-blur-sm">
                <div className="flex-grow min-w-[280px]">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">{req.name}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase border tracking-widest ${isLive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      {isLive ? 'LIVE' : 'WAITING'}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-1 text-sm">{req.description || 'Ожидает одобрения модератором'}</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                  {isLive ? (
                    <a href={req.url.startsWith('http') ? req.url : `https://${req.url}`} target="_blank" rel="noreferrer" className="flex-grow md:flex-grow-0 text-center px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
                      Открыть сайт
                    </a>
                  ) : (
                    <div className="flex-grow md:flex-grow-0 px-8 py-3.5 bg-slate-800/50 text-slate-400 rounded-2xl font-bold border border-slate-800 flex items-center justify-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                      Модерация
                    </div>
                  )}
                  
                  <button onClick={() => handleDeleteRequest(req.id, req.name)} className="p-3.5 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all" title="Запросить удаление">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RequestHistory;
