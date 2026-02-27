
import React, { useState } from 'react';
import { GamePhase } from '../types.ts';
import { PHASE_DESCRIPTIONS } from '../constants.ts';

interface PredictionScreenProps {
  gamePhase: GamePhase;
  onPredict: (prediction: string) => void;
  isDarkMode: boolean;
}

const PredictionScreen: React.FC<PredictionScreenProps> = ({ gamePhase, onPredict, isDarkMode }) => {
  const info = PHASE_DESCRIPTIONS[gamePhase];
  const [selected, setSelected] = useState<string | null>(null);

  const options = [
    "Aumentará el orden considerablemente",
    "El orden se mantendrá igual",
    "Disminuirá el orden inevitablemente",
    "Dependerá de mis acciones con la energía"
  ];

  return (
    <div className={`fixed inset-0 backdrop-blur-md flex items-center justify-center p-6 z-40 transition-colors ${isDarkMode ? 'bg-indigo-950/90' : 'bg-amber-100/80'}`}>
      <div className={`max-w-xl w-full rounded-2xl shadow-2xl p-8 border transition-colors ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-amber-200'}`}>
        <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Preparación de la Fase</p>
        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-amber-950'}`}>{info.title}</h2>
        <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-amber-800/80'}`}>{info.desc}</p>
        
        <div className={`p-4 rounded-lg border-l-4 border-indigo-500 mb-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-amber-50'}`}>
          <p className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-slate-200' : 'text-amber-900'}`}>¿Qué crees que pasará con el orden en esta fase?</p>
          <div className="space-y-3">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected === opt 
                    ? (isDarkMode ? 'bg-indigo-900/50 border-indigo-500 text-indigo-200 font-semibold' : 'bg-indigo-100 border-indigo-400 text-indigo-900 font-semibold')
                    : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500' : 'bg-white border-amber-200 text-amber-800 hover:border-indigo-300')
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
