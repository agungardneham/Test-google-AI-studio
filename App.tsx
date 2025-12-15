import React, { useState } from 'react';
import { Mail, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import { analyzeLetter } from './services/geminiService';
import { AnalysisState } from './types';

function App() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleFileSelect = async (file: File) => {
    setAnalysisState({ status: 'analyzing', data: null, error: null });

    try {
      const result = await analyzeLetter(file);
      setAnalysisState({ status: 'success', data: result, error: null });
    } catch (err: any) {
      let errorMessage = 'Terjadi kesalahan saat menganalisis surat. Silakan coba lagi.';
      if (err instanceof Error) {
        if (err.message.includes('API_KEY')) {
          errorMessage = 'API Key tidak ditemukan atau tidak valid.';
        } else if (err.message.includes('format')) {
          errorMessage = 'Format file tidak dapat diproses.';
        }
      }
      setAnalysisState({ status: 'error', data: null, error: errorMessage });
    }
  };

  const handleReset = () => {
    setAnalysisState({ status: 'idle', data: null, error: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700">
              LetterLens
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Hero Section (Visible only when idle) */}
          {analysisState.status === 'idle' && (
            <div className="text-center space-y-4 mb-8 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Ekstrak Isi Surat dalam <span className="text-blue-600">Hitungan Detik</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload surat dinas, undangan, atau dokumen resmi lainnya. AI kami akan merangkum dan mengekstrak data penting untuk Anda.
              </p>
            </div>
          )}

          {/* Upload Section */}
          {analysisState.status === 'idle' && (
            <div className="animate-slide-up">
               <FileUpload onFileSelect={handleFileSelect} />
            </div>
          )}

          {/* Loading State */}
          {analysisState.status === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
                <div className="relative bg-white p-4 rounded-full shadow-lg border border-blue-100">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-800">Sedang Menganalisis Dokumen...</h3>
              <p className="text-slate-500 mt-2">Gemini AI sedang membaca isi surat Anda.</p>
              
              <div className="mt-8 flex items-center space-x-2 text-sm text-slate-400">
                <Sparkles className="w-4 h-4" />
                <span>Mengekstrak nomor, tanggal, pengirim, dan inti surat</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {analysisState.status === 'error' && (
            <div className="max-w-xl mx-auto text-center animate-slide-up">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-800 mb-6">
                <p className="font-semibold text-lg mb-2">Gagal Menganalisis</p>
                <p>{analysisState.error}</p>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Coba Lagi
              </button>
            </div>
          )}

          {/* Success State */}
          {analysisState.status === 'success' && analysisState.data && (
            <div className="space-y-8 animate-slide-up">
              <AnalysisResult data={analysisState.data} />
              
              <div className="flex justify-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <Upload className="w-5 h-5 mr-2 text-slate-500" />
                  Analisis Surat Lain
                </button>
              </div>
            </div>
          )}
          
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} LetterLens. All rights reserved.</p>
      </footer>
    </div>
  );
}

// Icon wrapper for reuse in the reset button area
function Upload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export default App;
