
import React from 'react';

const Features: React.FC = () => {
  const items = [
    {
      title: "Никаких серверов",
      description: "Забудьте про SSH, FTP и настройку Apache/Nginx. Мы берем это на себя.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      title: "Мгновенная публикация",
      description: "Сайт становится доступен по всему миру в ту же секунду, как вы отпустили мышку.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Идеально для учебы",
      description: "Первые шаги в веб-разработке не должны быть сложными. Сфокусируйтесь на коде.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Почему выбирают нас?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Мы убрали все барьеры между вашим кодом и интернетом.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={i} className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
