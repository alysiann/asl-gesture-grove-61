
import React from 'react';
import { Hand, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface TrainingStatusProps {
  isHandDetected: boolean;
  selectedLetter: string;
  sampleCount: number;
  onCaptureSample: () => void;
  onSaveTraining: () => void;
}

const TrainingStatus: React.FC<TrainingStatusProps> = ({
  isHandDetected,
  selectedLetter,
  sampleCount,
  onCaptureSample,
  onSaveTraining
}) => {
  return (
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
            onClick={onCaptureSample}
            disabled={!selectedLetter || !isHandDetected}
            className="flex-1"
          >
            <Hand className="w-4 h-4 mr-2" />
            Capture Sample
          </Button>
          
          <Button
            onClick={onSaveTraining}
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
  );
};

export default TrainingStatus;
