"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { quizData } from "@/data/questions";
import Link from "next/link";

const successMessages = [
  "Əlasan!",
  "Möhtəşəm!",
  "Çox gözəl!",
  "Supersən!",
  "Afərin!"
];

const errorMessages = [
  "Növbəti sualda bacararsan!",
  "Sən bunu bacararsan, davam et!",
  "Diqqətli ol, düz cavabı tapacaqsan!",
  "Narahat olma, davam et!",
  "Özünə inan!"
];

const getRandomMessage = (messages: string[]): string => {
  const randomIndex: number = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

function QuizContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  // URL-dən gələn kateqoriyaya uyğun suallar götürülür
  const questions = quizData[category as keyof typeof quizData] || [];
  // Oyunun vəziyyətini idarə edən state-lər
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(questions.length).fill(null)
  );
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentIndex];
  // Variant seçildikdə işə düşən funksiya
  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    // Seçilmiş variantın indeksini state-ə əlavə edir və doğru cavab olub olmadığını yoxlayır
    setAnswers((currentAnswers) => {
      const updatedAnswers = [...currentAnswers];
      updatedAnswers[currentIndex] = index;
      return updatedAnswers;
    });
    if (index === currentQuestion.correct) {
      setScore((currentScore) => currentScore + 1);
      setFeedbackMessage(getRandomMessage(successMessages));
    } else {
      setFeedbackMessage(getRandomMessage(errorMessages));
    }
  };
  // Növbəti sual və əvvəlki sual düymələrinə basıldıqda işə düşən funksiyalar
  const handleNext = () => {
    setFeedbackMessage("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };
  const handlePrevious = () => {
    setFeedbackMessage("");
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  // Əgər suallar tapılmayıbsa, istifadəçiyə xəbərdarlıq göstərir
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
  // Oyun bitdikdə istifadəçiyə nəticəsini göstərir və yeni kateqoriya seçmək üçün link verir
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
  // Əsas oyun interfeysi
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      {feedbackMessage && (
        <div className=' text-white-400 font-serif text-5xl mb-6'>
          {feedbackMessage}
        </div>
      )}
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
        <div className="flex gap-3">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              aria-label="Əvvəlki sual"
              title="Əvvəlki sual"
              className="w-12 shrink-0 py-3 bg-slate-700 hover:bg-slate-600 font-semibold rounded-xl transition cursor-pointer"
            >
              &larr;
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-xl transition cursor-pointer"
          >
            {currentIndex + 1 === questions.length ? "Nəticəni Gör" : "Növbəti Sual"}
          </button>
        </div>
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
