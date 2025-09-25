import React, { ReactElement } from 'react';

export default function About(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">About Us</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                This is where you would learn about the mission, vision, and team behind Prismatik Studio. Our goal is to make powerful creative AI tools accessible and intuitive for everyone.
            </p>
        </div>
    </div>
  );
}
