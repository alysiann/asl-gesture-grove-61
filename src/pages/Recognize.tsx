import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Info, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Webcam from '@/components/Webcam';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
    toast("History cleared", {
      duration: 1500,
    });
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-semibold">ASL Recognition</h1>
              <p className="text-muted-foreground">Position your hand within the camera frame to begin</p>
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
                <h3 className="text-lg font-medium mb-2">How to use:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Ensure good lighting for optimal hand detection</li>
                  <li>Position your hand clearly in the frame</li>
                  <li>Form ASL letters with your hand</li>
                  <li>Hold the position for a moment for the system to recognize</li>
                  <li>The recognized letter will appear below the video</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Webcam 
            onHandDetected={handleHandDetection}
            onLetterRecognized={handleLetterRecognition}
          />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Recognition Status</h2>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${isHandDetected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">{isHandDetected ? 'Hand Detected' : 'No Hand'}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center py-8">
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-subtle" />
                  <div className="bg-white dark:bg-black rounded-full p-4 relative z-10">
                    <Hand className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                <div className="text-center">
                  {recognizedLetter ? (
                    <motion.div
                      key={recognizedLetter}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mb-2"
                    >
                      <span className="text-5xl font-bold text-primary">{recognizedLetter}</span>
                    </motion.div>
                  ) : (
                    <p className="text-muted-foreground">Waiting for letter recognition...</p>
                  )}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Recognition History</h2>
                {detectionHistory.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              {detectionHistory.length > 0 ? (
                <div className="grid grid-cols-5 gap-2">
                  {detectionHistory.map((letter, index) => (
                    <motion.div
                      key={`${letter}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="aspect-square bg-secondary rounded-lg flex items-center justify-center"
                    >
                      <span className="text-xl font-medium">{letter}</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  No recognized letters yet
                </div>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-8 glass rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h2 className="text-xl font-medium mb-4">ASL Alphabet</h2>
            <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
              {ASL_LETTERS.map((letter) => (
                <div 
                  key={letter}
                  className={`aspect-square glass p-2 rounded-lg flex items-center justify-center
                    ${letter === recognizedLetter ? 'ring-2 ring-primary' : ''}`}
                >
                  <span>{letter}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Recognize;
