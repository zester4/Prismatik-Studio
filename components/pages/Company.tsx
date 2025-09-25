import React, { ReactElement } from 'react';

export default function Company(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">Company</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700 text-center">
                Learn more about the mission and team behind Prismatik Studio.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <a href="/#/company/about" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">About Us</h2>
                    <p className="mt-2 text-brand-wheat-700">Our story and our mission.</p>
                </a>
                <a href="/#/company/blog" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Blog</h2>
                    <p className="mt-2 text-brand-wheat-700">News, updates, and creative insights.</p>
                </a>
                <a href="/#/company/contact" className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                    <h2 className="text-2xl font-bold text-brand-teal-600">Contact</h2>
                    <p className="mt-2 text-brand-wheat-700">Get in touch with our team.</p>
                </a>
            </div>
        </div>
    </div>
  );
}
