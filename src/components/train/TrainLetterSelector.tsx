
import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { getTrainingData, clearTrainingData, SignLanguage } from '@/services/trainingService';

interface TrainLetterSelectorProps {
  selectedLetter: string;
  onSelectLetter: (letter: string) => void;
  activeLanguage: SignLanguage;
}

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const FSL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'NG', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const TrainLetterSelector: React.FC<TrainLetterSelectorProps> = ({ 
  selectedLetter, 
  onSelectLetter,
  activeLanguage
}) => {
  const letters = activeLanguage === 'ASL' ? ASL_LETTERS : FSL_LETTERS;
  
  const handleImportData = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            const jsonData = JSON.parse(event.target?.result as string);
            
            // Use the appropriate storage key based on active language
            const storageKey = activeLanguage === 'ASL' ? 'asl-training-data' : 'fsl-training-data';
            localStorage.setItem(storageKey, JSON.stringify(jsonData));
            
            toast.success("Training data imported successfully", {
              description: `${jsonData.length} letter datasets imported for ${activeLanguage}`,
            });
          } catch (error) {
            toast.error("Failed to import data", {
              description: "Invalid JSON format",
            });
          }
        };
        
        reader.readAsText(file);
      }
    };
    
    fileInput.click();
  };
  
  const handleExportData = () => {
    const data = getTrainingData(activeLanguage);
    if (data.length === 0) {
      toast.error("No data to export", {
        description: "Train at least one letter first",
      });
      return;
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeLanguage.toLowerCase()}-training-data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Training data exported", {
      description: `${data.length} letter datasets exported for ${activeLanguage}`,
    });
  };
  
  const handleClearData = () => {
    if (confirm(`Are you sure you want to clear all ${activeLanguage} training data? This action cannot be undone.`)) {
      clearTrainingData(activeLanguage);
      toast.success("Training data cleared", {
        description: `All ${activeLanguage} training data has been removed`,
      });
    }
  };
  
  return (
    <motion.div 
      className="glass rounded-xl p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <h2 className="text-xl font-medium mb-4">
        Select Letter to Train ({activeLanguage === 'ASL' ? 'American' : 'Filipino'})
      </h2>
      
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => onSelectLetter(letter)}
            className={`aspect-square p-2 rounded-lg flex items-center justify-center transition-all
              ${letter === selectedLetter 
                ? 'bg-primary text-primary-foreground' 
                : 'glass hover:bg-secondary'}`}
          >
            <span className="text-xs sm:text-sm">{letter}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 border border-dashed border-muted rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          Import, export or clear training data
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <Button 
            variant="outline" 
            className="flex-1 text-xs sm:text-sm"
            onClick={handleImportData}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Import
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-xs sm:text-sm"
            onClick={handleExportData}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 rotate-180" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-xs sm:text-sm"
            onClick={handleClearData}
          >
            Clear Data
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrainLetterSelector;
