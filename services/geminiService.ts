import { GoogleGenAI, Type } from "@google/genai";
import { LetterData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Analyzes the letter image/PDF and extracts specific fields.
 */
export const analyzeLetter = async (file: File): Promise<LetterData> => {
  try {
    const filePart = await fileToGenerativePart(file);

    const modelId = "gemini-2.5-flash"; // Optimized for speed and extraction
    
    const prompt = `
      Analisis dokumen surat yang dilampirkan ini.
      Ekstrak informasi berikut secara akurat:
      1. Nomor Surat (Jika tidak ada, tulis "-")
      2. Hal / Perihal Surat (Judul perihal surat, jika tidak ada tulis "-")
      3. Pengirim Surat (Instansi atau Nama Orang)
      4. Tanggal Surat (Kapan surat ini ditulis. Format: DD MMMM YYYY)
      5. Kepada/Tujuan Surat (Siapa penerimanya)
      6. Inti dari surat tersebut (Ringkasan singkat 1-2 kalimat mengenai tujuan utama surat)
      7. Waktu Pelaksanaan / Tenggat (PENTING: Jika surat berupa undangan rapat/acara, ambil Hari, Tanggal, dan Jam pelaksanaannya. Jika surat permintaan data/tugas, ambil batas waktu/deadline-nya. Jika tidak ada informasi waktu pelaksanaan/tenggat, tulis "-").

      Pastikan output dalam format JSON yang valid sesuai skema. Gunakan Bahasa Indonesia.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          filePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nomorSurat: { type: Type.STRING, description: "Nomor identifikasi surat" },
            hal: { type: Type.STRING, description: "Perihal atau hal surat" },
            pengirim: { type: Type.STRING, description: "Nama pengirim atau instansi" },
            tanggal: { type: Type.STRING, description: "Tanggal pembuatan surat" },
            kepada: { type: Type.STRING, description: "Penerima surat" },
            intiSurat: { type: Type.STRING, description: "Ringkasan isi surat" },
            waktuAcara: { type: Type.STRING, description: "Waktu pelaksanaan acara atau tenggat waktu/deadline jika ada" },
          },
          required: ["nomorSurat", "hal", "pengirim", "tanggal", "kepada", "intiSurat", "waktuAcara"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Tidak ada respon dari AI.");
    }

    const data: LetterData = JSON.parse(resultText);
    return data;

  } catch (error) {
    console.error("Error analyzing letter:", error);
    throw error;
  }
};