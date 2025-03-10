
import React from 'react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TrainingInfoProps {
  showInfo: boolean;
  onToggleInfo: () => void;
}

const TrainingInfo: React.FC<TrainingInfoProps> = ({ showInfo, onToggleInfo }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">ASL Training</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Create custom training data for better recognition</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
          onClick={onToggleInfo}
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </motion.div>
      
      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 overflow-hidden"
        >
          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">How to train the ASL recognition system:</h3>
          <ul className="list-disc list-inside text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>Select a letter (A-Z) you want to train from the grid</li>
            <li>Position your hand clearly in the frame, making the corresponding ASL sign</li>
            <li>Ensure the "Hand Detected" indicator is green</li>
            <li>Click "Capture Sample" to store the current hand position</li>
            <li>Capture at least 5-10 samples with slightly different poses for the same letter</li>
            <li>Click "Save Training Data" when finished with a letter</li>
            <li>Repeat for each letter you want to train</li>
            <li>Go to the Recognize page to test your trained model</li>
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default TrainingInfo;
