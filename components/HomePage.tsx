import React, { ReactElement, useRef, useState, useEffect } from 'react';
import Footer from './Footer';

// --- ICONS --- //
const ImageIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);
const VideoIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);
const StoryIco: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);
const LogoIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);
const ArticleIco: React.FC<{className: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const AdIco: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const PencilIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);
const SettingsIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293M17.707 5.293L19 4m-3 13l-2.293 2.293m2.293-2.293L19 18M12 3v4m-2 2h4m-4 7v4m-2-2h4m5-11l2.293-2.293M12 12l2.293 2.293m-2.293-2.293L9.707 9.707m2.293 2.293L14.293 14.293" />
    </svg>
);
const MarketerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
);
const AuthorIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const DeveloperIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
    </svg>
);
const EntrepreneurIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
);
const GeminiLogoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M101.833 55.3333C101.833 30.6667 82.5 11.3333 57.8333 11.3333C33.1667 11.3333 13.8333 30.6667 13.8333 55.3333C13.8333 80 33.1667 99.3333 57.8333 99.3333C65.4167 99.3333 72.5 97.4167 78.5833 94.0833L84.6667 100.167L100.167 84.6667L94.0833 78.5833C99.3333 70.5833 101.833 62.5 101.833 55.3333ZM57.8333 84.6667C41.3333 84.6667 28.5 71.8333 28.5 55.3333C28.5 38.8333 41.3333 26 57.8333 26C74.3333 26 87.1667 38.8333 87.1667 55.3333C87.1667 71.8333 74.3333 84.6667 57.8333 84.6667Z" fill="url(#paint0_linear_1_2)"/>
        <path d="M114.167 84.6667L84.6667 114.167V84.6667H114.167Z" fill="url(#paint1_linear_1_2)"/>
        <defs>
            <linearGradient id="paint0_linear_1_2" x1="57.83" y1="11.33" x2="57.83" y2="99.33" gradientUnits="userSpaceOnUse">
            <stop stopColor="#41a9a1"/>
            <stop offset="1" stopColor="#368e87"/>
            </linearGradient>
            <linearGradient id="paint1_linear_1_2" x1="99.42" y1="84.67" x2="99.42" y2="114.17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ecbf8a"/>
            <stop offset="1" stopColor="#e6a86e"/>
            </linearGradient>
        </defs>
    </svg>
);
const BrainIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 22l-.648-1.437a3.375 3.375 0 00-2.6-2.6L12 17.25l1.438-.648a3.375 3.375 0 002.6-2.6L17 12.75l.648 1.437a3.375 3.375 0 002.6 2.6l1.438.648-1.438.648a3.375 3.375 0 00-2.6 2.6z" />
    </svg>
);
const LayersIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.375 6.375l11.25 11.25m-11.25 0L17.625 6.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const CheckBadgeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

// --- Reusable Components --- //
const AnimatedSection: React.FC<{children: React.ReactNode, className?: string}> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  return <section ref={ref} className={`${className || ''} ${isVisible ? 'is-visible' : 'is-hidden'}`}>{children}</section>;
};

