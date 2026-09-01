import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, Award, CheckCircle2, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { Level, Achievement } from '../types';
import { sound } from '../utils/audio';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: Level;
  starsEarned: number;
  totalBlocksUsed: number;
  isFlawlessRun?: boolean;
  newAchievements?: Achievement[];
  onNextLevel: () => void;
  onReplay: () => void;
  onClose: () => void;
  onOpenProfile?: () => void;
  hasNextLevel: boolean;
  onOpenCertificate: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  starsEarned,
  totalBlocksUsed,
  isFlawlessRun,
  newAchievements = [],
  onNextLevel,
  onReplay,
  onClose,
  onOpenProfile,
  hasNextLevel,
  onOpenCertificate,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Ignore if confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 mb-3 animate-bounce">
          🎉
        </div>

        <h3 className="text-xl font-bold text-white font-heading">
          Fase Concluída com Sucesso!
        </h3>
        <p className="text-xs text-emerald-300 font-semibold mt-0.5">
          {level.title}
        </p>

        {/* Stars Rating */}
        <div className="flex items-center justify-center gap-2 my-3">
          {[1, 2, 3].map((starIdx) => {
            const isFilled = starIdx <= starsEarned;
            return (
              <Star
                key={starIdx}
                className={`w-8 h-8 transition-all duration-500 transform ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow-[0_0_8px_#f59e0b]'
                    : 'text-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Performance Tags (No-error + 3-star optimization) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          {isFlawlessRun && (
            <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sem Erros (100% Preciso)</span>
            </span>
          )}

          {starsEarned === 3 && (
            <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Código Ultra Otimizado</span>
            </span>
          )}
        </div>

        {/* Newly Unlocked Achievements in this run */}
        {newAchievements.length > 0 && (
          <div className="mb-4 bg-amber-500/10 border-2 border-amber-400/60 rounded-xl p-3 text-left animate-pulse-slow">
            <div className="flex items-center justify-between text-xs font-bold text-amber-300 mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Novo Emblema Desbloqueado!</span>
              </div>
              {onOpenProfile && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    onOpenProfile();
                  }}
                  className="text-[10px] text-cyan-300 hover:underline cursor-pointer"
                >
                  Ver no Perfil
                </button>
              )}
            </div>
            {newAchievements.map((ach) => (
              <div key={ach.id} className="flex items-center gap-2.5 bg-slate-900/80 p-2 rounded-lg border border-amber-500/30">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${ach.badgeColor} flex items-center justify-center text-base shadow shrink-0`}>
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{ach.title}</div>
                  <div className="text-[10px] text-slate-300 truncate">{ach.description}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                  +{ach.points} XP
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Block efficiency info */}
        <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 text-xs mb-3">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span>Blocos Utilizados:</span>
            <span className="font-bold font-mono text-cyan-300">{totalBlocksUsed} blocos</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Meta para 3 Estrelas:</span>
            <span className="font-bold font-mono text-amber-300">≤ {level.targetStars.threeStarsMaxBlocks} blocos</span>
          </div>
        </div>

        {/* Educational Math Explanation */}
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 text-left mb-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Explicação Matemática & BNCC:</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {level.mathExplanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {hasNextLevel ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition cursor-pointer"
            >
              <span>Próxima Fase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCertificate();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 font-bold text-sm py-3 rounded-xl shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>Ver Certificado de Mestre!</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jogar Novamente</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
