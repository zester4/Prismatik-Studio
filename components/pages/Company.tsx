import React, { ReactElement } from 'react';

const CompanyCard = ({ href, title, description, icon }: { href: string, title:string, description: string, icon: ReactElement }) => (
    <a href={href} className="block p-8 bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-16 h-16 flex items-center justify-center mb-6 mx-auto">
            {icon}
        </div>
        <h2 className="text-2xl font-bold text-brand-teal-600">{title}</h2>
        <p className="mt-2 text-brand-wheat-700">{description}</p>
        <span className="mt-6 inline-block font-semibold text-brand-teal-500 group">
            Learn More <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
        </span>
    </a>
);

// Icons
const AboutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BlogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3m-3 4h3" /></svg>;
const ContactIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

export default function Company(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">Our Story</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                    Prismatik Studio was born from a passion for creativity and technology. We believe in empowering creators of all kinds by making cutting-edge AI tools accessible, intuitive, and powerful.
                </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <CompanyCard
                    href="/#/company/about"
                    title="About Us"
                    description="Learn about our mission to democratize creativity and the principles that guide our work."
                    icon={<AboutIcon />}
                />
                <CompanyCard
                    href="/#/company/blog"
                    title="Blog"
                    description="Explore our latest articles, product updates, tutorials, and showcases from the community."
                    icon={<BlogIcon />}
                />
                <CompanyCard
                    href="/#/company/contact"
                    title="Contact"
                    description="Have a question or a proposal? We'd love to hear from you. Get in touch with our team."
                    icon={<ContactIcon />}
                />
            </div>
        </div>
    </div>
  );
}