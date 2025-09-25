import React, { ReactElement } from 'react';

export default function Design(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Design Solutions</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                This is where you would find detailed information about using Prismatik Studio for design. Learn how to generate logo concepts, create mood boards, and produce high-quality visual assets for your branding and creative projects.
            </p>
        </div>
    </div>
  );
}
