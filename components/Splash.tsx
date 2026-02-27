
import React from 'react';
import { Sun, Moon, Languages } from 'lucide-react';
import { UniverseType, AppState } from '../types';
import { TRANSLATIONS } from '../constants.ts';

interface SplashProps {
  state: AppState;
  onStart: (type: UniverseType, cycles: number) => void;
  onOpenDocs: () => void;
  onToggleLanguage: () => void;
  onToggleDarkMode: () => void;
}

const Splash: React.FC<SplashProps> = ({ state, onStart, onOpenDocs, onToggleLanguage, onToggleDarkMode }) => {
  const t = TRANSLATIONS[state.language];
  const [cycles, setCycles] = React.useState(20);

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-6 z-50 overflow-y-auto transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className="absolute top-6 right-6 flex gap-3">
        <button 
          onClick={onToggleDarkMode}
          className={`p-3 rounded-2xl font-black transition-all shadow-lg border ${state.isDarkMode ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-indigo-500'}`}
        >
          {state.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button 
          onClick={onToggleLanguage}
          className={`px-4 py-3 rounded-2xl font-black text-xs uppercase transition-all shadow-lg border flex items-center gap-2 ${state.isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-indigo-500'}`}
        >
          <Languages className="w-5 h-5" />
          {state.language === 'es' ? 'EN' : 'ES'}
        </button>
      </div>

      <div className={`max-w-2xl w-full rounded-[2rem] md:rounded-[2.5rem] shadow-2xl p-6 md:p-12 text-center relative border transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <h1 className={`text-3xl md:text-5xl font-black mb-2 md:mb-4 tracking-tighter uppercase ${state.isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{t.title}</h1>
        <p className={`text-sm md:text-lg mb-6 md:mb-10 leading-relaxed font-medium px-2 ${state.isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.subtitle}
        </p>
        
        <div className={`p-4 md:p-8 rounded-2xl md:rounded-3xl border mb-6 md:mb-8 transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
          <div className="mb-8">
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 text-center">{t.cyclesPerLevel}</p>
            <div className="flex justify-center gap-4">
              {[10, 20, 30].map(c => (
                <button
                  key={c}
                  onClick={() => setCycles(c)}
                  className={`px-6 py-2 rounded-xl font-black transition-all border-2 ${cycles === c 
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg scale-110' 
                    : state.isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4 md:mb-6 text-center">{t.startSelect}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={() => onStart('lifeless', cycles)}
              className={`group p-4 border-2 rounded-xl text-left transition-all hover:shadow-lg flex flex-col ${state.isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-500' : 'bg-white border-slate-200 hover:border-slate-400'}`}
            >
              <h3 className={`font-black text-[10px] md:text-xs mb-1 uppercase group-hover:text-indigo-400 ${state.isDarkMode ? 'text-slate-300' : 'text-slate-800'}`}>{t.lifelessUniverse}</h3>
              <p className="text-[9px] md:text-[10px] text-slate-500 leading-normal flex-1">{t.lifelessDesc}</p>
            </button>
            <button 
              onClick={() => onStart('with-life', cycles)}
              className={`group p-4 border-2 rounded-xl text-left transition-all hover:shadow-lg flex flex-col ${state.isDarkMode ? 'bg-slate-800 border-indigo-900 hover:border-indigo-500' : 'bg-white border-indigo-200 hover:border-indigo-500'}`}
            >
              <h3 className={`font-black text-[10px] md:text-xs mb-1 uppercase group-hover:text-indigo-400 ${state.isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>{t.withLifeUniverse}</h3>
              <p className="text-[9px] md:text-[10px] text-slate-500 leading-normal flex-1">{t.withLifeDesc}</p>
            </button>
            <button 
              onClick={() => onStart('voracious', cycles)}
              className={`group p-4 border-2 rounded-xl text-left transition-all hover:shadow-lg flex flex-col ${state.isDarkMode ? 'bg-slate-800 border-red-900 hover:border-red-500' : 'bg-white border-red-200 hover:border-red-500'}`}
            >
              <h3 className={`font-black text-[10px] md:text-xs mb-1 uppercase group-hover:text-red-400 ${state.isDarkMode ? 'text-red-400' : 'text-red-700'}`}>{t.voraciousUniverse}</h3>
              <p className="text-[9px] md:text-[10px] text-slate-500 leading-normal flex-1">{t.voraciousDesc}</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:gap-4">
          <button 
            onClick={onOpenDocs}
            className="flex items-center gap-2 text-indigo-500 font-black text-[10px] md:text-xs uppercase tracking-widest hover:text-indigo-400 transition-colors"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {t.readGuide}
          </button>
          
          <p className="text-slate-500 text-xs md:text-sm font-medium italic px-4">
            "{t.quote}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
