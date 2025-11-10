import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { synthesizeSpeech } from '../services/geminiService';
import { HistoryItemTTS } from '../types';
import { TTS_VOICES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import LoadingSpinner from './LoadingSpinner';

// --- Helper Functions for Audio Processing ---

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function bufferToWave(abuffer: AudioBuffer): Blob {
    const numOfChan = abuffer.numberOfChannels,
          length = abuffer.length * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          sampleRate = abuffer.sampleRate;
    
    let pos = 0;
    
    const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; }
    const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); 
    setUint32(0x45564157); // "WAVE"
    setUint32(0x20746d66); // "fmt "
    setUint32(16); 
    setUint16(1); 
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); 
    setUint16(numOfChan * 2); 
    setUint16(16); 
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    const channels = Array.from({ length: abuffer.numberOfChannels }, (_, i) => abuffer.getChannelData(i));
    let index = 0;
    while(pos < length) {
        for(let i = 0; i < numOfChan; i++) {
            let sample = Math.max(-1, Math.min(1, channels[i][index]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        index++;
    }

    return new Blob([buffer], {type: "audio/wav"});
}

export default function TTSGenerator(): ReactElement {
    const [text, setText] = useState<string>('');
    const [voice, setVoice] = useState<string>(TTS_VOICES[0].id);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ audioUrl: string } | null>(null);
    const { addHistoryItem } = useContext(HistoryContext);

    const handleGenerate = useCallback(async () => {
        if (!text.trim()) {
            setError('Please enter some text to synthesize.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const base64Audio = await synthesizeSpeech(text, voice);
            
            // This is a browser-only feature
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const decodedPcm = decode(base64Audio);
            const audioBuffer = await decodeAudioData(decodedPcm, audioContext, 24000, 1);
            const audioBlob = bufferToWave(audioBuffer);
            const audioUrl = URL.createObjectURL(audioBlob);

            const newResult = { audioUrl };
            setResult(newResult);

            addHistoryItem({
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                type: 'tts',
                prompt: text,
                audioUrl: audioUrl,
                voice: voice,
            });

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [text, voice, addHistoryItem]);
    
    const handleDownload = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result.audioUrl;
        link.download = `tts_output.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Text-to-Speech</h2>
                <p className="text-brand-wheat-600 mt-1">Convert text into high-quality spoken audio.</p>
            </div>
            <div className="space-y-6">
                <div>
                    <label htmlFor="tts-text" className="block text-base sm:text-lg font-semibold text-brand-wheat-800 mb-2">
                        Your Text
                    </label>
                    <textarea
                        id="tts-text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="e.g., Hello, world! This is a test of the text-to-speech system."
                        disabled={isLoading}
                        rows={8}
                        className="w-full px-4 py-3 bg-brand-wheat-50 border-2 border-brand-wheat-200 rounded-lg text-brand-wheat-900 placeholder-brand-wheat-500 focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 transition duration-200 resize-none"
                    />
                </div>
                
                <div>
                    <label htmlFor="tts-voice" className="block text-sm font-medium text-brand-wheat-800 mb-1">Voice</label>
                    <select
                        id="tts-voice"
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 bg-brand-wheat-50 border border-brand-wheat-200 rounded-md focus:ring-brand-teal-500 focus:border-brand-teal-500"
                    >
                        {TTS_VOICES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                </div>

                <button onClick={handleGenerate} disabled={isLoading || !text.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
                    {isLoading && <LoadingSpinner />}
                    {isLoading ? 'Generating Speech...' : 'Generate Speech'}
                </button>
            </div>
            
            {error && (
                <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md flex justify-between items-center">
                    <span>{error}</span>
                </div>
            )}

            {result && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Result</h3>
                    <div className="bg-brand-wheat-50 p-4 rounded-xl border border-brand-wheat-200 space-y-4">
                        <audio controls src={result.audioUrl} className="w-full"></audio>
                        <button onClick={handleDownload} className="w-full bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition">Download Audio (.wav)</button>
                    </div>
                </div>
            )}
        </div>
    );
}