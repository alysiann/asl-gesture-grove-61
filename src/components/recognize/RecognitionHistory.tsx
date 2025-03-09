
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface RecognitionHistoryProps {
  detectionHistory: string[];
  clearHistory: () => void;
}

const RecognitionHistory: React.FC<RecognitionHistoryProps> = ({ 
  detectionHistory, 
  clearHistory 
}) => {
  const handleClearHistory = () => {
    clearHistory();
    toast("History cleared", {
      duration: 1500,
    });
  };

  return (
    <motion.div 
      className="glass rounded-xl p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Recognition History</h2>
        {detectionHistory.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearHistory}>
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
  );
};

export default RecognitionHistory;
