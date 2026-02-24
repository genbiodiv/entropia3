
import React from 'react';
import { UniverseType, AppState } from '../types';
import { TRANSLATIONS } from '../constants.ts';

interface SplashProps {
  state: AppState;
  onStart: (type: UniverseType) => void;
  onOpenDocs: () => void;
  onToggleLanguage: () => void;
}

const Splash: React.FC<SplashProps> = ({ state, onStart, onOpenDocs, onToggleLanguage }) => {
  const t = TRANSLATIONS[state.language];

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-6 z-50 overflow-y-auto">
      <div className="absolute top-6 right-6">
        <button 
          onClick={onToggleLanguage}
          className="px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 font-black text-[10px] uppercase hover:bg-white/20 transition-all backdrop-blur-md"
        >
          {state.language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        </button>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 text-center relative">
        <div className="inline-block p-4 bg-indigo-100 rounded-full mb-6">
          <svg className="w-12 h-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase">{t.title}</h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
          {t.subtitle}
        </p>
        
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 mb-8">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">{t.startSelect}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => onStart('lifeless')}
              className="group p-4 bg-white border-2 border-slate-200 rounded-xl text-left transition-all hover:border-slate-400 hover:shadow-lg"
            >
              <h3 className="font-black text-slate-800 text-xs mb-1 uppercase group-hover:text-black">{t.lifelessUniverse}</h3>
              <p className="text-[10px] text-slate-500 leading-normal">{t.lifelessDesc}</p>
            </button>
            <button 
              onClick={() => onStart('with-life')}
              className="group p-4 bg-white border-2 border-indigo-200 rounded-xl text-left transition-all hover:border-indigo-500 hover:shadow-lg"
            >
              <h3 className="font-black text-indigo-700 text-xs mb-1 uppercase group-hover:text-indigo-900">{t.withLifeUniverse}</h3>
              <p className="text-[10px] text-slate-500 leading-normal">{t.withLifeDesc}</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onOpenDocs}
            className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t.readGuide}
          </button>
          
          <p className="text-slate-400 text-sm font-medium italic">
            "{t.quote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
