
// Define types for our training data
export interface TrainingData {
  letter: string;
  samples: number[][];
  timestamp: number;
}

// Local storage key
const TRAINING_DATA_KEY = 'asl-training-data';

/**
 * Save training data for a letter
 */
export const saveTrainingData = (letter: string, samples: number[][]): void => {
  // Get existing data
  const existingData = getTrainingData();
  
  // Create new entry or update existing
  const newEntry: TrainingData = {
    letter,
    samples,
    timestamp: Date.now()
  };
  
  // Check if letter already exists
  const index = existingData.findIndex(data => data.letter === letter);
  
  if (index >= 0) {
    // Update existing
    existingData[index] = newEntry;
  } else {
    // Add new
    existingData.push(newEntry);
  }
  
  // Save to localStorage
  localStorage.setItem(TRAINING_DATA_KEY, JSON.stringify(existingData));
};

/**
 * Get all training data
 */
export const getTrainingData = (): TrainingData[] => {
  const data = localStorage.getItem(TRAINING_DATA_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Check if any training data exists
 */
export const hasTrainingData = (): boolean => {
  return getTrainingData().length > 0;
};

/**
 * Clear all training data
 */
export const clearTrainingData = (): void => {
  localStorage.removeItem(TRAINING_DATA_KEY);
};
