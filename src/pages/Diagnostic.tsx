import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, X, Gem } from 'lucide-react';
import { useStore } from '../lib/store';
import { DiagnosticCalculator } from '../components/DiagnosticCalculator';

function DiagnosticModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { groups, questions, addAssessment } = useStore();
  const [step, setStep] = useState<'client-info' | 'questions' | 'calculating'>('client-info');
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    cnpj: '',
  });

  const currentGroup = groups[currentGroupIndex];
  const groupQuestions = currentGroup
    ? questions.filter(q => q.group_id === currentGroup.id)
    : [];

  const isCurrentGroupComplete = currentGroup
    ? groupQuestions.every(q => answers[q.id])
    : false;

  const calculateProgress = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    return (answeredQuestions / totalQuestions) * 100;
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('questions');
  };

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => {
      if (prev[questionId] === value) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: value
      };
    });
  };

  const handleNextGroup = () => {
    if (currentGroupIndex < groups.length - 1) {
      setCurrentGroupIndex(prev => prev + 1);
    }
  };

  const handlePreviousGroup = () => {
    if (currentGroupIndex > 0) {
      setCurrentGroupIndex(prev => prev - 1);
    }
  };

  const handleFinishDiagnostic = () => {
    setStep('calculating');
  };

  const handleCalculationComplete = async (result: {
    totalScore: number;
    maxPossibleScore: number;
    answers: Array<{
      question_id: string;
      answer: string;
      score: number;
    }>;
  }) => {
    await addAssessment({
      client_name: clientInfo.name,
      company_name: clientInfo.company,
      cnpj: clientInfo.cnpj,
      answers: result.answers
    });

    navigate('/resultados');
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-screen flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-sm rounded-2xl flex flex-col max-h-screen">
          <div className="bg-gray-800/80 p-8 border-b border-gray-700 flex justify-between items-center rounded-t-2xl">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-4">Diagnóstico Empresarial</h1>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Nome</span>
                  <span className="text-xl text-gray-200">{clientInfo.name || '---'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-400 block mb-1">Empresa</span>
                  <span className="text-xl text-gray-200">{clientInfo.company || '---'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-sm text-gray-400">powered by</span>
                <div className="flex items-center gap-2">
                  <Gem className="w-6 h-6 text-blue-400" />
                  <span className="text-xl font-semibold text-white">DiagnósticoPRO</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {step === 'questions' && (
              <div className="px-8 pt-6">
                <div className="w-full bg-gray-700/50 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 ease-out rounded-full flex items-center justify-center min-w-[1.5rem]"
                    style={{ width: `${calculateProgress()}%` }}
                  >
                    <span className="text-[10px] font-medium text-white">
                      {Math.round(calculateProgress())}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {step === 'client-info' && (
              <div className="p-8">
                <form onSubmit={handleSubmitInfo} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Nome</label>
                    <input
                      type="text"
                      required
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">Empresa</label>
                    <input
                      type="text"
                      required
                      value={clientInfo.company}
                      onChange={(e) => setClientInfo({ ...clientInfo, company: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">CNPJ</label>
                    <input
                      type="text"
                      required
                      value={clientInfo.cnpj}
                      onChange={(e) => setClientInfo({ ...clientInfo, cnpj: e.target.value })}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-white/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Iniciar Diagnóstico
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {step === 'calculating' && (
              <DiagnosticCalculator
                answers={answers}
                onComplete={handleCalculationComplete}
              />
            )}

            {step === 'questions' && currentGroup && (
              <div className="p-8">
                <div className="bg-gray-800/80 rounded-xl p-6 mb-8 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{currentGroupIndex + 1}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white">
                        {currentGroup.name}
                      </h2>
                    </div>
                    <span className="text-white/60 text-sm">
                      Pilar {currentGroupIndex + 1} de {groups.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {groupQuestions.map((question) => (
                    <div key={question.id} className="space-y-4">
                      <div>
                        <p className="text-xl font-medium text-white">
                          {question.number}. {question.text}
                        </p>
                      </div>

                      <div className="flex gap-4">
                        {question.answer_type === 'yes_no' ? (
                          ['yes', 'no'].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value)}
                              className={`px-4 py-2 rounded-md transition-colors text-sm ${
                                answers[question.id] === value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {value === 'yes' ? 'Sim' : 'Não'}
                            </button>
                          ))
                        ) : (
                          ['yes', 'partial', 'no'].map((value) => (
                            <button
                              key={value}
                              onClick={() => handleAnswer(question.id, value)}
                              className={`px-4 py-2 rounded-md transition-colors text-sm ${
                                answers[question.id] === value
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 text-white hover:bg-white/20'
                              }`}
                            >
                              {value === 'yes' ? 'Sim' : value === 'partial' ? 'Às vezes' : 'Não'}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handlePreviousGroup}
                      disabled={currentGroupIndex === 0}
                      className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                        currentGroupIndex === 0
                          ? 'bg-white/5 text-white/20 cursor-not-allowed'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Anterior
                    </button>

                    {currentGroupIndex < groups.length - 1 ? (
                      <button
                        onClick={handleNextGroup}
                        disabled={!isCurrentGroupComplete}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                          isCurrentGroupComplete
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={handleFinishDiagnostic}
                        disabled={!isCurrentGroupComplete}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                          isCurrentGroupComplete
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-white/5 text-white/20 cursor-not-allowed'
                        }`}
                      >
                        Finalizar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Diagnostic() {
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const handleStartDiagnostic = () => {
    setShowDiagnostic(true);
  };

  const handleCloseDiagnostic = () => {
    if (window.confirm('Tem certeza que deseja sair do diagnóstico? Todo o progresso será perdido.')) {
      setShowDiagnostic(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Bem-vindo ao Diagnóstico Empresarial
        </h1>
        <button
          onClick={handleStartDiagnostic}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Iniciar Diagnóstico
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {showDiagnostic && <DiagnosticModal onClose={handleCloseDiagnostic} />}
    </div>
  );
}