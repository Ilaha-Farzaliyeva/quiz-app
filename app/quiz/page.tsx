"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { quizData } from "@/data/questions";
import Link from "next/link";

function QuizContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const questions = quizData[category as keyof typeof quizData] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Kateqoriya tapılmadı!</h1>
          <Link href="/" className="px-6 py-2 bg-indigo-600 rounded-xl text-white">
            Ana səhifəyə qayıt
          </Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; 

    setSelectedOption(index);
    if (index === currentQuestion.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center">
          <h1 className="text-3xl font-bold mb-4 text-indigo-400">Viktorina Bitdi! 🎉</h1>
          <p className="text-xl mb-6">
            Nəticən: <span className="font-bold text-yellow-400">{score}</span> / {questions.length}
          </p>
          <Link
            href="/"
            className="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition"
          >
            Yeni Kateqoriya Seç
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="flex justify-between items-center mb-6 text-slate-400 text-sm">
          <span>Sual {currentIndex + 1} / {questions.length}</span>
          <span>Xal: {score}</span>
        </div>

        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            let btnBg = "bg-slate-700 hover:bg-slate-600 text-white";

            if (selectedOption !== null) {
              if (index === currentQuestion.correct) {
                btnBg = "bg-green-600 text-white"; 
              } else if (index === selectedOption) {
                btnBg = "bg-red-600 text-white"; 
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`w-full p-4 rounded-xl text-left font-medium transition duration-200 cursor-pointer ${btnBg}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedOption !== null && (
          <button
            onClick={handleNext}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition cursor-pointer"
          >
            {currentIndex + 1 === questions.length ? "Nəticəni Gör" : "Növbəti Sual"}
          </button>
        )}
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Yüklənir...</div>}>
      <QuizContent />
    </Suspense>
  );
}