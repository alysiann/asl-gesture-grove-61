
import React from 'react';
import { motion } from 'framer-motion';
import { SignLanguage } from '@/services/trainingService';

interface ASLAlphabetProps {
  recognizedLetter: string;
  activeLanguage: SignLanguage;
}

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const FSL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'NG', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const ASLAlphabet: React.FC<ASLAlphabetProps> = ({ recognizedLetter, activeLanguage }) => {
  const letters = activeLanguage === 'ASL' ? ASL_LETTERS : FSL_LETTERS;
  
  return (
    <motion.div 
      className="mt-8 glass rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <h2 className="text-xl font-medium mb-4">
        {activeLanguage === 'ASL' ? 'ASL' : 'Filipino SL'} Alphabet
      </h2>
      <div className="grid grid-cols-6 sm:grid-cols-9 gap-2">
        {letters.map((letter) => (
          <motion.div 
            key={letter}
            className={`aspect-square glass p-2 rounded-lg flex items-center justify-center
              ${letter === recognizedLetter ? 'bg-primary/20 ring-2 ring-primary' : ''}`}
            animate={{
              scale: letter === recognizedLetter ? 1.1 : 1,
              backgroundColor: letter === recognizedLetter ? 'rgba(var(--primary), 0.2)' : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.3 }}
          >
            <span className={`text-base sm:text-lg font-medium ${letter === recognizedLetter ? 'text-primary font-bold' : ''}`}>
              {letter}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ASLAlphabet;
