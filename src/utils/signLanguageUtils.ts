
import { recognizeASLLetter as originalRecognizeASLLetter } from './handUtils';
import { getCombinedTrainingDataSync, SignLanguage } from '../services/trainingService';

/**
 * Recognize sign language letter based on hand landmarks
 * This extends the handUtils.ts functionality to support different sign languages
 */
export const recognizeSignLanguageLetter = (predictions: any, language: SignLanguage = 'ASL'): string => {
  try {
    // If we're using ASL, we can use the original function with the correct language
    if (language === 'ASL') {
      return originalRecognizeASLLetter(predictions);
    }
    
    // For FSL or any other languages, we need custom handling
    if (!predictions || predictions.length === 0) {
      return '';
    }
    
    const landmarks = predictions[0].landmarks;
    if (!landmarks || landmarks.length === 0) {
      return '';
    }
    
    // Get training data for the active language
    const trainingData = getCombinedTrainingDataSync(language);
    
    if (!trainingData || trainingData.length === 0) {
      console.error(`No training data available for ${language}`);
      return '';
    }
    
    // Extract feature vector from landmarks (normalized)
    const featureVector = landmarksToFeatureVector(landmarks);
    
    // Find best match using Euclidean distance
    let bestMatch = '';
    let minDistance = Number.MAX_VALUE;
    
    for (const letterData of trainingData) {
      for (const sample of letterData.samples) {
        const distance = calculateDistance(featureVector, sample);
        
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = letterData.letter;
        }
      }
    }
    
    // Only return if confidence is high enough (distance is low enough)
    const confidenceThreshold = 10; // Adjust based on testing
    return minDistance < confidenceThreshold ? bestMatch : '';
  } catch (error) {
    console.error("Error recognizing sign language:", error);
    return '';
  }
};

/**
 * Calculate Euclidean distance between two feature vectors
 */
function calculateDistance(vector1: number[], vector2: number[]): number {
  if (vector1.length !== vector2.length) {
    return Number.MAX_VALUE;
  }
  
  let sumSquaredDiff = 0;
  for (let i = 0; i < vector1.length; i++) {
    const diff = vector1[i] - vector2[i];
    sumSquaredDiff += diff * diff;
  }
  
  return Math.sqrt(sumSquaredDiff);
}

/**
 * Convert landmarks to normalized feature vector
 * This is a duplicate of the function in handUtils.ts since we can't import it directly
 */
export function landmarksToFeatureVector(landmarks: number[][]): number[] {
  try {
    if (!landmarks || landmarks.length === 0) {
      return [];
    }
    
    // The palm base point (wrist) serves as our reference point
    const palmBase = landmarks[0];
    
    // Create a feature vector of normalized positions relative to palm base
    const featureVector: number[] = [];
    
    // For each landmark except the palm base, calculate relative positions
    // Landmarks[0] is the palm base, which we use as reference
    for (let i = 1; i < landmarks.length; i++) {
      const landmark = landmarks[i];
      
      // Calculate the difference in position (normalize to palm position)
      const relX = landmark[0] - palmBase[0];
      const relY = landmark[1] - palmBase[1];
      const relZ = landmark[2] - palmBase[2];
      
      // Add normalized coordinates to feature vector
      featureVector.push(relX, relY, relZ);
    }
    
    return featureVector;
  } catch (error) {
    console.error("Error creating feature vector:", error);
    return [];
  }
}

// Monkey patch the original recognizeASLLetter to use our new function
// This allows us to not modify the original handUtils.ts file
const originalFunction = originalRecognizeASLLetter;
(window as any).__originalRecognizeASLLetter = originalFunction;

// Replace the original function with our new one that supports languages
export const monkeyPatchHandUtils = () => {
  (window as any).recognizeASLLetter = (predictions: any, language?: SignLanguage) => {
    return recognizeSignLanguageLetter(predictions, language);
  };
};
