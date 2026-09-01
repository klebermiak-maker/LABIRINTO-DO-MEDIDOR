export type Direction = 'up' | 'right' | 'down' | 'left';

export type MeasurementCategory = 'length' | 'mass' | 'capacity';

export type Unit = 'mm' | 'cm' | 'm' | 'km' | 'mg' | 'g' | 'kg' | 't' | 'ml' | 'L';

export type BlockType = 
  | 'move_forward'
  | 'turn_left'
  | 'turn_right'
  | 'repeat'
  | 'if_condition'
  | 'use_key'
  | 'inject_capacity'
  | 'add_weight'
  | 'collect_item';

export type ConditionType = 
  | 'front_is_gate'
  | 'front_is_scale'
  | 'front_is_tank'
  | 'front_is_clear'
  | 'has_item'
  | 'obstacle_measurement_is';

export interface CodeBlock {
  id: string;
  type: BlockType;
  // Parameters
  steps?: number;
  unitValue?: number;
  unit?: Unit;
  repeatCount?: number;
  children?: CodeBlock[]; // for repeat loops
  // Condition parameters
  condition?: ConditionType;
  conditionTargetUnit?: Unit;
  conditionTargetValue?: number;
  thenBlocks?: CodeBlock[];
  elseBlocks?: CodeBlock[];
}

export type ObstacleType = 
  | 'wall'
  | 'gate'        // Requires length conversion (e.g. 200 cm or 2m)
  | 'scale'       // Requires mass (e.g. 2000g or 2kg)
  | 'tank'        // Requires capacity (e.g. 1500ml or 1.5L)
  | 'laser'       // Laser barrier
  | 'key'         // Collectible measurement key
  | 'crystal'     // Collectible bonus energy crystal
  | 'goal';       // Target exit

export interface Obstacle {
  id: string;
  x: number;
  y: number;
  type: ObstacleType;
  label?: string;
  category?: MeasurementCategory;
  requiredValue?: number;
  requiredUnit?: Unit;
  solved?: boolean;
  color?: string;
  hint?: string;
}

export interface Level {
  id: number;
  title: string;
  subtitle: string;
  category: MeasurementCategory | 'mixed';
  concept: 'sequence' | 'loop' | 'conditional' | 'master';
  gridSize: { cols: number; rows: number };
  start: { x: number; y: number; dir: Direction };
  goal: { x: number; y: number };
  obstacles: Obstacle[];
  allowedBlocks: BlockType[];
  maxBlocks?: number;
  targetStars: {
    threeStarsMaxBlocks: number;
    twoStarsMaxBlocks: number;
  };
  stepUnitConversion: {
    unit: Unit;
    valuePerStep: number;
    description: string;
  };
  storyContext: string;
  mathChallenge: string;
  pedagogicalHint: string;
  mathExplanation: string;
}

export interface RobotState {
  x: number;
  y: number;
  dir: Direction;
  inventory: {
    keys: { [key in Unit]?: number };
    crystals: number;
    currentWeight: number; // in grams
    currentLiquid: number; // in ml
  };
  energy: number;
  status: 'idle' | 'running' | 'paused' | 'success' | 'failed';
  errorMessage?: string;
  successMessage?: string;
}

export interface ExecutionStep {
  robotState: RobotState;
  activeBlockId: string;
  message: string;
  type: 'move' | 'turn' | 'action' | 'loop_start' | 'loop_step' | 'if_check' | 'error' | 'success';
  obstacleIdUpdated?: string;
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestBlockCount?: number;
  attemptsCount?: number;
  completedWithoutErrors?: boolean;
}

export type AchievementCategory = 'perfection' | 'efficiency' | 'math' | 'mastery' | 'discovery';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  category: AchievementCategory;
  points: number;
  bnccCode?: string;
  requirement: string;
  isSecret?: boolean;
}

export interface StudentProfileData {
  name: string;
  grade: string;
  avatar: string;
  title: string;
  unlockedAchievementIds: string[];
  achievementUnlockDates: Record<string, string>;
  stats: {
    levelsCompleted: number;
    perfectRunsCount: number; // 3-star levels
    flawlessRunsCount: number; // 0 errors
    totalBlocksUsed: number;
    loopsOptimizedCount: number;
    sandboxLevelsCreated: number;
    conversionsSolved: number;
    totalStarsEarned: number;
  };
}
