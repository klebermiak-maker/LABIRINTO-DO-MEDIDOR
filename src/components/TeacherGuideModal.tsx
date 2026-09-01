import React from 'react';
import { X, BookOpen, CheckCircle, Lightbulb, Users, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold">
              📚
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-heading">
                Guia do Educador & Alinhamento BNCC
              </h2>
              <p className="text-xs text-slate-400">
                Fundamentos Pedagógicos para o 5º Ano do Ensino Fundamental
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* BNCC Competencies Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                <span>Pensamento Computacional (EF05CO04)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Habilidade:</strong> Construir e simular algoritmos representados em linguagem estruturada ou blocos lógicos, que utilizem <strong>sequências</strong>, <strong>repetições (loops)</strong> e <strong>seleções condicionais (se/então)</strong> para resolver problemas práticos e matemáticos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>Grandezas e Medidas (EF05MA19)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Habilidade:</strong> Resolver e elaborar problemas envolvendo medidas das grandezas <strong>comprimento</strong> (mm, cm, m, km), <strong>massa</strong> (g, kg, t) e <strong>capacidade</strong> (ml, L), recorrendo a transformações entre as unidades mais usuais em contextos socioculturais.
              </p>
            </div>
          </div>

          {/* How to use in Classroom */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Sugestão de Atividade em Sala de Aula</span>
            </div>
            <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Momento de Investigação (Pré-jogo):</strong> Pergunte aos alunos: <em>"Quantos centímetros têm 2 metros? Se eu der 2 passos de 1 metro, quantos centímetros andei?"</em>
              </p>
              <p>
                <strong>2. Trabalho em Duplas (Pair Programming):</strong> Coloque um aluno como <em>"Piloto"</em> (monta os blocos no teclado/mouse) e o outro como <em>"Co-piloto"</em> (calcula as conversões no caderno e na Tabela de Medidas). A cada fase, eles invertem os papéis.
              </p>
              <p>
                <strong>3. Discussão de Algoritmos Otimizados:</strong> Compare soluções que usam 5 blocos sequenciais com soluções que usam apenas 1 bloco "Repita 5 vezes [Avance]". Discuta a elegância do código e economia de memória computacional.
              </p>
            </div>
          </div>

          {/* Assessment rubrics */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Critérios de Avaliação Formativa</span>
            </div>
            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-300">
              <li><strong>Compreensão de Equivalência:</strong> O aluno converte corretamente grandezas de comprimento, massa e capacidade sem confundir grandezas.</li>
              <li><strong>Estruturação Algorítmica:</strong> O aluno identifica onde o uso de repetição (loops) e condições (se/então) torna o algoritmo mais eficiente.</li>
              <li><strong>Depuração (Debug):</strong> O aluno interpreta o feedback de erro do robô e corrige a rota ou as grandezas de forma autônoma.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-850 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow"
          >
            Entendido, Voltar ao Jogo
          </button>
        </div>
      </div>
    </div>
  );
};
