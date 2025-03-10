
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import {
  loadHandposeModel,
  recognizeASLLetter,
  isHandDetected,
  landmarksToFeatureVector
} from '@/utils/handUtils';

interface HandDetectionProps {
  webcamRef: React.RefObject<HTMLVideoElement>;
  onHandDetected?: (isDetected: boolean) => void;
  onLetterRecognized?: (letter: string) => void;
  onFeatureExtracted?: (features: number[]) => void;
  trainingMode?: boolean;
}

const HandDetection: React.FC<HandDetectionProps> = ({
  webcamRef,
  onHandDetected,
  onLetterRecognized,
  onFeatureExtracted,
  trainingMode = false
}) => {
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [detectedLetter, setDetectedLetter] = useState<string>('');
  const [handPresent, setHandPresent] = useState<boolean>(false);
  const lastToastTime = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const predictionLoop = useRef<number | null>(null);
  const featureExtractionTimeout = useRef<NodeJS.Timeout | null>(null);
  const skipFrames = useRef<number>(0);
  
  // Load the model
  useEffect(() => {
    async function initializeModel() {
      try {
        const loadedModel = await loadHandposeModel();
        setModel(loadedModel);
        setLoading(false);
        toast.success("Hand detection model loaded", {
          description: "Ready to recognize ASL gestures",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error loading handpose model:", error);
        toast.error("Failed to load hand detection model", {
          description: "Please refresh the page to try again",
          duration: 5000,
        });
        setLoading(false);
      }
    }
    
    initializeModel();
    
    return () => {
      if (predictionLoop.current) {
        cancelAnimationFrame(predictionLoop.current);
      }
      if (featureExtractionTimeout.current) {
        clearTimeout(featureExtractionTimeout.current);
      }
    };
  }, []);
  
  // Debounced feature extraction to improve performance
  const debouncedFeatureExtraction = useCallback((features: number[]) => {
    if (featureExtractionTimeout.current) {
      clearTimeout(featureExtractionTimeout.current);
    }
    
    featureExtractionTimeout.current = setTimeout(() => {
      if (features.length > 0 && onFeatureExtracted) {
        onFeatureExtracted(features);
      }
    }, 150); // 150ms debounce time
  }, [onFeatureExtracted]);
  
  // Draw hand landmarks
  const drawHand = useCallback((
    predictions: handpose.AnnotatedPrediction[],
    ctx: CanvasRenderingContext2D
  ) => {
    if (predictions.length > 0) {
      const prediction = predictions[0];
      const landmarks = prediction.landmarks;
      
      // Draw keypoints (only every other point for better performance)
      for (let i = 0; i < landmarks.length; i += 2) {
        const [x, y] = landmarks[i];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 3 * Math.PI);
        ctx.fillStyle = "#3B82F6"; // Blue
        ctx.fill();
      }
      
      // Draw lines between keypoints
      const fingerJoints = [
        [0, 1, 2, 3, 4], // Thumb
        [0, 5, 6, 7, 8], // Index
        [0, 9, 10, 11, 12], // Middle
        [0, 13, 14, 15, 16], // Ring
        [0, 17, 18, 19, 20] // Pinky
      ];
      
      // Draw lines (with simpler rendering)
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#60a5fa"; // Lighter blue
      
      fingerJoints.forEach((finger) => {
        ctx.beginPath();
        for (let i = 0; i < finger.length; i++) {
          const [x, y] = landmarks[finger[i]];
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
    }
  }, []);
  
  // Run predictions with frame skipping for performance
  useEffect(() => {
    if (!model || !webcamRef.current) return;
    
    const runPrediction = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.readyState === 4 &&
        canvasRef.current
      ) {
        // Skip frames for performance (process only every 2nd frame)
        if (skipFrames.current < 1) {
          skipFrames.current++;
          predictionLoop.current = requestAnimationFrame(runPrediction);
          return;
        }
        skipFrames.current = 0;
        
        try {
          // Get video dimensions
          const video = webcamRef.current;
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          
          // Set canvas dimensions
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;
          
          // Make predictions
          const predictions = await model.estimateHands(video);
          
          // Check if hand is detected
          const handDetected = isHandDetected(predictions);
          
          // Notify about hand detection state changes
          if (handDetected !== handPresent) {
            setHandPresent(handDetected);
            onHandDetected?.(handDetected);
            
            // Show toast when hand is detected, but limit frequency
            const now = Date.now();
            if (now - lastToastTime.current > 3000) {
              toast(`Hand ${handDetected ? "detected" : "lost"}`, {
                duration: 1500,
              });
              lastToastTime.current = now;
            }
          }
          
          // Process hand when detected
          if (handDetected && predictions.length > 0) {
            const landmarks = predictions[0].landmarks;
            
            // In training mode, extract features when hand is detected
            if (trainingMode) {
              const features = landmarksToFeatureVector(landmarks);
              if (features.length > 0) {
                debouncedFeatureExtraction(features);
              }
            } 
            // In recognition mode, recognize letters
            else {
              const letter = recognizeASLLetter(predictions);
              if (letter && letter !== detectedLetter) {
                setDetectedLetter(letter);
                onLetterRecognized?.(letter);
              } else if (!letter && detectedLetter) {
                setDetectedLetter('');
              }
            }
            
            // Draw hand landmarks on canvas
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, videoWidth, videoHeight);
              drawHand(predictions, ctx);
            }
          } else {
            // Clear canvas if no hand
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, videoWidth, videoHeight);
            }
            
            if (detectedLetter) {
              setDetectedLetter('');
            }
          }
        } catch (error) {
          console.error("Error during hand detection:", error);
        }
      }
      
      // Continue prediction loop
      predictionLoop.current = requestAnimationFrame(runPrediction);
    };
    
    runPrediction();
    
    return () => {
      if (predictionLoop.current) {
        cancelAnimationFrame(predictionLoop.current);
      }
    };
  }, [model, webcamRef, detectedLetter, handPresent, onHandDetected, onLetterRecognized, debouncedFeatureExtraction, trainingMode, drawHand]);
  
  // Simple loading view
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8">
        <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin mb-2" />
        <p className="text-base sm:text-lg font-medium text-center">Loading hand detection model...</p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-2">This may take a moment</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      />
      
      {handPresent && detectedLetter && !trainingMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute bottom-3 sm:bottom-5 left-0 right-0 mx-auto flex justify-center z-20"
        >
          <div className="glass px-3 sm:px-6 py-2 sm:py-3 rounded-full">
            <span className="text-base sm:text-xl font-medium">
              Detected: <span className="text-primary font-bold">{detectedLetter}</span>
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HandDetection;
