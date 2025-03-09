
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoPanelProps {
  showInfo: boolean;
  setShowInfo: (show: boolean) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ showInfo, setShowInfo }) => {
  return (
    <>
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
    </>
  );
};

export default InfoPanel;
