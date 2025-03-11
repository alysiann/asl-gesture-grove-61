
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import InfoPanel from '@/components/recognize/InfoPanel';
import RecognitionStatus from '@/components/recognize/RecognitionStatus';
import RecognitionHistory from '@/components/recognize/RecognitionHistory';
import ASLAlphabet from '@/components/recognize/ASLAlphabet';
import { getCombinedTrainingData } from '@/services/trainingService';

const Recognize: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [recognizedLetter, setRecognizedLetter] = useState<string>('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  
  // Load combined training data on startup
  useEffect(() => {
    const checkTrainingData = () => {
      try {
        const combinedData = getCombinedTrainingData();
        
        if (combinedData.length > 0) {
          setIsReady(true);
          toast.success("Recognition system ready", {
            description: "Ready to recognize ASL gestures A-Z",
            duration: 3000,
          });
        } else {
          toast.error("No recognition data available", {
            description: "Could not load ASL recognition data",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error("Error loading training data:", error);
        toast.error("Error loading recognition data", {
          description: "Please try refreshing the page",
          duration: 5000,
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
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
    </motion.div>
  );
};

export default Recognize;
