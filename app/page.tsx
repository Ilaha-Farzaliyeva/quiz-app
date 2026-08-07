"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSelectCategory = (category:string) => {
    router.push(`/quiz?category=${category}`);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 text-center">
        <h1 className="text-3xl font-bold mb-3 text-indigo-400">İnteraktiv Viktorina</h1>
        <p className="text-slate-400 mb-8">Biliklərini sınamaq üçün kateqoriya seç:</p>

        <div className="space-y-4">
          <button
            onClick={() => handleSelectCategory("javascript")}
            className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-semibold rounded-xl transition duration-200 shadow-lg cursor-pointer"
          >
            ⚡ JavaScript Bilikləri
          </button>
          
          <button
            onClick={() => handleSelectCategory("math")}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition duration-200 shadow-lg cursor-pointer"
          >
            📐 Riyaziyyat Məntiqi
          </button>
        </div>
      </div>
    </main>
  );
}