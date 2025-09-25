import React, { useState, useEffect, ReactElement } from 'react';
import Studio from './components/Studio';
import HomePage from './components/HomePage';
import Layout from './components/Layout';
import Solutions from './components/pages/Solutions';
import Marketing from './components/pages/Marketing';
import ContentCreation from './components/pages/ContentCreation';
import Design from './components/pages/Design';
import Development from './components/pages/Development';
import Support from './components/pages/Support';
import FAQ from './components/pages/FAQ';
import Documentation from './components/pages/Documentation';
import ApiStatus from './components/pages/ApiStatus';
import Company from './components/pages/Company';
import About from './components/pages/About';
import Blog from './components/pages/Blog';
import Contact from './components/pages/Contact';
import NotFound from './components/pages/NotFound';

export default function App(): ReactElement {
    const [route, setRoute] = useState(window.location.hash.substring(1) || '/');

    useEffect(() => {
        const handleHashChange = () => {
            setRoute(window.location.hash.substring(1) || '/');
            window.scrollTo(0, 0); // Scroll to top on page change
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const renderContent = () => {
        const path = route.split('?')[0];

        switch (path) {
            case '/':
                return <HomePage />;
            case '/studio':
                return <Studio />;
            
            // Solutions Pages
            case '/solutions':
                return <Layout><Solutions /></Layout>;
            case '/solutions/marketing':
                return <Layout><Marketing /></Layout>;
            case '/solutions/content-creation':
                return <Layout><ContentCreation /></Layout>;
            case '/solutions/design':
                return <Layout><Design /></Layout>;
            case '/solutions/development':
                return <Layout><Development /></Layout>;
            
            // Support Pages
            case '/support':
                return <Layout><Support /></Layout>;
            case '/support/faq':
                return <Layout><FAQ /></Layout>;
            case '/support/documentation':
                return <Layout><Documentation /></Layout>;
            case '/support/api-status':
                return <Layout><ApiStatus /></Layout>;

            // Company Pages
            case '/company':
                return <Layout><Company /></Layout>;
            case '/company/about':
                return <Layout><About /></Layout>;
            case '/company/blog':
                return <Layout><Blog /></Layout>;
            case '/company/contact':
                return <Layout><Contact /></Layout>;
                
            default:
                return <Layout><NotFound /></Layout>;
        }
    };

    return renderContent();
}
