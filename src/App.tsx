import React, { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import DeviceSelectionScreen from './components/DeviceSelectionScreen';
import InstructionsScreen from './components/InstructionsScreen';
import InterviewScreen from './components/InterviewScreen';
import SummaryScreen from './components/SummaryScreen';
import { getResponses } from './db';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'deviceSelection' | 'instructions' | 'interview' | 'summary'>('welcome');
  const [selectedDevices, setSelectedDevices] = useState({ videoDeviceId: '', audioDeviceId: '' });
  const [responses, setResponses] = useState<any[]>([]);

  const questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want to work here?",
    "Where do you see yourself in 5 years?"
  ];

  useEffect(() => {
    const loadResponses = async () => {
      const loadedResponses = await getResponses();
      setResponses(loadedResponses);
    };
    loadResponses();
  }, []);

  const handleDeviceSelection = (videoDeviceId: string, audioDeviceId: string) => {
    setSelectedDevices({ videoDeviceId, audioDeviceId });
    setCurrentScreen('instructions');
  };

  const handleStartInterview = () => {
    setCurrentScreen('interview');
  };

  const handleInterviewComplete = (newResponses: any[]) => {
    setResponses(newResponses);
    setCurrentScreen('summary');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Interview Practice</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {currentScreen === 'welcome' && (
              <WelcomeScreen onContinue={() => setCurrentScreen('deviceSelection')} />
            )}
            {currentScreen === 'deviceSelection' && (
              <DeviceSelectionScreen onDevicesSelected={handleDeviceSelection} />
            )}
            {currentScreen === 'instructions' && (
              <InstructionsScreen onStartInterview={handleStartInterview} />
            )}
            {currentScreen === 'interview' && (
              <InterviewScreen
                questions={questions}
                selectedDevices={selectedDevices}
                onInterviewComplete={handleInterviewComplete}
              />
            )}
            {currentScreen === 'summary' && (
              <SummaryScreen questions={questions} responses={responses} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;