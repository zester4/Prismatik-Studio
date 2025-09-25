import React, { ReactElement, useRef, useState, useEffect } from 'react';

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
const LightbulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.25H10.5a6.01 6.01 0 001.5 11.25v.25a2.25 2.25 0 11-4.5 0v-.25a6.01 6.01 0 001.5-11.25H6.75a6.01 6.01 0 001.5 11.25v.25a2.25 2.25 0 11-4.5 0v-.25a6.01 6.01 0 001.5-11.25H12M12 18h.01M12 18v.01" />
    </svg>
);
const PaletteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 011.622-3.385m5.043.025a15.998 15.998 0 001.622-3.385m3.388 1.62a15.998 15.998 0 00-1.622-3.385m-5.043.025a15.998 15.998 0 01-3.388-1.622m7.732 0a15.998 15.998 0 00-3.388-1.622m-5.043.025a15.998 15.998 0 01-1.622-3.385m5.043.025a15.998 15.998 0 00-1.622-3.385m-3.388 1.62a15.998 15.998 0 00-1.622-3.385" />
    </svg>
);
const MinusCircleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const ArrowPathIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.18-3.185m-3.181 9.995l-3.182-3.182a8.25 8.25 0 0111.664 0l3.18 3.185" />
    </svg>
);

// New Icons for Added Sections
const MarketerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 13.5H10.5" />
    </svg>
);
const ArtistIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 21v-4.5a.75.75 0 00-.75-.75H4.5A2.25 2.25 0 012.25 13.5V5.25A2.25 2.25 0 014.5 3h15A2.25 2.25 0 0121.75 5.25v8.25A2.25 2.25 0 0119.5 15.75h-3.75a.75.75 0 00-.75.75v4.5m0-13.5h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008zm-3 0h.008v.008h-.008v-.008z" />
    </svg>
);
const WriterIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);
const EntrepreneurIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519 22.5 22.5 0 01-5.814 5.519L9 18.75l-6.75-6.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z" />
    </svg>
);
const QuoteIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 16 16">
        <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 9 7.558V11a1 1 0 0 0 1 1h2Zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612c0-.351.021-.703.062-1.054.062-.372.166-.703.31-.992.145-.29.331-.517.559-.683.227-.186.516-.279.868-.279V3c-.579 0-1.085.124-1.52.372a3.322 3.322 0 0 0-1.085.992 4.92 4.92 0 0 0-.62 1.458A7.712 7.712 0 0 0 3 7.558V11a1 1 0 0 0 1 1h2Z"/>
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section ref={ref} className={`${className || ''} ${isVisible ? 'is-visible' : 'is-hidden'}`}>
      {children}
    </section>
  );
};


interface FeatureCardProps {
    icon: ReactElement<{ className?: string }>;
    title: string;
    description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="bg-brand-teal-100 text-brand-teal-500 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
            {React.cloneElement(icon, { className: 'w-7 h-7' })}
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-wheat-900">{title}</h3>
        <p className="text-brand-wheat-700">{description}</p>
    </div>
);

const HowItWorksStep: React.FC<{ icon: ReactElement<{ className?: string }>; step: number; title: string; description: string }> = ({ icon, step, title, description }) => (
    <div className="text-center">
        <div className="relative inline-block">
            <div className="bg-white rounded-lg w-16 h-16 flex items-center justify-center mb-4 shadow-md">
                {React.cloneElement(icon, { className: 'w-8 h-8 text-brand-teal-500' })}
            </div>
            <span className="absolute -top-2 -left-2 bg-brand-teal-500 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center border-4 border-brand-wheat-100">{step}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-brand-wheat-900">{title}</h3>
        <p className="text-brand-wheat-700 max-w-xs mx-auto">{description}</p>
    </div>
);

const QuickStartCard: React.FC<{ icon: ReactElement<{ className?: string }>; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-brand-wheat-50 p-6 rounded-lg border border-brand-wheat-200">
        <div className="flex items-start gap-4">
            <div className="text-brand-teal-500 mt-1">
                {React.cloneElement(icon, { className: 'w-6 h-6' })}
            </div>
            <div>
                <h4 className="font-bold text-brand-wheat-800">{title}</h4>
                <p className="text-sm text-brand-wheat-600 mt-1">{description}</p>
            </div>
        </div>
    </div>
);

