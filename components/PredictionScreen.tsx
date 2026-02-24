
import React, { useState } from 'react';
import { GamePhase } from '../types.ts';
import { PHASE_DESCRIPTIONS } from '../constants.ts';

interface PredictionScreenProps {
  gamePhase: GamePhase;
  onPredict: (prediction: string) => void;
}

const PredictionScreen: React.FC<PredictionScreenProps> = ({ gamePhase, onPredict }) => {
  const info = PHASE_DESCRIPTIONS[gamePhase];
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    "Aumentará el orden considerablemente",
    "El orden se mantendrá igual",
    "Disminuirá el orden inevitablemente",
    "Dependerá de mis acciones con la energía"
  ];

  return (
    <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-md flex items-center justify-center p-6 z-40">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-white/10">
        <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2">Preparación de la Fase</p>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{info.title}</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{info.desc}</p>
        
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border-l-4 border-indigo-500 mb-8">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-4">¿Qué crees que pasará con el orden en esta fase?</p>
          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected === opt 
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 border-indigo-400 dark:border-indigo-500 text-indigo-900 dark:text-indigo-200 font-semibold' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={!selected}
          onClick={() => onPredict(selected!)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition disabled:opacity-50"
        >
          Iniciar Simulación
        </button>
      </div>
    </div>
  );
};

export default PredictionScreen;
