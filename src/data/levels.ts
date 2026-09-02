import { Level } from '../types';

export const LEVELS: Level[] = [
  {
    id: 1,
    title: 'Fase 1: O Portão dos Centímetros',
    subtitle: 'Sequência Linear & Comprimento (m e cm)',
    category: 'length',
    concept: 'sequence',
    gridSize: { cols: 6, rows: 4 },
    start: { x: 0, y: 1, dir: 'right' },
    goal: { x: 4, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Cada passo do Medidroid equivale a 1 metro (100 cm).'
    },
    obstacles: [
      {
        id: 'gate-1',
        x: 2,
        y: 1,
        type: 'gate',
        label: 'Portão de 200 cm',
        category: 'length',
        requiredValue: 2, // 2 meters = 200 cm
        requiredUnit: 'm',
        color: '#3b82f6',
        hint: 'Dica de Medida: Lembre-se que 1 metro (m) equivale a 100 centímetros (cm). Calcule quantos metros correspondem a este portão!'
      },
      { id: 'wall-1', x: 2, y: 0, type: 'wall' },
      { id: 'wall-2', x: 2, y: 2, type: 'wall' },
      { id: 'wall-3', x: 2, y: 3, type: 'wall' },
      { id: 'crystal-1', x: 1, y: 1, type: 'crystal', label: 'Bateria' }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'O Medidroid precisa chegar à central de comando, mas um portão de segurança requer 200 cm de energia de deslocamento para destravar.',
    mathChallenge: 'Converta a exigência do portão (200 cm) para a unidade de deslocamento do robô (metros) e monte o algoritmo.',
    pedagogicalHint: 'Observe a distância até o portão e a meta. Monte uma sequência lógica com blocos de movimento para conduzir o robô em linha reta.',
    mathExplanation: '200 cm ÷ 100 = 2 metros. O robô precisa dar 2 passos para abrir a porta e depois continuar até a meta!'
  },
  {
    id: 2,
    title: 'Fase 2: O Poder da Repetição (Loop)',
    subtitle: 'Estruturas de Repetição & Conversão de Comprimento',
    category: 'length',
    concept: 'loop',
    gridSize: { cols: 7, rows: 4 },
    start: { x: 0, y: 1, dir: 'right' },
    goal: { x: 5, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Cada passo do Medidroid = 1 metro.'
    },
    obstacles: [
      {
        id: 'gate-2',
        x: 3,
        y: 1,
        type: 'gate',
        label: 'Trava de 300 cm',
        category: 'length',
        requiredValue: 3,
        requiredUnit: 'm',
        color: '#3b82f6',
        hint: 'Dica de Medida: Converta centímetros (cm) em metros (m) sabendo que 1 m = 100 cm.'
      },
      { id: 'crystal-2', x: 2, y: 1, type: 'crystal' },
      { id: 'crystal-3', x: 4, y: 1, type: 'crystal' }
    ],
    allowedBlocks: ['move_forward', 'repeat', 'turn_right', 'turn_left'],
    maxBlocks: 4,
    targetStars: {
      threeStarsMaxBlocks: 2, // Repeat block with move
      twoStarsMaxBlocks: 4
    },
    storyContext: 'Em vez de usar muitos blocos iguais, os programadores usam loops de repetição! Economize blocos com o bloco "Repetir".',
    mathChallenge: 'Calcule a distância total até a meta e use uma estrutura de repetição (loop) para economizar blocos de código.',
    pedagogicalHint: 'Em vez de enfileirar vários blocos de avanço idênticos, coloque um único bloco "Repetir N vezes" e insira a ação dentro dele para ganhar 3 estrelas.',
    mathExplanation: 'A repetição (loop) simula a multiplicação: 5 repetições de 1 m = 5 metros (500 cm).'
  },
  {
    id: 3,
    title: 'Fase 3: Curvas e Milímetros',
    subtitle: 'Sequência com Giro & Conversão (mm para cm)',
    category: 'length',
    concept: 'sequence',
    gridSize: { cols: 6, rows: 5 },
    start: { x: 1, y: 3, dir: 'up' },
    goal: { x: 4, y: 1 },
    stepUnitConversion: {
      unit: 'cm',
      valuePerStep: 10,
      description: 'Cada passo = 10 cm (100 mm).'
    },
    obstacles: [
      {
        id: 'gate-3',
        x: 1,
        y: 1,
        type: 'gate',
        label: 'Sensor de 200 mm',
        category: 'length',
        requiredValue: 2, // 2 steps of 10cm = 20cm = 200mm
        requiredUnit: 'cm',
        color: '#6366f1',
        hint: 'Dica de Medida: Lembre-se que 1 cm = 10 mm. Calcule quantos centímetros correspondem a 200 mm!'
      },
      { id: 'wall-c1', x: 2, y: 3, type: 'wall' },
      { id: 'wall-c2', x: 2, y: 2, type: 'wall' },
      { id: 'crystal-4', x: 1, y: 2, type: 'crystal' },
      { id: 'crystal-5', x: 3, y: 1, type: 'crystal' }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat'],
    maxBlocks: 8,
    targetStars: {
      threeStarsMaxBlocks: 6,
      twoStarsMaxBlocks: 8
    },
    storyContext: 'O caminho faz uma curva! O sensor precisa de 200 mm de aproximação antes da curva à direita.',
    mathChallenge: 'Converta a exigência de 200 mm para a escala do robô (passos de 10 cm) e planeje as mudanças de direção necessárias.',
    pedagogicalHint: 'Trace o percurso por partes: avance até atingir o sensor, utilize os comandos de giro (90°) para mudar a orientação do robô e siga até a meta.',
    mathExplanation: '2 passos de 10 cm = 20 cm = 200 mm. Após o portão, gire à direita e avance até a saída.'
  },
  {
    id: 4,
    title: 'Fase 4: A Trilha dos Quilômetros',
    subtitle: 'Comprimento em Grande Escala (km e m)',
    category: 'length',
    concept: 'loop',
    gridSize: { cols: 7, rows: 4 },
    start: { x: 0, y: 2, dir: 'right' },
    goal: { x: 6, y: 2 },
    stepUnitConversion: {
      unit: 'km',
      valuePerStep: 1,
      description: 'Em simulação de satélite: cada passo = 1 km (1.000 m).'
    },
    obstacles: [
      {
        id: 'gate-4',
        x: 4,
        y: 2,
        type: 'gate',
        label: 'Radar de 4.000 m',
        category: 'length',
        requiredValue: 4, // 4 km = 4000 m
        requiredUnit: 'km',
        color: '#0ea5e9',
        hint: 'Dica de Medida: Lembre-se que 1 quilômetro (km) equivale a 1.000 metros (m). Faça a conversão de escala!'
      },
      { id: 'crystal-6', x: 2, y: 2, type: 'crystal' }
    ],
    allowedBlocks: ['move_forward', 'repeat'],
    maxBlocks: 3,
    targetStars: {
      threeStarsMaxBlocks: 2,
      twoStarsMaxBlocks: 3
    },
    storyContext: 'O Medidroid agora está operando no radar regional. O radar requer 4.000 m de alcance!',
    mathChallenge: 'Descubra quantos quilômetros equivalem a 4.000 metros e utilize um laço de repetição para percorrer o trajeto completo.',
    pedagogicalHint: 'Conte o total de casas até o destino final e configure um laço "Repetir" com o bloco de avanço para construir um código compacto.',
    mathExplanation: '4.000 m ÷ 1.000 = 4 km. Como cada passo vale 1 km, o portão de 4.000 m se abre no 4º passo!'
  },
  {
    id: 5,
    title: 'Fase 5: A Balança de Carga',
    subtitle: 'Massa: Gramas (g) e Quilogramas (kg)',
    category: 'mass',
    concept: 'sequence',
    gridSize: { cols: 6, rows: 5 },
    start: { x: 0, y: 2, dir: 'right' },
    goal: { x: 5, y: 2 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Deslocamento padrão de 1 metro.'
    },
    obstacles: [
      {
        id: 'scale-1',
        x: 3,
        y: 2,
        type: 'scale',
        label: 'Balança de 2.000 g',
        category: 'mass',
        requiredValue: 2, // 2 kg = 2000 g
        requiredUnit: 'kg',
        color: '#f59e0b',
        hint: 'Dica de Massa: A relação fundamental é 1 kg = 1.000 g. Calcule quantos kg equilibram a balança!'
      },
      { id: 'wall-s1', x: 3, y: 1, type: 'wall' },
      { id: 'wall-s2', x: 3, y: 3, type: 'wall' }
    ],
    allowedBlocks: ['move_forward', 'add_weight', 'repeat'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'Uma ponte elevadiça é ativada por contrapeso. A balança precisa receber 2.000 g de carga para descer!',
    mathChallenge: 'Descubra quantos quilogramas (kg) são equivalentes aos 2.000 g exigidos e configure o peso adequado no robô.',
    pedagogicalHint: 'Conduza o robô até a balança e utilize o bloco de adicionar peso com a massa calculada para destravar a ponte.',
    mathExplanation: '2 kg x 1.000 = 2.000 g. Ao calibrar com 2 kg, a balança se equilibra e a ponte abre!'
  },
  {
    id: 6,
    title: 'Fase 6: O Tanque de Resfriamento',
    subtitle: 'Capacidade: Litros (L) e Mililitros (ml)',
    category: 'capacity',
    concept: 'sequence',
    gridSize: { cols: 6, rows: 4 },
    start: { x: 0, y: 1, dir: 'right' },
    goal: { x: 5, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Passo do robô.'
    },
    obstacles: [
      {
        id: 'tank-1',
        x: 2,
        y: 1,
        type: 'tank',
        label: 'Válvula de 1.500 ml',
        category: 'capacity',
        requiredValue: 1.5, // 1.5 L = 1500 ml
        requiredUnit: 'L',
        color: '#06b6d4',
        hint: 'Dica de Capacidade: Lembre-se que 1 Litro (L) possui 1.000 mililitros (ml). Calcule a quantidade em litros correspondente!'
      }
    ],
    allowedBlocks: ['move_forward', 'inject_capacity', 'repeat'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'O reator térmico superaqueceu! O robô deve injetar exatamente 1.500 ml de refrigerante para esfriar o tubo.',
    mathChallenge: 'Calcule a equivalência entre mililitros e litros para calibrar a válvula com o volume exato de refrigerante.',
    pedagogicalHint: 'Desloque o robô até a câmara da válvula, acione a injeção do volume correto e continue em direção à saída.',
    mathExplanation: '1.500 ml = 1,5 L (1 litro e meio). Ao injetar 1.500 ml a válvula esfria e abre.'
  },
  {
    id: 7,
    title: 'Fase 7: Decisão Inteligente (Se / Então)',
    subtitle: 'Seleção Condicional (if/else) & Comprimento',
    category: 'length',
    concept: 'conditional',
    gridSize: { cols: 6, rows: 5 },
    start: { x: 0, y: 2, dir: 'right' },
    goal: { x: 4, y: 2 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: '1 metro por passo.'
    },
    obstacles: [
      {
        id: 'gate-cond-1',
        x: 2,
        y: 2,
        type: 'gate',
        label: 'Porta com Trava de 100 cm',
        category: 'length',
        requiredValue: 1,
        requiredUnit: 'm',
        color: '#8b5cf6',
        hint: 'Dica de Condição: Converta 100 cm em metros para saber qual chave deve ser acionada na condição.'
      }
    ],
    allowedBlocks: ['move_forward', 'if_condition', 'use_key', 'repeat'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'Sensores inteligentes usam condições! O robô deve checar: "Se na minha frente houver uma porta de medida, então destrave com a chave correta".',
    mathChallenge: 'Utilize o bloco de decisão condicional para fazer o robô testar se há uma porta antes de usar o dispositivo de destravamento.',
    pedagogicalHint: 'Combine comandos de movimento com o bloco "Se [condição]". O robô só executará a ação interna se o sensor detectar a porta à frente.',
    mathExplanation: 'O comando "SE" verifica o ambiente antes de agir: se encontrar a porta de 100 cm, ativa a chave de 1 m!'
  },
  {
    id: 8,
    title: 'Fase 8: A Ponte de Carga Condicional',
    subtitle: 'Condicional + Massa (g e kg)',
    category: 'mass',
    concept: 'conditional',
    gridSize: { cols: 6, rows: 5 },
    start: { x: 1, y: 3, dir: 'up' },
    goal: { x: 4, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Passo do robô.'
    },
    obstacles: [
      {
        id: 'scale-cond-2',
        x: 1,
        y: 1,
        type: 'scale',
        label: 'Balança de 3.000 g',
        category: 'mass',
        requiredValue: 3, // 3 kg
        requiredUnit: 'kg',
        color: '#f59e0b',
        hint: 'Dica de Massa: Converta 3.000 gramas em quilogramas sabendo que 1 kg = 1.000 g.'
      }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'if_condition', 'add_weight', 'repeat'],
    maxBlocks: 8,
    targetStars: {
      threeStarsMaxBlocks: 6,
      twoStarsMaxBlocks: 8
    },
    storyContext: 'Uma balança no meio do caminho exige 3.000 g de carga para ativar a plataforma.',
    mathChallenge: 'Programe o robô para identificar a balança dinamicamente através de uma condição e carregar a massa equivalente.',
    pedagogicalHint: 'Estruture o algoritmo com detecção condicional da balança, ajuste a massa calculada e oriente o trajeto com as curvas necessárias até a meta.',
    mathExplanation: '3.000 g ÷ 1.000 = 3 kg. A seleção condicional automatiza a pesagem no momento exato!'
  },
  {
    id: 9,
    title: 'Fase 9: Válvulas em Série (Loop + Condicional)',
    subtitle: 'Repetição com Seleção & Capacidade (ml e L)',
    category: 'capacity',
    concept: 'master',
    gridSize: { cols: 7, rows: 4 },
    start: { x: 0, y: 1, dir: 'right' },
    goal: { x: 6, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: 'Passos lineares.'
    },
    obstacles: [
      {
        id: 'tank-s1',
        x: 2,
        y: 1,
        type: 'tank',
        label: 'Tanque 1 (500 ml)',
        category: 'capacity',
        requiredValue: 500,
        requiredUnit: 'ml',
        color: '#06b6d4',
        hint: 'Dica: Cada tanque na esteira precisa do volume indicado para ser refrigerado.'
      },
      {
        id: 'tank-s2',
        x: 4,
        y: 1,
        type: 'tank',
        label: 'Tanque 2 (500 ml)',
        category: 'capacity',
        requiredValue: 500,
        requiredUnit: 'ml',
        color: '#06b6d4',
        hint: 'Dica: Cada tanque na esteira precisa do volume indicado para ser refrigerado.'
      }
    ],
    allowedBlocks: ['move_forward', 'repeat', 'if_condition', 'inject_capacity'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4, // Loop containing Move + If
      twoStarsMaxBlocks: 6
    },
    storyContext: 'Existem vários tanques na linha de produção, cada um precisando de 500 ml (0,5 L) de água.',
    mathChallenge: 'Automatize o percurso integrando um laço de repetição com uma verificação condicional para cada tanque encontrado na esteira.',
    pedagogicalHint: 'Ao aninhar um bloco condicional "Se" dentro de um bloco "Repetir", o robô é capaz de inspecionar o caminho a cada passo e agir apenas onde há tanques.',
    mathExplanation: '500 ml + 500 ml = 1.000 ml = 1 Litro no total! O loop executa a mesma decisão para cada obstáculo.'
  },
  {
    id: 10,
    title: 'Fase 10: O Circuito Comprimento & Massa',
    subtitle: 'Desafio Integrado de Grandezas',
    category: 'mixed',
    concept: 'master',
    gridSize: { cols: 7, rows: 5 },
    start: { x: 0, y: 3, dir: 'up' },
    goal: { x: 5, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: '1 passo = 1 m.'
    },
    obstacles: [
      {
        id: 'gate-m1',
        x: 0,
        y: 1,
        type: 'gate',
        label: 'Porta de 200 cm',
        category: 'length',
        requiredValue: 2,
        requiredUnit: 'm',
        color: '#3b82f6',
        hint: 'Dica: Converta centímetros em metros sabendo que 100 cm = 1 m.'
      },
      {
        id: 'scale-m1',
        x: 3,
        y: 1,
        type: 'scale',
        label: 'Balança de 1.000 g',
        category: 'mass',
        requiredValue: 1,
        requiredUnit: 'kg',
        color: '#f59e0b',
        hint: 'Dica: Calcule quantos quilogramas equivalem a 1.000 gramas.'
      },
      { id: 'crystal-m1', x: 0, y: 2, type: 'crystal' },
      { id: 'crystal-m2', x: 4, y: 1, type: 'crystal' }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_condition', 'add_weight'],
    maxBlocks: 8,
    targetStars: {
      threeStarsMaxBlocks: 6,
      twoStarsMaxBlocks: 8
    },
    storyContext: 'Agora você deve vencer dois tipos de desafios na mesma rota: uma porta de comprimento e uma balança de massa.',
    mathChallenge: 'Identifique os dois tipos de obstáculos no circuito e resolva as conversões de comprimento e massa necessárias para cada um.',
    pedagogicalHint: 'Planeje a rota em etapas: destrave primeiro a passagem de comprimento, faça a curva no momento certo e calibre a balança de massa antes da meta.',
    mathExplanation: '200 cm = 2 m e 1.000 g = 1 kg. Você dominou comprimento e massa juntos!'
  },
  {
    id: 11,
    title: 'Fase 11: A Tríade das Medidas',
    subtitle: 'Comprimento, Massa e Capacidade Integrados',
    category: 'mixed',
    concept: 'master',
    gridSize: { cols: 7, rows: 6 },
    start: { x: 0, y: 4, dir: 'up' },
    goal: { x: 6, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: '1 passo = 1 m (100 cm).'
    },
    obstacles: [
      {
        id: 'gate-triad',
        x: 0,
        y: 2,
        type: 'gate',
        label: 'Laser de 2.000 mm',
        category: 'length',
        requiredValue: 2, // 2000 mm = 2 m
        requiredUnit: 'm',
        color: '#6366f1',
        hint: 'Dica: Converta milímetros (mm) para metros (m) sabendo que 1.000 mm = 1 m.'
      },
      {
        id: 'scale-triad',
        x: 3,
        y: 2,
        type: 'scale',
        label: 'Carga de 2.500 g',
        category: 'mass',
        requiredValue: 2.5, // 2.5 kg
        requiredUnit: 'kg',
        color: '#f59e0b',
        hint: 'Dica: Calcule o valor em quilogramas (kg) para uma massa de 2.500 g.'
      },
      {
        id: 'tank-triad',
        x: 6,
        y: 3,
        type: 'tank',
        label: 'Resfriador de 2 Litros',
        category: 'capacity',
        requiredValue: 2000, // 2000 ml
        requiredUnit: 'ml',
        color: '#06b6d4',
        hint: 'Dica: Converta o volume em litros (L) para mililitros (ml) sabendo que 1 L = 1.000 ml.'
      },
      { id: 'wall-t1', x: 1, y: 4, type: 'wall' },
      { id: 'wall-t2', x: 2, y: 4, type: 'wall' }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_condition', 'add_weight', 'inject_capacity'],
    maxBlocks: 12,
    targetStars: {
      threeStarsMaxBlocks: 8,
      twoStarsMaxBlocks: 11
    },
    storyContext: 'O teste definitivo dos três laboratórios: Comprimento (mm para m), Massa (g para kg) e Capacidade (L para ml)!',
    mathChallenge: 'Resolva o circuito integrando conversões das três grandezas (comprimento, massa e capacidade) no mesmo algoritmo.',
    pedagogicalHint: 'Analise o mapa completo, calcule as três conversões necessárias e organize seu código combinando movimentos, giros e comandos de medida.',
    mathExplanation: '2.000 mm = 2 m | 2.500 g = 2,5 kg | 2 L = 2.000 ml. Três conversões perfeitas da BNCC!'
  },
  {
    id: 12,
    title: 'Fase 12: Mestre dos Algoritmos e Medidas',
    subtitle: 'Grande Desafio Final & Certificado BNCC 5º Ano',
    category: 'mixed',
    concept: 'master',
    gridSize: { cols: 8, rows: 6 },
    start: { x: 0, y: 4, dir: 'up' },
    goal: { x: 7, y: 1 },
    stepUnitConversion: {
      unit: 'm',
      valuePerStep: 1,
      description: '1 passo = 1 m.'
    },
    obstacles: [
      {
        id: 'gate-f1',
        x: 0,
        y: 1,
        type: 'gate',
        label: 'Portal de 300 cm',
        category: 'length',
        requiredValue: 3,
        requiredUnit: 'm',
        color: '#3b82f6',
        hint: 'Dica: Calcule quantos metros correspondem a 300 centímetros.'
      },
      {
        id: 'scale-f1',
        x: 3,
        y: 1,
        type: 'scale',
        label: 'Sensor de 5.000 g',
        category: 'mass',
        requiredValue: 5,
        requiredUnit: 'kg',
        color: '#f59e0b',
        hint: 'Dica: Calcule quantos quilogramas (kg) equilibram o sensor de 5.000 gramas.'
      },
      {
        id: 'tank-f1',
        x: 5,
        y: 3,
        type: 'tank',
        label: 'Câmara de 3.000 ml',
        category: 'capacity',
        requiredValue: 3000,
        requiredUnit: 'ml',
        color: '#06b6d4',
        hint: 'Dica: Calcule o volume em mililitros ou litros correspondente à câmara de resfriamento.'
      },
      { id: 'crystal-f1', x: 2, y: 1, type: 'crystal' },
      { id: 'crystal-f2', x: 4, y: 1, type: 'crystal' },
      { id: 'crystal-f3', x: 6, y: 2, type: 'crystal' }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'repeat', 'if_condition', 'add_weight', 'inject_capacity'],
    maxBlocks: 14,
    targetStars: {
      threeStarsMaxBlocks: 9,
      twoStarsMaxBlocks: 13
    },
    storyContext: 'A câmara principal da Federação dos Medidores! Use todo o seu conhecimento de algoritmos (sequência, loops e condições) e unidades de medida para conquistar o Certificado de Mestre.',
    mathChallenge: 'Aplique todos os conceitos de conversão de unidades e crie um algoritmo compacto usando laços e condições.',
    pedagogicalHint: 'Use blocos de Repetição para trechos longos e certifique-se de satisfazer as exigências de massa e volume nos pontos certos.',
    mathExplanation: 'Parabéns! 300 cm = 3 m, 5.000 g = 5 kg e 3.000 ml = 3 L. Você completou todas as habilidades da BNCC EF05CO04 com louvor!'
  }
];
