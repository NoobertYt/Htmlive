
import React, { useState, useRef } from 'react';
import { ProjectState, UploadedFile } from '../types';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

interface HeroProps {
  onUploadComplete: (project: ProjectState) => void;
  user: User | null;
  onOpenAuth: () => void;
}

const Hero: React.FC<HeroProps> = ({ onUploadComplete, user, onOpenAuth }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [siteName, setSiteName] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePublishRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return onOpenAuth();
    if (!selectedFiles || selectedFiles.length === 0) return alert('Пожалуйста, выберите файлы');
    if (!siteName) return alert('Пожалуйста, введите название сайта');

    setIsUploading(true);
    setProgress(10);

    try {
      const uploadedFiles: UploadedFile[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const content = await file.text();
        uploadedFiles.push({
          name: file.name,
          content: content,
          type: file.type
        });
      }
      
      setProgress(60);

      await addDoc(collection(db, "siteRequests"), {
        name: siteName,
        description: siteDesc,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        status: 'pending',
        url: '', 
        files: uploadedFiles 
      });

      setProgress(100);
      
      setTimeout(() => {
        onUploadComplete({
          id: 'request',
          name: siteName,
          description: siteDesc,
          files: uploadedFiles,
          createdAt: Date.now(),
          url: ''
        });
        setIsUploading(false);
        setProgress(0);
        setSiteName('');
        setSiteDesc('');
        setSelectedFiles(null);
      }, 500);

    } catch (error) {
      console.error("Request error:", error);
      alert('Ошибка при отправке заявки.');
      setIsUploading(false);
    }
  };

  return (
    <section className="relative py-12 lg:py-24 overflow-hidden bg-slate-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full opacity-20 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-glow shadow-indigo-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            HTMLIVE 2026 EDITION
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Оставь заявку — <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">мы оживим твой код</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Хватит мучаться с консолью. Просто загрузи свой проект, и наши модераторы развернут его в облаке.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {!user && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md text-center p-6 rounded-[2.5rem]">
              <h3 className="text-2xl font-bold text-white mb-2">Требуется регистрация</h3>
              <p className="text-slate-400 mb-6 max-w-xs">Чтобы отправить заявку на хостинг, необходимо войти в аккаунт.</p>
              <button onClick={onOpenAuth} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-xl shadow-indigo-600/30 active:scale-95">Войти</button>
            </div>
          )}

          <form onSubmit={handlePublishRequest} className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Название сайта</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Напр: Мой Лендинг" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Комментарий модератору</label>
                <textarea value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)} placeholder="Опишите, о чем этот сайт..." className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-indigo-500 h-32 resize-none" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wider">Файлы проекта</label>
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => { e.preventDefault(); setIsDragging(false); setSelectedFiles(e.dataTransfer.files); }}
                onClick={() => user && fileInputRef.current?.click()}
                className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all cursor-pointer p-6 ${isDragging ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700 hover:bg-slate-900/30'}`}
              >
                <input type="file" multiple className="hidden" ref={fileInputRef} onChange={(e) => setSelectedFiles(e.target.files)} />
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${selectedFiles ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-900 text-slate-700'}`}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-white font-medium mb-1">{selectedFiles ? `Выбрано: ${selectedFiles.length}` : 'Выберите файлы'}</p>
                  <p className="text-xs text-slate-500">HTML, CSS, JS или Zip</p>
                </div>
              </div>
              <button disabled={isUploading || !user} className="mt-6 w-full py-5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50">
                {isUploading ? `ОТПРАВКА ${progress}%...` : 'ОТПРАВИТЬ ЗАЯВКУ'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
