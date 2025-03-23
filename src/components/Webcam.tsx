
import React, { useRef, useEffect, lazy, Suspense } from 'react';
import { SignLanguage } from '@/services/trainingService';

const HandDetectionComponent = lazy(() => import('@/components/HandDetection'));

interface WebcamProps {
  onHandDetected?: (isDetected: boolean) => void;
  onLetterRecognized?: (letter: string) => void;
  onFeatureExtracted?: (features: number[]) => void;
  trainingMode?: boolean;
  signLanguage?: SignLanguage;
}

const Webcam: React.FC<WebcamProps> = ({ onHandDetected, onLetterRecognized, onFeatureExtracted, trainingMode, signLanguage }) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    const loadWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };
    
    loadWebcam();
    
    return () => {
      if (webcamRef.current && webcamRef.current.srcObject) {
        const stream = webcamRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  
  return (
    <div className="relative">
      <video
        ref={webcamRef}
        className="w-full aspect-video rounded-xl"
        autoPlay
        muted
      />
      <Suspense fallback={<p>Loading Hand Detection...</p>}>
        <HandDetectionComponent
          webcamRef={webcamRef}
          onHandDetected={onHandDetected}
          onLetterRecognized={onLetterRecognized}
          onFeatureExtracted={onFeatureExtracted}
          trainingMode={trainingMode}
          signLanguage={signLanguage}
        />
      </Suspense>
    </div>
  );
};

export default Webcam;
