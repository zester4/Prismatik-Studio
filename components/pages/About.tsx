import React, { ReactElement } from 'react';

const PrincipleCard = ({ title, description, icon }: { title: string, description: string, icon: ReactElement }) => (
    <div className="text-center">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-16 h-16 flex items-center justify-center mb-4 mx-auto">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-brand-wheat-900">{title}</h3>
        <p className="mt-2 text-brand-wheat-700">{description}</p>
    </div>
);

// Icons
const QualityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L19 4m-3 13l-2.293 2.293m2.293-2.293L19 18M12 3v4m-2 2h4m-4 7v4m-2-2h4m5-11l2.293-2.293M12 12l2.293 2.293m-2.293-2.293L9.707 9.707m2.293 2.293L14.293 14.293" /></svg>;
const PrivacyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const UxIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function About(): ReactElement {
  return (
    <div className="bg-white">
        {/* Hero Section */}
        <div className="bg-brand-wheat-50">
            <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">Our Mission: To Democratize Creativity</h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-700">
                    We believe that everyone has a story to tell, an idea to visualize, and a vision to share. Our mission is to break down the technical and financial barriers to creative expression by building intuitive, powerful, and accessible AI tools for all.
                </p>
            </div>
        </div>

        {/* Why Prismatik Section */}
        <div className="container mx-auto px-4 sm:px-6 py-24">
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative">
                    <img src="https://images.unsplash.com/photo-1554702526-65e04c4501a1?q=80&w=800&auto=format&fit=crop" alt="Team collaborating" className="rounded-xl shadow-lg w-full h-full object-cover" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-brand-wheat-900">Why Prismatik Studio?</h2>
                    <p className="mt-4 text-brand-wheat-700">Prismatik Studio started as a simple idea: what if you could have a single, unified interface to access the world's most advanced generative models? Instead of juggling multiple subscriptions and learning different workflows, we wanted to create a seamless environment where your creativity can flow uninterrupted.</p>
                    <p className="mt-4 text-brand-wheat-700">We are not building the AI models themselves; we are standing on the shoulders of giants like Google. Our focus is on crafting the best possible user experience, creating innovative workflows (like Character Lock in our Story Generator), and ensuring that your privacy is always protected.</p>
                </div>
             </div>
        </div>
        
        {/* Principles Section */}
        <div className="bg-brand-wheat-50">
            <div className="container mx-auto px-4 sm:px-6 py-24">
                 <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-brand-wheat-900">Our Guiding Principles</h2>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <PrincipleCard 
                        icon={<QualityIcon />}
                        title="Uncompromising Quality"
                        description="We integrate only the most capable and state-of-the-art AI models to ensure your creations are of the highest possible quality."
                    />
                     <PrincipleCard 
                        icon={<PrivacyIcon />}
                        title="Privacy First"
                        description="Your API key and your creations are your own. We never see or store your data. Everything runs securely in your browser."
                    />
                     <PrincipleCard 
                        icon={<UxIcon />}
                        title="Intuitive by Design"
                        description="We believe powerful tools don't have to be complicated. Our interface is designed to be clean, intuitive, and easy to use for everyone."
                    />
                 </div>
            </div>
        </div>
    </div>
  );
}