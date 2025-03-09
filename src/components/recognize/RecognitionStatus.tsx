
import React from 'react';
import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

interface RecognitionStatusProps {
  isHandDetected: boolean;
  recognizedLetter: string;
}

const RecognitionStatus: React.FC<RecognitionStatusProps> = ({ 
  isHandDetected, 
  recognizedLetter 
}) => {
  return (
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
  );
};

export default RecognitionStatus;
