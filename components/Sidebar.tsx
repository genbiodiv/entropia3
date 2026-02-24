
import React from 'react';
import { AppState, GamePhase } from '../types.ts';
import { TRANSLATIONS } from '../constants.ts';

interface SidebarProps {
  state: AppState;
  onOpenDocs: () => void;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, onOpenDocs, onToggleLanguage, onToggleTheme }) => {
  const t = TRANSLATIONS[state.language];
  const phaseInfo = t.phases[state.gamePhase];
  
  const orderedCount = state.particles.filter(p => p.state === 'ordered').length;
  const localOrderPercent = (orderedCount / state.particles.length) * 100;

  const triCount = state.patterns.filter(p => p.type === 'TRI').length;
  const sqrCount = state.patterns.filter(p => p.type === 'SQR').length;
  const pntCount = state.patterns.filter(p => p.type === 'PNT').length;

  return (
    <aside className="w-full md:w-80 flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex-1 overflow-y-auto">
        <h3 className="font-black text-gray-400 dark:text-slate-500 text-[10px] uppercase tracking-widest mb-4">{t.machineStatus}</h3>
        
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 mb-6">
          <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase mb-1">{t.objectiveTitle}</p>
          <p className="text-sm text-red-900 dark:text-red-200 font-medium">{t.objectiveDesc}</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500 dark:text-slate-400 font-bold uppercase">{t.localOrder}</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-black">{localOrderPercent.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
              <div 
                className="h-full bg-indigo-500 transition-all duration-700" 
                style={{ width: `${localOrderPercent}%` }}
              />
            </div>
          </div>

          {state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl space-y-3">
              <p className="text-[10px] font-bold uppercase text-indigo-300 mb-1">{t.dissipationEngines}</p>
              
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-500 rounded-sm"></div> {t.triangles}</span>
                <span className="font-black">{triCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-white/10 pb-2">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-sm"></div> {t.squares}</span>
                <span className="font-black">{sqrCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2"><div className="w-2 h-2 bg-purple-500 rounded-sm"></div> {t.pentagons}</span>
                <span className="font-black">{pntCount}</span>
              </div>

              <p className="text-[10px] mt-2 text-indigo-200 leading-tight">{t.formsDesc}</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">{t.logTitle}</h4>
            <div className="flex gap-2">
              <button 
                onClick={onToggleTheme}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
                title={state.theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              >
                {state.theme === 'light' ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                )}
              </button>
              <button 
                onClick={onToggleLanguage}
                className="text-[10px] font-bold text-slate-400 uppercase hover:text-indigo-600 transition-colors"
              >
                {state.language === 'es' ? 'EN' : 'ES'}
              </button>
              <button 
                onClick={onOpenDocs}
                className="text-[10px] font-bold text-indigo-600 uppercase hover:underline"
              >
                {t.help}
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
            {phaseInfo.log}
          </p>
        </div>
      </div>

      <div className="bg-indigo-950 p-6 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform"></div>
        <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-2 tracking-widest">{t.lawTitle}</h4>
        <p className="text-xs leading-relaxed font-medium">
          {t.lawDesc}
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
