import React, { useState, useCallback, ReactElement, useContext, useMemo } from 'react';
import { generatePodcastScript, generateSpeech } from '../services/geminiService';
import { HistoryItemPodcast, PodcastScriptLine } from '../types';
import { TTS_VOICES, PODCAST_TEMPLATES } from '../constants';
import { HistoryContext } from '../context/HistoryContext';
import { PersonaContext } from '../context/PersonaContext';
import PromptInput from './PromptInput';
import LoadingSpinner from './LoadingSpinner';
import PromptTemplates from './PromptTemplates';
import Tooltip from './Tooltip';

type PodcastResult = Omit<HistoryItemPodcast, 'id' | 'timestamp' | 'type'>;
type InputType = 'topic' | 'script';

// --- Helper Functions for Audio Processing ---
// Base64 decoding
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Function to convert an AudioBuffer to a Blob (WAV format)
function bufferToWave(abuffer: AudioBuffer) {
    const numOfChan = abuffer.numberOfChannels,
          length = abuffer.length * numOfChan * 2 + 44,
          buffer = new ArrayBuffer(length),
          view = new DataView(buffer),
          channels = [],
          sampleRate = abuffer.sampleRate;

    let offset = 0,
        pos = 0;
    
    // Helper function
    const setUint16 = (data: number) => {
        view.setUint16(pos, data, true);
        pos += 2;
    }
    const setUint32 = (data: number) => {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    // Write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit
    
    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    // Write PCM samples
    for (let i = 0; i < abuffer.numberOfChannels; i++) {
        channels.push(abuffer.getChannelData(i));
    }

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


export default function PodcastGenerator(): ReactElement {
    const [inputType, setInputType] = useState<InputType>('topic');
    const [prompt, setPrompt] = useState<string>('');
    const [scriptText, setScriptText] = useState<string>('');
    const [generatedScript, setGeneratedScript] = useState<PodcastScriptLine[] | null>(null);
    const [voiceAssignments, setVoiceAssignments] = useState<{ [speaker: string]: string }>({});
    
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PodcastResult | null>(null);
    
    const { addHistoryItem } = useContext(HistoryContext);
    const { activePersona } = useContext(PersonaContext);

    const speakers = useMemo(() => {
        if (!generatedScript) return [];
        return [...new Set(generatedScript.map(line => line.speaker))];
    }, [generatedScript]);

    const handleSelectTemplate = useCallback((template: any) => {
        setPrompt(template.prompt || '');
        setResult(null);
        setError(null);
        setGeneratedScript(null);
        setInputType('topic');
    }, []);

    const handleSurpriseMe = useCallback(() => {
        const randomTemplate = PODCAST_TEMPLATES[Math.floor(Math.random() * PODCAST_TEMPLATES.length)];
        handleSelectTemplate(randomTemplate);
    }, [handleSelectTemplate]);

    const handleGenerateScript = async () => {
        if (!prompt.trim()) {
            setError('Please enter a topic for your podcast.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);
        setGeneratedScript(null);
        setProgress('Generating script...');
        const systemInstruction = activePersona?.systemInstruction;

        try {
            const script = await generatePodcastScript(prompt, systemInstruction);
            setGeneratedScript(script);
            // Auto-assign default voices
            const newAssignments: { [speaker: string]: string } = {};
            const uniqueSpeakers = [...new Set(script.map(line => line.speaker))];
            uniqueSpeakers.forEach((speaker, index) => {
                newAssignments[speaker] = TTS_VOICES[index % TTS_VOICES.length].id;
            });
            setVoiceAssignments(newAssignments);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setProgress('');
        }
    };
    
    const handleSynthesize = async () => {
        const scriptToUse = inputType === 'topic' 
            ? generatedScript
            : [{ speaker: 'Narrator', line: scriptText }];

        if (!scriptToUse || scriptToUse.length === 0) {
            setError('There is no script to synthesize.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioBuffers: AudioBuffer[] = [];
            
            for (let i = 0; i < scriptToUse.length; i++) {
                const item = scriptToUse[i];
                setProgress(`Synthesizing audio for line ${i + 1}/${scriptToUse.length}...`);
                const voice = voiceAssignments[item.speaker] || TTS_VOICES[0].id;
                const base64Audio = await generateSpeech(item.line, voice);
                const decodedAudio = decode(base64Audio);
                const audioBuffer = await audioContext.decodeAudioData(decodedAudio.buffer);
                audioBuffers.push(audioBuffer);
            }

            setProgress('Combining audio clips...');
            const totalLength = audioBuffers.reduce((sum, buffer) => sum + buffer.length, 0);
            const outputBuffer = audioContext.createBuffer(1, totalLength, audioBuffers[0].sampleRate);
            
            let offset = 0;
            for (const buffer of audioBuffers) {
                outputBuffer.getChannelData(0).set(buffer.getChannelData(0), offset);
                offset += buffer.length;
            }

            const audioBlob = bufferToWave(outputBuffer);
            const audioUrl = URL.createObjectURL(audioBlob);

            const newResult = {
                audioUrl,
                prompt,
                script: scriptToUse,
                voiceAssignments
            };
            setResult(newResult);
            addHistoryItem({
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                type: 'podcast',
                ...newResult
            });

        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred during synthesis.');
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

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-brand-wheat-900">Podcast Generator</h2>
                <button onClick={handleSurpriseMe} disabled={isLoading} className="flex items-center text-sm font-semibold text-brand-teal-600 hover:text-brand-teal-700 transition disabled:opacity-50 self-start sm:self-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                    Surprise Me
                </button>
            </div>

            <div className="space-y-6">
                {!result && (
                    <>
                        {/* Input Type Selector */}
                        <div className="grid grid-cols-2 gap-2 p-1 bg-brand-wheat-200 rounded-lg">
                            <button onClick={() => setInputType('topic')} disabled={isLoading} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2 ${inputType === 'topic' ? 'bg-brand-teal-500 text-white shadow' : 'bg-brand-wheat-100 text-brand-wheat-700 hover:bg-brand-wheat-200'}`}>
                                Generate from Topic
                            </button>
                            <button onClick={() => setInputType('script')} disabled={isLoading} className={`w-full py-2 px-4 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-teal-500 focus:ring-offset-2 ${inputType === 'script' ? 'bg-brand-teal-500 text-white shadow' : 'bg-brand-wheat-100 text-brand-wheat-700 hover:bg-brand-wheat-200'}`}>
                                Use Your Own Script
                            </button>
                        </div>
                        
                        {inputType === 'topic' ? (
                            <>
                                <PromptInput prompt={prompt} setPrompt={setPrompt} placeholder="e.g., A 5-minute podcast about the history of coffee." disabled={isLoading} />
                                <PromptTemplates templates={PODCAST_TEMPLATES} onSelect={handleSelectTemplate} disabled={isLoading} />
                                <button onClick={handleGenerateScript} disabled={isLoading || !prompt.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition disabled:bg-brand-teal-300">
                                    {isLoading && <LoadingSpinner />}
                                    {isLoading ? 'Generating Script...' : 'Generate Script'}
                                </button>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="scriptText" className="block text-base sm:text-lg font-semibold text-brand-wheat-800 mb-2">Your Script</label>
                                    <textarea id="scriptText" value={scriptText} onChange={(e) => setScriptText(e.target.value)} disabled={isLoading} rows={10} placeholder="Paste your podcast script here..." className="w-full px-4 py-3 bg-brand-wheat-50 border-2 border-brand-wheat-200 rounded-lg" />
                                </div>
                                <button onClick={handleSynthesize} disabled={isLoading || !scriptText.trim()} className="w-full flex items-center justify-center bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-teal-600 transition disabled:bg-brand-teal-300">
                                    {isLoading && <LoadingSpinner />}
                                    {isLoading ? 'Synthesizing...' : 'Synthesize Audio'}
                                </button>
                            </>
                        )}
                    </>
                )}

                {isLoading && (
                    <div className="mt-4 text-center p-3 bg-blue-100 text-blue-800 rounded-md">
                        <p className="font-semibold">Generation in progress...</p>
                        <p className="text-sm">{progress}</p>
                    </div>
                )}
                {error && <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-md">{error}</div>}

                {generatedScript && !result && (
                    <div className="mt-8 space-y-6">
                        <h3 className="text-xl font-semibold">Generated Script & Voice Assignment</h3>
                        <div className="bg-brand-wheat-50 p-4 rounded-lg border border-brand-wheat-200 space-y-4">
                            {speakers.map(speaker => (
                                <div key={speaker} className="flex items-center gap-4">
                                    <label htmlFor={`voice-${speaker}`} className="font-bold w-24 flex-shrink-0">{speaker}:</label>
                                    <select id={`voice-${speaker}`} value={voiceAssignments[speaker]} onChange={e => setVoiceAssignments({...voiceAssignments, [speaker]: e.target.value})} className="w-full px-3 py-2 bg-white border border-brand-wheat-200 rounded-md">
                                        {TTS_VOICES.map(voice => <option key={voice.id} value={voice.id}>{voice.name}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSynthesize} disabled={isLoading} className="w-full flex items-center justify-center bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition disabled:bg-green-400">
                           {isLoading && <LoadingSpinner />}
                           {isLoading ? 'Synthesizing...' : 'Synthesize Audio'}
                        </button>
                    </div>
                )}
                
                {result && (
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4">Your Podcast is Ready!</h3>
                        <div className="bg-brand-wheat-50 p-6 rounded-xl border border-brand-wheat-200 space-y-4">
                             <audio controls src={result.audioUrl} className="w-full"></audio>
                             <div className="flex gap-4">
                                <button onClick={handleDownload} className="flex-1 bg-brand-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-teal-600 transition">Download Audio</button>
                                <button onClick={() => { setResult(null); setGeneratedScript(null); }} className="flex-1 bg-brand-wheat-200 text-brand-wheat-800 font-bold py-2 px-4 rounded-lg hover:bg-brand-wheat-300 transition">Create Another</button>
                             </div>
                             <details className="pt-4">
                                <summary className="cursor-pointer font-semibold text-brand-wheat-800">View Script</summary>
                                <div className="mt-4 space-y-2 text-sm max-h-60 overflow-y-auto pr-2">
                                    {result.script.map((line, index) => (
                                        <p key={index}><strong className="text-brand-teal-700">{line.speaker}:</strong> {line.line}</p>
                                    ))}
                                </div>
                             </details>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
