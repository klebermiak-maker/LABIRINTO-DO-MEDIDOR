import React, { useState } from 'react';
import { X, Ruler, Scale, Droplet, Calculator, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface MeasurementCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MeasurementCheatSheet: React.FC<MeasurementCheatSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'length' | 'mass' | 'capacity' | 'calc'>('length');
  const [calcValue, setCalcValue] = useState<number>(1);
  const [calcFromUnit, setCalcFromUnit] = useState<string>('m');
  const [calcToUnit, setCalcToUnit] = useState<string>('cm');

  if (!isOpen) return null;

  // Conversion calculator logic
  const calculateConversion = (): string => {
    // Length
    if (['mm', 'cm', 'm', 'km'].includes(calcFromUnit) && ['mm', 'cm', 'm', 'km'].includes(calcToUnit)) {
      const inMeters: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
      const valInM = calcValue * inMeters[calcFromUnit];
      const result = valInM / inMeters[calcToUnit];
      return `${result.toLocaleString('pt-BR')} ${calcToUnit}`;
    }
    // Mass
    if (['mg', 'g', 'kg', 't'].includes(calcFromUnit) && ['mg', 'g', 'kg', 't'].includes(calcToUnit)) {
      const inGrams: Record<string, number> = { mg: 0.001, g: 1, kg: 1000, t: 1000000 };
      const valInG = calcValue * inGrams[calcFromUnit];
      const result = valInG / inGrams[calcToUnit];
      return `${result.toLocaleString('pt-BR')} ${calcToUnit}`;
    }
    // Capacity
    if (['ml', 'L'].includes(calcFromUnit) && ['ml', 'L'].includes(calcToUnit)) {
      const inMl: Record<string, number> = { ml: 1, L: 1000 };
      const valInMl = calcValue * inMl[calcFromUnit];
      const result = valInMl / inMl[calcToUnit];
      return `${result.toLocaleString('pt-BR')} ${calcToUnit}`;
    }
    return 'Unidades incompatíveis';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
              📐
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Guia de Grandezas e Medidas (5º Ano)
              </h2>
              <p className="text-xs text-slate-400">
                Tabela de equivalências e conversor prático da BNCC
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('length')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'length'
                ? 'bg-slate-800 text-blue-300 border-blue-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Ruler className="w-4 h-4 text-blue-400" />
            <span>Comprimento</span>
          </button>

          <button
            onClick={() => setActiveTab('mass')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'mass'
                ? 'bg-slate-800 text-amber-300 border-amber-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Massa (Peso)</span>
          </button>

          <button
            onClick={() => setActiveTab('capacity')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'capacity'
                ? 'bg-slate-800 text-cyan-300 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span>Capacidade</span>
          </button>

          <button
            onClick={() => setActiveTab('calc')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-t-lg transition border-b-2 ${
              activeTab === 'calc'
                ? 'bg-slate-800 text-emerald-300 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>Testador Rápido</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* LENGTH TAB */}
          {activeTab === 'length' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                  📏 Tabela de Conversão de Comprimento
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-blue-300 text-sm">1 metro (m)</div>
                    <div className="text-slate-400 mt-1">= 100 cm</div>
                    <div className="text-slate-400">= 1.000 mm</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-blue-300 text-sm">1 centímetro (cm)</div>
                    <div className="text-slate-400 mt-1">= 10 mm</div>
                    <div className="text-slate-400">= 0,01 m</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-blue-300 text-sm">1 quilômetro (km)</div>
                    <div className="text-slate-400 mt-1">= 1.000 metros</div>
                    <div className="text-slate-400">= 100.000 cm</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-blue-300 text-sm">1 milímetro (mm)</div>
                    <div className="text-slate-400 mt-1">= 0,1 cm</div>
                    <div className="text-slate-400">= 0,001 m</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                <div className="font-bold text-white mb-1">💡 Dica Prática para o 5º Ano:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Para transformar de <strong>metros para centímetros</strong>, multiplique por 100 (ex: 2 m = 200 cm).</li>
                  <li>Para transformar de <strong>centímetros para metros</strong>, divida por 100 (ex: 300 cm = 3 m).</li>
                  <li>Para transformar de <strong>quilômetros para metros</strong>, multiplique por 1.000 (ex: 4 km = 4.000 m).</li>
                </ul>
              </div>
            </div>
          )}

          {/* MASS TAB */}
          {activeTab === 'mass' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/40">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  ⚖️ Tabela de Conversão de Massa
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-amber-300 text-sm">1 quilograma (kg)</div>
                    <div className="text-slate-400 mt-1">= 1.000 gramas (g)</div>
                    <div className="text-slate-400">1 pacote de açúcar</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-amber-300 text-sm">500 gramas (0,5 kg)</div>
                    <div className="text-slate-400 mt-1">= Meio quilo</div>
                    <div className="text-slate-400">Metade de 1.000 g</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-amber-300 text-sm">1 tonelada (t)</div>
                    <div className="text-slate-400 mt-1">= 1.000 kg</div>
                    <div className="text-slate-400">= 1.000.000 g</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                <div className="font-bold text-white mb-1">💡 Dica Prática de Massa:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Para passar de <strong>kg para g</strong>, multiplique por 1.000 (ex: 2,5 kg = 2.500 g).</li>
                  <li>Para passar de <strong>g para kg</strong>, divida por 1.000 (ex: 3.000 g = 3 kg).</li>
                </ul>
              </div>
            </div>
          )}

          {/* CAPACITY TAB */}
          {activeTab === 'capacity' && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                  💧 Tabela de Conversão de Capacidade
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-cyan-300 text-sm">1 Litro (L)</div>
                    <div className="text-slate-400 mt-1">= 1.000 mililitros (ml)</div>
                    <div className="text-slate-400">1 garrafa padrão</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-cyan-300 text-sm">500 ml (0,5 L)</div>
                    <div className="text-slate-400 mt-1">= Meio Litro</div>
                    <div className="text-slate-400">1 garrafinha d'água</div>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-center">
                    <div className="font-bold text-cyan-300 text-sm">250 ml (0,25 L)</div>
                    <div className="text-slate-400 mt-1">= 1/4 de Litro</div>
                    <div className="text-slate-400">1 copo comum</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs text-slate-300">
                <div className="font-bold text-white mb-1">💡 Dica Prática de Capacidade:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-300">
                  <li>Para transformar de <strong>Litros (L) para mililitros (ml)</strong>, multiplique por 1.000 (ex: 1,5 L = 1.500 ml).</li>
                  <li>Para transformar de <strong>ml para L</strong>, divida por 1.000 (ex: 2.000 ml = 2 L).</li>
                </ul>
              </div>
            </div>
          )}

          {/* CALCULATOR TAB */}
          {activeTab === 'calc' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-3">
                  🧮 Teste de Conversão Interativa
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Valor</label>
                    <input
                      type="number"
                      value={calcValue}
                      onChange={(e) => setCalcValue(parseFloat(e.target.value) || 0)}
                      className="w-24 bg-slate-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700 text-center"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">De:</label>
                    <select
                      value={calcFromUnit}
                      onChange={(e) => setCalcFromUnit(e.target.value)}
                      className="bg-slate-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700"
                    >
                      <optgroup label="Comprimento">
                        <option value="m">Metro (m)</option>
                        <option value="cm">Centímetro (cm)</option>
                        <option value="mm">Milímetro (mm)</option>
                        <option value="km">Quilômetro (km)</option>
                      </optgroup>
                      <optgroup label="Massa">
                        <option value="kg">Quilograma (kg)</option>
                        <option value="g">Grama (g)</option>
                        <option value="mg">Miligrama (mg)</option>
                      </optgroup>
                      <optgroup label="Capacidade">
                        <option value="L">Litro (L)</option>
                        <option value="ml">Mililitro (ml)</option>
                      </optgroup>
                    </select>
                  </div>

                  <ArrowRight className="w-5 h-5 text-emerald-400 mt-5 hidden sm:block" />

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Para:</label>
                    <select
                      value={calcToUnit}
                      onChange={(e) => setCalcToUnit(e.target.value)}
                      className="bg-slate-900 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700"
                    >
                      <optgroup label="Comprimento">
                        <option value="cm">Centímetro (cm)</option>
                        <option value="m">Metro (m)</option>
                        <option value="mm">Milímetro (mm)</option>
                        <option value="km">Quilômetro (km)</option>
                      </optgroup>
                      <optgroup label="Massa">
                        <option value="g">Grama (g)</option>
                        <option value="kg">Quilograma (kg)</option>
                        <option value="mg">Miligrama (mg)</option>
                      </optgroup>
                      <optgroup label="Capacidade">
                        <option value="ml">Mililitro (ml)</option>
                        <option value="L">Litro (L)</option>
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-emerald-500/40 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Resultado Calculado:</span>
                  <span className="text-base font-bold text-emerald-300 font-mono">
                    {calculateConversion()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-850 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
