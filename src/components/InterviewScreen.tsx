import React, { useState, useEffect, useRef } from 'react';
import { saveResponse } from '../db';
import Timer from './Timer';
import { ArrowRight } from 'lucide-react';

interface InterviewScreenProps {
  questions: string[];
  selectedDevices: { videoDeviceId: string; audioDeviceId: string };
  onInterviewComplete: (responses: any[]) => void;
}

const InterviewScreen: React.FC<InterviewScreenProps> = ({ questions, selectedDevices, onInterviewComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedVideoChunks, setRecordedVideoChunks] = useState<Blob[]>([]);
  const [recordedAudioChunks, setRecordedAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    startRecording();
  }, [currentQuestionIndex]);

  const startRecording = async () => {
    setRecordedVideoChunks([]);
    setRecordedAudioChunks([]);
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevices.videoDeviceId },
        audio: false
      });
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevices.audioDeviceId }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }

      mediaRecorderRef.current = new MediaRecorder(videoStream);
      audioRecorderRef.current = new MediaRecorder(audioStream);

      mediaRecorderRef.current.ondataavailable = handleVideoDataAvailable;
      audioRecorderRef.current.ondataavailable = handleAudioDataAvailable;

      mediaRecorderRef.current.start();
      audioRecorderRef.current.start();

      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const handleVideoDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedVideoChunks((prev) => prev.concat(event.data));
    }
  };

  const handleAudioDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedAudioChunks((prev) => prev.concat(event.data));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleNextQuestion = async () => {
    stopRecording();

    const videoBlob = new Blob(recordedVideoChunks, { type: 'video/webm' });
    const audioBlob = new Blob(recordedAudioChunks, { type: 'audio/webm' });
    const videoFile = URL.createObjectURL(videoBlob);
    const audioFile = URL.createObjectURL(audioBlob);

    await saveResponse(
      questions[currentQuestionIndex],
      "", // We're not using text responses in this version
      audioFile,
      videoFile
    );

    const updatedResponses = [...responses, {
      question: questions[currentQuestionIndex],
      audioFile,
      videoFile
    }];

    setResponses(updatedResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onInterviewComplete(updatedResponses);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Interview in Progress</h2>
          <Timer isRunning={isRecording} />
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Question {currentQuestionIndex + 1} of {questions.length}</h3>
          <p className="text-xl text-gray-700">{questions[currentQuestionIndex]}</p>
        </div>
        <div className="flex justify-between items-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleNextQuestion}
          >
            Next Question
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </button>
          <div className="w-1/4">
            <video ref={videoRef} autoPlay muted className="w-full h-auto rounded-lg shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;