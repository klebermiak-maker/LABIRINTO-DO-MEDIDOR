import React, { useState } from 'react';
import { X, Play, Plus, Trash2, Save, Wrench, Check } from 'lucide-react';
import { Level, Obstacle, ObstacleType, Unit } from '../types';
import { sound } from '../utils/audio';

interface CustomLevelBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayCustomLevel: (customLevel: Level) => void;
}

export const CustomLevelBuilder: React.FC<CustomLevelBuilderProps> = ({
  isOpen,
  onClose,
  onPlayCustomLevel,
}) => {
  const [cols, setCols] = useState<number>(6);
  const [rows, setRows] = useState<number>(5);
  const [selectedTool, setSelectedTool] = useState<ObstacleType | 'start' | 'goal' | 'erase'>('wall');
  const [startPos, setStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 2 });
  const [goalPos, setGoalPos] = useState<{ x: number; y: number }>({ x: 5, y: 2 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([
    { id: 'custom-gate', x: 2, y: 2, type: 'gate', label: 'Porta 200 cm', requiredValue: 2, requiredUnit: 'm' },
  ]);
  const [levelTitle, setLevelTitle] = useState<string>('Minha Fase Personalizada');

  if (!isOpen) return null;

  const handleCellClick = (x: number, y: number) => {
    sound.playClick();
    if (selectedTool === 'start') {
      setStartPos({ x, y });
      setObstacles(obstacles.filter((o) => !(o.x === x && o.y === y)));
      return;
    }

    if (selectedTool === 'goal') {
      setGoalPos({ x, y });
      setObstacles(obstacles.filter((o) => !(o.x === x && o.y === y)));
      return;
    }

    if (selectedTool === 'erase') {
      setObstacles(obstacles.filter((o) => !(o.x === x && o.y === y)));
      return;
    }

    // Do not place on start or goal
    if (startPos.x === x && startPos.y === y) return;
    if (goalPos.x === x && goalPos.y === y) return;

    // Create obstacle
    const existing = obstacles.find((o) => o.x === x && o.y === y);
    if (existing) {
      setObstacles(obstacles.map((o) => (o.x === x && o.y === y ? createObstacle(selectedTool, x, y) : o)));
    } else {
      setObstacles([...obstacles, createObstacle(selectedTool, x, y)]);
    }
  };

  const createObstacle = (type: ObstacleType, x: number, y: number): Obstacle => {
    const id = `obs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    switch (type) {
      case 'gate':
        return { id, x, y, type: 'gate', label: 'Portão 200 cm', requiredValue: 2, requiredUnit: 'm', category: 'length' };
      case 'scale':
        return { id, x, y, type: 'scale', label: 'Balança 2.000 g', requiredValue: 2, requiredUnit: 'kg', category: 'mass' };
      case 'tank':
        return { id, x, y, type: 'tank', label: 'Tanque 1.500 ml', requiredValue: 1500, requiredUnit: 'ml', category: 'capacity' };
      case 'crystal':
        return { id, x, y, type: 'crystal', label: 'Bateria' };
      case 'wall':
      default:
        return { id, x, y, type: 'wall' };
    }
  };

  const handleStartPlaying = () => {
    sound.playClick();
    const customLevel: Level = {
      id: 999,
      title: levelTitle || 'Fase do Laboratório',
      subtitle: 'Nível Criado pelo Aluno / Professor',
      category: 'mixed',
      concept: 'master',
      gridSize: { cols, rows },
      start: { ...startPos, dir: 'right' },
      goal: { ...goalPos },
      obstacles: obstacles.map((o) => ({ ...o, solved: false })),
      allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_condition', 'add_weight', 'inject_capacity', 'use_key'],
      targetStars: {
        threeStarsMaxBlocks: 8,
        twoStarsMaxBlocks: 12,
      },
      stepUnitConversion: {
        unit: 'm',
        valuePerStep: 1,
        description: 'Passo do robô = 1 metro.',
      },
      storyContext: 'Teste seu próprio labirinto com medidas de comprimento, massa ou capacidade!',
      mathChallenge: 'Complete o trajeto resolvendo as travas e medidores configurados.',
      pedagogicalHint: 'Observe os obstáculos que você colocou e monte a sequência correspondente.',
      mathExplanation: 'Parabéns por planejar e resolver o seu próprio algoritmo e labirinto de medidas!',
    };

    onPlayCustomLevel(customLevel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Laboratório Criativo: Criador de Fases
              </h2>
              <p className="text-xs text-slate-400">
                Monte seu próprio labirinto com obstáculos de grandezas e teste seu código
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

        {/* Builder Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Level settings */}
          <div className="flex flex-wrap items-center gap-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] text-slate-400 block mb-1">Título da Fase:</label>
              <input
                type="text"
                value={levelTitle}
                onChange={(e) => setLevelTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Tamanho da Grade:</label>
              <div className="flex items-center gap-2">
                <select
                  value={cols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="bg-slate-950 text-white text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-700"
                >
                  {[5, 6, 7, 8].map((c) => (
                    <option key={c} value={c}>
                      {c} Colunas
                    </option>
                  ))}
                </select>
                <span className="text-slate-500">×</span>
                <select
                  value={rows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="bg-slate-950 text-white text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-700"
                >
                  {[4, 5, 6].map((r) => (
                    <option key={r} value={r}>
                      {r} Linhas
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Placement Toolbar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-xs font-bold text-slate-300 mr-2">Ferramenta:</span>

            <button
              onClick={() => setSelectedTool('start')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'start' ? 'bg-cyan-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              🤖 Início (Robô)
            </button>

            <button
              onClick={() => setSelectedTool('goal')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'goal' ? 'bg-emerald-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              🏁 Saída
            </button>

            <button
              onClick={() => setSelectedTool('wall')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'wall' ? 'bg-slate-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              🧱 Parede
            </button>

            <button
              onClick={() => setSelectedTool('gate')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'gate' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              📏 Portão (Comprimento)
            </button>

            <button
              onClick={() => setSelectedTool('scale')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'scale' ? 'bg-amber-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              ⚖️ Balança (Massa)
            </button>

            <button
              onClick={() => setSelectedTool('tank')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'tank' ? 'bg-cyan-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              💧 Tanque (Capacidade)
            </button>

            <button
              onClick={() => setSelectedTool('crystal')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'crystal' ? 'bg-yellow-500 text-slate-900 shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              ⭐ Bateria
            </button>

            <button
              onClick={() => setSelectedTool('erase')}
              className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-bold transition ${
                selectedTool === 'erase' ? 'bg-rose-600 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              🧹 Apagar
            </button>
          </div>

          {/* Grid Canvas */}
          <div className="flex items-center justify-center p-4 bg-slate-950 rounded-2xl border border-slate-800 min-h-[280px]">
            <div
              className="grid gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 w-full max-w-md aspect-square"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: rows }).map((_, r) =>
                Array.from({ length: cols }).map((_, c) => {
                  const isStart = startPos.x === c && startPos.y === r;
                  const isGoal = goalPos.x === c && goalPos.y === r;
                  const obs = obstacles.find((o) => o.x === c && o.y === r);

                  return (
                    <button
                      key={`builder-${c}-${r}`}
                      onClick={() => handleCellClick(c, r)}
                      className={`relative rounded-lg border flex flex-col items-center justify-center text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                        isStart
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                          : isGoal
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                          : obs?.type === 'wall'
                          ? 'bg-slate-700 border-slate-600 text-slate-200'
                          : obs?.type === 'gate'
                          ? 'bg-blue-950 border-blue-500 text-blue-200'
                          : obs?.type === 'scale'
                          ? 'bg-amber-950 border-amber-500 text-amber-200'
                          : obs?.type === 'tank'
                          ? 'bg-cyan-950 border-cyan-500 text-cyan-200'
                          : obs?.type === 'crystal'
                          ? 'bg-yellow-950 border-yellow-500 text-yellow-200'
                          : 'bg-slate-850/50 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <span className="text-[8px] absolute top-0.5 left-1 text-slate-500 font-mono">
                        {c},{r}
                      </span>
                      {isStart && <span>🤖</span>}
                      {isGoal && <span>🏁</span>}
                      {obs?.type === 'wall' && <span>🧱</span>}
                      {obs?.type === 'gate' && <span>🚪</span>}
                      {obs?.type === 'scale' && <span>⚖️</span>}
                      {obs?.type === 'tank' && <span>💧</span>}
                      {obs?.type === 'crystal' && <span>⭐</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <button
            onClick={() => setObstacles([])}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar Obstáculos</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartPlaying}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-500/20"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jogar Minha Fase!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
