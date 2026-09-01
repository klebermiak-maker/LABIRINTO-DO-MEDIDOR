import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Trash2, 
  Code, 
  Layers, 
  ChevronUp, 
  ChevronDown, 
  X, 
  Plus, 
  ArrowUp, 
  RotateCw, 
  RotateCcw as RotateLeftIcon, 
  Repeat, 
  GitBranch, 
  Scale, 
  Droplet, 
  Key,
  Info
} from 'lucide-react';
import { CodeBlock, Level, Unit, ConditionType } from '../types';
import { sound } from '../utils/audio';

interface CodeWorkspaceProps {
  level: Level;
  blocks: CodeBlock[];
  activeBlockId: string | null;
  isRunning: boolean;
  isPaused: boolean;
  onUpdateBlocks: (blocks: CodeBlock[]) => void;
  onRun: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onClear: () => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  maxBlocks?: number;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  level,
  blocks,
  activeBlockId,
  isRunning,
  isPaused,
  onUpdateBlocks,
  onRun,
  onPause,
  onStepForward,
  onReset,
  onClear,
  speed,
  onChangeSpeed,
  maxBlocks,
}) => {
  const [viewMode, setViewMode] = useState<'blocks' | 'code'>('blocks');

  // Count total blocks including children
  const countTotal = (items: CodeBlock[]): number => {
    let total = 0;
    for (const b of items) {
      total++;
      if (b.children) total += countTotal(b.children);
      if (b.thenBlocks) total += countTotal(b.thenBlocks);
      if (b.elseBlocks) total += countTotal(b.elseBlocks);
    }
    return total;
  };

  const totalBlocksUsed = countTotal(blocks);

  // Manipulate root or nested blocks
  const removeBlock = (id: string) => {
    sound.playClick();
    const filterRec = (list: CodeBlock[]): CodeBlock[] => {
      return list
        .filter((b) => b.id !== id)
        .map((b) => ({
          ...b,
          children: b.children ? filterRec(b.children) : undefined,
          thenBlocks: b.thenBlocks ? filterRec(b.thenBlocks) : undefined,
          elseBlocks: b.elseBlocks ? filterRec(b.elseBlocks) : undefined,
        }));
    };
    onUpdateBlocks(filterRec(blocks));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    sound.playClick();
    const moveInList = (list: CodeBlock[]): CodeBlock[] => {
      const idx = list.findIndex((b) => b.id === id);
      if (idx !== -1) {
        const newList = [...list];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < list.length) {
          const [moved] = newList.splice(idx, 1);
          newList.splice(targetIdx, 0, moved);
          return newList;
        }
        return list;
      }
      return list.map((b) => ({
        ...b,
        children: b.children ? moveInList(b.children) : undefined,
        thenBlocks: b.thenBlocks ? moveInList(b.thenBlocks) : undefined,
        elseBlocks: b.elseBlocks ? moveInList(b.elseBlocks) : undefined,
      }));
    };
    onUpdateBlocks(moveInList(blocks));
  };

  const updateBlockProps = (id: string, updates: Partial<CodeBlock>) => {
    const updateRec = (list: CodeBlock[]): CodeBlock[] => {
      return list.map((b) => {
        if (b.id === id) {
          return { ...b, ...updates };
        }
        return {
          ...b,
          children: b.children ? updateRec(b.children) : undefined,
          thenBlocks: b.thenBlocks ? updateRec(b.thenBlocks) : undefined,
          elseBlocks: b.elseBlocks ? updateRec(b.elseBlocks) : undefined,
        };
      });
    };
    onUpdateBlocks(updateRec(blocks));
  };

  const addChildBlock = (parentId: string, targetList: 'children' | 'thenBlocks' | 'elseBlocks', blockType: CodeBlock['type']) => {
    sound.playClick();
    const newChild: CodeBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: blockType,
      repeatCount: 2,
      unitValue: blockType === 'inject_capacity' ? 500 : 1,
      unit: blockType === 'inject_capacity' ? 'ml' : blockType === 'add_weight' ? 'kg' : 'm',
      condition: 'front_is_gate',
    };

    const addRec = (list: CodeBlock[]): CodeBlock[] => {
      return list.map((b) => {
        if (b.id === parentId) {
          const existing = b[targetList] || [];
          return {
            ...b,
            [targetList]: [...existing, newChild],
          };
        }
        return {
          ...b,
          children: b.children ? addRec(b.children) : undefined,
          thenBlocks: b.thenBlocks ? addRec(b.thenBlocks) : undefined,
          elseBlocks: b.elseBlocks ? addRec(b.elseBlocks) : undefined,
        };
      });
    };
    onUpdateBlocks(addRec(blocks));
  };

  // Generate Portuguese pseudocode view
  const generatePseudocode = (list: CodeBlock[], indent: string = ''): string => {
    return list
      .map((b) => {
        switch (b.type) {
          case 'move_forward':
            return `${indent}Avance(1 passo / ${level.stepUnitConversion.valuePerStep} ${level.stepUnitConversion.unit});`;
          case 'turn_right':
            return `${indent}Girar_Direita(90°);`;
          case 'turn_left':
            return `${indent}Girar_Esquerda(90°);`;
          case 'repeat':
            return `${indent}Repita (${b.repeatCount || 2} vezes) {\n${generatePseudocode(b.children || [], indent + '  ')}\n${indent}}`;
          case 'if_condition':
            return `${indent}Se (${b.condition === 'front_is_gate' ? 'frente == Porta' : b.condition === 'front_is_scale' ? 'frente == Balança' : b.condition === 'front_is_tank' ? 'frente == Tanque' : 'frente_livre'}) Então {\n${generatePseudocode(b.thenBlocks || [], indent + '  ')}\n${indent}}`;
          case 'add_weight':
            return `${indent}Adicionar_Massa(${b.unitValue || 1} ${b.unit || 'kg'});`;
          case 'inject_capacity':
            return `${indent}Injetar_Fluido(${b.unitValue || 500} ${b.unit || 'ml'});`;
          case 'use_key':
            return `${indent}Usar_Chave_Medida("${b.unit || 'm'}");`;
          default:
            return `${indent}// comando`;
        }
      })
      .join('\n');
  };

  // Render an individual block or recursive container
  const renderBlockItem = (block: CodeBlock, index: number, total: number, depth: number = 0) => {
    const isActive = activeBlockId === block.id;

    return (
      <div
        key={block.id}
        className={`group relative rounded-xl border transition-all duration-200 ${
          isActive
            ? 'ring-2 ring-yellow-400 bg-amber-500/20 border-yellow-400 shadow-lg shadow-yellow-500/20 scale-[1.01]'
            : block.type === 'repeat'
            ? 'bg-purple-950/40 border-purple-600/50'
            : block.type === 'if_condition'
            ? 'bg-amber-950/40 border-amber-600/50'
            : 'bg-slate-800/90 border-slate-700/80 hover:border-slate-600'
        } p-2.5 sm:p-3 mb-2`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Left Icon & Block Description */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {block.type === 'move_forward' && (
              <>
                <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-xs shrink-0">
                  <ArrowUp className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-blue-200 truncate">
                  Avance 1 passo ({level.stepUnitConversion.valuePerStep} {level.stepUnitConversion.unit})
                </div>
              </>
            )}

            {block.type === 'turn_right' && (
              <>
                <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white text-xs shrink-0">
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-indigo-200 truncate">
                  Gire à Direita ↪ (90°)
                </div>
              </>
            )}

            {block.type === 'turn_left' && (
              <>
                <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-white text-xs shrink-0">
                  <RotateLeftIcon className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-bold text-indigo-200 truncate">
                  Gire à Esquerda ↩ (90°)
                </div>
              </>
            )}

            {block.type === 'repeat' && (
              <div className="flex flex-wrap items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-white text-xs shrink-0 font-bold">
                  <Repeat className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-purple-200">Repita</span>
                <select
                  value={block.repeatCount || 2}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { repeatCount: Number(e.target.value) })}
                  className="bg-purple-900/90 text-purple-100 text-xs font-bold px-2 py-0.5 rounded border border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} vezes
                    </option>
                  ))}
                </select>
                <span className="text-xs text-purple-300 font-semibold">faça:</span>
              </div>
            )}

            {block.type === 'if_condition' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center text-slate-900 text-xs shrink-0 font-bold">
                  <GitBranch className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-amber-200">Se</span>
                <select
                  value={block.condition || 'front_is_gate'}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { condition: e.target.value as ConditionType })}
                  className="bg-amber-950 text-amber-100 text-xs font-bold px-2 py-0.5 rounded border border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
                >
                  <option value="front_is_gate">frente for Porta / Portão</option>
                  <option value="front_is_scale">frente for Balança de Carga</option>
                  <option value="front_is_tank">frente for Tanque / Válvula</option>
                  <option value="front_is_clear">caminho à frente estiver livre</option>
                </select>
                <span className="text-xs text-amber-300 font-semibold">Então:</span>
              </div>
            )}

            {block.type === 'add_weight' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white text-xs shrink-0">
                  <Scale className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-emerald-200">Adicionar Peso:</span>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={block.unitValue || 1}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { unitValue: parseFloat(e.target.value) || 1 })}
                  className="w-14 bg-slate-900 text-emerald-200 text-xs font-bold px-1.5 py-0.5 rounded border border-emerald-500/50 text-center"
                />
                <select
                  value={block.unit || 'kg'}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { unit: e.target.value as Unit })}
                  className="bg-slate-900 text-emerald-200 text-xs font-bold px-2 py-0.5 rounded border border-emerald-500/50"
                >
                  <option value="kg">kg (Quilogramas)</option>
                  <option value="g">g (Gramas)</option>
                </select>
              </div>
            )}

            {block.type === 'inject_capacity' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-slate-900 text-xs shrink-0">
                  <Droplet className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-cyan-200">Injetar Fluido:</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={block.unitValue || 500}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { unitValue: parseFloat(e.target.value) || 100 })}
                  className="w-16 bg-slate-900 text-cyan-200 text-xs font-bold px-1.5 py-0.5 rounded border border-cyan-500/50 text-center"
                />
                <select
                  value={block.unit || 'ml'}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { unit: e.target.value as Unit })}
                  className="bg-slate-900 text-cyan-200 text-xs font-bold px-2 py-0.5 rounded border border-cyan-500/50"
                >
                  <option value="ml">ml (Mililitros)</option>
                  <option value="L">L (Litros)</option>
                </select>
              </div>
            )}

            {block.type === 'use_key' && (
              <div className="flex flex-wrap items-center gap-1.5">
                <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center text-slate-900 text-xs shrink-0">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-yellow-200">Usar Chave de Medida:</span>
                <select
                  value={block.unit || 'm'}
                  disabled={isRunning}
                  onChange={(e) => updateBlockProps(block.id, { unit: e.target.value as Unit })}
                  className="bg-slate-900 text-yellow-200 text-xs font-bold px-2 py-0.5 rounded border border-yellow-500/50"
                >
                  <option value="m">1 Metro (100 cm)</option>
                  <option value="cm">1 Centímetro (10 mm)</option>
                  <option value="km">1 Quilômetro (1.000 m)</option>
                </select>
              </div>
            )}
          </div>

          {/* Right Action Controls (Move Up/Down, Delete) */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
            {depth === 0 && (
              <>
                <button
                  onClick={() => moveBlock(block.id, 'up')}
                  disabled={index === 0 || isRunning}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Mover para Cima"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveBlock(block.id, 'down')}
                  disabled={index === total - 1 || isRunning}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 disabled:opacity-30"
                  title="Mover para Baixo"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={() => removeBlock(block.id)}
              disabled={isRunning}
              className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 disabled:opacity-30 transition"
              title="Remover Bloco"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Nested Area for Repeat Loop */}
        {block.type === 'repeat' && (
          <div className="mt-2.5 pl-3 border-l-2 border-purple-500/60 ml-2">
            <div className="min-h-[40px] rounded-lg bg-purple-950/30 p-2 border border-purple-800/40">
              {block.children && block.children.length > 0 ? (
                block.children.map((child, cIdx) =>
                  renderBlockItem(child, cIdx, block.children?.length || 0, depth + 1)
                )
              ) : (
                <div className="text-[11px] text-purple-300/70 italic py-1 text-center">
                  (Vazio: adicione blocos para repetir dentro do loop)
                </div>
              )}

              {/* Quick buttons to add actions inside repeat loop */}
              {!isRunning && (
                <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-purple-800/30">
                  <button
                    onClick={() => addChildBlock(block.id, 'children', 'move_forward')}
                    className="text-[10px] font-semibold bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded flex items-center gap-1 border border-purple-700/50"
                  >
                    <Plus className="w-3 h-3" /> + Avance
                  </button>
                  <button
                    onClick={() => addChildBlock(block.id, 'children', 'turn_right')}
                    className="text-[10px] font-semibold bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded flex items-center gap-1 border border-purple-700/50"
                  >
                    <Plus className="w-3 h-3" /> + Gire Direita
                  </button>
                  <button
                    onClick={() => addChildBlock(block.id, 'children', 'turn_left')}
                    className="text-[10px] font-semibold bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 px-2 py-0.5 rounded flex items-center gap-1 border border-purple-700/50"
                  >
                    <Plus className="w-3 h-3" /> + Gire Esquerda
                  </button>
                  {level.allowedBlocks.includes('if_condition') && (
                    <button
                      onClick={() => addChildBlock(block.id, 'children', 'if_condition')}
                      className="text-[10px] font-semibold bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-700/50"
                    >
                      <Plus className="w-3 h-3" /> + Se Condição
                    </button>
                  )}
                  {level.allowedBlocks.includes('inject_capacity') && (
                    <button
                      onClick={() => addChildBlock(block.id, 'children', 'inject_capacity')}
                      className="text-[10px] font-semibold bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 px-2 py-0.5 rounded flex items-center gap-1 border border-cyan-700/50"
                    >
                      <Plus className="w-3 h-3" /> + Fluido
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nested Area for Conditional If/Then */}
        {block.type === 'if_condition' && (
          <div className="mt-2.5 pl-3 border-l-2 border-amber-500/60 ml-2">
            <div className="min-h-[40px] rounded-lg bg-amber-950/30 p-2 border border-amber-800/40">
              {block.thenBlocks && block.thenBlocks.length > 0 ? (
                block.thenBlocks.map((thenChild, tIdx) =>
                  renderBlockItem(thenChild, tIdx, block.thenBlocks?.length || 0, depth + 1)
                )
              ) : (
                <div className="text-[11px] text-amber-300/70 italic py-1 text-center">
                  (Vazio: o que o Medidroid deve fazer se a condição for verdadeira?)
                </div>
              )}

              {/* Quick buttons to add actions inside conditional */}
              {!isRunning && (
                <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-amber-800/30">
                  {level.allowedBlocks.includes('use_key') && (
                    <button
                      onClick={() => addChildBlock(block.id, 'thenBlocks', 'use_key')}
                      className="text-[10px] font-semibold bg-yellow-900/60 hover:bg-yellow-800/80 text-yellow-200 px-2 py-0.5 rounded flex items-center gap-1 border border-yellow-700/50"
                    >
                      <Plus className="w-3 h-3" /> + Usar Chave
                    </button>
                  )}
                  {level.allowedBlocks.includes('add_weight') && (
                    <button
                      onClick={() => addChildBlock(block.id, 'thenBlocks', 'add_weight')}
                      className="text-[10px] font-semibold bg-emerald-900/60 hover:bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-700/50"
                    >
                      <Plus className="w-3 h-3" /> + Adicionar Peso
                    </button>
                  )}
                  {level.allowedBlocks.includes('inject_capacity') && (
                    <button
                      onClick={() => addChildBlock(block.id, 'thenBlocks', 'inject_capacity')}
                      className="text-[10px] font-semibold bg-cyan-900/60 hover:bg-cyan-800/80 text-cyan-200 px-2 py-0.5 rounded flex items-center gap-1 border border-cyan-700/50"
                    >
                      <Plus className="w-3 h-3" /> + Injetar Fluido
                    </button>
                  )}
                  <button
                    onClick={() => addChildBlock(block.id, 'thenBlocks', 'move_forward')}
                    className="text-[10px] font-semibold bg-blue-900/60 hover:bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded flex items-center gap-1 border border-blue-700/50"
                  >
                    <Plus className="w-3 h-3" /> + Avance
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="workspace-container" className="flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('blocks');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
                viewMode === 'blocks'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Blocos</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setViewMode('code');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition ${
                viewMode === 'code'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Pseudocódigo</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {totalBlocksUsed} {totalBlocksUsed === 1 ? 'bloco' : 'blocos'}
            {maxBlocks ? ` / máx ${maxBlocks}` : ''}
          </span>
        </div>

        {/* Speed and Clear */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
            <span>Velocidade:</span>
            <select
              value={speed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value={750} className="bg-slate-800">🐢 Lento</option>
              <option value={400} className="bg-slate-800">🚗 Normal</option>
              <option value={180} className="bg-slate-800">⚡ Rápido</option>
            </select>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClear();
            }}
            disabled={isRunning || blocks.length === 0}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 px-2 py-1 rounded-lg transition disabled:opacity-30"
            title="Limpar todos os blocos"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Limpar</span>
          </button>
        </div>
      </div>

      {/* Main Blocks Viewport */}
      <div className="flex-1 overflow-y-auto pr-1 min-h-[260px] max-h-[420px]">
        {viewMode === 'blocks' ? (
          blocks.length > 0 ? (
            blocks.map((block, idx) => renderBlockItem(block, idx, blocks.length, 0))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
                🧩
              </div>
              <p className="text-sm font-bold text-slate-300">
                Seu algoritmo está vazio!
              </p>
              <p className="text-xs text-slate-400 max-w-xs mt-1">
                Clique nos blocos de comandos abaixo para montar o trajeto do Medidroid.
              </p>
            </div>
          )
        ) : (
          /* Pseudocode view */
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <div className="text-slate-500 mb-2">
              // Algoritmo: {level.title} (BNCC EF05CO04)
            </div>
            <pre className="font-mono">
              {blocks.length > 0
                ? generatePseudocode(blocks)
                : '// Adicione blocos para gerar o código em Português Estruturado'}
            </pre>
          </div>
        )}
      </div>

      {/* Primary Action Buttons (Execute / Pause / Step / Reset) */}
      <div id="workspace-execute-btn-area" className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button
              onClick={() => {
                sound.playClick();
                onRun();
              }}
              disabled={blocks.length === 0}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Executar Algoritmo</span>
            </button>
          ) : isPaused ? (
            <button
              onClick={() => {
                sound.playClick();
                onRun();
              }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow transition"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continuar</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-sm px-5 py-2.5 rounded-xl shadow transition"
            >
              <Pause className="w-4 h-4 fill-slate-900" />
              <span>Pausar</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onStepForward();
            }}
            disabled={blocks.length === 0}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition disabled:opacity-50"
            title="Avançar 1 instrução por vez"
          >
            <StepForward className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Passo a Passo</span>
          </button>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onReset();
          }}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition"
          title="Reiniciar posição do robô"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Reiniciar</span>
        </button>
      </div>
    </div>
  );
};
