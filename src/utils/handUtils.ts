
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

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

// Process predictions to determine ASL letter
export const recognizeASLLetter = (predictions: handpose.AnnotatedPrediction[]): string => {
  if (!predictions || predictions.length === 0) {
    return '';
  }

  // This is a simplified example - a real implementation would need more complex logic
  // In production, this would use a trained model for accurate letter prediction
  // For now, we'll return a placeholder
  
  return 'A'; // Placeholder - will be replaced with actual recognition logic
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
