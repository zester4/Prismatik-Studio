import React, { ReactElement } from 'react';

interface Template {
  title: string;
  description: string;
  // All other fields are dynamic
  [key: string]: any;
}

interface PromptTemplatesProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  disabled: boolean;
}

export default function PromptTemplates({ templates, onSelect, disabled }: PromptTemplatesProps): ReactElement {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-brand-wheat-800 mb-3">Or, start with a template</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {templates.map((template, index) => (
          <button
            key={index}
            onClick={() => onSelect(template)}
            disabled={disabled}
            className="text-left p-4 bg-brand-wheat-50 hover:bg-brand-wheat-100 border border-brand-wheat-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-teal-500"
          >
            <p className="font-semibold text-brand-wheat-900 text-sm">{template.title}</p>
            <p className="text-xs text-brand-wheat-600 mt-1 line-clamp-2">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
