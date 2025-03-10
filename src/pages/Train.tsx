
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import TrainingInfo from '@/components/train/TrainingInfo';
import TrainingStatus from '@/components/train/TrainingStatus';
import TrainLetterSelector from '@/components/train/TrainLetterSelector';
import { saveTrainingData, getTrainingData } from '@/services/trainingService';

const Train: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [sampleCount, setSampleCount] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(true);
  const samplesRef = useRef<number[][]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<number[]>([]);
  const featureUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load existing samples for the selected letter
  useEffect(() => {
    if (selectedLetter) {
      // Reset samples when letter changes
      samplesRef.current = [];
      setSampleCount(0);
      
      // Check if we have existing samples for this letter
      const existingData = getTrainingData();
      const letterData = existingData.find(data => data.letter === selectedLetter);
      
      if (letterData) {
        samplesRef.current = [...letterData.samples];
        setSampleCount(letterData.samples.length);
        toast.info(`${letterData.samples.length} existing samples loaded for letter ${selectedLetter}`, {
          duration: 3000,
        });
      }
    }
  }, [selectedLetter]);
  
  // Handle hand detection with useCallback for better performance
  const handleHandDetection = useCallback((detected: boolean) => {
    setIsHandDetected(detected);
  }, []);
  
  // Handle feature extraction with debouncing for better performance
  const handleFeatureExtracted = useCallback((features: number[]) => {
    if (featureUpdateTimeoutRef.current) {
      clearTimeout(featureUpdateTimeoutRef.current);
    }
    
    featureUpdateTimeoutRef.current = setTimeout(() => {
      if (features.length > 0) {
        setCurrentFeatures(features);
      }
    }, 100);
  }, []);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (featureUpdateTimeoutRef.current) {
        clearTimeout(featureUpdateTimeoutRef.current);
      }
    };
  }, []);
  
  const handleCaptureSample = useCallback(() => {
    if (!isHandDetected) {
      toast.error("No hand detected", {
        description: "Position your hand in the camera frame first",
      });
      return;
    }
    
    if (!selectedLetter) {
      toast.error("No letter selected", {
        description: "Please select a letter to train",
      });
      return;
    }
    
    if (currentFeatures.length === 0) {
      toast.error("No features detected", {
        description: "Please ensure your hand is clearly visible",
      });
      return;
    }
    
    // Add features to samples
    samplesRef.current.push([...currentFeatures]);
    setSampleCount(prev => prev + 1);
    
    toast.success(`Sample captured for letter ${selectedLetter}`, {
      description: `Sample #${sampleCount + 1}`,
    });
  }, [isHandDetected, selectedLetter, currentFeatures, sampleCount]);
  
  const handleSaveTraining = useCallback(() => {
    if (sampleCount === 0) {
      toast.error("No samples captured", {
        description: "Capture at least one sample before saving",
      });
      return;
    }
    
    // Save training data
    saveTrainingData(selectedLetter, samplesRef.current);
    
    toast.success("Training data saved successfully", {
      description: `${sampleCount} samples for letter ${selectedLetter} saved`,
    });
    
    // Reset after save
    samplesRef.current = [];
    setSampleCount(0);
    setSelectedLetter('');
  }, [sampleCount, selectedLetter]);
  
  const handleToggleInfo = useCallback(() => {
    setShowInfo(prev => !prev);
  }, []);
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <TrainingInfo 
            showInfo={showInfo} 
            onToggleInfo={handleToggleInfo} 
          />
          
          <Webcam 
            onHandDetected={handleHandDetection}
            onFeatureExtracted={handleFeatureExtracted}
            trainingMode={true}
          />
          
          <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <TrainingStatus 
              isHandDetected={isHandDetected}
              selectedLetter={selectedLetter}
              sampleCount={sampleCount}
              onCaptureSample={handleCaptureSample}
              onSaveTraining={handleSaveTraining}
            />
            
            <TrainLetterSelector 
              selectedLetter={selectedLetter}
              onSelectLetter={setSelectedLetter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Train;
