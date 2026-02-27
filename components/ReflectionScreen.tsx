
import React, { useEffect, useRef } from 'react';
import { AppState, GamePhase } from '../types.ts';
import { TRANSLATIONS } from '../constants.ts';

declare const Chart: any;

const ReflectionScreen: React.FC<{ 
  state: AppState; 
  onRestart: () => void;
  onDownloadCSV: () => void;
  onCaptureSnapshot: () => void;
}> = ({ state, onRestart, onDownloadCSV, onCaptureSnapshot }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const t = TRANSLATIONS[state.language];

  useEffect(() => {
    if (chartRef.current && state.history && state.history.length > 0) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: state.history.map((h, i) => i + 1),
            datasets: [
              {
                label: t.localOrder,
                data: state.history.map(h => h.order),
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.3,
                yAxisID: 'y',
              },
              {
                label: t.globalEntropy,
                data: state.history.map(h => h.globalEntropy),
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 3,
                fill: false,
                tension: 0.1,
                yAxisID: 'y1',
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { 
              legend: { position: 'bottom', labels: { color: state.isDarkMode ? '#94a3b8' : '#475569' } },
            },
            scales: {
              y: { 
                type: 'linear', 
                display: true, 
                position: 'left', 
                title: { display: true, text: t.localOrder, font: { weight: 'bold' }, color: state.isDarkMode ? '#94a3b8' : '#475569' },
                ticks: { color: state.isDarkMode ? '#94a3b8' : '#475569' },
                grid: { color: state.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
              },
              y1: { 
                type: 'linear', 
                display: true, 
                position: 'right', 
                grid: { drawOnChartArea: false }, 
                title: { display: true, text: t.globalEntropy, font: { weight: 'bold' }, color: state.isDarkMode ? '#94a3b8' : '#475569' },
                ticks: { color: state.isDarkMode ? '#94a3b8' : '#475569' }
              },
              x: {
                ticks: { color: state.isDarkMode ? '#94a3b8' : '#475569' },
                grid: { color: state.isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [state.history, t, state.isDarkMode]);

  const totalEntropy = state.globalEntropy;

  const captureChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `simulation_chart_${Date.now()}.png`;
      link.href = url;
      link.click();
    }
  };
  
  return (
    <div className={`min-h-screen p-6 md:p-12 overflow-y-auto transition-colors duration-500 ${state.isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className={`text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter ${state.isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{t.balanceTitle}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs md:text-sm">{t.balanceSubtitle}</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {state.phaseSummaries.map((summary) => (
            <div key={summary.phase} className={`p-8 rounded-[2rem] shadow-sm border-t-8 border-indigo-500 flex flex-col justify-between transition-colors ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Fase {summary.phase}</p>
                <h3 className={`text-xl font-black uppercase mb-4 ${state.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  {t.phases[summary.phase as GamePhase].title.split(': ')[1]}
                </h3>
              </div>
              <div className="space-y-4">
                <div className={`flex justify-between items-end border-b pb-2 ${state.isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{t.maxOrder}</span>
                   <span className="text-2xl font-black text-indigo-400">{summary.maxOrder}</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{t.entropy}</span>
                   <span className="text-2xl font-black text-red-500">{summary.finalEntropy.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className={`md:col-span-2 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-xl border transition-colors ${state.isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className={`text-2xl font-black uppercase mb-8 tracking-tight ${state.isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t.analysisTitle}</h3>
            <div className="h-[300px] md:h-[400px] relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-2xl flex flex-col justify-center border border-slate-800">
            <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">{t.metricsConsolidated}</p>
            <div className="space-y-8">
               <div>
                <p className="text-4xl font-black text-red-500 leading-none">{totalEntropy.toFixed(0)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{t.totalDissipation}</p>
              </div>
              <div>
                <p className="text-4xl font-black text-indigo-400 leading-none">{(totalEntropy / Math.max(state.history.length, 1)).toFixed(1)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{t.degradationRate}</p>
              </div>
               <div>
                <p className="text-4xl font-black text-emerald-400 leading-none">{state.phaseSummaries.reduce((acc, s) => acc + s.maxOrder, 0)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">{t.accumulatedOrder}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] text-center border-2 transition-colors ${state.isDarkMode ? 'bg-amber-950/10 border-amber-900/30' : 'bg-amber-50 border-amber-100'}`}>
           <p className={`text-xl md:text-2xl font-black italic mb-6 ${state.isDarkMode ? 'text-amber-200' : 'text-amber-900'}`}>{t.reflectionQuote}</p>
           <p className={`max-w-3xl mx-auto leading-relaxed font-medium ${state.isDarkMode ? 'text-amber-400/80' : 'text-amber-800/70'}`}>
             {t.reflectionDesc}
           </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pb-24">
          <button 
            onClick={onCaptureSnapshot}
            disabled={state.capturedData.length > 0}
            className={`px-8 py-4 rounded-xl font-black transition-all shadow-md flex items-center gap-2 text-xs uppercase tracking-widest disabled:opacity-30 ${state.isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            {t.captureData} ({state.capturedData.length})
          </button>
          
          <button 
            onClick={captureChart}
            className={`px-8 py-4 rounded-xl font-black transition-all shadow-md flex items-center gap-2 text-xs uppercase tracking-widest ${state.isDarkMode ? 'bg-indigo-900/30 text-indigo-400 border border-indigo-800/50 hover:bg-indigo-900/50' : 'bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            {t.captureChart}
          </button>

          <button 
            onClick={onRestart}
            className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            {t.newSimulation}
          </button>

          <button 
            onClick={onDownloadCSV}
            disabled={state.capturedData.length === 0}
            className={`px-8 py-4 rounded-xl font-black transition-all shadow-md flex items-center gap-2 text-xs uppercase tracking-widest disabled:opacity-30 ${state.isDarkMode ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 hover:bg-emerald-900/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {t.downloadData}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionScreen;
