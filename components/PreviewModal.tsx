
import React, { useMemo } from 'react';
import { ProjectState } from '../types';

interface PreviewModalProps {
  project: ProjectState;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ project, onClose }) => {
  const entryFile = useMemo(() => {
    return project.files.find(f => f.name.toLowerCase() === 'index.html') || project.files.find(f => f.name.endsWith('.html'));
  }, [project]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-6xl bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl uppercase">
              {project.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{project.name} 🎉</h2>
              <p className="text-sm text-slate-500">{project.description || 'Ваш проект HTMLIVE'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-slate-800 text-slate-400 transition-colors">✕</button>
        </div>
        <div className="flex-grow flex bg-slate-950 overflow-hidden relative">
          <div className="w-72 border-r border-slate-800 flex flex-col bg-slate-900/30 backdrop-blur-md">
            <div className="p-5 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Проводник</span>
            </div>
            <div className="flex-grow overflow-y-auto p-3 space-y-1">
              {project.files.map((file, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${file.name === entryFile?.name ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}>
                  <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
            <div className="p-5 border-t border-slate-800 bg-slate-900/50 text-[10px] text-slate-500 text-center">
              Проект ожидает подтверждения модератором.
            </div>
          </div>
          <div className="flex-grow bg-white relative">
            {entryFile ? (
              <iframe srcDoc={entryFile.content} title="Preview" className="w-full h-full border-none shadow-inner" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">Точка входа не найдена</div>
            )}
          </div>
        </div>
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Проект ID: {project.id}</span>
          <span>HTMLIVE 2026 Community Edition</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
