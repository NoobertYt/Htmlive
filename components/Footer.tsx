
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
                H
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white uppercase">
                HTML<span className="text-indigo-500">IVE</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-sm">
              Мы делаем веб-хостинг доступным для каждого. Просто загружайте файлы и делитесь результатом.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Продукт</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Возможности</a></li>
              <li><a href="#pricing" className="hover:text-indigo-400 transition-colors">Тарифы</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Кейсы</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">API</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Компания</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">О нас</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Блог</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Помощь</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Контакты</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© 2026 HTMLIVE. Все права защищены.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
            <a href="#" className="hover:text-white transition-colors">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
