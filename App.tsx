import React, { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
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
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/studio" element={<Studio />} />

            {/* Solutions Pages */}
            <Route path="/solutions" element={<Layout><Solutions /></Layout>} />
            <Route path="/solutions/marketing" element={<Layout><Marketing /></Layout>} />
            <Route path="/solutions/content-creation" element={<Layout><ContentCreation /></Layout>} />
            <Route path="/solutions/design" element={<Layout><Design /></Layout>} />
            <Route path="/solutions/development" element={<Layout><Development /></Layout>} />

            {/* Support Pages */}
            <Route path="/support" element={<Layout><Support /></Layout>} />
            <Route path="/support/faq" element={<Layout><FAQ /></Layout>} />
            <Route path="/support/documentation" element={<Layout><Documentation /></Layout>} />
            <Route path="/support/api-status" element={<Layout><ApiStatus /></Layout>} />

            {/* Company Pages */}
            <Route path="/company" element={<Layout><Company /></Layout>} />
            <Route path="/company/about" element={<Layout><About /></Layout>} />
            <Route path="/company/blog" element={<Layout><Blog /></Layout>} />
            <Route path="/company/contact" element={<Layout><Contact /></Layout>} />

            {/* Catch-all Not Found Page */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
    );
}