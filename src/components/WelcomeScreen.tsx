import React from 'react';
import { ArrowRightCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to AI-Powered Interview Practice</h2>
        <p className="text-gray-600 mb-4">
          This app will guide you through a simulated interview experience. Here's what to expect:
        </p>
        <ul className="list-disc list-inside mb-6 text-gray-600">
          <li>You'll be asked to select your camera and microphone.</li>
          <li>You'll receive instructions on how the interview will proceed.</li>
          <li>You'll answer a series of interview questions.</li>
          <li>Your responses will be recorded for review.</li>
          <li>At the end, you'll see a summary of your interview.</li>
        </ul>
        <p className="text-gray-600 mb-6">
          This practice session will help you improve your interview skills in a safe, AI-powered environment.
        </p>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={onContinue}
        >
          Continue to Device Selection
          <ArrowRightCircle className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;