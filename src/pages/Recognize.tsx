import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import InfoPanel from '@/components/recognize/InfoPanel';
import RecognitionStatus from '@/components/recognize/RecognitionStatus';
import RecognitionHistory from '@/components/recognize/RecognitionHistory';
import ASLAlphabet from '@/components/recognize/ASLAlphabet';

const Recognize: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [recognizedLetter, setRecognizedLetter] = useState<string>('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  
  const handleHandDetection = (detected: boolean) => {
    setIsHandDetected(detected);
  };
  
  const handleLetterRecognition = (letter: string) => {
    if (letter && letter !== recognizedLetter) {
      setRecognizedLetter(letter);
      
      // Add to history (keeping last 10 items)
      setDetectionHistory(prev => {
        const newHistory = [letter, ...prev];
        return newHistory.slice(0, 10);
      });
      
      // Show toast for letter detection
      toast(`Recognized: ${letter}`, {
        duration: 1500,
      });
    }
  };
  
  const clearHistory = () => {
    setDetectionHistory([]);
  };
  
  // Reset recognition when the component unmounts
  useEffect(() => {
    return () => {
      setRecognizedLetter('');
      setDetectionHistory([]);
    };
  }, []);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <InfoPanel showInfo={showInfo} setShowInfo={setShowInfo} />
          
          <Webcam 
            onHandDetected={handleHandDetection}
            onLetterRecognized={handleLetterRecognition}
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecognitionStatus 
              isHandDetected={isHandDetected} 
              recognizedLetter={recognizedLetter} 
            />
            
            <RecognitionHistory 
              detectionHistory={detectionHistory} 
              clearHistory={clearHistory} 
            />
          </div>
          
          <ASLAlphabet recognizedLetter={recognizedLetter} />
        </div>
      </div>
    </div>
  );
};

export default Recognize;
