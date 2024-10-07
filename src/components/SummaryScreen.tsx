import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SummaryScreenProps {
  questions: string[];
  responses: any[];
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ questions, responses }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-6">
          <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Interview Summary</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Congratulations on completing your practice interview! Here's a summary of your responses:
        </p>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-2">{question}</h3>
              {responses[index] && (
                <div className="space-y-2">
                  <div className="bg-white p-2 rounded">
                    <h4 className="font-medium text-gray-700 mb-1">Audio Response:</h4>
                    <audio src={responses[index].audioFile} controls className="w-full" />
                  </div>
                  <div className="bg-white p-2 rounded">
                    <h4 className="font-medium text-gray-700 mb-1">Video Response:</h4>
                    <video src={responses[index].videoFile} controls className="w-full h-auto" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-6 text-gray-600">
          Take some time to review your responses. Consider areas where you can improve and practice more to enhance your interview skills!
        </p>
      </div>
    </div>
  );
};

export default SummaryScreen;