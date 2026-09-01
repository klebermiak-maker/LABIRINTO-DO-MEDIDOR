import React, { useEffect } from 'react';
import { Award, Sparkles, X, ChevronRight } from 'lucide-react';
import { Achievement } from '../types';
import { sound } from '../utils/audio';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
  onOpenProfile: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  achievement,
  onClose,
  onOpenProfile,
}) => {
  useEffect(() => {
    if (!achievement) return;

    sound.playAchievement();

    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short">
      <div 
        className="bg-slate-900/95 border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] backdrop-blur-md text-slate-100 relative overflow-hidden flex items-start gap-3.5"
      >
        {/* Glowing aura */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${achievement.badgeColor} flex items-center justify-center text-2xl shadow-lg shrink-0 ring-2 ring-amber-400`}>
          {achievement.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-400 font-mono">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
            <span>Novo Emblema Conquistado!</span>
          </div>

          <h4 className="text-sm font-bold text-white truncate">
            {achievement.title}
          </h4>

          <p className="text-xs text-slate-300 leading-snug line-clamp-2 mt-0.5">
            {achievement.description}
          </p>

          <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-slate-800">
            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
              +{achievement.points} XP
            </span>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
                onOpenProfile();
              }}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>Ver no Perfil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