const ShowcaseCard: React.FC<{ imageUrl: string; title: string; prompt: string }> = ({ imageUrl, title, prompt }) => (
    <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white">
            <h4 className="text-xl font-bold">{title}</h4>
            <p className="text-sm opacity-80 mt-1 italic">"{prompt}"</p>
        </div>
    </div>
);

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-brand-wheat-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-5 text-left"
            >
                <h4 className="text-lg font-semibold text-brand-wheat-800">{question}</h4>
                <ChevronDownIcon className={`w-5 h-5 text-brand-wheat-600 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                 <div className="overflow-hidden">
                    <p className="pb-5 text-brand-wheat-700">{answer}</p>
                 </div>
            </div>
        </div>
    );
};


// --- Main HomePage Component --- //
interface HomePageProps {
    onStartCreating: () => void;
}
export default function HomePage({ onStartCreating }: HomePageProps): ReactElement {
  return (
    <div className="min-h-screen bg-brand-wheat-50 text-brand-wheat-900">
        <header className="bg-white/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-10 shadow-sm">
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
                    Start Creating
                </button>
            </div>
        </header>

        <main>
            {/* Hero Section */}
            <section className="pt-32 pb-20 text-center bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <h2 className="text-4xl md:text-6xl font-extrabold text-brand-wheat-900 leading-tight">
                        Unleash Your Creativity with <span className="text-brand-teal-500">AI</span>
                    </h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-brand-wheat-700">
                        Generate stunning images, captivating videos, immersive stories, and unique logos from simple text prompts. Welcome to the future of creation.
                    </p>
                    <button onClick={onStartCreating} className="mt-8 bg-brand-teal-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
                        Get Started for Free
                    </button>
                </div>
            </section>
            
            {/* Features Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                         <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Your All-in-One Creative Suite</h3>
                         <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                            From a single idea to a finished masterpiece, our suite of AI tools has you covered.
                         </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<ImageIco className="w-full h-full" />} title="Image Generation" description="Craft photorealistic images, digital art, and more in any style imaginable." />
                        <FeatureCard icon={<VideoIco className="w-full h-full" />} title="Video Generation" description="Bring your ideas to life with dynamic, high-quality videos from text or images." />
                        <FeatureCard icon={<StoryIco className="w-full h-full" />} title="Story Generation" description="Weave compelling narratives and visualize them with AI-generated scene illustrations." />
                         <FeatureCard icon={<LogoIco className="w-full h-full" />} title="Logo Design" description="Instantly create professional, unique logos for your brand or project." />
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Showcase Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">From Imagination to Reality</h3>
                        <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                            See what's possible with the power of Prismatik Studio.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-[500px]">
                        <div className="lg:col-span-2 lg:row-span-2">
                             <ShowcaseCard imageUrl="https://images.unsplash.com/photo-1679085226243-85b413c415b3?q=80&w=800&auto=format&fit=crop" title="Sci-Fi Character" prompt="A photorealistic robot warrior..." />
                        </div>
                        <ShowcaseCard imageUrl="https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=800&auto=format&fit=crop" title="Story Illustration" prompt="A magical library with floating books..." />
                        <ShowcaseCard imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" title="Minimalist Logo" prompt="A geometric logo for a tech company..." />
                        <div className="sm:col-span-2">
                             <ShowcaseCard imageUrl="https://images.unsplash.com/photo-1629114757912-3499f57f1542?q=80&w=800&auto=format&fit=crop" title="Cinematic Video" prompt="Drone shot of a misty forest at dawn..." />
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* How It Works Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-100">
                 <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                         <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Create in Three Simple Steps</h3>
                         <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                            Our intuitive interface makes it easy to bring your ideas to life.
                         </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <HowItWorksStep icon={<PencilIcon />} step={1} title="Describe Your Vision" description="Write a detailed prompt describing your idea. The more specific you are, the better the result!" />
                        <HowItWorksStep icon={<SettingsIcon />} step={2} title="Customize Options" description="Select your preferred model, style, aspect ratio, and other settings to fine-tune your creation." />
                        <HowItWorksStep icon={<SparklesIcon />} step={3} title="Generate & Refine" description="Click generate! Watch the AI work its magic, then download or refine your masterpiece." />
                    </div>
                 </div>
            </AnimatedSection>

            {/* Use Cases Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Creativity for Everyone</h3>
                        <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                           Whether you're a professional or a hobbyist, our tools empower you to create amazing content.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard icon={<MarketerIcon />} title="For Marketers" description="Generate stunning ad visuals, write compelling copy, and create promotional videos in minutes." />
                        <FeatureCard icon={<ArtistIcon />} title="For Artists" description="Break creative blocks, explore new styles, and rapidly prototype ideas for concept art and designs." />
                        <FeatureCard icon={<WriterIcon />} title="For Writers" description="Craft engaging narratives, develop characters, and instantly visualize your scenes to overcome writer's block." />
                        <FeatureCard icon={<EntrepreneurIcon />} title="For Entrepreneurs" description="Design professional logos, create marketing materials, and produce product ads without a big budget." />
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Testimonials Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                         <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Loved by Creators Worldwide</h3>
                         <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                            Don't just take our word for it. Here's what people are saying about Prismatik Studio.
                         </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <QuoteIcon className="w-8 h-8 text-brand-teal-200 mb-4" />
                            <p className="text-brand-wheat-700 mb-6 italic">"This has revolutionized our workflow. We can now produce high-quality ad campaigns in a fraction of the time. It's an indispensable tool for our team."</p>
                            <p className="font-bold text-brand-wheat-900">Sarah L.</p>
                            <p className="text-sm text-brand-wheat-600">Marketing Manager</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg md:transform md:scale-105">
                            <QuoteIcon className="w-8 h-8 text-brand-teal-200 mb-4" />
                            <p className="text-brand-wheat-700 mb-6 italic">"As a solo developer, I don't have the budget for a dedicated artist. This tool lets me generate incredible concept art and assets. It's like having an art department on call."</p>
                            <p className="font-bold text-brand-wheat-900">Marco B.</p>
                            <p className="text-sm text-brand-wheat-600">Indie Game Developer</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-lg">
                            <QuoteIcon className="w-8 h-8 text-brand-teal-200 mb-4" />
                            <p className="text-brand-wheat-700 mb-6 italic">"The story generator is pure magic. Seeing my characters and scenes come to life has been incredibly inspiring and has helped me overcome writer's block more than once."</p>
                            <p className="font-bold text-brand-wheat-900">Jasmine K.</p>
                            <p className="text-sm text-brand-wheat-600">Author</p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>

             {/* Quick Start Guide Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Quick Start Guide</h3>
                        <p className="mt-3 max-w-2xl mx-auto text-md text-brand-wheat-600">
                            A few tips to help you get incredible results, faster.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <QuickStartCard 
                            icon={<LightbulbIcon />} 
                            title="Be Descriptive & Specific" 
                            description="Instead of 'a dog', try 'a fluffy golden retriever puppy playing in a field of daisies during a golden sunset'."
                        />
                        <QuickStartCard 
                            icon={<PaletteIcon />} 
                            title="Experiment with Styles" 
                            description="Combine your subject with an art style. For example, add 'in the style of watercolor' or 'cinematic lighting'."
                        />
                        <QuickStartCard 
                            icon={<MinusCircleIcon />} 
                            title="Use Negative Prompts" 
                            description="For models that support it, use the negative prompt to exclude things you don't want, like 'blurry, text, watermark'."
                        />
                        <QuickStartCard 
                            icon={<ArrowPathIcon />} 
                            title="Iterate and Refine" 
                            description="Your first result might not be perfect. Use it as inspiration and adjust your prompt to get closer to your vision."
                        />
                    </div>
                </div>
            </AnimatedSection>

            {/* FAQ Section */}
            <AnimatedSection className="py-20 bg-brand-wheat-100">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold text-brand-wheat-900">Frequently Asked Questions</h3>
                    </div>
                    <div className="max-w-3xl mx-auto">
                        <FaqItem
                            question="What models does Prismatik Studio use?"
                            answer="We leverage Google's powerful family of Gemini models, including Imagen for images and Veo for video, to provide state-of-the-art results."
                        />
                        <FaqItem
                            question="Is it free to use?"
                            answer="Yes, the basic features of Prismatik Studio are available for free. We operate based on the free tier of the Gemini API. Please be mindful of your own API key usage limits."
                        />
                        <FaqItem
                            question="What kind of content can I create?"
                            answer="You can generate a wide range of content, including digital art, photorealistic images, short videos, multi-scene illustrated stories, brand logos, and complete advertisements."
                        />
                        <FaqItem
                            question="Can I use the generated content commercially?"
                            answer="Please refer to the terms of service for the Google Gemini API. Generally, you own the content you create, but it's important to understand the usage rights and restrictions of the underlying models."
                        />
                    </div>
                </div>
            </AnimatedSection>
            
            {/* Final CTA */}
            <AnimatedSection className="bg-brand-wheat-50">
                <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-brand-wheat-900 leading-tight">
                        Ready to Create Something Amazing?
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                        Join thousands of creators and bring your most ambitious ideas to life today.
                    </p>
                    <button onClick={onStartCreating} className="mt-8 bg-brand-teal-500 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-brand-teal-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Enter the Studio
                    </button>
                </div>
            </AnimatedSection>

        </main>
        
        <footer className="text-center py-8 bg-brand-wheat-200 text-brand-wheat-700 text-sm">
            <p>Powered by Google Gemini. Designed with passion.</p>
        </footer>
    </div>
  );
}