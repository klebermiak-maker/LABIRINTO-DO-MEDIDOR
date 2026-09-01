import React from 'react';
import { 
  ArrowUp, 
  RotateCw, 
  RotateCcw, 
  Repeat, 
  GitBranch, 
  Scale, 
  Droplet, 
  Key, 
  Plus
} from 'lucide-react';
import { BlockType, Level, Unit } from '../types';
import { sound } from '../utils/audio';

interface ToolboxProps {
  level: Level;
  onAddBlock: (type: BlockType, defaults?: Partial<{ repeatCount: number; unitValue: number; unit: Unit }>) => void;
  disabled?: boolean;
}

export const Toolbox: React.FC<ToolboxProps> = ({ level, onAddBlock, disabled }) => {
  const isBlockAllowed = (type: BlockType) => level.allowedBlocks.includes(type);

  return (
    <div id="toolbox-container" className="bg-slate-900/60 rounded-2xl border border-slate-800 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider font-heading flex items-center gap-1.5">
          <span>📦</span> Blocos de Comandos (BNCC)
        </h3>
        <span className="text-[11px] text-slate-400">Clique para adicionar</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {/* Move Forward */}
        {isBlockAllowed('move_forward') && (
          <button
            id="toolbox-move-forward-btn"
            onClick={() => {
              sound.playClick();
              onAddBlock('move_forward');
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white shrink-0 shadow">
              <ArrowUp className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Avance</div>
              <div className="text-[10px] text-blue-300 truncate">
                1 passo ({level.stepUnitConversion.valuePerStep}{level.stepUnitConversion.unit})
              </div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-blue-300" />
          </button>
        )}

        {/* Turn Right */}
        {isBlockAllowed('turn_right') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('turn_right');
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow">
              <RotateCw className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Gire Direita ↪</div>
              <div className="text-[10px] text-indigo-300 truncate">90 graus</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-indigo-300" />
          </button>
        )}

        {/* Turn Left */}
        {isBlockAllowed('turn_left') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('turn_left');
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Gire Esquerda ↩</div>
              <div className="text-[10px] text-indigo-300 truncate">90 graus</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-indigo-300" />
          </button>
        )}

        {/* Repeat Loop */}
        {isBlockAllowed('repeat') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('repeat', { repeatCount: 2 });
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center text-white shrink-0 shadow">
              <Repeat className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Repita [N] vezes</div>
              <div className="text-[10px] text-purple-300 truncate">Loop de Repetição</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-purple-300" />
          </button>
        )}

        {/* If Condition */}
        {isBlockAllowed('if_condition') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('if_condition');
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 shrink-0 shadow font-bold">
              <GitBranch className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Se [Condição]</div>
              <div className="text-[10px] text-amber-300 truncate">Seleção Condicional</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-amber-300" />
          </button>
        )}

        {/* Add Weight (Massa) */}
        {isBlockAllowed('add_weight') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('add_weight', { unitValue: 1, unit: 'kg' });
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow">
              <Scale className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Adicionar Peso</div>
              <div className="text-[10px] text-emerald-300 truncate">Massa (kg / g)</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-emerald-300" />
          </button>
        )}

        {/* Inject Capacity (Capacidade) */}
        {isBlockAllowed('inject_capacity') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('inject_capacity', { unitValue: 500, unit: 'ml' });
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-900 shrink-0 shadow">
              <Droplet className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Injetar Fluido</div>
              <div className="text-[10px] text-cyan-300 truncate">Capacidade (ml / L)</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-cyan-300" />
          </button>
        )}

        {/* Use Key */}
        {isBlockAllowed('use_key') && (
          <button
            onClick={() => {
              sound.playClick();
              onAddBlock('use_key', { unit: 'm' });
            }}
            disabled={disabled}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-500/40 text-yellow-200 text-xs font-semibold transition active:scale-95 text-left group shadow-sm disabled:opacity-50"
          >
            <div className="w-7 h-7 rounded-lg bg-yellow-500 flex items-center justify-center text-slate-900 shrink-0 shadow">
              <Key className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold truncate text-slate-100">Chave de Medida</div>
              <div className="text-[10px] text-yellow-300 truncate">Destravar Portão</div>
            </div>
            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-yellow-300" />
          </button>
        )}
      </div>
    </div>
  );
};
