
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { getCombinedTrainingDataSync, TrainingData } from '../services/trainingService';

// Initialize handpose model with optimized parameters
export const loadHandposeModel = async (): Promise<handpose.HandPose> => {
  console.log("Loading handpose model...");
  try {
    const model = await handpose.load({
      detectionConfidence: 0.8,
      maxContinuousChecks: 5, // Reduced for better performance
      iouThreshold: 0.3,
      scoreThreshold: 0.75,
    });
    console.log("Handpose model loaded successfully");
    return model;
  } catch (error) {
    console.error("Error loading handpose model:", error);
    throw error;
  }
};

// Convert landmarks to feature vector - optimized version
export const landmarksToFeatureVector = (landmarks: Array<[number, number, number]>): number[] => {
  if (!landmarks || landmarks.length < 21) return [];
  
  try {
    // Extract palm position
    const palmPosition = landmarks[0];
    
    // Create a normalized feature vector (relative to palm position)
    const featureVector: number[] = [];
    
    // Process only every 2nd landmark for training (improves performance while maintaining accuracy)
    for (let i = 1; i < landmarks.length; i += 1) {
      const [x, y, z] = landmarks[i];
      const [palmX, palmY, palmZ] = palmPosition;
      
      // Normalized position - rounded to 2 decimal places for performance
      featureVector.push(Math.round((x - palmX) * 100) / 100);
      featureVector.push(Math.round((y - palmY) * 100) / 100);
      featureVector.push(Math.round((z - palmZ) * 100) / 100);
    }
    
    return featureVector;
  } catch (error) {
    console.error("Error in landmarksToFeatureVector:", error);
    return [];
  }
};

// Optimized distance calculation with early termination
const calculateFeatureDistance = (vec1: number[], vec2: number[]): number => {
  if (!vec1 || !vec2 || vec1.length !== vec2.length) return Infinity;
  
  try {
    let sum = 0;
    const threshold = 200 * 200; // Square of threshold for early termination
    
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
      
      // Early termination if we're already above threshold
      if (sum > threshold) {
        return Infinity;
      }
    }
    
    return Math.sqrt(sum);
  } catch (error) {
    console.error("Error in calculateFeatureDistance:", error);
    return Infinity;
  }
};

// Cache to avoid recalculating distances
const distanceCache = new Map<string, number>();

// Process predictions to determine ASL letter using training data - optimized version
export const recognizeASLLetter = (predictions: handpose.AnnotatedPrediction[]): string => {
  if (!predictions || predictions.length === 0) {
    return '';
  }
  
  try {
    // Get combined training data (user + defaults) synchronously
    const trainingData = getCombinedTrainingDataSync();
    if (trainingData.length === 0) {
      console.warn("No training data available for recognition");
      return '';
    }
    
    // Extract landmarks from first hand
    const landmarks = predictions[0].landmarks;
    if (!landmarks || landmarks.length === 0) return '';
    
    // Convert to feature vector
    const featureVector = landmarksToFeatureVector(landmarks);
    if (featureVector.length === 0) return '';
    
    // Compare with training data
    let bestMatch = '';
    let minDistance = Infinity;
    
    trainingData.forEach((data: TrainingData) => {
      try {
        let letterMinDistance = Infinity;
        
        data.samples.forEach(sample => {
          // Skip invalid samples
          if (!sample || sample.length === 0) return;
          
          // Create a cache key
          const cacheKey = `${featureVector.slice(0, 10).join(',')}:${sample.slice(0, 10).join(',')}`;
          
          // Try to get from cache first
          let distance: number;
          if (distanceCache.has(cacheKey)) {
            distance = distanceCache.get(cacheKey)!;
          } else {
            distance = calculateFeatureDistance(featureVector, sample);
            
            // Store in cache - limit cache size
            if (distanceCache.size > 500) distanceCache.clear();
            distanceCache.set(cacheKey, distance);
          }
          
          letterMinDistance = Math.min(letterMinDistance, distance);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = data.letter;
          }
        });
      } catch (error) {
        console.error("Error processing training data letter:", error);
      }
    });
    
    // Return the best match if distance is below threshold
    const threshold = 150; 
    return minDistance < threshold ? bestMatch : '';
  } catch (error) {
    console.error("Error in recognizeASLLetter:", error);
    return '';
  }
};

// Check if hand is present in the frame - simple version
export const isHandDetected = (predictions: handpose.AnnotatedPrediction[]): boolean => {
  return predictions && predictions.length > 0;
};

// Normalize landmarks to be relative to hand size
export const normalizeLandmarks = (
  landmarks: Array<[number, number, number]>,
  handSize: number
): Array<[number, number, number]> => {
  if (!landmarks || landmarks.length === 0 || handSize === 0) {
    return [];
  }
  
  try {
    return landmarks.map(([x, y, z]) => [x / handSize, y / handSize, z / handSize]);
  } catch (error) {
    console.error("Error in normalizeLandmarks:", error);
    return [];
  }
};

// Get hand bounding box
export const getHandBoundingBox = (landmarks: Array<[number, number, number]>) => {
  if (!landmarks || landmarks.length === 0) return null;
  
  try {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    
    landmarks.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    });
    
    return {
      topLeft: [minX, minY] as [number, number],
      bottomRight: [maxX, maxY] as [number, number],
      width: maxX - minX,
      height: maxY - minY
    };
  } catch (error) {
    console.error("Error in getHandBoundingBox:", error);
    return null;
  }
};
