import { CodeBlock, Direction, ExecutionStep, Level, Obstacle, RobotState, Unit } from '../types';

export interface InterpretationResult {
  steps: ExecutionStep[];
  success: boolean;
  finalMessage: string;
  mathExplanation: string;
}

const DIR_DELTAS: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  right: { dx: 1, dy: 0 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
};

const NEXT_RIGHT: Record<Direction, Direction> = {
  up: 'right',
  right: 'down',
  down: 'left',
  left: 'up',
};

const NEXT_LEFT: Record<Direction, Direction> = {
  up: 'left',
  left: 'down',
  down: 'right',
  right: 'up',
};

// Helper unit conversions to standard base
export function convertToMeters(val: number, unit: Unit): number {
  switch (unit) {
    case 'mm': return val / 1000;
    case 'cm': return val / 100;
    case 'm': return val;
    case 'km': return val * 1000;
    default: return val;
  }
}

export function convertToGrams(val: number, unit: Unit): number {
  switch (unit) {
    case 'mg': return val / 1000;
    case 'g': return val;
    case 'kg': return val * 1000;
    case 't': return val * 1000000;
    default: return val;
  }
}

export function convertToMilliliters(val: number, unit: Unit): number {
  switch (unit) {
    case 'ml': return val;
    case 'L': return val * 1000;
    default: return val;
  }
}

