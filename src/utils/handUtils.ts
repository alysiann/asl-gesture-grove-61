
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { getTrainingData, TrainingData } from '../services/trainingService';

// Finger landmark indices
const fingerLandmarks = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20]
};

// Initialize handpose model
export const loadHandposeModel = async (): Promise<handpose.HandPose> => {
  const model = await handpose.load();
  return model;
};

// Convert landmarks to feature vector
const landmarksToFeatureVector = (landmarks: Array<[number, number, number]>): number[] => {
  if (!landmarks || landmarks.length < 21) return [];
  
  // Extract relative positions of fingers to palm
  const palmPosition = landmarks[0]; // Base of palm
  
  // Create a normalized feature vector (relative to palm position)
  const featureVector: number[] = [];
  
  // For each landmark, compute distance and angle from palm
  for (let i = 1; i < landmarks.length; i++) {
    const [x, y, z] = landmarks[i];
    const [palmX, palmY, palmZ] = palmPosition;
    
    // Normalized position
    featureVector.push((x - palmX));
    featureVector.push((y - palmY));
    featureVector.push((z - palmZ));
  }
  
  return featureVector;
};

// Calculate euclidean distance between feature vectors
const calculateFeatureDistance = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) return Infinity;
  
  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += Math.pow(vec1[i] - vec2[i], 2);
  }
  
  return Math.sqrt(sum);
};

// Process predictions to determine ASL letter using training data
export const recognizeASLLetter = (predictions: handpose.AnnotatedPrediction[]): string => {
  if (!predictions || predictions.length === 0) {
    return '';
  }
  
  // Get training data
  const trainingData = getTrainingData();
  if (trainingData.length === 0) {
    // No training data available
    return '';
  }
  
  // Extract landmarks from first hand
  const landmarks = predictions[0].landmarks;
  
  // Convert to feature vector
  const featureVector = landmarksToFeatureVector(landmarks);
  if (featureVector.length === 0) return '';
  
  // Compare with training data using K-nearest neighbor approach
  let bestMatch = '';
  let minDistance = Infinity;
  
  trainingData.forEach((data: TrainingData) => {
    data.samples.forEach(sample => {
      const distance = calculateFeatureDistance(featureVector, sample);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = data.letter;
      }
    });
  });
  
  // Return the best match if distance is below threshold
  const threshold = 200; // Adjust this threshold based on testing
  return minDistance < threshold ? bestMatch : '';
};

// Calculate distance between two points (landmarks)
export const calculateDistance = (
  [x1, y1, z1]: [number, number, number], 
  [x2, y2, z2]: [number, number, number]
): number => {
  return Math.sqrt(
    Math.pow(x1 - x2, 2) + 
    Math.pow(y1 - y2, 2) + 
    Math.pow(z1 - z2, 2)
  );
};

// Check if hand is present in the frame
export const isHandDetected = (predictions: handpose.AnnotatedPrediction[]): boolean => {
  return predictions && predictions.length > 0;
};

// Normalize landmarks to be relative to hand size
export const normalizeLandmarks = (
  landmarks: Array<[number, number, number]>,
  handSize: number
): Array<[number, number, number]> => {
  return landmarks.map(([x, y, z]) => [x / handSize, y / handSize, z / handSize]);
};

// Get hand bounding box
export const getHandBoundingBox = (landmarks: Array<[number, number, number]>) => {
  if (!landmarks || landmarks.length === 0) return null;
  
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
};
