import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  X, 
  Sparkles, 
  Play, 
  ArrowUp, 
  Layers, 
  Compass, 
  MousePointerClick,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';
import { BlockType, CodeBlock } from '../types';

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBlock: (type: BlockType) => void;
  onSetBlocks: (blocks: CodeBlock[]) => void;
  currentBlocksCount: number;
}

interface TutorialStep {
  id: number;
  title: string;
  badge: string;
  targetElementId?: string;
  description: string;
  mathNote?: string;
  icon: string;
  actionText?: string;
  onAction?: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  isOpen,
  onClose,
  onAddBlock,
  onSetBlocks,
  currentBlocksCount,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TutorialStep[] = [
    {
      id: 1,
      title: 'Bem-vindo ao Labirinto do Medidor!',
      badge: 'Passo 1 de 5 • O Tabuleiro & Medidroid',
      targetElementId: 'game-board-container',
      icon: '🤖',
      description:
        'Este é o tabuleiro 2D de simulação. O robô Medidroid inicia na posição (0, 1) virado para Leste (→). O objetivo é construir um algoritmo para conduzi-lo com segurança até a Bandeira de Chegada 🏁 na posição (4, 1).',
      mathNote:
        'Escala da Fase: 1 passo = 1 metro (1 m). Para percorrer 4 casas em linha reta, o robô precisa se deslocar 4 metros.',
    },
    {
      id: 2,
      title: 'A Caixa de Comandos (Toolbox)',
      badge: 'Passo 2 de 5 • Seleção de Blocos',
      targetElementId: 'toolbox-container',
      icon: '📦',
      description:
        'Aqui você encontra os blocos de instruções lógicas alinhados à BNCC. Cada clique no bloco "Avance" adiciona 1 instrução de movimento de 1 metro ao código.',
      mathNote:
        'Pensamento Computacional: Um algoritmo é uma sequência ordenada de instruções para resolver um desafio.',
      actionText: '➕ Adicionar 1 Bloco "Avance"',
      onAction: () => {
        sound.playClick();
        onAddBlock('move_forward');
      },
    },
    {
      id: 3,
      title: 'Área de Programação (Workspace)',
      badge: 'Passo 3 de 5 • Sequência Lógica',
      targetElementId: 'workspace-container',
      icon: '🧩',
      description:
        'Os blocos adicionados são organizados sequencialmente de cima para baixo. Você pode reordenar instruções usando as setas ⬆️⬇️, remover blocos no ❌ ou alternar para o modo Pseudocódigo.',
      mathNote:
        'Habilidade BNCC EF05CO04: Construção e análise de algoritmos estruturados.',
    },
    {
      id: 4,
      title: 'Planejando a Solução (4 Metros)',
      badge: 'Passo 4 de 5 • Grandezas & Medidas',
      targetElementId: 'workspace-container',
      icon: '📏',
      description:
        'Para alcançar a bandeira na casa (4, 1), o Medidroid precisa de exatamente 4 blocos de "Avance". Usando até 4 blocos, você conquista a pontuação perfeita de 3 Estrelas ⭐⭐⭐!',
      mathNote:
        'Cálculo Matemático (EF05MA19): 4 passos × 1 m/passo = 4 metros no total.',
      actionText: '🪄 Preencher Sequência Completa (4 × Avance)',
      onAction: () => {
        sound.playVictory();
        onSetBlocks([
          { id: 'tut-b1', type: 'move_forward' },
          { id: 'tut-b2', type: 'move_forward' },
          { id: 'tut-b3', type: 'move_forward' },
          { id: 'tut-b4', type: 'move_forward' },
        ]);
      },
    },
    {
      id: 5,
      title: 'Executar e Depurar o Algoritmo!',
      badge: 'Passo 5 de 5 • Simulação & Debug',
      targetElementId: 'workspace-execute-btn-area',
      icon: '🚀',
      description:
        'Clique no botão verde "Executar Algoritmo" para ver o robô se mover! O bloco ativo é iluminado em tempo real. Se errar o cálculo, basta ajustar os blocos e clicar em "Reiniciar".',
      mathNote:
        'Dica de Ouro: Você também pode usar "Passo a Passo" para acompanhar cada instrução individualmente.',
      actionText: '🚀 Concluir Tutorial & Jogar!',
      onAction: () => {
        sound.playVictory();
        onClose();
      },
    },
  ];

  const currentStepData = steps[currentStep - 1];

  // Update target element highlight bounding box
  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      if (currentStepData.targetElementId) {
        const el = document.getElementById(currentStepData.targetElementId);
        if (el) {
          setTargetRect(el.getBoundingClientRect());
          return;
        }
      }
      setTargetRect(null);
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    };
  }, [isOpen, currentStep, currentStepData.targetElementId]);

  if (!isOpen) return null;

  const handleNext = () => {
    sound.playClick();
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-[2px] transition-all animate-fadeIn">
      {/* Target Highlight Spotlight (if target rect is found) */}
      {targetRect && (
        <div
          className="fixed pointer-events-none rounded-2xl ring-4 ring-cyan-400 ring-offset-4 ring-offset-slate-950 transition-all duration-300 shadow-[0_0_40px_rgba(6,182,212,0.4)] z-40 hidden md:block"
          style={{
            top: `${Math.max(8, targetRect.top - 6)}px`,
            left: `${Math.max(8, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        >
          {/* Animated pointer tag */}
          <div className="absolute -top-3 left-4 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>Área em Foco</span>
          </div>
        </div>
      )}

      {/* Tutorial Dialog Card */}
      <div 
        id="tutorial-modal-card"
        className="bg-slate-900 border-2 border-cyan-500/70 rounded-2xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative z-50 overflow-hidden text-slate-100 animate-scaleUp"
      >
        {/* Ambient background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
              {currentStepData.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {currentStepData.badge}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                {currentStepData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Pular Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {steps.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                sound.playClick();
                setCurrentStep(s.id);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.id === currentStep
                  ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]'
                  : s.id < currentStep
                  ? 'w-3 bg-emerald-500'
                  : 'w-3 bg-slate-700'
              }`}
              title={`Ir para o Passo ${s.id}`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="space-y-3.5 mb-5 text-xs sm:text-sm">
          <p className="text-slate-200 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Educational Math / BNCC Insight Box */}
          {currentStepData.mathNote && (
            <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-xl p-3 flex items-start gap-2.5 text-cyan-200">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-cyan-300 block mb-0.5">
                  Conexão Matemática & BNCC:
                </span>
                {currentStepData.mathNote}
              </div>
            </div>
          )}

          {/* Interactive In-Tutorial Action Button (e.g. Add Block or Auto-Fill) */}
          {currentStepData.actionText && currentStepData.onAction && (
            <div className="pt-1">
              <button
                onClick={currentStepData.onAction}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 active:scale-98 transition cursor-pointer"
              >
                <MousePointerClick className="w-4 h-4" />
                <span>{currentStepData.actionText}</span>
              </button>
            </div>
          )}

          {/* Live Status indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-850 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
            <span>Blocos no seu programa:</span>
            <span className="font-bold text-cyan-300">
              {currentBlocksCount} {currentBlocksCount === 1 ? 'bloco' : 'blocos'}
            </span>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Pular Tutorial
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 active:scale-95 transition"
            >
              <span>{currentStep === steps.length ? 'Concluir' : 'Próximo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
