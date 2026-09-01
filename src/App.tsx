import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GameBoard } from './components/GameBoard';
import { Toolbox } from './components/Toolbox';
import { CodeWorkspace } from './components/CodeWorkspace';
import { MeasurementCheatSheet } from './components/MeasurementCheatSheet';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { CertificateModal } from './components/CertificateModal';
import { CustomLevelBuilder } from './components/CustomLevelBuilder';
import { TutorialOverlay } from './components/TutorialOverlay';
import { StudentProfileModal } from './components/StudentProfileModal';
import { AchievementToast } from './components/AchievementToast';
import { LEVELS } from './data/levels';
import { ACHIEVEMENTS } from './data/achievements';
import { 
  Achievement,
  BlockType, 
  CodeBlock, 
  ExecutionStep, 
  Level, 
  LevelProgress, 
  Obstacle, 
  RobotState, 
  StudentProfileData,
  Unit 
} from './types';
import { interpretAlgorithm, countTotalBlocks } from './utils/interpreter';
import { sound } from './utils/audio';
import { fireBoardConfetti } from './utils/confettiFx';
import { HelpCircle, Sparkles, X } from 'lucide-react';

const INITIAL_PROFILE: StudentProfileData = {
  name: 'Jovem Programador(a)',
  grade: '5º Ano - Ensino Fundamental',
  avatar: '🤖',
  title: 'Cadete do Medidor',
  unlockedAchievementIds: [],
  achievementUnlockDates: {},
  stats: {
    levelsCompleted: 0,
    perfectRunsCount: 0,
    flawlessRunsCount: 0,
    totalBlocksUsed: 0,
    loopsOptimizedCount: 0,
    sandboxLevelsCreated: 0,
    conversionsSolved: 0,
    totalStarsEarned: 0,
  },
};

