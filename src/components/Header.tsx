import React from 'react';
import { 
  Play, 
  BookOpen, 
  Scale, 
  Wrench, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Award,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { Level } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  levels: Level[];
  currentLevel: Level;
  onSelectLevel: (levelId: number) => void;
  starsCount: number;
  totalStars: number;
  onOpenTutorial: () => void;
  onOpenProfile: () => void;
  onOpenTeacherGuide: () => void;
  onOpenCheatSheet: () => void;
  onOpenSandbox: () => void;
  onOpenCertificate: () => void;
  studentName: string;
  studentAvatar: string;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  isCompletedAll: boolean;
  onResetProgress: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  levels,
  currentLevel,
  onSelectLevel,
  starsCount,
  totalStars,
  onOpenTutorial,
  onOpenProfile,
  onOpenTeacherGuide,
  onOpenCheatSheet,
  onOpenSandbox,
  onOpenCertificate,
  studentName,
  studentAvatar,
  unlockedBadgesCount,
  totalBadgesCount,
  isCompletedAll,
}) => {
  const [muted, setMuted] = React.useState(sound.isMuted());

  const handleToggleMute = () => {
    const next = sound.toggleMute();
    setMuted(next);
    if (!next) sound.playClick();
  };

  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-30 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Title and Level Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-bold text-xl">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide font-heading">
                O Labirinto do Medidor
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                BNCC EF05CO04
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pensamento Computacional & Grandezas e Medidas (5º Ano)
            </p>
          </div>
        </div>

        {/* Level Selector Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={currentLevel.id}
              onChange={(e) => {
                sound.playClick();
                onSelectLevel(Number(e.target.value));
              }}
              className="appearance-none bg-slate-800 hover:bg-slate-750 text-slate-100 text-sm font-semibold pl-3 pr-8 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm"
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.title} ({lvl.category === 'length' ? 'Comprimento' : lvl.category === 'mass' ? 'Massa' : lvl.category === 'capacity' ? 'Capacidade' : 'Misto'})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Stars counter */}
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1.5 rounded-lg text-amber-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{starsCount} / {totalStars} ⭐</span>
          </div>

          {/* Student Profile & Badges Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenProfile();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-slate-800 to-indigo-950/80 hover:from-slate-750 hover:to-indigo-900 text-slate-100 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-lg border border-indigo-500/40 shadow-sm transition active:scale-95 cursor-pointer group"
            title="Abrir Perfil do Aluno e Mural de Emblemas"
          >
            <div className="w-5 h-5 rounded-md bg-indigo-600/40 flex items-center justify-center text-xs">
              {studentAvatar || '🤖'}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="hidden md:inline font-heading max-w-[100px] truncate">{studentName}</span>
              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono">
                <Award className="w-3 h-3 text-amber-400" />
                <span>{unlockedBadgesCount}/{totalBadgesCount}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interactive Tutorial Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTutorial();
            }}
            className="flex items-center gap-1.5 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-cyan-500/40 transition shadow-sm"
            title="Abrir Tutorial Interativo da Fase"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Como Jogar</span>
          </button>

          {/* Measurement Reference Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCheatSheet();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-cyan-500/30 transition shadow-sm"
            title="Tabela de Conversão de Medidas"
          >
            <Scale className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Guia de Medidas</span>
          </button>

          {/* Teacher Guide Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTeacherGuide();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-emerald-500/30 transition shadow-sm"
            title="Guia do Professor e Habilidades BNCC"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Guia BNCC</span>
          </button>

          {/* Sandbox / Builder Mode */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSandbox();
            }}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border border-purple-500/30 transition shadow-sm"
            title="Modo Laboratório / Criar Labirinto"
          >
            <Wrench className="w-4 h-4 text-purple-400" />
            <span className="hidden lg:inline">Criar Fase</span>
          </button>

          {/* Certificate Button */}
          {isCompletedAll && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md animate-pulse transition"
              title="Ver Certificado BNCC"
            >
              <Award className="w-4 h-4" />
              <span>Certificado</span>
            </button>
          )}

          {/* Audio toggle */}
          <button
            onClick={handleToggleMute}
            className={`p-2 rounded-lg border transition ${
              muted 
                ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title={muted ? 'Ativar Efeitos Sonoros' : 'Silenciar'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
