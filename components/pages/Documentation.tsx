import React, { ReactElement } from 'react';

export default function Documentation(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Documentation</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                This page will host detailed documentation for each tool within Prismatik Studio, including parameter explanations, best practices for prompting, and advanced workflow examples.
            </p>
        </div>
    </div>
  );
}
