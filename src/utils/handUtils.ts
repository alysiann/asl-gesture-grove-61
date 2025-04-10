import * as handpose from '@tensorflow-models/handpose';
import { getCombinedTrainingDataSync } from '../services/trainingService';

/**
 * Load the Handpose model
 */
export const loadHandposeModel = async (): Promise<handpose.HandPose> => {
  try {
    const model = await handpose.load();
    return model;
  } catch (error) {
    console.error("Error loading handpose model:", error);
    throw new Error("Failed to load handpose model");
  }
};

/**
 * Recognize ASL letter based on hand landmarks
 */
export const recognizeASLLetter = (predictions: any): string => {
  try {
    if (!predictions || predictions.length === 0) {
      return '';
    }

    const landmarks = predictions[0].landmarks;
    if (!landmarks || landmarks.length === 0) {
      return '';
    }

    // Get training data
    const trainingData = getCombinedTrainingDataSync();

    if (!trainingData || trainingData.length === 0) {
      console.warn("No training data available");
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
    console.error("Error recognizing ASL letter:", error);
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
 * Check if hand is detected based on predictions
 */
export const isHandDetected = (predictions: handpose.AnnotatedPrediction[]): boolean => {
  return predictions && predictions.length > 0;
};

/**
 * Convert landmarks to normalized feature vector
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
