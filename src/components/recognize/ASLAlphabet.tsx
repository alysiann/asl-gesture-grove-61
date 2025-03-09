
import React from 'react';
import { motion } from 'framer-motion';

interface ASLAlphabetProps {
  recognizedLetter: string;
}

const ASL_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

const ASLAlphabet: React.FC<ASLAlphabetProps> = ({ recognizedLetter }) => {
  return (
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
  );
};

export default ASLAlphabet;
