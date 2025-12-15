import React from 'react';
import { LetterData } from '../types';
import { Calendar, User, Hash, Send, FileText, CheckCircle2, Clock, Tag } from 'lucide-react';

interface AnalysisResultProps {
  data: LetterData;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center space-x-3 mb-1">
          <CheckCircle2 className="w-6 h-6 text-blue-200" />
          <h2 className="text-xl font-bold">Analisis Selesai</h2>
        </div>
        <p className="text-blue-100 text-sm opacity-90 pl-9">
          Informasi berikut berhasil diekstrak dari dokumen Anda.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Inti Surat - Highlighted */}
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-1">Inti Surat</h3>
              <p className="text-blue-900 text-lg leading-relaxed font-medium">
                {data.intiSurat}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResultItem 
            icon={<Hash className="w-5 h-5 text-slate-400" />}
            label="Nomor Surat"
            value={data.nomorSurat}
          />
          <ResultItem 
            icon={<Tag className="w-5 h-5 text-slate-400" />}
            label="Hal / Perihal"
            value={data.hal}
          />
          <ResultItem 
            icon={<Calendar className="w-5 h-5 text-slate-400" />}
            label="Tanggal Surat"
            value={data.tanggal}
          />
          <ResultItem 
            icon={<User className="w-5 h-5 text-slate-400" />}
            label="Pengirim"
            value={data.pengirim}
          />
          <ResultItem 
            icon={<Send className="w-5 h-5 text-slate-400" />}
            label="Kepada / Tujuan"
            value={data.kepada}
          />
           <ResultItem 
            icon={<Clock className="w-5 h-5 text-slate-400" />}
            label="Waktu Acara / Tenggat"
            value={data.waktuAcara}
          />
        </div>
      </div>
    </div>
  );
};

const ResultItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3 group p-3 rounded-lg hover:bg-slate-50 transition-colors">
    <div className="mt-1 bg-white p-1.5 rounded-md border border-slate-200 shadow-sm group-hover:border-blue-200 group-hover:shadow-blue-100 transition-all">
      {icon}
    </div>
    <div className="flex-1 overflow-hidden">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-slate-800 font-medium break-words">{value}</p>
    </div>
  </div>
);

export default AnalysisResult;