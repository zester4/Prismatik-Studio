import React, { ReactElement, PropsWithChildren } from 'react';

interface TooltipProps {
  text: string;
}

export default function Tooltip({ text, children }: PropsWithChildren<TooltipProps>): ReactElement {
  return (
    <div className="relative flex items-center group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-brand-wheat-900 text-white text-xs rounded-md py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 shadow-lg">
        {text}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-wheat-900"></div>
      </div>
    </div>
  );
}
