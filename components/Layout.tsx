import React, { PropsWithChildren, ReactElement } from 'react';
import SimpleHeader from './SimpleHeader';
import Footer from './Footer';

export default function Layout({ children }: PropsWithChildren<{}>): ReactElement {
  return (
    <div className="min-h-screen bg-brand-wheat-50 text-brand-wheat-900 flex flex-col">
      <SimpleHeader />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
