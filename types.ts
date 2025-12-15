export interface LetterData {
  nomorSurat: string;
  hal: string;
  pengirim: string;
  tanggal: string;
  kepada: string;
  intiSurat: string;
  waktuAcara: string;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  data: LetterData | null;
  error: string | null;
}