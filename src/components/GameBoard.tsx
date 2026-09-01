import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Scale, 
  Droplet, 
  Sparkles, 
  Flag, 
  Compass, 
  Zap, 
  Gauge,
  HelpCircle,
  Info,
  X
} from 'lucide-react';
import { Level, Obstacle, RobotState, Direction } from '../types';
import { sound } from '../utils/audio';

interface GameBoardProps {
  level: Level;
  robotState: RobotState;
  activeObstacles: Obstacle[];
  lastMessage: string;
  executionStatus: 'idle' | 'running' | 'paused' | 'success' | 'failed';
  currentStepNumber: number;
  totalSteps: number;
  starsEarned?: number;
  onShowHint: () => void;
}

const DIR_ANGLES: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

const DIR_LABELS: Record<Direction, string> = {
  up: 'Norte ↑',
  right: 'Leste →',
  down: 'Sul ↓',
  left: 'Oeste ←',
};

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  robotState,
  activeObstacles,
  lastMessage,
  executionStatus,
  currentStepNumber,
  totalSteps,
  starsEarned,
  onShowHint,
}) => {
  const { cols, rows } = level.gridSize;
  const [visitedTrail, setVisitedTrail] = useState<{ x: number; y: number }[]>([]);
  const [inspectedCell, setInspectedCell] = useState<{ x: number; y: number } | null>(null);

  // Track robot visited trail during simulation
  useEffect(() => {
    if (executionStatus === 'idle') {
      setVisitedTrail([{ x: robotState.x, y: robotState.y }]);
    } else {
      setVisitedTrail((prev) => {
        const last = prev[prev.length - 1];
        if (!last || last.x !== robotState.x || last.y !== robotState.y) {
          return [...prev, { x: robotState.x, y: robotState.y }];
        }
        return prev;
      });
    }
  }, [robotState.x, robotState.y, executionStatus]);

  // Clear inspected cell when level changes
  useEffect(() => {
    setInspectedCell(null);
  }, [level.id]);

  const handleCellClick = (c: number, r: number) => {
    sound.playClick();
    if (inspectedCell && inspectedCell.x === c && inspectedCell.y === r) {
      setInspectedCell(null);
    } else {
      setInspectedCell({ x: c, y: r });
    }
  };

  const getCellDetails = (c: number, r: number) => {
    const isStart = level.start.x === c && level.start.y === r;
    const isGoal = level.goal.x === c && level.goal.y === r;
    const obs = activeObstacles.find((o) => o.x === c && o.y === r);
    const isRobotHere = robotState.x === c && robotState.y === r;
    const distSteps = Math.abs(c - robotState.x) + Math.abs(r - robotState.y);
    const distReal = distSteps * level.stepUnitConversion.valuePerStep;

    return {
      isStart,
      isGoal,
      obs,
      isRobotHere,
      distSteps,
      distReal,
    };
  };

  return (
    <div 
      id="game-board-container" 
      className={`flex flex-col h-full bg-slate-900/60 rounded-2xl border border-slate-800 p-3 sm:p-4 shadow-xl relative transition-all ${
        executionStatus === 'failed' ? 'animate-shake' : ''
      }`}
    >
      {/* Top Level Banner & Context */}
      <div className="mb-3 bg-slate-800/80 rounded-xl p-3 border border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {level.category === 'length' ? '📏 Comprimento' : level.category === 'mass' ? '⚖️ Massa' : level.category === 'capacity' ? '💧 Capacidade' : '🧪 Grandezas Mistas'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Conceito: {level.concept === 'sequence' ? 'Sequência' : level.concept === 'loop' ? 'Repetição (Loop)' : level.concept === 'conditional' ? 'Seleção Condicional' : 'Desafio Integrado'}
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1 font-heading">
            {level.title}
          </h2>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            {level.storyContext}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onShowHint();
          }}
          className="flex items-center gap-1 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 transition shrink-0 active:scale-95"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Dica Pedagógica</span>
        </button>
      </div>

      {/* Robot Status & Sensors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[10px]">Posição / Direção</div>
            <div className="font-bold text-slate-200">
              ({robotState.x}, {robotState.y}) • {DIR_LABELS[robotState.dir]}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex items-center gap-2">
          <Gauge className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[10px]">Escala de Passo</div>
            <div className="font-bold text-slate-200">
              1 passo = {level.stepUnitConversion.valuePerStep} {level.stepUnitConversion.unit}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[10px]">Carga Acumulada</div>
            <div className="font-bold text-amber-300">
              {robotState.inventory.currentWeight} g ({robotState.inventory.currentWeight / 1000} kg)
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[10px]">Fluido Acumulado</div>
            <div className="font-bold text-cyan-300">
              {robotState.inventory.currentLiquid} ml ({robotState.inventory.currentLiquid / 1000} L)
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Grid Area */}
      <div className="flex-1 flex items-center justify-center p-2 bg-slate-950/90 rounded-xl border border-slate-800/90 relative overflow-hidden min-h-[300px] sm:min-h-[380px]">
        {/* Radar subtle grid background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div 
          className="grid gap-1.5 sm:gap-2 p-2 bg-slate-900/95 rounded-xl border border-slate-800 shadow-inner w-full max-w-lg aspect-square relative z-10"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: rows }).map((_, r) =>
            Array.from({ length: cols }).map((_, c) => {
              const isStart = level.start.x === c && level.start.y === r;
              const isGoal = level.goal.x === c && level.goal.y === r;
              const obstacle = activeObstacles.find((o) => o.x === c && o.y === r);
              const isRobotHere = robotState.x === c && robotState.y === r;
              const isVisited = visitedTrail.some((t) => t.x === c && t.y === r);
              const isSelected = inspectedCell?.x === c && inspectedCell?.y === r;

              return (
                <div
                  key={`cell-${c}-${r}`}
                  onClick={() => handleCellClick(c, r)}
                  className={`relative rounded-lg flex flex-col items-center justify-center transition-all duration-300 select-none cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 bg-cyan-950/40 z-20 scale-105 shadow-lg shadow-cyan-500/20'
                      : obstacle?.type === 'wall'
                      ? 'bg-slate-800 border border-slate-700/80 shadow-md'
                      : isGoal
                      ? 'bg-emerald-950/50 border-2 border-emerald-500/70 shadow-lg shadow-emerald-500/10'
                      : isVisited && !isRobotHere
                      ? 'bg-slate-800/80 border border-cyan-500/30'
                      : 'bg-slate-850/60 border border-slate-800 hover:border-slate-700'
                  }`}
                  title={`Casa (${c}, ${r}) - Clique para inspecionar`}
                >
                  {/* Coordinate tag in corner */}
                  <span className="absolute top-0.5 left-1 text-[9px] font-mono text-slate-600 pointer-events-none">
                    {c},{r}
                  </span>

                  {/* Visited path glowing footprint */}
                  {isVisited && !isRobotHere && !isGoal && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                    </div>
                  )}

                  {/* Start Point Marker (if not robot currently there) */}
                  {isStart && !isRobotHere && (
                    <span className="text-[9px] font-bold text-slate-500 absolute bottom-0.5">
                      INÍCIO
                    </span>
                  )}

                  {/* Goal Marker */}
                  {isGoal && !isRobotHere && (
                    <div className="flex flex-col items-center justify-center animate-bounce">
                      <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 fill-emerald-400/30" />
                      <span className="text-[9px] font-bold text-emerald-300">CHEGADA</span>
                    </div>
                  )}

                  {/* Obstacles Rendering */}
                  {obstacle && (
                    <div className="flex flex-col items-center justify-center text-center p-0.5">
                      {obstacle.type === 'wall' && (
                        <div className="text-slate-500 font-mono text-xs flex flex-col items-center">
                          <span className="text-base sm:text-lg">🧱</span>
                          <span className="text-[8px] text-slate-400">Muro</span>
                        </div>
                      )}

                      {obstacle.type === 'gate' && (
                        <div className={`flex flex-col items-center transition-all ${obstacle.solved ? 'opacity-40 scale-90' : 'animate-pulse'}`}>
                          {obstacle.solved ? (
                            <Unlock className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Lock className="w-5 h-5 text-blue-400 filter drop-shadow-[0_0_6px_#3b82f6]" />
                          )}
                          <span className={`text-[8px] font-bold px-1 rounded mt-0.5 ${
                            obstacle.solved ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/80 text-blue-200 border border-blue-500/40 shadow-sm'
                          }`}>
                            {obstacle.label || 'Portão'}
                          </span>
                        </div>
                      )}

                      {obstacle.type === 'scale' && (
                        <div className={`flex flex-col items-center transition-all ${obstacle.solved ? 'opacity-40 scale-90' : 'animate-pulse'}`}>
                          <Scale className={`w-5 h-5 ${obstacle.solved ? 'text-emerald-400' : 'text-amber-400 filter drop-shadow-[0_0_6px_#f59e0b]'}`} />
                          <span className={`text-[8px] font-bold px-1 rounded mt-0.5 ${
                            obstacle.solved ? 'bg-emerald-900/60 text-emerald-300' : 'bg-amber-900/80 text-amber-200 border border-amber-500/40 shadow-sm'
                          }`}>
                            {obstacle.label || 'Balança'}
                          </span>
                        </div>
                      )}

                      {obstacle.type === 'tank' && (
                        <div className={`flex flex-col items-center transition-all ${obstacle.solved ? 'opacity-40 scale-90' : 'animate-pulse'}`}>
                          <Droplet className={`w-5 h-5 ${obstacle.solved ? 'text-emerald-400' : 'text-cyan-400 filter drop-shadow-[0_0_6px_#06b6d4]'}`} />
                          <span className={`text-[8px] font-bold px-1 rounded mt-0.5 ${
                            obstacle.solved ? 'bg-emerald-900/60 text-emerald-300' : 'bg-cyan-900/80 text-cyan-200 border border-cyan-500/40 shadow-sm'
                          }`}>
                            {obstacle.label || 'Tanque'}
                          </span>
                        </div>
                      )}

                      {obstacle.type === 'crystal' && !obstacle.solved && (
                        <div className="flex flex-col items-center animate-spin-slow">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 fill-yellow-400/40 drop-shadow-[0_0_8px_#fde047]" />
                          <span className="text-[8px] text-yellow-300 font-bold">Bateria</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Robot Medidroid */}
                  {isRobotHere && (
                    <div 
                      className="absolute inset-1 flex flex-col items-center justify-center z-10 transition-transform duration-300"
                      style={{
                        transform: `rotate(${DIR_ANGLES[robotState.dir]}deg)`,
                      }}
                    >
                      {/* Directional Flashlight / Scanner Cone */}
                      <div className="absolute -top-6 w-10 h-6 bg-gradient-to-t from-yellow-300/30 to-transparent rounded-t-full pointer-events-none blur-[2px]" />

                      <div className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg border-2 transition-all ${
                        executionStatus === 'success' 
                          ? 'border-emerald-400 shadow-emerald-500/50 bg-gradient-to-b from-emerald-400 to-teal-600 scale-110' 
                          : executionStatus === 'failed'
                          ? 'border-red-400 shadow-red-500/50 bg-gradient-to-b from-red-500 to-rose-700 animate-shake'
                          : 'border-cyan-300 shadow-cyan-500/40 bg-gradient-to-b from-cyan-500 to-blue-600'
                      }`}>
                        {/* Robot Headlight / Eye direction indicator */}
                        <div className="absolute -top-1 w-2.5 h-1.5 bg-yellow-300 rounded-full shadow-[0_0_8px_#fde047]" />
                        
                        <span className="text-base sm:text-xl filter drop-shadow">
                          {executionStatus === 'success' ? '🥳' : executionStatus === 'failed' ? '💥' : '🤖'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* 3-Stars & Victory Board Particle Celebration Overlay */}
        {executionStatus === 'success' && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-20 animate-fadeIn">
            {/* Sparkling floating particles */}
            <div className="absolute top-1/4 left-1/4 animate-bounce text-xl">✨</div>
            <div className="absolute top-1/3 right-1/4 animate-spin-slow text-2xl">⭐</div>
            <div className="absolute bottom-1/3 left-1/5 animate-pulse text-lg">🌟</div>
            <div className="absolute top-1/5 right-1/3 animate-bounce text-xl">🎉</div>
            <div className="absolute bottom-1/4 right-1/5 animate-spin-slow text-xl">✨</div>

            {starsEarned === 3 && (
              <div className="bg-slate-900/90 border-2 border-amber-400 text-amber-300 px-4 py-2 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.5)] backdrop-blur-md flex items-center gap-2 animate-scaleUp">
                <span className="text-xl">🏆</span>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase text-amber-400 font-mono flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>SUCESSO TOTAL! 3 ESTRELAS</span>
                  </div>
                  <div className="text-[10px] text-amber-200/90 font-medium">
                    Algoritmo otimizado com perfeição!
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cell Inspector Floating Card (when user clicks any tile) */}
        {inspectedCell && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-3 sm:w-72 bg-slate-900/95 backdrop-blur border border-cyan-500/40 rounded-xl p-3 shadow-2xl z-30 animate-fadeIn text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-cyan-300 font-heading">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Casa ({inspectedCell.x}, {inspectedCell.y})</span>
              </div>
              <button
                onClick={() => setInspectedCell(null)}
                className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {(() => {
              const info = getCellDetails(inspectedCell.x, inspectedCell.y);
              return (
                <div className="space-y-1 text-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Distância do Robô:</span>
                    <span className="font-bold text-cyan-300">{info.distSteps} passos ({info.distReal} {level.stepUnitConversion.unit})</span>
                  </div>
                  {info.isStart && (
                    <div className="text-blue-300 font-semibold">📍 Ponto de Partida do Medidroid</div>
                  )}
                  {info.isGoal && (
                    <div className="text-emerald-300 font-semibold">🏁 Linha de Chegada / Objetivo da Fase</div>
                  )}
                  {info.obs && (
                    <div className="bg-slate-800/80 p-1.5 rounded border border-slate-700 mt-1">
                      <div className="font-bold text-amber-300">{info.obs.label || info.obs.type}</div>
                      {info.obs.hint && <div className="text-[11px] text-slate-300 mt-0.5">{info.obs.hint}</div>}
                      <div className="text-[10px] text-emerald-400 mt-0.5">
                        Status: {info.obs.solved ? '✅ Liberado/Desbloqueado' : '🔒 Bloqueado (Necessita ação)'}
                      </div>
                    </div>
                  )}
                  {!info.isStart && !info.isGoal && !info.obs && (
                    <div className="text-slate-400 italic">Piso livre para deslocamento.</div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Bottom Live Execution Feedback Banner */}
      <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
        executionStatus === 'success'
          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-lg shadow-emerald-500/10'
          : executionStatus === 'failed'
          ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-lg shadow-rose-500/10'
          : executionStatus === 'running'
          ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-200 animate-pulse'
          : 'bg-slate-800/80 border-slate-700 text-slate-300'
      }`}>
        <div className="flex items-center gap-2 flex-1">
          <Zap className={`w-4 h-4 shrink-0 ${
            executionStatus === 'success' ? 'text-emerald-400' :
            executionStatus === 'failed' ? 'text-rose-400' :
            executionStatus === 'running' ? 'text-cyan-400' : 'text-slate-400'
          }`} />
          <span className="font-medium line-clamp-2">
            {lastMessage || 'Monte o algoritmo no painel ao lado e clique em Executar para testar!'}
          </span>
        </div>

        {totalSteps > 0 && (
          <span className="font-mono font-bold bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700/60 shrink-0">
            Passo {currentStepNumber} / {totalSteps}
          </span>
        )}
      </div>
    </div>
  );
};

