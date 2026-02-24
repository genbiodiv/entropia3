
import React, { useEffect, useRef } from 'react';
import { AppState, GamePhase } from '../types.ts';
import { TRANSLATIONS } from '../constants.ts';

declare const Chart: any;

const ReflectionScreen: React.FC<{ state: AppState; onRestart: () => void }> = ({ state, onRestart }) => {
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
              legend: { position: 'bottom' },
            },
            scales: {
              y: { type: 'linear', display: true, position: 'left', title: { display: true, text: t.localOrder, font: { weight: 'bold' } } },
              y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: t.globalEntropy, font: { weight: 'bold' } } },
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
  }, [state.history, t]);

  const totalEntropy = state.globalEntropy;
  
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-6xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{t.balanceTitle}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-sm">{t.balanceSubtitle}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {state.phaseSummaries.map((summary) => (
            <div key={summary.phase} className="bg-white p-8 rounded-[2rem] shadow-sm border-t-8 border-indigo-500 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fase {summary.phase}</p>
                <h3 className="text-xl font-black text-slate-800 uppercase mb-4">
                  {t.phases[summary.phase as GamePhase].title.split(': ')[1]}
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{t.maxOrder}</span>
                   <span className="text-2xl font-black text-indigo-600">{summary.maxOrder}</span>
                </div>
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">{t.entropy}</span>
                   <span className="text-2xl font-black text-red-600">{summary.finalEntropy.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-2xl font-black uppercase text-slate-800 mb-8 tracking-tight">{t.analysisTitle}</h3>
            <div className="h-[400px] relative">
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center">
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

        <div className="bg-amber-50 p-12 rounded-[3.5rem] text-center border-2 border-amber-100">
           <p className="text-2xl font-black italic text-amber-900 mb-6">{t.reflectionQuote}</p>
           <p className="text-amber-800/70 max-w-3xl mx-auto leading-relaxed font-medium">
             {t.reflectionDesc}
           </p>
        </div>

        <div className="flex justify-center pb-24">
          <button 
            onClick={onRestart}
            className="px-12 py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-xs"
          >
            {t.newSimulation}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionScreen;
