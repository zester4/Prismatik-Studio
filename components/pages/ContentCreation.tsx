import React, { ReactElement } from 'react';

export default function ContentCreation(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Content Creation</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                This is where you would find detailed information about using Prismatik Studio for content creation. Explore how to write and illustrate stories, generate long-form articles, and create engaging blog posts with AI assistance.
            </p>
        </div>
    </div>
  );
}
