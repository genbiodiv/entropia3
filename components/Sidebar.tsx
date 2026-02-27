
import React from 'react';
import { AppState, GamePhase } from '../types.ts';
import { TRANSLATIONS } from '../constants.ts';

interface SidebarProps {
  state: AppState;
  onOpenDocs: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ state, onOpenDocs }) => {
  const t = TRANSLATIONS[state.language];
  const phaseInfo = t.phases[state.gamePhase];
  
  const orderedCount = state.particles.filter(p => p.state === 'ordered').length;
  const localOrderPercent = (orderedCount / state.particles.length) * 100;

  const triCount = state.patterns.filter(p => p.type === 'TRI').length;
  const sqrCount = state.patterns.filter(p => p.type === 'SQR').length;
  const pntCount = state.patterns.filter(p => p.type === 'PNT').length;

  return (
    <aside className="w-full md:w-72 lg:w-80 flex flex-col gap-2 md:gap-4 shrink-0">
      <div className={`p-4 md:p-6 rounded-2xl shadow-sm border flex-1 overflow-y-auto transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
        <h3 className="font-black text-slate-500 text-[8px] md:text-[10px] uppercase tracking-widest mb-2 md:mb-4">{t.machineStatus}</h3>
        
        <div className={`p-3 md:p-4 rounded-xl border mb-4 md:mb-6 ${state.isDarkMode ? 'bg-red-950/20 border-red-900/30' : 'bg-red-50 border-red-100'}`}>
          <p className={`text-[10px] md:text-xs font-bold uppercase mb-0.5 md:mb-1 ${state.isDarkMode ? 'text-red-400' : 'text-red-800'}`}>{t.objectiveTitle}</p>
          <p className={`text-xs md:text-sm font-medium ${state.isDarkMode ? 'text-red-200' : 'text-red-900'}`}>{t.objectiveDesc}</p>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div>
            <div className="flex justify-between text-[10px] md:text-xs mb-1 md:mb-2">
              <span className="text-slate-500 font-bold uppercase">{t.localOrder}</span>
              <span className="font-mono text-indigo-400 font-black">{localOrderPercent.toFixed(1)}%</span>
            </div>
            <div className={`h-2 md:h-3 rounded-full overflow-hidden border ${state.isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-200'}`}>
              <div 
                className="h-full bg-indigo-500 transition-all duration-700" 
                style={{ width: `${localOrderPercent}%` }}
              />
            </div>
            <p className="text-[9px] md:text-[10px] mt-2 text-slate-500 font-medium leading-tight">
              {phaseInfo.log}
            </p>
          </div>

          {state.gamePhase >= GamePhase.PERSISTENT_PATTERNS && (
            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl space-y-2 md:space-y-3 ${state.isDarkMode ? 'bg-slate-800' : 'bg-slate-900 text-white'}`}>
              <p className={`text-[8px] md:text-[10px] font-bold uppercase mb-0.5 md:mb-1 ${state.isDarkMode ? 'text-indigo-400' : 'text-indigo-300'}`}>{t.dissipationEngines}</p>
              
              {state.gamePhase < GamePhase.SPECIALIZATION ? (
                <>
                  <div className={`flex justify-between items-center text-[10px] md:text-xs border-b pb-1 md:pb-2 ${state.isDarkMode ? 'border-slate-700' : 'border-white/10'}`}>
                    <span className="flex items-center gap-1 md:gap-2"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-sm"></div> {t.triangles}</span>
                    <span className={`font-black ${state.isDarkMode ? 'text-slate-200' : 'text-white'}`}>{triCount}</span>
                  </div>
                  <div className={`flex justify-between items-center text-[10px] md:text-xs border-b pb-1 md:pb-2 ${state.isDarkMode ? 'border-slate-700' : 'border-white/10'}`}>
                    <span className="flex items-center gap-1 md:gap-2"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-sm"></div> {t.squares}</span>
                    <span className={`font-black ${state.isDarkMode ? 'text-slate-200' : 'text-white'}`}>{sqrCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] md:text-xs">
                    <span className="flex items-center gap-1 md:gap-2"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-sm"></div> {t.pentagons}</span>
                    <span className={`font-black ${state.isDarkMode ? 'text-slate-200' : 'text-white'}`}>{pntCount}</span>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {[
                    { id: 'HARVESTER', label: t.harvester, desc: t.harvesterDesc, count: state.patterns.filter(p => p.role === 'HARVESTER').length },
                    { id: 'PRODUCER', label: t.producer, desc: t.producerDesc, count: state.patterns.filter(p => p.role === 'PRODUCER').length },
                    { id: 'REPLICATOR', label: t.replicator, desc: t.replicatorDesc, count: state.patterns.filter(p => p.role === 'REPLICATOR').length },
                    { id: 'RECYCLER', label: t.recycler, desc: t.recyclerDesc, count: state.patterns.filter(p => p.role === 'RECYCLER').length },
                  ].map(role => (
                    <div key={role.id} className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] md:text-xs">
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: t.roleColors[role.id] }}></div>
                          <span className="font-bold">{role.label}</span>
                        </span>
                        <span className="font-black">{role.count}</span>
                      </div>
                      <p className="text-[8px] md:text-[9px] opacity-60 leading-tight pl-4">
                        {role.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`mt-4 md:mt-8 pt-4 md:pt-6 border-t ${state.isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h4 className="text-[8px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest">{t.logTitle}</h4>
            <button 
              onClick={onOpenDocs}
              className="text-[8px] md:text-[10px] font-bold text-indigo-500 uppercase hover:underline"
            >
              {t.help}
            </button>
          </div>
          <p className={`text-[10px] md:text-xs leading-relaxed italic ${state.isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {phaseInfo.desc}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
