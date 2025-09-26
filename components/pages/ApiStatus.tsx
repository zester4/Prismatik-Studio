import React, { ReactElement } from 'react';

const StatusIndicator = ({ status }: { status: 'operational' | 'degraded' | 'outage' }) => {
    const statusMap = {
        operational: {
            text: 'Operational',
            color: 'bg-green-500',
        },
        degraded: {
            text: 'Degraded Performance',
            color: 'bg-yellow-500',
        },
        outage: {
            text: 'Major Outage',
            color: 'bg-red-500',
        },
    };
    const { text, color } = statusMap[status];

    return (
        <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
            <span className={`font-semibold ${status === 'operational' ? 'text-green-600' : status === 'degraded' ? 'text-yellow-600' : 'text-red-600'}`}>{text}</span>
        </div>
    );
};

const ServiceStatus = ({ name, status }: { name: string, status: 'operational' | 'degraded' | 'outage' }) => (
    <div className="flex justify-between items-center p-4 bg-brand-wheat-50 rounded-lg">
        <p className="text-lg font-medium text-brand-wheat-800">{name}</p>
        <StatusIndicator status={status} />
    </div>
);

const Incident = ({ title, date, resolution }: { title: string, date: string, resolution: string }) => (
    <div>
        <h4 className="font-bold text-brand-wheat-800">{title}</h4>
        <p className="text-sm text-brand-wheat-600 mt-1">{date}</p>
        <p className="mt-2 text-sm text-green-700 bg-green-50 p-2 rounded-md"><span className="font-semibold">Resolved:</span> {resolution}</p>
    </div>
);

export default function ApiStatus(): ReactElement {
  return (
    <div className="bg-white min-h-[calc(100vh-160px)]">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900 text-center">API Status</h1>
                <p className="mt-4 text-center text-brand-wheat-700">This page provides real-time status updates for the Google AI services that power Prismatik Studio. All times are in UTC.</p>

                <div className="mt-8 p-6 bg-green-100 text-green-800 rounded-lg text-center">
                    <h2 className="text-2xl font-bold">All Systems Operational</h2>
                </div>

                <div className="mt-12 space-y-4">
                    <ServiceStatus name="Image Generation API (Imagen & Gemini)" status="operational" />
                    <ServiceStatus name="Video Generation API (Veo)" status="operational" />
                    <ServiceStatus name="Text & Story Generation API (Gemini)" status="operational" />
                    <ServiceStatus name="Prismatik Studio Interface" status="operational" />
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-brand-wheat-900 mb-4 pb-2 border-b-2 border-brand-wheat-200">Incident History</h3>
                    <div className="space-y-6">
                         <Incident 
                            title="Delayed Video Processing"
                            date="November 5, 2023, 08:15-09:00 UTC"
                            resolution="We experienced a backlog in the video generation queue, causing longer than usual processing times. The issue has been resolved and all systems are back to normal."
                        />
                        <Incident 
                            title="Brief latency in Image Generation"
                            date="October 25, 2023, 14:30-14:45 UTC"
                            resolution="The issue was identified and a fix was implemented. Service performance has returned to normal."
                        />
                         <p className="text-center text-brand-wheat-500 pt-4">No other recent incidents to report.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
