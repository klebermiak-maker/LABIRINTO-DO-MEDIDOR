import React, { useState } from 'react';
import { 
  Award, 
  X, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Star, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Check, 
  Share2, 
  Trophy, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { Achievement, AchievementCategory, StudentProfileData } from '../types';
import { sound } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfileData;
  onUpdateProfile: (updated: Partial<StudentProfileData>) => void;
  onOpenCertificate?: () => void;
}

const AVATARS = [
  { id: 'robot', emoji: '🤖', label: 'Medidroid' },
  { id: 'girl_coder', emoji: '👩‍💻', label: 'Programadora' },
  { id: 'boy_coder', emoji: '👨‍💻', label: 'Programador' },
  { id: 'scientist', emoji: '🧪', label: 'Cientista' },
  { id: 'wizard', emoji: '🧙‍♂️', label: 'Mestre da Lógica' },
  { id: 'astronaut', emoji: '🚀', label: 'Astronauta' },
  { id: 'star_math', emoji: '⭐', label: 'Estrela da Matemática' },
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'badges' | 'stats' | 'settings'>('badges');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(profile.name);
  const [tempGrade, setTempGrade] = useState<string>(profile.grade);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(profile.avatar);

  if (!isOpen) return null;

  const unlockedCount = profile.unlockedAchievementIds.length;
  const totalAchievements = ACHIEVEMENTS.length;
  const totalPoints = ACHIEVEMENTS
    .filter(a => profile.unlockedAchievementIds.includes(a.id))
    .reduce((sum, a) => sum + a.points, 0);

  const maxPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);

  // Compute Rank Title based on points
  const getRank = (pts: number) => {
    if (pts >= 1200) return { title: 'Mestre Supremo dos Algoritmos', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' };
    if (pts >= 800) return { title: 'Engenheiro(a) de Otimização BNCC', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/40' };
    if (pts >= 500) return { title: 'Especialista em Grandezas & Medidas', color: 'text-cyan-400', bg: 'bg-cyan-500/20 border-cyan-500/40' };
    if (pts >= 250) return { title: 'Programador(a) Júnior', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
    return { title: 'Cadete Explorador(a) do Medidor', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/40' };
  };

  const rank = getRank(totalPoints);

  const filteredAchievements = ACHIEVEMENTS.filter(a => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  const handleSaveProfile = () => {
    sound.playClick();
    onUpdateProfile({
      name: tempName.trim() || 'Jovem Programador(a)',
      grade: tempGrade.trim() || '5º Ano - Ensino Fundamental',
      avatar: selectedAvatar,
    });
    setIsEditingName(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="student-profile-modal"
        className="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 animate-scaleUp"
      >
        {/* Top Profile Header Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800 p-4 sm:p-6">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {onOpenCertificate && (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                  onOpenCertificate();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Ver Certificado</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              title="Fechar Perfil"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Student Info Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center text-4xl">
                <div className="w-full h-full bg-slate-900/90 rounded-[14px] flex items-center justify-center">
                  {profile.avatar || '🤖'}
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('settings');
                }}
                className="absolute -bottom-1 -right-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-1 rounded-full shadow transition"
                title="Mudar Avatar"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name, Grade, Rank */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="bg-slate-800 border border-cyan-500 rounded-lg px-2.5 py-1 text-sm font-bold text-white focus:outline-none"
                      placeholder="Nome do Aluno(a)"
                    />
                    <button
                      onClick={handleSaveProfile}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-1 rounded-lg transition"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
                      {profile.name}
                    </h2>
                    <button
                      onClick={() => {
                        sound.playClick();
                        setIsEditingName(true);
                      }}
                      className="text-slate-400 hover:text-cyan-400 transition"
                      title="Editar Nome"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${rank.bg} ${rank.color} uppercase tracking-wider`}>
                  {rank.title}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-3">
                {profile.grade} • Alinhado à Base Nacional Comum Curricular (BNCC)
              </p>

              {/* Points Progress Bar */}
              <div className="w-full max-w-md bg-slate-800/80 rounded-full h-3 border border-slate-700 overflow-hidden relative">
                <div 
                  className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-amber-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (totalPoints / maxPoints) * 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between max-w-md text-[11px] text-slate-400 font-mono mt-1">
                <span>{totalPoints} XP acumulados</span>
                <span>{unlockedCount} de {totalAchievements} emblemas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('badges');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'badges'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Mural de Emblemas ({unlockedCount}/{totalAchievements})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('stats');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'stats'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Estatísticas de Desempenho</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('settings');
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'settings'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Perfil & Avatar</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* TAB 1: BADGES SHOWCASE */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> Filtrar:
                </span>
                {[
                  { id: 'all', label: 'Todos os Emblemas' },
                  { id: 'perfection', label: '🎯 Sem Erros (Perfeição)' },
                  { id: 'efficiency', label: '⚡ Otimização de Blocos' },
                  { id: 'math', label: '📏 Grandezas & Medidas' },
                  { id: 'discovery', label: '🚀 Descoberta & Criação' },
                  { id: 'mastery', label: '👑 Mestria Global' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedCategory(cat.id as AchievementCategory | 'all');
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {filteredAchievements.map((ach) => {
                  const isUnlocked = profile.unlockedAchievementIds.includes(ach.id);
                  const unlockDate = profile.achievementUnlockDates[ach.id];

                  return (
                    <div
                      key={ach.id}
                      className={`relative rounded-xl p-3.5 border transition-all duration-300 flex items-start gap-3.5 ${
                        isUnlocked
                          ? 'bg-slate-850/90 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                          : 'bg-slate-900/50 border-slate-800/80 opacity-60'
                      }`}
                    >
                      {/* Badge Icon */}
                      <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                          isUnlocked
                            ? `bg-gradient-to-tr ${ach.badgeColor} text-white shadow-cyan-500/20 ring-2 ring-cyan-400/50`
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}>
                          {ach.icon}
                        </div>
                        {isUnlocked ? (
                          <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-0.5 shadow">
                            <CheckCircle2 className="w-4 h-4 fill-emerald-400 text-slate-950" />
                          </div>
                        ) : (
                          <div className="absolute -bottom-1 -right-1 bg-slate-800 text-slate-400 rounded-full p-1 border border-slate-700 shadow">
                            <Lock className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Badge Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className={`font-bold text-sm truncate ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>
                            {ach.title}
                          </h4>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isUnlocked ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                          }`}>
                            +{ach.points} XP
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed mb-2">
                          {ach.description}
                        </p>

                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                          {ach.bnccCode && (
                            <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                              BNCC {ach.bnccCode}
                            </span>
                          )}

                          {isUnlocked && unlockDate && (
                            <span className="text-emerald-400 font-mono">
                              Conquistado em {unlockDate}
                            </span>
                          )}

                          {!isUnlocked && (
                            <span className="text-slate-400 italic">
                              Requisito: {ach.requirement}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-5">
              {/* Quick Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono mb-1">
                    {profile.stats.levelsCompleted} / 12
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Fases Concluídas</div>
                </div>

                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mb-1 flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{profile.stats.perfectRunsCount}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Fases 3 Estrelas (Ótimas)</div>
                </div>

                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mb-1 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>{profile.stats.flawlessRunsCount}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Fases Sem Erros (100%)</div>
                </div>

                <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono mb-1">
                    {profile.stats.loopsOptimizedCount}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Laços Otimizados</div>
                </div>
              </div>

              {/* Pedagogical Competence Summary (BNCC) */}
              <div className="bg-slate-850/80 rounded-xl p-4 sm:p-5 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Matriz de Competências BNCC Desenvolvidas</span>
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Length */}
                  <div>
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span>EF05MA19 • Grandezas & Medidas de Comprimento (mm, cm, m, km)</span>
                      <span className="text-cyan-400 font-mono">Dominado</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-400 h-full rounded-full w-full" />
                    </div>
                  </div>

                  {/* Mass */}
                  <div>
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span>EF05MA19 • Medidas de Massa & Balança (g, kg, tonelada)</span>
                      <span className="text-amber-400 font-mono">Dominado</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full w-full" />
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span>EF05MA19 • Medidas de Capacidade & Fluidos (ml, L)</span>
                      <span className="text-teal-400 font-mono">Dominado</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full rounded-full w-full" />
                    </div>
                  </div>

                  {/* Computational Thinking */}
                  <div>
                    <div className="flex justify-between text-slate-300 font-semibold mb-1">
                      <span>EF05CO04 & EF05CO05 • Pensamento Computacional & Otimização de Algoritmos</span>
                      <span className="text-purple-400 font-mono">Dominado</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-400 h-full rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & AVATAR */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="bg-slate-850 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-4">
                <h4 className="text-sm font-bold text-white font-heading">
                  Personalizar Dados do Aluno(a)
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nome Completo (para o Certificado e Mural):
                  </label>
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: Carlos Eduardo Silva"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Turma / Escola:
                  </label>
                  <input
                    type="text"
                    value={tempGrade}
                    onChange={(e) => setTempGrade(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="Ex: 5º Ano B - Escola Municipal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Escolha seu Avatar:
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setSelectedAvatar(av.emoji);
                        }}
                        className={`p-2.5 rounded-xl text-2xl flex flex-col items-center justify-center gap-1 border transition cursor-pointer ${
                          selectedAvatar === av.emoji
                            ? 'bg-cyan-500/20 border-cyan-400 ring-2 ring-cyan-400/50'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                        title={av.label}
                      >
                        <span>{av.emoji}</span>
                        <span className="text-[9px] text-slate-400 truncate w-full text-center">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
