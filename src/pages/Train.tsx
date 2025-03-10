
import React, { useState, useRef } from 'react';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { toast } from "sonner";
import TrainingInfo from '@/components/train/TrainingInfo';
import TrainingStatus from '@/components/train/TrainingStatus';
import TrainLetterSelector from '@/components/train/TrainLetterSelector';
import { saveTrainingData } from '@/services/trainingService';

const Train: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [sampleCount, setSampleCount] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const samplesRef = useRef<number[][]>([]);
  const [currentFeatures, setCurrentFeatures] = useState<number[]>([]);
  
  const handleHandDetection = (detected: boolean) => {
    setIsHandDetected(detected);
  };
  
  const handleFeatureExtracted = (features: number[]) => {
    setCurrentFeatures(features);
  };
  
  const handleCaptureSample = () => {
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
  };
  
  const handleSaveTraining = () => {
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
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <TrainingInfo 
            showInfo={showInfo} 
            onToggleInfo={() => setShowInfo(!showInfo)} 
          />
          
          <Webcam 
            onHandDetected={handleHandDetection}
            onFeatureExtracted={handleFeatureExtracted}
            trainingMode={true}
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
