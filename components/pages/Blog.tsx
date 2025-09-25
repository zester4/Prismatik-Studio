import React, { ReactElement } from 'react';

export default function Blog(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Blog</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                This page will feature a collection of articles, tutorials, product updates, and creative showcases related to Prismatik Studio and the world of generative AI.
            </p>
        </div>
    </div>
  );
}
