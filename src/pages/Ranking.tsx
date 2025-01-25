import React from 'react';
import { useStore } from '../lib/store';

export default function Ranking() {
  const { assessments, questions } = useStore();

  const calculateScore = (assessment: any) => {
    const totalScore = assessment.answers.reduce((sum: number, answer: any) => {
      const question = questions.find(q => q.id === answer.question_id);
      if (!question) return sum;

      let score = 0;
      if (answer.answer === 'partial') {
        score = question.score_value / 2;
      } else if (
        (question.score_type === 'full' && answer.answer === 'yes') ||
        (question.score_type === 'none' && answer.answer === 'no')
      ) {
        score = question.score_value;
      }

      return sum + score;
    }, 0);

    const maxPossibleScore = questions.reduce((sum, question) => sum + question.score_value, 0);

    return { totalScore, maxPossibleScore };
  };

  const sortedAssessments = [...assessments]
    .map(assessment => ({
      ...assessment,
      ...calculateScore(assessment)
    }))
    .sort((a, b) => b.totalScore - a.totalScore);

  const maxScore = Math.max(...sortedAssessments.map(a => a.maxPossibleScore), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Ranking de Diagnósticos</h1>

      <div className="bg-gray-800 rounded-lg p-6">
        <div className="space-y-4">
          {sortedAssessments.length > 0 ? (
            sortedAssessments.map((assessment, index) => (
              <div key={assessment.id} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-right font-bold text-gray-400">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2">
                      <h3 className="font-semibold">{assessment.client_name}</h3>
                      <p className="text-sm text-gray-400">{assessment.company_name}</p>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-right text-sm font-semibold">
                          {assessment.totalScore} pontos
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${(assessment.totalScore / maxScore) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-32 text-right text-sm text-gray-400">
                    {new Date(assessment.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              Nenhum diagnóstico realizado ainda
            </div>
          )}
        </div>
      </div>
    </div>
  );
}