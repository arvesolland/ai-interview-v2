import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, ArrowRightCircle } from 'lucide-react';

interface DeviceSelectionScreenProps {
  onDevicesSelected: (videoDeviceId: string, audioDeviceId: string) => void;
}

interface Device {
  deviceId: string;
  kind: string;
  label: string;
}

const DeviceSelectionScreen: React.FC<DeviceSelectionScreenProps> = ({ onDevicesSelected }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setDevices(devices);
        const videoDevice = devices.find(device => device.kind === 'videoinput');
        const audioDevice = devices.find(device => device.kind === 'audioinput');
        if (videoDevice) setSelectedVideoDevice(videoDevice.deviceId);
        if (audioDevice) setSelectedAudioDevice(audioDevice.deviceId);
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    }
    getDevices();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedVideoDevice && selectedAudioDevice) {
      startMediaStream();
    }
  }, [selectedVideoDevice, selectedAudioDevice]);

  const startMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedVideoDevice },
        audio: { deviceId: selectedAudioDevice }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Set up audio visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      drawAudioWaveform();
    } catch (err) {
      console.error("Error starting media stream:", err);
    }
  };

  const drawAudioWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(249, 250, 251)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(79, 70, 229)';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const handleContinue = () => {
    onDevicesSelected(selectedVideoDevice, selectedAudioDevice);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Devices</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Camera size={20} className="mr-2" />
              Camera
            </label>
            <select 
              value={selectedVideoDevice} 
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {devices.filter(device => device.kind === 'videoinput').map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Camera ${device.deviceId}`}
                </option>
              ))}
            </select>
            <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Mic size={20} className="mr-2" />
              Microphone
            </label>
            <select 
              value={selectedAudioDevice} 
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {devices.filter(device => device.kind === 'audioinput').map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId}`}
                </option>
              ))}
            </select>
            <div className="mt-2 bg-gray-100 rounded-lg overflow-hidden">
              <canvas ref={canvasRef} width="640" height="100" className="w-full" />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleContinue}
          >
            Continue to Instructions
            <ArrowRightCircle className="ml-2 -mr-1 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSelectionScreen;