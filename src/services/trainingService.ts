
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
  try {
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
  } catch (error) {
    console.error("Error saving training data:", error);
    throw new Error("Failed to save training data");
  }
};

/**
 * Get all training data
 */
export const getTrainingData = (): TrainingData[] => {
  try {
    const data = localStorage.getItem(TRAINING_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting training data:", error);
    return [];
  }
};

/**
 * Check if any training data exists
 */
export const hasTrainingData = (): boolean => {
  return getTrainingData().length > 0;
};

/**
 * Get combined training data (user trained + defaults)
 */
export const getCombinedTrainingData = (): TrainingData[] => {
  try {
    // Import here to avoid circular dependency
    const { getDefaultASLAlphabet } = require('../utils/defaultASLAlphabet');
    
    // Get user training data
    const userData = getTrainingData();
    
    // Get default data
    const defaultData = getDefaultASLAlphabet();
    
    // If no default data, return just user data
    if (!defaultData || defaultData.length === 0) {
      return userData;
    }
    
    // If no user data, return default alphabet
    if (userData.length === 0) {
      return defaultData;
    }
    
    // Combine user data with defaults for letters not trained by user
    const userLetters = userData.map(item => item.letter);
    const combinedData = [...userData];
    
    defaultData.forEach(defaultItem => {
      if (!userLetters.includes(defaultItem.letter)) {
        combinedData.push(defaultItem);
      }
    });
    
    return combinedData;
  } catch (error) {
    console.error("Error combining training data:", error);
    
    // Fallback to default alphabet if available
    try {
      const { getDefaultASLAlphabet } = require('../utils/defaultASLAlphabet');
      return getDefaultASLAlphabet();
    } catch (fallbackError) {
      console.error("Fallback to default alphabet failed:", fallbackError);
      return [];
    }
  }
};

/**
 * Clear all training data
 */
export const clearTrainingData = (): void => {
  try {
    localStorage.removeItem(TRAINING_DATA_KEY);
  } catch (error) {
    console.error("Error clearing training data:", error);
  }
};
