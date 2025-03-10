
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import InfoPanel from '@/components/recognize/InfoPanel';
import RecognitionStatus from '@/components/recognize/RecognitionStatus';
import RecognitionHistory from '@/components/recognize/RecognitionHistory';
import ASLAlphabet from '@/components/recognize/ASLAlphabet';
import { hasTrainingData } from '@/services/trainingService';

const Recognize: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [recognizedLetter, setRecognizedLetter] = useState<string>('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [hasTraining, setHasTraining] = useState<boolean>(false);
  
  // Check if training data exists
  useEffect(() => {
    const checkTrainingData = () => {
      const hasTrained = hasTrainingData();
      setHasTraining(hasTrained);
      
      if (!hasTrained) {
        toast.info("No training data found", {
          description: "Visit the Train page to train some gestures first",
          duration: 5000,
        });
      } else {
        toast.success("Training data loaded", {
          description: "Ready to recognize your trained gestures",
          duration: 3000,
        });
      }
    };
    
    checkTrainingData();
  }, []);
  
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
          
          {!hasTraining && (
            <motion.div 
              className="mb-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-yellow-800 dark:text-yellow-200">
                No training data found. Please visit the Train page to train some gestures first.
              </p>
            </motion.div>
          )}
          
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
