/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useData, Question } from '../../contexts/DataContext';
import { X, Brain, XCircle, Award } from 'lucide-react';

interface TaskQuizProps {
  taskId: string;
  microtaskId: string;
  onComplete: (taskId: string, microtaskId: string, score: number) => void;
  onClose: () => void;
}

const TaskQuiz = ({ taskId, microtaskId, onComplete, onClose }: TaskQuizProps) => {
  const { tasks, completeMicrotask } = useData();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const task = tasks.find(t => t.id === taskId);
  const microtask = task?.microtasks.find(mt => mt.id === microtaskId);

  useEffect(() => {
    // Use quiz from microtask if present
    setLoading(true);
    if (microtask && Array.isArray(microtask.quiz) && microtask.quiz.length > 0) {
      setQuestions(microtask.quiz);
    } else {
      setQuestions([]);
    }
    setLoading(false);
  }, [microtask]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      const answerIdx = selectedAnswers[index];
      if (answerIdx !== undefined && question.options[answerIdx] === question.answer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);
  };

  const handleComplete = () => {
    completeMicrotask(taskId, microtaskId, score);
    onComplete(taskId, microtaskId, score);
    onClose();
  };

  if (!task || !microtask) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 text-white bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">Task Verification Quiz</h2>
                <p className="text-sm text-purple-100">Be honest about your progress</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-lg hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Brain className="w-12 h-12 mb-4 text-blue-500 animate-pulse" />
              <p className="text-lg font-medium text-blue-700">Loading quiz for this task...</p>
            </div>
          ) : !showResults && questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <XCircle className="w-12 h-12 mb-4 text-red-400" />
              <p className="text-lg font-medium text-gray-700">No quiz found for this task. Please contact support.</p>
              <button
                onClick={onClose}
                className="px-8 py-3 mt-6 text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Close
              </button>
            </div>
          ) : !showResults ? (
            <>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {questions.length > 0 ? Math.round(((currentQuestion + 1) / questions.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 transition-all duration-300 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    style={{ width: `${questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Question */}
              {questions[currentQuestion] && (
                <div className="pr-2 mb-8 overflow-y-auto max-h-72">
                  <h3 className="mb-6 text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text drop-shadow">
                    {questions[currentQuestion].question}
                  </h3>
                  <div className="grid gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full flex items-center p-4 rounded-xl border-2 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base font-medium
                          ${selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 scale-105 ring-2 ring-blue-200'
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700'}
                        `}
                      >
                        <div className={`flex items-center justify-center w-6 h-6 mr-4 rounded-full border-2 transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 bg-white'
                        }`}>
                          {selectedAnswers[currentQuestion] === index && (
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="flex-1">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="px-6 py-3 text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
                </button>
              </div>
            </>
          ) : (
            /* Results */
            <div className="py-8 text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                score >= 80 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {score >= 80 ? (
                  <Award className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                Quiz Complete!
              </h3>
              
              <div className="mb-4 text-4xl font-bold">
                <span className={score >= 80 ? 'text-green-600' : 'text-red-600'}>
                  {score}%
                </span>
              </div>
              
              <p className={`text-lg mb-6 ${score >= 80 ? 'text-green-700' : 'text-red-700'}`}>
                {score >= 80 
                  ? '🎉 Great job! Task marked as complete.'
                  : '💪 Keep working on it. You can retake this quiz later.'
                }
              </p>
              
              <div className="p-4 mb-6 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-600">
                  <strong>Task:</strong> {microtask.title}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Goal:</strong> {task.title}
                </p>
              </div>
              
              <button
                onClick={handleComplete}
                className="px-8 py-3 text-white transition-all rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskQuiz;