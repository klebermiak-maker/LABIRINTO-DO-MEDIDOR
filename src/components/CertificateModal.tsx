import React, { useState, useEffect } from 'react';
import { X, Award, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
  initialStudentName?: string;
  onUpdateStudentName?: (name: string) => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  totalStars,
  initialStudentName = '',
  onUpdateStudentName,
}) => {
  const [studentName, setStudentName] = useState<string>(initialStudentName || '');
  const currentDate = new Date().toLocaleDateString('pt-BR');

  useEffect(() => {
    if (initialStudentName) {
      setStudentName(initialStudentName);
    }
  }, [initialStudentName]);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Certificado de Conclusão BNCC
              </h2>
              <p className="text-xs text-slate-400">
                Parabéns por dominar Algoritmos e Grandezas de Medida!
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

        {/* Certificate Body (Printable Area) */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="mb-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Digite o Nome do Aluno(a) para o Certificado:
            </label>
            <input
              type="text"
              placeholder="Ex: Maria Clara Silva"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Diplome Box */}
          <div 
            id="printable-certificate" 
            className="border-4 border-double border-amber-500/80 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-center relative shadow-inner"
          >
            {/* Corner decorations */}
            <div className="absolute top-2 left-2 text-amber-400/40 text-lg">✦</div>
            <div className="absolute top-2 right-2 text-amber-400/40 text-lg">✦</div>
            <div className="absolute bottom-2 left-2 text-amber-400/40 text-lg">✦</div>
            <div className="absolute bottom-2 right-2 text-amber-400/40 text-lg">✦</div>

            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-2xl mx-auto mb-2">
              🏆
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-amber-300 uppercase tracking-widest font-heading">
              Certificado de Mestre
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              Pensamento Computacional & Grandezas Matemáticas
            </p>

            <div className="my-5">
              <p className="text-xs text-slate-300">Certificamos que o(a) aluno(a)</p>
              <div className="text-xl sm:text-2xl font-bold text-white border-b border-amber-500/50 pb-1 max-w-sm mx-auto my-1 font-heading min-h-[36px]">
                {studentName || 'Nome do(a) Aluno(a)'}
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                completou com distinção o jogo educativo <strong>"O Labirinto do Medidor"</strong>, demonstrando domínio das habilidades da BNCC <strong>EF05CO04</strong> (Sequências, Loops e Condicionais) e <strong>EF05MA19</strong> (Comprimento, Massa e Capacidade).
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <div>
                <span>Data: </span>
                <strong className="text-slate-300">{currentDate}</strong>
              </div>
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{totalStars} Estrelas Conquistadas</span>
              </div>
              <div>
                <span>Selo BNCC 5º Ano</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-850 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Você pode imprimir ou salvar em PDF!
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
