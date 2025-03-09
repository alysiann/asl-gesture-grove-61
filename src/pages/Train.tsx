import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Save, Upload, Info } from 'lucide-react';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const Train: React.FC = () => {
  const [isHandDetected, setIsHandDetected] = useState<boolean>(false);
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [sampleCount, setSampleCount] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  
  const handleHandDetection = (detected: boolean) => {
    setIsHandDetected(detected);
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
    
    // Simulate capturing a sample
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
    
    // Simulate saving training data
    toast.success("Training data saved successfully", {
      description: `${sampleCount} samples for letter ${selectedLetter} saved`,
    });
    
    // Reset after save
    setSampleCount(0);
    setSelectedLetter('');
  };
  
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-semibold">ASL Training</h1>
              <p className="text-muted-foreground">Create custom training data for better recognition</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => setShowInfo(!showInfo)}
            >
              <Info className="w-5 h-5" />
            </Button>
          </motion.div>
          
          <AnimatePresence>
            {showInfo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-xl p-4 mb-6 overflow-hidden"
              >
                <h3 className="text-lg font-medium mb-2">How to train:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Select a letter you want to train</li>
                  <li>Position your hand clearly in the frame</li>
                  <li>Click "Capture Sample" to store the current hand position</li>
                  <li>Capture multiple samples with slightly different poses</li>
                  <li>Click "Save Training Data" when finished</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Webcam 
            onHandDetected={handleHandDetection} 
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Training Status</h2>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isHandDetected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{isHandDetected ? 'Hand Detected' : 'No Hand'}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Selected letter:</p>
                <div className="flex items-center mb-4">
                  {selectedLetter ? (
                    <div className="flex items-center text-center justify-center w-16 h-16 text-3xl font-bold bg-primary text-primary-foreground rounded-lg">
                      {selectedLetter}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-muted text-muted-foreground rounded-lg">
                      ?
                    </div>
                  )}
                  <div className="ml-4">
                    <p className="font-medium">{selectedLetter ? `Training letter "${selectedLetter}"` : "No letter selected"}</p>
                    <p className="text-sm text-muted-foreground">{sampleCount} samples captured</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleCaptureSample}
                    disabled={!selectedLetter || !isHandDetected}
                    className="flex-1"
                  >
                    <Hand className="w-4 h-4 mr-2" />
                    Capture Sample
                  </Button>
                  
                  <Button
                    onClick={handleSaveTraining}
                    disabled={sampleCount === 0}
                    variant="secondary"
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Training Data
                  </Button>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h2 className="text-xl font-medium mb-4">Select Letter to Train</h2>
              
              <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
                {ASL_LETTERS.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`aspect-square p-2 rounded-lg flex items-center justify-center transition-all
                      ${letter === selectedLetter 
                        ? 'bg-primary text-primary-foreground' 
                        : 'glass hover:bg-secondary'}`}
                  >
                    <span>{letter}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-3 border border-dashed border-muted rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  You can also import existing data
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Training Data
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Train;
