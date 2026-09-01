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
        hint: '1 metro = 100 cm. Portanto, 200 cm = 2 metros (2 passos)!'
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
    mathChallenge: 'Converta 200 cm para metros (1 m = 100 cm) e crie o algoritmo para alcançar o objetivo!',
    pedagogicalHint: 'Para avançar em linha reta, monte uma sequência de blocos "Avance 1 metro". Lembre-se: 1 metro tem 100 centímetros.',
    mathExplanation: '200 cm ÷ 100 = 2 metros. O robô precisa dar 2 passos para abrir a porta e depois mais passos até a meta!'
  },
  {
    id: 2,
    title: 'Fase 2: O Poder da Repetição (Loop)',
    subtitle: 'Estruturas de Repetição & Comprimento (300 cm = 3 m)',
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
        hint: '300 cm equivalem a exatamente 3 metros (3 passos seguidos)!'
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
    storyContext: 'Em vez de usar muitos blocos iguais, os programadores usam loops de repetição! Economize blocos com o bloco "Repita".',
    mathChallenge: 'Use o bloco de repetição para andar a distância total até a meta (5 metros) ou até o portão de 300 cm.',
    pedagogicalHint: 'Em vez de colocar 5 blocos de "Avance", coloque 1 bloco "Repita 5 vezes" com "Avance" dentro!',
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
        hint: '1 cm = 10 mm. Portanto 200 mm = 20 cm (2 passos de 10 cm)!'
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
    mathChallenge: 'Sabendo que 1 cm = 10 mm, calcule quantos passos de 10 cm são necessários para somar 200 mm, gire e vá até a meta.',
    pedagogicalHint: 'Ande 2 passos para o norte, gire 90° à direita e use um loop para avançar 3 passos a leste.',
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
        hint: '1 km = 1.000 m. Então 4.000 metros = 4 km (4 passos de 1 km)!'
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
    mathChallenge: 'Quantos quilômetros equivalem a 4.000 metros? Use um bloco de repetição para andar 6 km no total.',
    pedagogicalHint: '4.000 m = 4 km. Programe "Repita 6 vezes [Avance 1 km]".',
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
        hint: '1 kg = 1.000 g. A balança pede 2.000 g, que são exatamente 2 kg!'
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
    mathChallenge: 'Adicione 2 kg de peso ao robô antes ou ao chegar na balança para somar 2.000 g.',
    pedagogicalHint: 'Avance até a balança, use o comando "Adicionar 2 kg de peso" (ou 2x 1kg) e avance até a saída.',
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
        hint: '1 L = 1.000 ml. Logo, 1.500 ml = 1,5 Litros (ou 1L + 500ml)!'
      }
    ],
    allowedBlocks: ['move_forward', 'inject_capacity', 'repeat'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'O reator térmico superaqueceu! O robô deve injetar exatamente 1.500 ml de refrigerante para esfriar o tubo.',
    mathChallenge: 'Quantos litros representam 1.500 ml? Injete 1,5 L (ou 1500 ml) para liberar a passagem.',
    pedagogicalHint: 'Avance 2 vezes, injete 1.500 ml (ou 1,5 L) na válvula e continue até a saída.',
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
        hint: 'Use a chave de 1 metro para abrir a porta de 100 cm!'
      }
    ],
    allowedBlocks: ['move_forward', 'if_condition', 'use_key', 'repeat'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4,
      twoStarsMaxBlocks: 6
    },
    storyContext: 'Sensores inteligentes usam condições! O robô deve checar: "Se na minha frente houver uma porta de medida, então destrave com a chave correta".',
    mathChallenge: 'Crie uma estrutura condicional [Se houver porta] então [Usar chave de 1 metro (100 cm)].',
    pedagogicalHint: 'Avance 1 passo. Coloque o bloco condicional "Se frente for Porta", dentro coloque "Usar Chave de 1m", depois avance até o final.',
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
        hint: '3.000 gramas = 3 quilogramas (3 kg).'
      }
    ],
    allowedBlocks: ['move_forward', 'turn_right', 'turn_left', 'if_condition', 'add_weight', 'repeat'],
    maxBlocks: 8,
    targetStars: {
      threeStarsMaxBlocks: 6,
      twoStarsMaxBlocks: 8
    },
    storyContext: 'Uma balança no meio do caminho exige 3.000 g de carga para ativar a plataforma.',
    mathChallenge: 'Use "Se frente for Balança de Massa" então "Adicionar 3 kg" para satisfazer os 3.000 g exigidos.',
    pedagogicalHint: 'Avance 1 passo, use o SE condicional para carregar 3 kg quando estiver em frente à balança, avance e faça a curva até a meta.',
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
        color: '#06b6d4'
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
        color: '#06b6d4'
      }
    ],
    allowedBlocks: ['move_forward', 'repeat', 'if_condition', 'inject_capacity'],
    maxBlocks: 6,
    targetStars: {
      threeStarsMaxBlocks: 4, // Loop containing Move + If
      twoStarsMaxBlocks: 6
    },
    storyContext: 'Existem vários tanques na linha de produção, cada um precisando de 500 ml (0,5 L) de água.',
    mathChallenge: 'Combine "Repita 6 vezes" com "Se frente for Tanque" então "Injetar 500 ml" e "Avance".',
    pedagogicalHint: 'Coloque um Loop "Repita 6 vezes". Dentro dele, adicione "Se frente for Tanque" -> "Injetar 500 ml", seguido de "Avance".',
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
        color: '#3b82f6'
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
        color: '#f59e0b'
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
    storyContext: 'Agora você deve vencer dois tipos de desafios na mesma rota: uma porta de comprimento (200 cm = 2 m) e uma balança de massa (1.000 g = 1 kg).',
    mathChallenge: '200 cm = 2 m de caminhada; 1.000 g = 1 kg na balança!',
    pedagogicalHint: 'Avance 2 passos até a porta, gire à direita, avance até a balança, adicione 1 kg e siga até a saída.',
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
        hint: '2.000 mm = 200 cm = 2 metros!'
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
        hint: '2.500 g = 2,5 kg (2 kg e meio).'
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
        hint: '2 Litros = 2.000 ml!'
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
    mathChallenge: '2.000 mm = 2 m; 2.500 g = 2,5 kg; 2 L = 2.000 ml.',
    pedagogicalHint: 'Suba até a porta de 2.000 mm (2 passos), vire à direita, abasteça 2.5 kg na balança, siga e desça até a válvula de 2 L, injetando 2.000 ml!',
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
        label: 'Portal 300 cm (3 m)',
        category: 'length',
        requiredValue: 3,
        requiredUnit: 'm',
        color: '#3b82f6'
      },
      {
        id: 'scale-f1',
        x: 3,
        y: 1,
        type: 'scale',
        label: 'Sensor de 5.000 g (5 kg)',
        category: 'mass',
        requiredValue: 5,
        requiredUnit: 'kg',
        color: '#f59e0b'
      },
      {
        id: 'tank-f1',
        x: 5,
        y: 3,
        type: 'tank',
        label: 'Câmara de 3.000 ml (3 L)',
        category: 'capacity',
        requiredValue: 3000,
        requiredUnit: 'ml',
        color: '#06b6d4'
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
    mathChallenge: 'Conecte todas as grandezas (300 cm = 3 m, 5.000 g = 5 kg, 3.000 ml = 3 L) com código otimizado!',
    pedagogicalHint: 'Use blocos de Repetição para trechos longos e certifique-se de satisfazer as exigências de massa e volume nos pontos certos.',
    mathExplanation: 'Parabéns! 300 cm = 3 m, 5.000 g = 5 kg e 3.000 ml = 3 L. Você completou todas as habilidades da BNCC EF05CO04 com louvor!'
  }
];
