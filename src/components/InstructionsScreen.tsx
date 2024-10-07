import React from 'react';
import { Play } from 'lucide-react';

interface InstructionsScreenProps {
  onStartInterview: () => void;
}

const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onStartInterview }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interview Instructions</h2>
        <ul className="list-disc list-inside mb-6 text-gray-600 space-y-2">
          <li>You will be asked a series of interview questions.</li>
          <li>Your video and audio will be recorded for each answer.</li>
          <li>Speak clearly and maintain good posture during the interview.</li>
          <li>Take your time to think before answering each question.</li>
          <li>Once you've finished answering a question, click "Next Question".</li>
          <li>You can't go back to previous questions, so answer thoroughly.</li>
          <li>At the end, you'll see a summary of your interview responses.</li>
        </ul>
        <p className="text-gray-600 mb-6">
          Remember, this is a practice session to help you improve. Relax, be yourself, and do your best!
        </p>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={onStartInterview}
        >
          Start Interview
          <Play className="ml-2 -mr-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InstructionsScreen;