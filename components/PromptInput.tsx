import React, { ReactElement } from 'react';
import { PROMPT_MAX_LENGTH } from '../constants';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  placeholder: string;
  disabled: boolean;
  rows?: number;
}

export default function PromptInput({ prompt, setPrompt, placeholder, disabled, rows = 8 }: PromptInputProps): ReactElement {
  const remainingChars = PROMPT_MAX_LENGTH - prompt.length;

  return (
    <div className="w-full">
      <label htmlFor="prompt" className="block text-base sm:text-lg font-semibold text-brand-wheat-800 mb-2">
        Your Creative Prompt
      </label>
      <div className="relative">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => {
            if (e.target.value.length <= PROMPT_MAX_LENGTH) {
              setPrompt(e.target.value);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className="w-full px-4 py-3 bg-brand-wheat-50 border-2 border-brand-wheat-200 rounded-lg text-brand-wheat-900 placeholder-brand-wheat-500 focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 transition duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className={`absolute bottom-3 right-3 text-sm ${remainingChars < 0 ? 'text-red-500' : 'text-brand-wheat-500'}`}>
          {prompt.length}/{PROMPT_MAX_LENGTH}
        </div>
      </div>
    </div>
  );
}