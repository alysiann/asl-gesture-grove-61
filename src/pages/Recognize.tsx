
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import InfoPanel from '@/components/recognize/InfoPanel';
import RecognitionStatus from '@/components/recognize/RecognitionStatus';
import RecognitionHistory from '@/components/recognize/RecognitionHistory';
import ASLAlphabet from '@/components/recognize/ASLAlphabet';
import LanguageSelector from '@/components/LanguageSelector';
import { useSignLanguage } from '@/hooks/use-sign-language';
import { 
  getTrainingData, 
  SignLanguage, 
  getActiveSignLanguage, 
  setActiveSignLanguage 
} from '@/services/trainingService';
import { getDefaultASLAlphabet } from '@/utils/defaultASLAlphabet';
import { getDefaultFSLAlphabet } from '@/utils/defaultFSLAlphabet';

const Recognize: React.FC = () => {
  // Initialize sign language support
  useSignLanguage();
  
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [recognizedLetter, setRecognizedLetter] = useState<string>('');
  const [detectionHistory, setDetectionHistory] = useState<string[]>([]);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<SignLanguage>(getActiveSignLanguage());
  
  // Initialize default alphabet cache for faster recognition
  useEffect(() => {
    try {
      // Cache default alphabets in localStorage for faster access
      const defaultASLAlphabet = getDefaultASLAlphabet();
      localStorage.setItem('asl-default-alphabet-cache', JSON.stringify(defaultASLAlphabet));
      
      const defaultFSLAlphabet = getDefaultFSLAlphabet();
      localStorage.setItem('fsl-default-alphabet-cache', JSON.stringify(defaultFSLAlphabet));
      
      // Check if we have user training data for active language
      const userData = getTrainingData(activeLanguage);
      
      // Set ready state
      setIsReady(true);
      
      // Show appropriate toast
      if (userData.length > 0) {
        toast.success("Recognition system ready", {
          description: `Ready with ${userData.length} custom trained letters plus defaults for ${activeLanguage}`,
          duration: 3000,
        });
      } else {
        toast.success("Recognition system ready", {
          description: `Using default ${activeLanguage} alphabet recognition`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Error initializing recognition:", error);
      // Still set ready to true to allow using defaults
      setIsReady(true);
      
      toast.warning("Using default recognition only", {
        description: "Custom training data not available",
        duration: 3000,
      });
    }
  }, [activeLanguage]);
  
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
  
  const handleLanguageChange = (language: SignLanguage) => {
    setActiveLanguage(language);
    setActiveSignLanguage(language);
    setRecognizedLetter('');
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Recognition Mode</h1>
            <LanguageSelector onLanguageChange={handleLanguageChange} />
          </div>
          
          <InfoPanel showInfo={showInfo} setShowInfo={setShowInfo} />
          
          <Webcam 
            onHandDetected={handleHandDetection}
            onLetterRecognized={handleLetterRecognition}
            signLanguage={activeLanguage}
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
          
          <ASLAlphabet 
            recognizedLetter={recognizedLetter} 
            activeLanguage={activeLanguage}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Recognize;
