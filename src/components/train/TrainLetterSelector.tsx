
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface TrainLetterSelectorProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
}

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const TrainLetterSelector: React.FC<TrainLetterSelectorProps> = ({ selectedLetter, onSelectLetter }) => {
  return (
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
            onClick={() => onSelectLetter(letter)}
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
  );
};

export default TrainLetterSelector;
