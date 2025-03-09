
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
          onClick={onToggleInfo}
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
    </>
  );
};

export default TrainingInfo;
