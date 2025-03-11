
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
    // Import the defaultASLAlphabet properly (no require)
    import { getDefaultASLAlphabet } from '../utils/defaultASLAlphabet';
    
    // Get user training data
    const userData = getTrainingData();
    
    // Get default data using dynamic import
    return import('../utils/defaultASLAlphabet').then(module => {
      const defaultData = module.getDefaultASLAlphabet();
      
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
    }).catch(error => {
      console.error("Error importing default alphabet:", error);
      return userData; // Fallback to user data only
    });
  } catch (error) {
    console.error("Error combining training data:", error);
    return getTrainingData(); // Fallback to user data only
  }
};

/**
 * Get combined training data synchronously (for immediate use)
 * This avoids the promise-based approach when we need data right away
 */
export const getCombinedTrainingDataSync = (): TrainingData[] => {
  try {
    // Get user training data
    const userData = getTrainingData();
    
    // Try to get default data from local storage cache if available
    const cachedDefaultData = localStorage.getItem('asl-default-alphabet-cache');
    if (cachedDefaultData) {
      try {
        const defaultData = JSON.parse(cachedDefaultData);
        
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
        console.error("Error parsing cached default alphabet:", error);
      }
    }
    
    // Fallback to just user data if no cached defaults
    return userData;
  } catch (error) {
    console.error("Error in getCombinedTrainingDataSync:", error);
    return [];
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