export default function App() {
  const [levelsList, setLevelsList] = useState<Level[]>(LEVELS);
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const currentLevel = levelsList.find((l) => l.id === currentLevelId) || levelsList[0];

  // Code blocks for the current level
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);

  // Simulation execution states
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(450); // ms per step
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  // Active state during simulation
  const [robotState, setRobotState] = useState<RobotState>({
    x: currentLevel.start.x,
    y: currentLevel.start.y,
    dir: currentLevel.start.dir,
    inventory: { keys: {}, crystals: 0, currentWeight: 0, currentLiquid: 0 },
    energy: 100,
    status: 'idle',
  });
  const [activeObstacles, setActiveObstacles] = useState<Obstacle[]>(currentLevel.obstacles);
  const [lastMessage, setLastMessage] = useState<string>('');

  // Modals state
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('medidroid_tutorial_seen');
    } catch {
      return true;
    }
  });
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);
  const [isLevelCompleteOpen, setIsLevelCompleteOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);

  // Achievements toast & round rewards
  const [latestToastAchievement, setLatestToastAchievement] = useState<Achievement | null>(null);
  const [roundAchievements, setRoundAchievements] = useState<Achievement[]>([]);
  const [isCurrentRunFlawless, setIsCurrentRunFlawless] = useState<boolean>(false);

  // Failure tracking for current level attempt
  const [levelFailuresCount, setLevelFailuresCount] = useState<number>(0);
  const [flawlessStreak, setFlawlessStreak] = useState<number>(0);

  // Student Profile state
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(() => {
    try {
      const saved = localStorage.getItem('medidroid_student_profile');
      if (saved) {
        return { ...INITIAL_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return INITIAL_PROFILE;
  });

  // Save student profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('medidroid_student_profile', JSON.stringify(studentProfile));
    } catch {
      // Ignore
    }
  }, [studentProfile]);

  const handleCloseTutorial = () => {
    setIsTutorialOpen(false);
    try {
      localStorage.setItem('medidroid_tutorial_seen', 'true');
    } catch {
      // Ignore
    }
  };

  // Progress tracking
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(() => {
    try {
      const saved = localStorage.getItem('medidroid_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    const initial: Record<number, LevelProgress> = {};
    LEVELS.forEach((l, i) => {
      initial[l.id] = {
        unlocked: i === 0,
        completed: false,
        stars: 0,
      };
    });
    return initial;
  });

  const [earnedStars, setEarnedStars] = useState<number>(0);

  // Timer reference for step simulation
  const timerRef = useRef<number | null>(null);

  // Initialize level state when currentLevel changes
  useEffect(() => {
    resetSimulationState();
    setLevelFailuresCount(0);

    // Load saved blocks for this level if available
    try {
      const savedBlocks = localStorage.getItem(`medidroid_blocks_lvl_${currentLevel.id}`);
      if (savedBlocks) {
        setBlocks(JSON.parse(savedBlocks));
      } else {
        // Starter blocks tailored for gentle onboarding
        if (currentLevel.id === 1) {
          setBlocks([
            { id: 'b-start-1', type: 'move_forward' },
            { id: 'b-start-2', type: 'move_forward' },
          ]);
        } else if (currentLevel.id === 2) {
          setBlocks([
            {
              id: 'b-start-loop',
              type: 'repeat',
              repeatCount: 5,
              children: [{ id: 'b-start-child', type: 'move_forward' }],
            },
          ]);
        } else {
          setBlocks([]);
        }
      }
    } catch {
      setBlocks([]);
    }
  }, [currentLevelId]);

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem('medidroid_progress', JSON.stringify(progress));
    } catch {
      // Ignore
    }
  }, [progress]);

  // Update profile
  const handleUpdateProfile = (updated: Partial<StudentProfileData>) => {
    setStudentProfile((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // Save code blocks
  const handleUpdateBlocks = (newBlocks: CodeBlock[]) => {
    setBlocks(newBlocks);
    try {
      localStorage.setItem(`medidroid_blocks_lvl_${currentLevel.id}`, JSON.stringify(newBlocks));
    } catch {
      // Ignore
    }
  };

  const resetSimulationState = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepIdx(0);
    setActiveBlockId(null);
    setRobotState({
      x: currentLevel.start.x,
      y: currentLevel.start.y,
      dir: currentLevel.start.dir,
      inventory: { keys: {}, crystals: 0, currentWeight: 0, currentLiquid: 0 },
      energy: 100,
      status: 'idle',
    });
    setActiveObstacles(currentLevel.obstacles.map((o) => ({ ...o, solved: false })));
    setLastMessage(currentLevel.storyContext);
  };

  // Add block from toolbox
  const handleAddBlock = (
    type: BlockType,
    defaults?: Partial<{ repeatCount: number; unitValue: number; unit: Unit }>
  ) => {
    const newBlock: CodeBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      repeatCount: defaults?.repeatCount || 2,
      unitValue: defaults?.unitValue || (type === 'inject_capacity' ? 500 : 1),
      unit: defaults?.unit || (type === 'inject_capacity' ? 'ml' : type === 'add_weight' ? 'kg' : 'm'),
      condition: 'front_is_gate',
      children: type === 'repeat' ? [{ id: `child-${Date.now()}`, type: 'move_forward' }] : undefined,
      thenBlocks: type === 'if_condition' ? [{ id: `then-${Date.now()}`, type: 'use_key', unit: 'm' }] : undefined,
    };
    handleUpdateBlocks([...blocks, newBlock]);
  };

  // Run full algorithm
  const handleRunSimulation = () => {
    if (blocks.length === 0) return;

    if (isPaused && executionSteps.length > 0) {
      setIsPaused(false);
      setIsRunning(true);
      startPlaybackTimer(currentStepIdx);
      return;
    }

    // Interpret code
    const result = interpretAlgorithm(currentLevel, blocks);
    setExecutionSteps(result.steps);
    setCurrentStepIdx(0);
    setIsRunning(true);
    setIsPaused(false);

    // Start playback
    startPlaybackTimer(0, result.steps);
  };

  const startPlaybackTimer = (startIdx: number, stepsToUse?: ExecutionStep[]) => {
    if (timerRef.current) window.clearInterval(timerRef.current);

    let idx = startIdx;
    const steps = stepsToUse || executionSteps;

    timerRef.current = window.setInterval(() => {
      if (idx >= steps.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setIsRunning(false);
        return;
      }

      const step = steps[idx];
      applyStep(step, idx, steps.length);
      idx++;
      setCurrentStepIdx(idx);

      if (idx >= steps.length) {
        if (timerRef.current) window.clearInterval(timerRef.current);
        setIsRunning(false);

        // Check if finished with success
        const lastStep = steps[steps.length - 1];
        if (lastStep.robotState.status === 'success') {
          handleSuccessCompletion();
        } else if (lastStep.robotState.status === 'failed') {
          setLevelFailuresCount((prev) => prev + 1);
          setFlawlessStreak(0);
          sound.playError();
        }
      }
    }, speed);
  };

  const applyStep = (step: ExecutionStep, idx: number, total: number) => {
    setRobotState(step.robotState);
    setActiveBlockId(step.activeBlockId);
    setLastMessage(step.message);

    // Audio effects for step
    if (step.type === 'move') sound.playStep();
    else if (step.type === 'turn') sound.playTurn();
    else if (step.type === 'action') sound.playUnlock();

    if (step.obstacleIdUpdated) {
      setActiveObstacles((prev) =>
        prev.map((o) => (o.id === step.obstacleIdUpdated ? { ...o, solved: true } : o))
      );
    }
  };

  const handlePause = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPaused(true);
    setIsRunning(false);
  };

  const handleStepForward = () => {
    let steps = executionSteps;
    if (steps.length === 0 || !isRunning) {
      const result = interpretAlgorithm(currentLevel, blocks);
      steps = result.steps;
      setExecutionSteps(steps);
      setCurrentStepIdx(0);
      setIsRunning(true);
      setIsPaused(true);
    }

    if (currentStepIdx < steps.length) {
      const step = steps[currentStepIdx];
      applyStep(step, currentStepIdx, steps.length);
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);

      if (nextIdx >= steps.length) {
        setIsRunning(false);
        setIsPaused(false);
        const lastStep = steps[steps.length - 1];
        if (lastStep.robotState.status === 'success') {
          handleSuccessCompletion();
        } else if (lastStep.robotState.status === 'failed') {
          setLevelFailuresCount((prev) => prev + 1);
          setFlawlessStreak(0);
          sound.playError();
        }
      }
    }
  };

  const handleSuccessCompletion = () => {
    const totalBlocks = countTotalBlocks(blocks);
    let stars = 1;
    if (totalBlocks <= currentLevel.targetStars.threeStarsMaxBlocks) {
      stars = 3;
    } else if (totalBlocks <= currentLevel.targetStars.twoStarsMaxBlocks) {
      stars = 2;
    }

    setEarnedStars(stars);

    // Evaluate Flawless Run (Zero simulation errors/collisions on this level attempt)
    const isFlawless = levelFailuresCount === 0;
    setIsCurrentRunFlawless(isFlawless);
    const nextStreak = isFlawless ? flawlessStreak + 1 : 0;
    setFlawlessStreak(nextStreak);

    // Check if loops were used
    const hasLoops = blocks.some(
      (b) => b.type === 'repeat' || (b.children && b.children.length > 0)
    );

    // Update progress state
    setProgress((prev) => {
      const nextProgress = { ...prev };
      const currentEntry = nextProgress[currentLevel.id] || { unlocked: true, completed: false, stars: 0 };
      nextProgress[currentLevel.id] = {
        unlocked: true,
        completed: true,
        stars: Math.max(currentEntry.stars, stars),
        bestBlockCount: Math.min(currentEntry.bestBlockCount || 999, totalBlocks),
        attemptsCount: (currentEntry.attemptsCount || 0) + 1,
        completedWithoutErrors: isFlawless || currentEntry.completedWithoutErrors,
      };

      // Unlock next level if exists
      const nextLvl = levelsList.find((l) => l.id === currentLevel.id + 1);
      if (nextLvl) {
        nextProgress[nextLvl.id] = {
          ...(nextProgress[nextLvl.id] || { completed: false, stars: 0 }),
          unlocked: true,
        };
      }

      return nextProgress;
    });

    // Update Student Profile & Evaluate Achievements
    const today = new Date().toLocaleDateString('pt-BR');
    const newlyUnlocked: Achievement[] = [];
    const alreadyUnlocked = new Set(studentProfile.unlockedAchievementIds);

    const unlockAchievement = (id: string) => {
      if (!alreadyUnlocked.has(id)) {
        const found = ACHIEVEMENTS.find((a) => a.id === id);
        if (found) {
          newlyUnlocked.push(found);
          alreadyUnlocked.add(id);
        }
      }
    };

    // 1. Primeiros Passos
    unlockAchievement('first_victory');

    // 2. Sem Erros (Flawless)
    if (isFlawless) {
      unlockAchievement('flawless_starter');
    }

    // 3. Otimizador de Blocos (3 estrelas nesta fase)
    if (stars === 3) {
      unlockAchievement('block_optimizer');
    }

    // 4. Mestre dos Laços
    if (hasLoops) {
      unlockAchievement('loop_master');
    }

    // 5. Grandezas específicas
    if (currentLevel.category === 'length' || currentLevel.obstacles.some((o) => o.type === 'gate')) {
      unlockAchievement('length_expert');
    }
    if (currentLevel.category === 'mass' || currentLevel.obstacles.some((o) => o.type === 'scale')) {
      unlockAchievement('mass_expert');
    }
    if (currentLevel.category === 'capacity' || currentLevel.obstacles.some((o) => o.type === 'tank')) {
      unlockAchievement('capacity_expert');
    }

    // 6. Sequência de Ouro (3 fases sem falhas)
    if (nextStreak >= 3) {
      unlockAchievement('no_bugs_streak');
    }

    // 7. Código Ultra Compacto (superou meta de 3 estrelas)
    if (totalBlocks < currentLevel.targetStars.threeStarsMaxBlocks) {
      unlockAchievement('ultra_compact_code');
    }

    // Update Student Profile Stats
    setStudentProfile((prev) => {
      const isNewCompletion = !progress[currentLevel.id]?.completed;
      const wasThreeStars = (progress[currentLevel.id]?.stars || 0) === 3;
      const isNewThreeStars = stars === 3 && !wasThreeStars;
      const nextPerfectCount = prev.stats.perfectRunsCount + (isNewThreeStars ? 1 : 0);

      // Check 3-stars count achievements
      if (nextPerfectCount >= 3) {
        unlockAchievement('triple_perfection');
      }

      // Check Grand Master (completed all standard levels)
      const nextCompletedCount = prev.stats.levelsCompleted + (isNewCompletion ? 1 : 0);
      if (nextCompletedCount >= 12) {
        unlockAchievement('grand_master');
      }

      const updatedUnlockDates = { ...prev.achievementUnlockDates };
      newlyUnlocked.forEach((a) => {
        updatedUnlockDates[a.id] = today;
      });

      return {
        ...prev,
        unlockedAchievementIds: Array.from(alreadyUnlocked),
        achievementUnlockDates: updatedUnlockDates,
        stats: {
          ...prev.stats,
          levelsCompleted: nextCompletedCount,
          perfectRunsCount: nextPerfectCount,
          flawlessRunsCount: prev.stats.flawlessRunsCount + (isFlawless ? 1 : 0),
          totalBlocksUsed: prev.stats.totalBlocksUsed + totalBlocks,
          loopsOptimizedCount: prev.stats.loopsOptimizedCount + (hasLoops ? 1 : 0),
          conversionsSolved: prev.stats.conversionsSolved + (currentLevel.obstacles.filter(o => o.requiredValue).length || 1),
          totalStarsEarned: (Object.values(progress) as LevelProgress[]).reduce((acc: number, p: LevelProgress) => acc + (p.stars || 0), 0) + (stars > (progress[currentLevel.id]?.stars || 0) ? (stars - (progress[currentLevel.id]?.stars || 0)) : 0),
        },
      };
    });

    setRoundAchievements(newlyUnlocked);
    if (newlyUnlocked.length > 0) {
      setLatestToastAchievement(newlyUnlocked[0]);
    }

    // Fire celebratory confetti animation directly over the GameBoard container
    fireBoardConfetti('game-board-container', stars === 3);

    // If 3 stars (total perfection), play achievement celebration sound
    if (stars === 3) {
      sound.playAchievement();
    }

    // Open modal with a brief celebratory delay so the student sees the robot dance & board particle burst
    setTimeout(() => {
      setIsLevelCompleteOpen(true);
    }, 450);
  };

  const handleNextLevel = () => {
    setIsLevelCompleteOpen(false);
    const nextLvl = levelsList.find((l) => l.id === currentLevel.id + 1);
    if (nextLvl) {
      setCurrentLevelId(nextLvl.id);
    }
  };

  // Calculate total stars collected across all levels
  const progressList = Object.values(progress) as LevelProgress[];
  const totalStarsCount = progressList.reduce((acc, p) => acc + (p.stars || 0), 0);
  const maxPossibleStars = levelsList.length * 3;
  const isCompletedAll = progressList.filter((p) => p.completed).length >= levelsList.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        levels={levelsList}
        currentLevel={currentLevel}
        onSelectLevel={(lvlId) => setCurrentLevelId(lvlId)}
        starsCount={totalStarsCount}
        totalStars={maxPossibleStars}
        onOpenTutorial={() => setIsTutorialOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenSandbox={() => setIsSandboxOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        studentName={studentProfile.name}
        studentAvatar={studentProfile.avatar}
        unlockedBadgesCount={studentProfile.unlockedAchievementIds.length}
        totalBadgesCount={ACHIEVEMENTS.length}
        isCompletedAll={isCompletedAll}
        onResetProgress={() => {
          localStorage.removeItem('medidroid_progress');
          localStorage.removeItem('medidroid_student_profile');
          window.location.reload();
        }}
      />

      {/* Toast Notification when a new Badge / Achievement is unlocked */}
      <AchievementToast
        achievement={latestToastAchievement}
        onClose={() => setLatestToastAchievement(null)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Split Screen Gameplay Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (5 cols on lg): 2D Grid Board & Command Toolbox */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <GameBoard
            level={currentLevel}
            robotState={robotState}
            activeObstacles={activeObstacles}
            lastMessage={lastMessage}
            executionStatus={robotState.status}
            currentStepNumber={currentStepIdx}
            totalSteps={executionSteps.length}
            starsEarned={earnedStars}
            onShowHint={() => setIsHintModalOpen(true)}
          />

          <Toolbox
            level={currentLevel}
            onAddBlock={handleAddBlock}
            disabled={isRunning}
          />
        </div>

        {/* Right Column (7 cols on lg): Visual Algorithm Workspace & Controls */}
        <div className="lg:col-span-7 flex flex-col">
          <CodeWorkspace
            level={currentLevel}
            blocks={blocks}
            activeBlockId={activeBlockId}
            isRunning={isRunning}
            isPaused={isPaused}
            onUpdateBlocks={handleUpdateBlocks}
            onRun={handleRunSimulation}
            onPause={handlePause}
            onStepForward={handleStepForward}
            onReset={resetSimulationState}
            onClear={() => handleUpdateBlocks([])}
            speed={speed}
            onChangeSpeed={(newSpeed) => setSpeed(newSpeed)}
            maxBlocks={currentLevel.maxBlocks}
          />
        </div>
      </main>

      {/* Pedagogical Hint Modal */}
      {isHintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <HelpCircle className="w-5 h-5" />
                <span className="font-heading">Dica Pedagógica da Fase</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsHintModalOpen(false);
                }}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 mb-4 text-xs text-amber-200 leading-relaxed">
              <p className="font-semibold text-white mb-1.5">Desafio Matemático:</p>
              <p className="mb-2">{currentLevel.mathChallenge}</p>
              <p className="font-semibold text-white mb-1">Como resolver no algoritmo:</p>
              <p>{currentLevel.pedagogicalHint}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setIsHintModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow"
              >
                Entendi, vamos programar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Educational Modals */}
      <MeasurementCheatSheet
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
      />

      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />

      <LevelCompleteModal
        isOpen={isLevelCompleteOpen}
        level={currentLevel}
        starsEarned={earnedStars}
        totalBlocksUsed={countTotalBlocks(blocks)}
        isFlawlessRun={isCurrentRunFlawless}
        newAchievements={roundAchievements}
        onNextLevel={handleNextLevel}
        onReplay={() => {
          setIsLevelCompleteOpen(false);
          resetSimulationState();
        }}
        onClose={() => setIsLevelCompleteOpen(false)}
        onOpenProfile={() => setIsProfileOpen(true)}
        hasNextLevel={currentLevel.id < levelsList.length}
        onOpenCertificate={() => {
          setIsLevelCompleteOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        totalStars={totalStarsCount}
        initialStudentName={studentProfile.name}
        onUpdateStudentName={(name) => handleUpdateProfile({ name })}
      />

      <StudentProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={studentProfile}
        onUpdateProfile={handleUpdateProfile}
        onOpenCertificate={() => {
          setIsProfileOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      <CustomLevelBuilder
        isOpen={isSandboxOpen}
        onClose={() => setIsSandboxOpen(false)}
        onPlayCustomLevel={(customLevel) => {
          // Trigger Sandbox Architect achievement
          if (!studentProfile.unlockedAchievementIds.includes('sandbox_architect')) {
            const today = new Date().toLocaleDateString('pt-BR');
            const sandboxAch = ACHIEVEMENTS.find((a) => a.id === 'sandbox_architect');
            setStudentProfile((prev) => ({
              ...prev,
              unlockedAchievementIds: [...prev.unlockedAchievementIds, 'sandbox_architect'],
              achievementUnlockDates: {
                ...prev.achievementUnlockDates,
                sandbox_architect: today,
              },
              stats: {
                ...prev.stats,
                sandboxLevelsCreated: prev.stats.sandboxLevelsCreated + 1,
              },
            }));
            if (sandboxAch) {
              setLatestToastAchievement(sandboxAch);
            }
          }

          setLevelsList((prev) => {
            const withoutOldCustom = prev.filter((l) => l.id !== 999);
            return [...withoutOldCustom, customLevel];
          });
          setCurrentLevelId(customLevel.id);
        }}
      />

      <TutorialOverlay
        isOpen={isTutorialOpen}
        onClose={handleCloseTutorial}
        onAddBlock={(type) => handleAddBlock(type)}
        onSetBlocks={(newBlocks) => handleUpdateBlocks(newBlocks)}
        currentBlocksCount={countTotalBlocks(blocks)}
      />
    </div>
  );
}