// FIX: Changed icon prop type to ReactElement to allow passing props via React.cloneElement.
const HowItWorksStep: React.FC<{ icon: ReactElement; step: number; title: string; description: string }> = ({ icon, step, title, description }) => (
    <div className="text-center">
        <div className="relative inline-block">
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mb-5 shadow-lg border-4 border-brand-teal-100">
                {React.cloneElement(icon, { className: 'w-10 h-10 text-brand-teal-500' })}
            </div>
            <span className="absolute -top-1 -right-1 bg-brand-teal-500 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center border-4 border-brand-wheat-100 text-lg">{step}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-wheat-900">{title}</h3>
        <p className="text-brand-wheat-700 max-w-xs mx-auto">{description}</p>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-wheat-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-5 text-left gap-4">
                <h4 className="text-lg font-semibold text-brand-wheat-800">{question}</h4>
                <div className="w-6 h-6 flex-shrink-0 bg-brand-wheat-200 rounded-full flex items-center justify-center">
                    <ChevronDownIcon className={`w-4 h-4 text-brand-wheat-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                 <div className="overflow-hidden">
                    <p className="pb-5 text-brand-wheat-700 pr-10">{answer}</p>
                 </div>
            </div>
        </div>
    );
};

const FeatureDetail: React.FC<{
    icon: ReactElement,
    title: string,
    description: string,
    bulletPoints: string[],
    imageUrl: string,
    align: 'left' | 'right'
}> = ({ icon, title, description, bulletPoints, imageUrl, align }) => (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${align === 'right' ? 'lg:grid-flow-col-dense' : ''}`}>
        <div className={` ${align === 'right' ? 'lg:col-start-2' : ''}`}>
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-brand-teal-100 text-brand-teal-500 p-3 rounded-lg">
                    {icon}
                </div>
                <h3 className="text-3xl font-bold text-brand-wheat-900">{title}</h3>
            </div>
            <p className="text-lg text-brand-wheat-700 mb-6">{description}</p>
            <ul className="space-y-3">
                {bulletPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckBadgeIcon className="w-6 h-6 text-brand-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-brand-wheat-800">{point}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="relative">
            <div className="aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img src={imageUrl} alt={`${title} showcase`} className="w-full h-full object-cover" />
            </div>
        </div>
    </div>
);


// --- Main HomePage Component --- //
interface HomePageProps {
    onStartCreating: () => void;
}
export default function HomePage({ onStartCreating }: HomePageProps): ReactElement {
  return (
    <div className="min-h-screen bg-brand-wheat-50 text-brand-wheat-900">
        <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                 <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-teal-500 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 8.5l10 6.5 10-6.5L12 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 8.5l10 6.5V22" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 8.5l-10 6.5V22" />
                    </svg>
                    <h1 className="text-2xl font-bold text-brand-wheat-900">
                        Prismatik <span className="text-brand-teal-500">Studio</span>
                    </h1>
                </div>
                <button onClick={onStartCreating} className="bg-brand-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-teal-600 transition duration-300 shadow-sm hover:shadow-md">
                    Launch Studio
                </button>
            </div>
        </header>

        <main>
            {/* Hero Section */}
            <section className="pt-36 pb-24 text-center bg-brand-wheat-50 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-brand-wheat-900 leading-tight">
                        Your AI Co-pilot for <span className="text-brand-teal-500">Boundless Creation</span>
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-brand-wheat-700">
                        Stop dreaming, start creating. Prismatik Studio is an all-in-one suite of generative AI tools that transforms your simple text prompts into stunning images, videos, stories, articles, logos, and ads.
                    </p>
                    <button onClick={onStartCreating} className="mt-10 bg-brand-teal-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Start Creating for Free
                    </button>
                </div>
                <div className="relative mt-12">
                    <div className="flex justify-center gap-4 sm:gap-6 animate-marquee">
                        <img src="https://images.unsplash.com/photo-1679085226243-85b413c415b3?q=80&w=400&auto=format&fit=crop" className="w-40 h-52 object-cover rounded-xl shadow-lg transform rotate-[-3deg]" alt="showcase 1"/>
                        <img src="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=400&auto=format&fit=crop" className="w-40 h-52 object-cover rounded-xl shadow-lg transform rotate-[2deg] mt-8" alt="showcase 2"/>
                        <img src="https://images.unsplash.com/photo-1629114757912-3499f57f1542?q=80&w=400&auto=format&fit=crop" className="w-40 h-52 object-cover rounded-xl shadow-lg transform rotate-[-5deg]" alt="showcase 3"/>
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop" className="w-40 h-52 object-cover rounded-xl shadow-lg transform rotate-[4deg] mt-4" alt="showcase 4"/>
                        <img src="https://images.unsplash.com/photo-1618355799105-67657b238383?q=80&w=400&auto=format&fit=crop" className="w-40 h-52 object-cover rounded-xl shadow-lg transform rotate-[-2deg] mt-10" alt="showcase 5"/>
                    </div>
                </div>
            </section>
            
            {/* Detailed Features Section */}
            <AnimatedSection className="py-24 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                         <h3 className="text-3xl md:text-5xl font-bold text-brand-wheat-900">One Studio, Infinite Possibilities</h3>
                         <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-600">
                            Each tool in Prismatik Studio is designed to be powerful on its own, but magical when used together. Explore what you can create.
                         </p>
                    </div>
                    <div className="space-y-20">
                        <FeatureDetail
                            icon={<ImageIco className="w-7 h-7" />}
                            title="Image Generator"
                            description="Craft breathtaking visuals for any purpose. Whether you need photorealistic assets, fantasy concept art, or stylish digital illustrations, our Image Generator is your digital canvas."
                            bulletPoints={[
                                "Access multiple state-of-the-art models like Imagen 4.",
                                "Fine-tune with aspect ratios, styles, and negative prompts.",
                                "Generate multiple concepts at once to find the perfect shot."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1664420339932-51786933a11f?q=80&w=800&auto=format&fit=crop"
                            align="left"
                        />
                        <FeatureDetail
                            icon={<VideoIco className="w-7 h-7" />}
                            title="Video Generator"
                            description="Transform static ideas into dynamic motion. Generate short video clips from a simple text prompt or bring your existing images to life with subtle, captivating animation."
                            bulletPoints={[
                                "Powered by the cutting-edge Veo model for cinematic quality.",
                                "Create videos from text or animate your own images.",
                                "Perfect for social media, presentations, or ad campaigns."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1574717547372-5341499557ce?q=80&w=800&auto=format&fit=crop"
                            align="right"
                        />
                        <FeatureDetail
                            icon={<StoryIco className="w-7 h-7" />}
                            title="Story Generator"
                            description="Overcome writer's block and visualize your narrative like never before. Develop a story idea, and our AI will write it scene by scene, complete with unique illustrations for each part."
                            bulletPoints={[
                                "Generate multi-scene stories with accompanying images.",
                                "Lock in a character's appearance for visual consistency.",
                                "Edit text and regenerate images to perfect your tale."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop"
                            align="left"
                        />
                        <FeatureDetail
                            icon={<ArticleIco className="w-7 h-7" />}
                            title="Article Generator"
                            description="From blog posts to in-depth reports, generate well-structured, coherent articles on any topic. The AI assists with structure, writing, and even suggests relevant imagery."
                            bulletPoints={[
                                "Specify article type, writing style, and number of images.",
                                "AI-powered proofreading to correct grammar and spelling.",
                                "Context-aware image generation creates relevant visuals."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop"
                            align="right"
                        />
                        <FeatureDetail
                            icon={<LogoIco className="w-7 h-7" />}
                            title="Logo Generator"
                            description="Need a professional logo, fast? Describe your brand, choose a style and color palette, and receive multiple high-quality, text-free logo concepts in seconds."
                            bulletPoints={[
                                "Based on detailed brand descriptions, not just keywords.",
                                "Explore various styles from minimalist to vintage.",
                                "Receive clean, vector-style concepts on a white background."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1607237138337-581bedac452c?q=80&w=800&auto=format&fit=crop"
                            align="left"
                        />
                        <FeatureDetail
                            icon={<AdIco className="w-7 h-7" />}
                            title="Ad Creator"
                            description="Launch your next campaign with ease. The Ad Creator generates persuasive copy (headline, body, CTA) and a stunning visual (image or video) tailored to your product and audience."
                            bulletPoints={[
                                "Generates both ad copy and media in one seamless workflow.",
                                "Choose a tone of voice, from professional to humorous.",
                                "Upload your own product shot or have the AI create one."
                            ]}
                            imageUrl="https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=800&auto=format&fit=crop"
                            align="right"
                        />
                    </div>
                </div>
            </AnimatedSection>

            {/* Use Cases Section */}
            <AnimatedSection className="py-24 bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl md:text-5xl font-bold text-brand-wheat-900">Designed for Every Creator</h3>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-600">
                           Whether you're a professional team or a solo creator with a big idea, Prismatik Studio is built to amplify your efforts.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <PersonaCard icon={<MarketerIcon />} title="The Marketer" description="Rapidly generate A/B test variants for ad campaigns, create eye-catching social media content, and draft copy that converts, all in a fraction of the time." />
                        <PersonaCard icon={<AuthorIcon />} title="The Author" description="Break through writer's block by visualizing scenes, develop character concepts with the image generator, and illustrate entire chapters with the story tool." />
                        <PersonaCard icon={<DeveloperIcon />} title="The Indie Developer" description="Create stunning concept art, generate in-game assets, design unique logos for your projects, and produce promotional materials without an art team." />
                        <PersonaCard icon={<EntrepreneurIcon />} title="The Small Business Owner" description="Design a professional brand identity, create marketing materials for your products, and produce engaging ads for social media, all without a big budget." />
                    </div>
                </div>
            </AnimatedSection>
            
             {/* Technology Section */}
            <AnimatedSection className="py-24 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                             <GeminiLogoIcon className="w-24 h-24 mx-auto md:mx-0" />
                             <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900 mt-4">Powered by Google Gemini</h3>
                             <p className="mt-4 text-lg text-brand-wheat-700">
                                Prismatik Studio sits on the shoulders of giants. We harness the full power of Google's state-of-the-art Gemini family of models, including Imagen and Veo, to deliver unparalleled quality, speed, and creative potential directly to your fingertips.
                             </p>
                        </div>
                        <div className="space-y-6">
                            <TechBenefitCard icon={<SparklesIcon/>} title="Unmatched Quality" description="Generate visuals and text with incredible detail, coherence, and realism."/>
                            <TechBenefitCard icon={<BrainIcon/>} title="Multi-Modal Understanding" description="Go beyond text. The models understand images, enabling features like Character Lock and animating your photos."/>
                            <TechBenefitCard icon={<LayersIcon/>} title="Versatility at Scale" description="From a single image to a full-length article, the models are optimized for a massive range of creative tasks."/>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* How It Works Section */}
            <AnimatedSection className="py-24 bg-brand-wheat-50">
                 <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                         <h3 className="text-3xl md:text-5xl font-bold text-brand-wheat-900">Your Idea, Supercharged</h3>
                         <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-600">
                            Our intuitive workflow makes it easy to go from concept to creation in minutes.
                         </p>
                    </div>
                    <div className="relative">
                        <div className="absolute top-10 left-0 w-full h-1 bg-brand-wheat-200 hidden md:block" aria-hidden="true"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
                            <HowItWorksStep icon={<PencilIcon />} step={1} title="Describe Your Vision" description="Start with a thought. Write a detailed prompt describing exactly what you want to create." />
                            <HowItWorksStep icon={<SettingsIcon />} step={2} title="Customize & Refine" description="Choose your model, style, and format. Fine-tune the parameters to match your creative intent." />
                            <HowItWorksStep icon={<SparklesIcon />} step={3} title="Generate & Iterate" description="Witness the AI bring your idea to life. Download, edit, or use your result as inspiration for the next version." />
                        </div>
                    </div>
                 </div>
            </AnimatedSection>
            
            {/* FAQ Section */}
            <AnimatedSection className="py-24 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-5xl font-bold text-brand-wheat-900">Questions? We Have Answers.</h3>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <FaqItem
                            question="What is Prismatik Studio?"
                            answer="It's a web-based creative suite that uses Google's Gemini AI to help you generate content. Think of it as a user-friendly interface that gives you access to incredibly powerful AI models for creating images, videos, stories, and more, all from one place."
                        />
                        <FaqItem
                            question="How do I get an API key?"
                            answer="You'll need a Google Gemini API key to use the studio. You can get one for free from Google AI Studio. The app will use this key to make requests to the AI models on your behalf."
                        />
                        <FaqItem
                            question="Can I use the generated content commercially?"
                            answer="Content you create is subject to Google's Gemini API terms of service. Generally, you own the assets you create, but it is your responsibility to ensure your use case complies with Google's policies and does not violate any copyrights."
                        />
                        <FaqItem
                            question="Is my data and my creations private?"
                            answer="Prismatik Studio is designed with privacy in mind. Your API key and creations are stored in your browser's local storage and are never sent to our servers. All AI processing is handled directly between your browser and the Google Gemini API."
                        />
                        <FaqItem
                            question="What makes this different from other AI tools?"
                            answer="Our focus is on providing an integrated, multi-tool workflow. Instead of jumping between different apps for images, text, and video, you can do it all here. Features like Character Lock in the Story Generator are examples of how we leverage the tools working together."
                        />
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Final CTA */}
            <AnimatedSection className="bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6 py-24 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 leading-tight">
                        Ready to Build the Impossible?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                        The canvas is blank. The tools are ready. Your next masterpiece is just a prompt away.
                    </p>
                    <button onClick={onStartCreating} className="mt-8 bg-brand-teal-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Enter the Studio
                    </button>
                </div>
            </AnimatedSection>
        </main>
        
        <Footer />
    </div>
  );
}

// FIX: Changed icon prop type to ReactElement to allow passing props via React.cloneElement.
const PersonaCard: React.FC<{ icon: ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-16 h-16 flex items-center justify-center mb-4 mx-auto">
            {React.cloneElement(icon, { className: 'w-8 h-8' })}
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-wheat-900">{title}</h3>
        <p className="text-brand-wheat-700">{description}</p>
    </div>
);

const TechBenefitCard: React.FC<{ icon: ReactElement; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="bg-brand-teal-100 text-brand-teal-500 p-3 rounded-lg mt-1">
             {React.cloneElement(icon, { className: 'w-6 h-6' })}
        </div>
        <div>
            <h4 className="font-bold text-xl text-brand-wheat-800">{title}</h4>
            <p className="text-md text-brand-wheat-600 mt-1">{description}</p>
        </div>
    </div>
);