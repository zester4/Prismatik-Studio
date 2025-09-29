import React, { useState, useCallback, ReactElement, useContext } from 'react';
import { synthesizePodcast, generatePodcastScript } from '../services/geminiService';
import { HistoryItemPodcast, PodcastScriptLine } from '../types';
import { TTS_VOICES, PODCAST_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import PromptTemplates from './PromptTemplates';

type PodcastResult = Omit<HistoryItemPodcast, 'id' | 'timestamp' | 'type'>;
type InputType = 'topic' | 'script';

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

const parseScript = (text: string): PodcastScriptLine[] => {
    return text.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split(':');
        if (parts.length > 1) {
            const speaker = parts[0].trim();
            const lineContent = parts.slice(1).join(':').trim();
            return { speaker, line: lineContent };
        }
        return { speaker: 'Narrator', line: line.trim() };
    });
};

export default function PodcastGenerator(): ReactElement {
    const [inputType, setInputType] = useState<InputType>('topic');
    const [prompt, setPrompt] = useState<string>('');
    const [scriptText, setScriptText] = useState<string>('');
    const [speakers, setSpeakers] = useState([{ id: crypto.randomUUID(), name: 'Narrator', voice: TTS_VOICES[0].id }]);
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PodcastResult | null>(null);
    
    const { addHistoryItem } = useContext(HistoryContext);
    const { activePersona } = useContext(PersonaContext);

    const handleSelectTemplate = useCallback((template: any) => {
        setPrompt(template.prompt || '');
        setResult(null);
        setError(null);
        setInputType('topic');
    }, []);

    const handleSurpriseMe = useCallback(() => {
        const randomTemplate = PODCAST_TEMPLATES[Math.floor(Math.random() * PODCAST_TEMPLATES.length)];
        handleSelectTemplate(randomTemplate);
    }, [handleSelectTemplate]);

    const handleAddSpeaker = () => {
        if (speakers.length >= 5) return;
        setSpeakers([...speakers, { id: crypto.randomUUID(), name: `Speaker ${speakers.length + 1}`, voice: TTS_VOICES[speakers.length % TTS_VOICES.length].id }]);
    };
    
    const handleRemoveSpeaker = (id: string) => {
        if (speakers.length <= 1) return;
        setSpeakers(speakers.filter(s => s.id !== id));
    };
    
    const handleSpeakerChange = (id: string, field: 'name' | 'voice', value: string) => {
        setSpeakers(speakers.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleGeneratePodcast = async () => {
        if (inputType === 'topic' && !prompt.trim()) {
          setError('Please enter a topic for your podcast.');
          return;
        }
        if (inputType === 'script' && !scriptText.trim()) {
          setError('Please enter a script to generate.');
          return;
        }
    
        setIsLoading(true);
        setError(null);
        setResult(null);
        setProgress('Starting generation...');
        const systemInstruction = activePersona?.systemInstruction;
    
        try {
          let scriptToSynthesize: PodcastScriptLine[];
          const finalVoiceAssignments = speakers.reduce((acc, speaker) => {
              acc[speaker.name] = speaker.voice;
              return acc;
          }, {} as { [key: string]: string });
    
          if (inputType === 'topic') {
            setProgress('Generating script...');
            const speakerNames = speakers.map(s => s.name);
            scriptToSynthesize = await generatePodcastScript(prompt, speakerNames, systemInstruction);
          } else { // inputType === 'script'
            setProgress('Parsing script...');
            scriptToSynthesize = parseScript(scriptText);
            if (scriptToSynthesize.length === 0) {
              throw new Error("Could not parse the script. Please use 'Speaker: Text' format or plain text for a single speaker.");
            }
          }
    
          setProgress('Synthesizing podcast audio...');
          const base64Audio = await synthesizePodcast(scriptToSynthesize, finalVoiceAssignments, systemInstruction);
    
          setProgress('Processing audio...');
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const decodedPcm = decode(base64Audio);
          const audioBuffer = await decodeAudioData(decodedPcm, audioContext, 24000, 1);
          const audioBlob = bufferToWave(audioBuffer);
          const audioUrl = URL.createObjectURL(audioBlob);
    
          const newResult = {
            audioUrl,
            prompt: inputType === 'topic' ? prompt : 'Custom Script',
            script: scriptToSynthesize,
            voiceAssignments: finalVoiceAssignments
          };
          setResult(newResult);
          addHistoryItem({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: 'podcast',
            ...newResult
          });
    
        } catch (e) {
          setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
          setIsLoading(false);
          setProgress('');
        }
    };
    
    const handleDownload = () => {
        if (!result) return;
        const link = document.createElement('a');
        link.href = result.audioUrl;
        link.download = `${result.prompt.substring(0, 20).replace(/\s+/g, '_') || 'podcast'}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const resetState = () => {
        setResult(null);
        setPrompt('');
        setScriptText('');
        setError(null);
        setProgress('');
        setSpeakers([{ id: crypto.randomUUID(), name: 'Narrator', voice: TTS_VOICES[0].id }]);
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Podcast Generator</h2>
                {!result && (
                    <button onClick={handleSurpriseMe} disabled={isLoading} className="flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                        Surprise Me
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {!result ? (
                    <>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-brand-wheat-200 rounded-lg">
                            <button onClick={() => setInputType('topic')} disabled={isLoading} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2 ${inputType === 'topic' ? 'bg-brand-teal-500 text-white shadow' : 'bg-brand-wheat-100 text-brand-wheat-700 hover:bg-brand-wheat-200'}`}>
                                From Topic
                            </button>
                            <button onClick={() => setInputType('script')} disabled={isLoading} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2 ${inputType === 'script' ? 'bg-brand-teal-500 text-white shadow' : 'bg-brand-wheat-100 text-brand-wheat-700 hover:bg-brand-wheat-200'}`}>
                                From Script
                            </button>
                        </div>
                        
                        {inputType === 'topic' ? (
                            <>
                                <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder="e.g., A 5-minute podcast about the history of coffee." disabled={isLoading} />
                                <PromptTemplates templates={PODCAST_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
                            </>
                        ) : (
                            <div>
                                <label htmlFor="scriptText" className="block text-base sm:text-lg font-semibold text-brand-wheat-800 mb-2">Your Script</label>
                                <p className="text-xs text-brand-wheat-600 mb-2">For multiple speakers, use the format: <strong>Speaker Name: Dialogue text...</strong> on each line. The speaker names must match the names you configure below.</p>
                                <textarea id="scriptText" value={scriptText} onChange={(e) => setScriptText(e.target.value)} disabled={isLoading} rows={10} placeholder="Paste your podcast script here..." className="w-full px-4 py-3 bg-brand-wheat-50 border-2 border-brand-wheat-200 rounded-lg" />
                            </div>
                        )}
                        
                        <div className="bg-brand-wheat-50 p-4 rounded-lg border border-brand-wheat-200">
                            <h3 className="text-lg font-semibold text-brand-wheat-800 mb-3">Speakers & Voices</h3>
                            <div className="space-y-3">
                                {speakers.map((speaker, index) => (
                                    <div key={speaker.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                        <input 
                                            type="text" 
                                            value={speaker.name} 
                                            onChange={e => handleSpeakerChange(speaker.id, 'name', e.target.value)}
                                            className="w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md"
                                            placeholder={`Speaker ${index + 1} Name`}
                                        />
                                        <div className="flex items-center gap-2">
                                            <select 
                                                value={speaker.voice}
                                                onChange={e => handleSpeakerChange(speaker.id, 'voice', e.target.value)}
                                                className="w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md"
                                            >
                                                {TTS_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
                                            </select>
                                            <button onClick={() => handleRemoveSpeaker(speaker.id)} disabled={speakers.length <= 1} className="p-2 text-brand-wheat-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleAddSpeaker} disabled={speakers.length >= 5} className="mt-3 text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50">
                                + Add Speaker
                            </button>
                        </div>

                        <button onClick={handleGeneratePodcast} disabled={isLoading || (inputType === 'topic' && !prompt.trim()) || (inputType === 'script' && !scriptText.trim())} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition disabled:bg-brand-teal-300">
                            {isLoading && <LoadingSpinner />}
                            {isLoading ? 'Generating...' : 'Generate Podcast'}
                        </button>
                    </>
                ) : (
                     <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Your Podcast is Ready!</h3>
                        <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200 space-y-4">
                             <audio controls src={result.audioUrl} className="w-full"></audio>
                             <div className="flex gap-4">
                                <button onClick={handleDownload} className="flex-1 bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition">Download Audio (.wav)</button>
                                <button onClick={resetState} className="flex-1 bg-brand-wheat-200 text-brand-wheat-800 font-bold py-2 px-4 rounded-lg hover:bg-brand-wheat-300 transition">Create Another</button>
                             </div>
                             <details className="pt-4">
                                <summary className="cursor-pointer font-semibold text-brand-wheat-800">View Script & Voice Assignments</summary>
                                <div className="mt-4 space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                                    {result.script.map((line, index) => {
                                        const voiceName = TTS_VOICES.find(v => v.id === result.voiceAssignments[line.speaker])?.name || 'Default';
                                        return (
                                            <p key={index}>
                                                <strong className="text-brand-teal-700">{line.speaker}</strong>
                                                <em className="text-brand-wheat-600 text-xs"> ({voiceName})</em>: {line.line}
                                            </p>
                                        );
                                    })}
                                </div>
                             </details>
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="mt-4 text-center p-3 bg-blue-100 text-blue-800 rounded-md">
                        <p className="font-semibold">Generation in progress...</p>
                        <p className="text-sm">{progress}</p>
                    </div>
                )}
                {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}
            </div>
        </div>
    );
}