export function interpretAlgorithm(level: Level, blocks: CodeBlock[]): InterpretationResult {
  const steps: ExecutionStep[] = [];
  const obstaclesMap: Map<string, Obstacle> = new Map();
  level.obstacles.forEach((obs) => obstaclesMap.set(obs.id, { ...obs, solved: false }));

  let robotState: RobotState = {
    x: level.start.x,
    y: level.start.y,
    dir: level.start.dir,
    inventory: {
      keys: {},
      crystals: 0,
      currentWeight: 0,
      currentLiquid: 0,
    },
    energy: 100,
    status: 'idle',
  };

  let totalStepsCount = 0;
  const MAX_SAFE_STEPS = 300;
  let terminated = false;
  let finalMessage = '';
  let distanceMovedMeters = 0;

  // Initial step
  steps.push({
    robotState: { ...robotState },
    activeBlockId: '',
    message: 'Robô pronto para iniciar a simulação.',
    type: 'move',
  });

  function getObstacleAt(x: number, y: number): Obstacle | undefined {
    for (const obs of obstaclesMap.values()) {
      if (obs.x === x && obs.y === y && !obs.solved) {
        return obs;
      }
    }
    return undefined;
  }

  function getObstacleInFront(): Obstacle | undefined {
    const delta = DIR_DELTAS[robotState.dir];
    const targetX = robotState.x + delta.dx;
    const targetY = robotState.y + delta.dy;
    return getObstacleAt(targetX, targetY);
  }

  function checkItemPickup() {
    for (const obs of obstaclesMap.values()) {
      if (obs.x === robotState.x && obs.y === robotState.y && !obs.solved) {
        if (obs.type === 'crystal') {
          obs.solved = true;
          robotState.inventory.crystals += 1;
          steps.push({
            robotState: { ...robotState, inventory: { ...robotState.inventory } },
            activeBlockId: '',
            message: '⭐ Bateria / Cristal de energia coletado!',
            type: 'action',
            obstacleIdUpdated: obs.id,
          });
        } else if (obs.type === 'key' && obs.requiredUnit) {
          obs.solved = true;
          robotState.inventory.keys[obs.requiredUnit] = (robotState.inventory.keys[obs.requiredUnit] || 0) + 1;
          steps.push({
            robotState: { ...robotState, inventory: { ...robotState.inventory } },
            activeBlockId: '',
            message: `🔑 Chave de ${obs.requiredUnit} coletada!`,
            type: 'action',
            obstacleIdUpdated: obs.id,
          });
        }
      }
    }
  }

  function executeBlockList(blockList: CodeBlock[]): boolean {
    for (const block of blockList) {
      if (terminated) return false;
      totalStepsCount++;

      if (totalStepsCount > MAX_SAFE_STEPS) {
        terminated = true;
        robotState.status = 'failed';
        finalMessage = 'Limite de passos excedido! Verifique se seu algoritmo tem um loop infinito.';
        steps.push({
          robotState: { ...robotState },
          activeBlockId: block.id,
          message: finalMessage,
          type: 'error',
        });
        return false;
      }

      switch (block.type) {
        case 'move_forward': {
          const delta = DIR_DELTAS[robotState.dir];
          const nextX = robotState.x + delta.dx;
          const nextY = robotState.y + delta.dy;

          // Check grid boundaries
          if (nextX < 0 || nextX >= level.gridSize.cols || nextY < 0 || nextY >= level.gridSize.rows) {
            terminated = true;
            robotState.status = 'failed';
            finalMessage = 'Bateu na parede externa do laboratório! Ajuste o número de passos ou vire antes da borda.';
            steps.push({
              robotState: { ...robotState },
              activeBlockId: block.id,
              message: finalMessage,
              type: 'error',
            });
            return false;
          }

          // Check obstacle in front
          const obstacle = getObstacleAt(nextX, nextY);
          if (obstacle && !obstacle.solved) {
            if (obstacle.type === 'wall') {
              terminated = true;
              robotState.status = 'failed';
              finalMessage = 'O robô colidiu contra uma parede de concreto! Gire antes para desviar.';
              steps.push({
                robotState: { ...robotState },
                activeBlockId: block.id,
                message: finalMessage,
                type: 'error',
              });
              return false;
            }

            if (obstacle.type === 'gate') {
              // Convert step values to compare with obstacle
              const stepValueInM = convertToMeters(level.stepUnitConversion.valuePerStep, level.stepUnitConversion.unit);
              const totalDistWithNextStep = distanceMovedMeters + stepValueInM;
              const requiredDistInM = obstacle.requiredUnit 
                ? convertToMeters(obstacle.requiredValue || 0, obstacle.requiredUnit) 
                : (obstacle.requiredValue || 0);

              // Gate opens if student accumulated required distance or uses key
              if (totalDistWithNextStep >= requiredDistInM || obstacle.solved) {
                obstacle.solved = true;
                distanceMovedMeters += stepValueInM;
                robotState.x = nextX;
                robotState.y = nextY;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: `🔓 Portão destravado! Medida correta atingida: ${obstacle.label}`,
                  type: 'action',
                  obstacleIdUpdated: obstacle.id,
                });
                checkItemPickup();
              } else {
                terminated = true;
                robotState.status = 'failed';
                finalMessage = `Ops! O ${obstacle.label} requer ${obstacle.requiredValue} ${obstacle.requiredUnit}, mas você atingiu apenas ${distanceMovedMeters} m. Faltou energia de deslocamento!`;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: finalMessage,
                  type: 'error',
                });
                return false;
              }
              break;
            }

            if (obstacle.type === 'scale') {
              const currentWeightKg = robotState.inventory.currentWeight / 1000;
              const requiredWeightKg = obstacle.requiredUnit === 'kg' 
                ? (obstacle.requiredValue || 0)
                : ((obstacle.requiredValue || 0) / 1000);

              if (currentWeightKg >= requiredWeightKg || obstacle.solved) {
                obstacle.solved = true;
                const stepVal = convertToMeters(level.stepUnitConversion.valuePerStep, level.stepUnitConversion.unit);
                distanceMovedMeters += stepVal;
                robotState.x = nextX;
                robotState.y = nextY;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: `⚖️ Balança equilibrada com ${robotState.inventory.currentWeight} g (${currentWeightKg} kg)! Plataforma liberada.`,
                  type: 'action',
                  obstacleIdUpdated: obstacle.id,
                });
                checkItemPickup();
              } else {
                terminated = true;
                robotState.status = 'failed';
                finalMessage = `A balança requer ${obstacle.label}, mas o robô só está carregando ${robotState.inventory.currentWeight} g (${currentWeightKg} kg). Adicione a massa correta!`;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: finalMessage,
                  type: 'error',
                });
                return false;
              }
              break;
            }

            if (obstacle.type === 'tank') {
              const currentLiquidL = robotState.inventory.currentLiquid / 1000;
              const requiredLiquidL = obstacle.requiredUnit === 'L' 
                ? (obstacle.requiredValue || 0)
                : ((obstacle.requiredValue || 0) / 1000);

              if (robotState.inventory.currentLiquid >= (obstacle.requiredValue || 0) || currentLiquidL >= requiredLiquidL || obstacle.solved) {
                obstacle.solved = true;
                const stepVal = convertToMeters(level.stepUnitConversion.valuePerStep, level.stepUnitConversion.unit);
                distanceMovedMeters += stepVal;
                robotState.x = nextX;
                robotState.y = nextY;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: `💧 Tanque resfriado com sucesso! Fluido injetado corretamente: ${obstacle.label}`,
                  type: 'action',
                  obstacleIdUpdated: obstacle.id,
                });
                checkItemPickup();
              } else {
                terminated = true;
                robotState.status = 'failed';
                finalMessage = `O tanque superaqueceu! Ele requer ${obstacle.label}, mas você só injetou ${robotState.inventory.currentLiquid} ml (${currentLiquidL} L).`;
                steps.push({
                  robotState: { ...robotState },
                  activeBlockId: block.id,
                  message: finalMessage,
                  type: 'error',
                });
                return false;
              }
              break;
            }
          }

          // Free move
          const stepVal = convertToMeters(level.stepUnitConversion.valuePerStep, level.stepUnitConversion.unit);
          distanceMovedMeters += stepVal;
          robotState.x = nextX;
          robotState.y = nextY;
          steps.push({
            robotState: { ...robotState },
            activeBlockId: block.id,
            message: `Avançou 1 passo (${level.stepUnitConversion.valuePerStep} ${level.stepUnitConversion.unit}). Posição atual: (${nextX}, ${nextY})`,
            type: 'move',
          });
          checkItemPickup();
          break;
        }

        case 'turn_right': {
          robotState.dir = NEXT_RIGHT[robotState.dir];
          steps.push({
            robotState: { ...robotState },
            activeBlockId: block.id,
            message: `Girou 90° à direita. Olhando para: ${robotState.dir.toUpperCase()}`,
            type: 'turn',
          });
          break;
        }

        case 'turn_left': {
          robotState.dir = NEXT_LEFT[robotState.dir];
          steps.push({
            robotState: { ...robotState },
            activeBlockId: block.id,
            message: `Girou 90° à esquerda. Olhando para: ${robotState.dir.toUpperCase()}`,
            type: 'turn',
          });
          break;
        }

        case 'repeat': {
          const count = Math.min(block.repeatCount || 2, 20);
          steps.push({
            robotState: { ...robotState },
            activeBlockId: block.id,
            message: `Iniciando Loop: Repetir ${count} vezes.`,
            type: 'loop_start',
          });

          for (let i = 1; i <= count; i++) {
            if (terminated) break;
            steps.push({
              robotState: { ...robotState },
              activeBlockId: block.id,
              message: `Repetição [${i}/${count}] em execução...`,
              type: 'loop_step',
            });

            if (block.children && block.children.length > 0) {
              const continueExec = executeBlockList(block.children);
              if (!continueExec) return false;
            }
          }
          break;
        }

        case 'if_condition': {
          const frontObs = getObstacleInFront();
          let conditionPassed = false;

          if (block.condition === 'front_is_gate') {
            conditionPassed = !!frontObs && frontObs.type === 'gate';
          } else if (block.condition === 'front_is_scale') {
            conditionPassed = !!frontObs && frontObs.type === 'scale';
          } else if (block.condition === 'front_is_tank') {
            conditionPassed = !!frontObs && frontObs.type === 'tank';
          } else if (block.condition === 'front_is_clear') {
            conditionPassed = !frontObs || frontObs.solved;
          } else {
            // Default condition: check if obstacle exists in front
            conditionPassed = !!frontObs && !frontObs.solved;
          }

          steps.push({
            robotState: { ...robotState },
            activeBlockId: block.id,
            message: `Condição verificada: [${block.condition || 'verificar obstáculo'}] -> Resultado: ${conditionPassed ? 'VERDADEIRO (Sim)' : 'FALSO (Não)'}`,
            type: 'if_check',
          });

          if (conditionPassed) {
            if (block.thenBlocks && block.thenBlocks.length > 0) {
              const continueExec = executeBlockList(block.thenBlocks);
              if (!continueExec) return false;
            }
          } else {
            if (block.elseBlocks && block.elseBlocks.length > 0) {
              const continueExec = executeBlockList(block.elseBlocks);
              if (!continueExec) return false;
            }
          }
          break;
        }

        case 'add_weight': {
          const val = block.unitValue || 1;
          const u = block.unit || 'kg';
          const gramsAdded = convertToGrams(val, u);
          robotState.inventory.currentWeight += gramsAdded;
          
          steps.push({
            robotState: { ...robotState, inventory: { ...robotState.inventory } },
            activeBlockId: block.id,
            message: `⚖️ Calibrou peso: +${val} ${u} (+${gramsAdded} g). Total acumulado: ${robotState.inventory.currentWeight} g (${robotState.inventory.currentWeight / 1000} kg)`,
            type: 'action',
          });

          // Check if front obstacle is a scale that can be solved
          const front = getObstacleInFront();
          if (front && front.type === 'scale') {
            const reqGrams = convertToGrams(front.requiredValue || 0, front.requiredUnit || 'kg');
            if (robotState.inventory.currentWeight >= reqGrams) {
              front.solved = true;
              steps.push({
                robotState: { ...robotState },
                activeBlockId: block.id,
                message: `✨ Balança destravada! Carga de ${front.label} atingida!`,
                type: 'action',
                obstacleIdUpdated: front.id,
              });
            }
          }
          break;
        }

        case 'inject_capacity': {
          const val = block.unitValue || 500;
          const u = block.unit || 'ml';
          const mlAdded = convertToMilliliters(val, u);
          robotState.inventory.currentLiquid += mlAdded;

          steps.push({
            robotState: { ...robotState, inventory: { ...robotState.inventory } },
            activeBlockId: block.id,
            message: `💧 Injetou capacidade: +${val} ${u} (+${mlAdded} ml). Total: ${robotState.inventory.currentLiquid} ml (${robotState.inventory.currentLiquid / 1000} L)`,
            type: 'action',
          });

          const front = getObstacleInFront();
          if (front && front.type === 'tank') {
            const reqMl = convertToMilliliters(front.requiredValue || 0, front.requiredUnit || 'ml');
            if (robotState.inventory.currentLiquid >= reqMl) {
              front.solved = true;
              steps.push({
                robotState: { ...robotState },
                activeBlockId: block.id,
                message: `✨ Válvula destravada! Capacidade de ${front.label} satisfeita!`,
                type: 'action',
                obstacleIdUpdated: front.id,
              });
            }
          }
          break;
        }

        case 'use_key': {
          const u = block.unit || 'm';
          const front = getObstacleInFront();
          if (front && front.type === 'gate') {
            front.solved = true;
            steps.push({
              robotState: { ...robotState },
              activeBlockId: block.id,
              message: `🔑 Usou ferramenta de conversão de ${u}! Porta de ${front.label} aberta!`,
              type: 'action',
              obstacleIdUpdated: front.id,
            });
          } else {
            steps.push({
              robotState: { ...robotState },
              activeBlockId: block.id,
              message: `Usou ferramenta de ${u}, mas não há porta correspondente em frente.`,
              type: 'action',
            });
          }
          break;
        }
      }
    }
    return true;
  }

  // Run the code
  if (blocks.length === 0) {
    return {
      steps: [{
        robotState,
        activeBlockId: '',
        message: 'O algoritmo está vazio! Adicione blocos para movimentar o Medidroid.',
        type: 'error',
      }],
      success: false,
      finalMessage: 'O algoritmo está vazio. Arraste ou clique nos blocos para programar.',
      mathExplanation: level.mathExplanation,
    };
  }

  executeBlockList(blocks);

  // Check victory condition
  const reachedGoal = robotState.x === level.goal.x && robotState.y === level.goal.y;

  if (reachedGoal && !terminated) {
    robotState.status = 'success';
    finalMessage = `🎉 Parabéns! O Medidroid completou o trajeto com sucesso e dominou o desafio de medidas!`;
    steps.push({
      robotState: { ...robotState },
      activeBlockId: '',
      message: finalMessage,
      type: 'success',
    });
  } else if (!terminated) {
    robotState.status = 'failed';
    finalMessage = `O robô parou na posição (${robotState.x}, ${robotState.y}), mas a saída está em (${level.goal.x}, ${level.goal.y}). Adicione mais blocos para alcançar a meta!`;
    steps.push({
      robotState: { ...robotState },
      activeBlockId: '',
      message: finalMessage,
      type: 'error',
    });
  }

  return {
    steps,
    success: reachedGoal && robotState.status === 'success',
    finalMessage,
    mathExplanation: level.mathExplanation,
  };
}

export function countTotalBlocks(blocks: CodeBlock[]): number {
  let count = 0;
  for (const b of blocks) {
    count++;
    if (b.children) count += countTotalBlocks(b.children);
    if (b.thenBlocks) count += countTotalBlocks(b.thenBlocks);
    if (b.elseBlocks) count += countTotalBlocks(b.elseBlocks);
  }
  return count;
}
