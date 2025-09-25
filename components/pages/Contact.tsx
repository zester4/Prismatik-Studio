import React, { ReactElement } from 'react';

const ContactInfo = ({ title, description, email, icon }: { title: string, description: string, email: string, icon: ReactElement }) => (
    <div className="flex items-start gap-4">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
            {icon}
        </div>
        <div>
            <h3 className="text-xl font-bold text-brand-wheat-900">{title}</h3>
            <p className="mt-1 text-brand-wheat-700">{description}</p>
            <a href={`mailto:${email}`} className="mt-2 inline-block font-semibold text-brand-teal-600 hover:underline">{email}</a>
        </div>
    </div>
);

// Icons
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const PressIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3m-3 4h3" /></svg>;
const BusinessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default function Contact(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">Get In Touch</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                    We'd love to hear from you. Whether you have a question, a partnership proposal, or just want to say hello, here's how you can reach us.
                </p>
            </div>
            
            <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 sm:p-12 rounded-2xl shadow-lg">
                {/* Contact Info */}
                <div className="space-y-8">
                    <ContactInfo 
                        title="General & Support"
                        description="For help with the studio, technical issues, or feature suggestions, please reach out to our support team."
                        email="support@prismatik.studio"
                        icon={<SupportIcon />}
                    />
                     <ContactInfo 
                        title="Press & Media"
                        description="For press inquiries, interviews, or other media-related matters, please contact our communications team."
                        email="press@prismatik.studio"
                        icon={<PressIcon />}
                    />
                     <ContactInfo 
                        title="Business & Partnerships"
                        description="Interested in collaborating or exploring business opportunities? We're always open to new ideas."
                        email="partners@prismatik.studio"
                        icon={<BusinessIcon />}
                    />
                </div>

                {/* Contact Form */}
                <div className="bg-brand-wheat-50 p-8 rounded-lg">
                    <h2 className="text-2xl font-bold text-brand-wheat-900 mb-4">Send us a message</h2>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-brand-wheat-800">Full Name</label>
                            <input type="text" id="name" disabled className="mt-1 w-full px-3 py-2 bg-brand-wheat-100 border border-brand-wheat-200 rounded-md disabled:opacity-70" placeholder="Your Name" />
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-brand-wheat-800">Email Address</label>
                            <input type="email" id="email" disabled className="mt-1 w-full px-3 py-2 bg-brand-wheat-100 border border-brand-wheat-200 rounded-md disabled:opacity-70" placeholder="you@example.com" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-brand-wheat-800">Message</label>
                            <textarea id="message" rows={5} disabled className="mt-1 w-full px-3 py-2 bg-brand-wheat-100 border border-brand-wheat-200 rounded-md disabled:opacity-70 resize-none" placeholder="Your message..."></textarea>
                        </div>
                        <button type="submit" disabled className="w-full bg-brand-teal-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-brand-teal-300 disabled:cursor-not-allowed">
                            Send Message
                        </button>
                        <p className="text-xs text-center text-brand-wheat-600">This form is for demonstration purposes only.</p>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
}