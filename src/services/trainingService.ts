
// Import statements at the top level
import { getDefaultASLAlphabet } from '../utils/defaultASLAlphabet';
import { getDefaultFSLAlphabet } from '../utils/defaultFSLAlphabet';

// Define types for our training data
export interface TrainingData {
  letter: string;
  samples: number[][];
  timestamp: number;
}

export type SignLanguage = 'ASL' | 'FSL';

// Local storage keys
const TRAINING_DATA_KEY = 'asl-training-data';
const TRAINING_DATA_KEY_FSL = 'fsl-training-data';
const CURRENT_LANGUAGE_KEY = 'current-sign-language';

/**
 * Set active sign language
 */
export const setActiveSignLanguage = (language: SignLanguage): void => {
  try {
    localStorage.setItem(CURRENT_LANGUAGE_KEY, language);
  } catch (error) {
    console.error("Error saving active sign language:", error);
  }
};

/**
 * Get active sign language
 */
export const getActiveSignLanguage = (): SignLanguage => {
  try {
    const language = localStorage.getItem(CURRENT_LANGUAGE_KEY);
    return (language as SignLanguage) || 'ASL';
  } catch (error) {
    console.error("Error getting active sign language:", error);
    return 'ASL';
  }
};

/**
 * Get storage key based on language
 */
const getStorageKey = (language: SignLanguage = getActiveSignLanguage()): string => {
  return language === 'ASL' ? TRAINING_DATA_KEY : TRAINING_DATA_KEY_FSL;
};

/**
 * Save training data for a letter
 */
export const saveTrainingData = (letter: string, samples: number[][], language?: SignLanguage): void => {
  try {
    const activeLanguage = language || getActiveSignLanguage();
    const storageKey = getStorageKey(activeLanguage);
    
    // Get existing data
    const existingData = getTrainingData(activeLanguage);
    
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
    localStorage.setItem(storageKey, JSON.stringify(existingData));
  } catch (error) {
    console.error("Error saving training data:", error);
    throw new Error("Failed to save training data");
  }
};

/**
 * Get all training data
 */
export const getTrainingData = (language?: SignLanguage): TrainingData[] => {
  try {
    const activeLanguage = language || getActiveSignLanguage();
    const storageKey = getStorageKey(activeLanguage);
    
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting training data:", error);
    return [];
  }
};

/**
 * Check if any training data exists
 */
export const hasTrainingData = (language?: SignLanguage): boolean => {
  return getTrainingData(language).length > 0;
};

/**
 * Get combined training data (user trained + defaults)
 */
export const getCombinedTrainingData = (language?: SignLanguage): TrainingData[] => {
  try {
    const activeLanguage = language || getActiveSignLanguage();
    
    // Get user training data
    const userData = getTrainingData(activeLanguage);
    
    // Get default data based on language
    let defaultData: TrainingData[] = [];
    
    if (activeLanguage === 'ASL') {
      const cachedDefaultData = localStorage.getItem('asl-default-alphabet-cache');
      defaultData = cachedDefaultData ? JSON.parse(cachedDefaultData) : getDefaultASLAlphabet();
    } else {
      const cachedDefaultData = localStorage.getItem('fsl-default-alphabet-cache');
      defaultData = cachedDefaultData ? JSON.parse(cachedDefaultData) : getDefaultFSLAlphabet();
    }
    
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
    return getTrainingData(language); // Fallback to user data only
  }
};

/**
 * Get combined training data synchronously (for immediate use)
 */
export const getCombinedTrainingDataSync = (language?: SignLanguage): TrainingData[] => {
  try {
    const activeLanguage = language || getActiveSignLanguage();
    
    // Get user training data
    const userData = getTrainingData(activeLanguage);
    
    // Try to get default data from local storage cache if available
    let cachedDefaultData;
    let defaultData;
    
    if (activeLanguage === 'ASL') {
      cachedDefaultData = localStorage.getItem('asl-default-alphabet-cache');
      defaultData = cachedDefaultData ? JSON.parse(cachedDefaultData) : getDefaultASLAlphabet();
    } else {
      cachedDefaultData = localStorage.getItem('fsl-default-alphabet-cache');
      defaultData = cachedDefaultData ? JSON.parse(cachedDefaultData) : getDefaultFSLAlphabet();
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
    console.error("Error in getCombinedTrainingDataSync:", error);
    return [];
  }
};

/**
 * Clear all training data
 */
export const clearTrainingData = (language?: SignLanguage): void => {
  try {
    const activeLanguage = language || getActiveSignLanguage();
    const storageKey = getStorageKey(activeLanguage);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error("Error clearing training data:", error);
  }
};
