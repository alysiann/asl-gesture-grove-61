
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
import { SignLanguage, getActiveSignLanguage } from '@/services/trainingService';

interface HandDetectionProps {
  webcamRef: React.RefObject<HTMLVideoElement>;
  onHandDetected?: (isDetected: boolean) => void;
  onLetterRecognized?: (letter: string) => void;
  onFeatureExtracted?: (features: number[]) => void;
  trainingMode?: boolean;
  signLanguage?: SignLanguage;
}

const HandDetection: React.FC<HandDetectionProps> = ({
  webcamRef,
  onHandDetected,
  onLetterRecognized,
  onFeatureExtracted,
  trainingMode = false,
  signLanguage
}) => {
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [detectedLetter, setDetectedLetter] = useState<string>('');
  const [handPresent, setHandPresent] = useState<boolean>(false);
  const [activeLanguage, setActiveLanguage] = useState<SignLanguage>(
    signLanguage || getActiveSignLanguage()
  );
  const lastToastTime = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const predictionLoop = useRef<number | null>(null);
  const featureExtractionTimeout = useRef<NodeJS.Timeout | null>(null);
  const skipFrames = useRef<number>(0);
  const modelError = useRef<boolean>(false);
  
  // Update active language when prop changes
  useEffect(() => {
    if (signLanguage) {
      setActiveLanguage(signLanguage);
    }
  }, [signLanguage]);
  
  // Load the model
  useEffect(() => {
    let isMounted = true;
    
    async function initializeModel() {
      try {
        console.log("Starting model initialization");
        const loadedModel = await loadHandposeModel();
        
        if (!isMounted) return;
        
        console.log("Model initialized successfully");
        setModel(loadedModel);
        setLoading(false);
        toast.success("Hand detection model loaded", {
          description: "Ready to recognize gestures",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error loading handpose model:", error);
        
        if (!isMounted) return;
        
        modelError.current = true;
        setLoading(false);
        toast.error("Failed to load hand detection model", {
          description: "Please refresh the page to try again",
          duration: 5000,
        });
      }
    }
    
    initializeModel();
    
    return () => {
      isMounted = false;
      
      if (predictionLoop.current) {
        cancelAnimationFrame(predictionLoop.current);
        predictionLoop.current = null;
      }
      
      if (featureExtractionTimeout.current) {
        clearTimeout(featureExtractionTimeout.current);
        featureExtractionTimeout.current = null;
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
    if (!predictions || predictions.length === 0) return;
    
    try {
      const prediction = predictions[0];
      const landmarks = prediction.landmarks;
      if (!landmarks || landmarks.length === 0) return;
      
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
          if (i >= landmarks.length) continue;
          
          const [x, y] = landmarks[finger[i]];
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });
    } catch (error) {
      console.error("Error drawing hand:", error);
    }
  }, []);
  
  // Run predictions with frame skipping for performance
  useEffect(() => {
    if (modelError.current || !model || !webcamRef.current) return;
    
    const runPrediction = async () => {
      if (
        !webcamRef.current ||
        webcamRef.current.readyState !== 4 ||
        !canvasRef.current
      ) {
        predictionLoop.current = requestAnimationFrame(runPrediction);
        return;
      }
      
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
        const canvas = canvasRef.current;
        canvas.width = videoWidth;
        canvas.height = videoHeight;
        
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
          // In recognition mode, recognize letters using the active language
          else {
            const letter = recognizeASLLetter(predictions, activeLanguage);
            if (letter && letter !== detectedLetter) {
              setDetectedLetter(letter);
              onLetterRecognized?.(letter);
            } else if (!letter && detectedLetter) {
              setDetectedLetter('');
            }
          }
          
          // Draw hand landmarks on canvas
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, videoWidth, videoHeight);
            drawHand(predictions, ctx);
          }
        } else {
          // Clear canvas if no hand
          const ctx = canvas.getContext('2d');
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
      
      // Continue prediction loop
      predictionLoop.current = requestAnimationFrame(runPrediction);
    };
    
    runPrediction();
    
    return () => {
      if (predictionLoop.current) {
        cancelAnimationFrame(predictionLoop.current);
        predictionLoop.current = null;
      }
    };
  }, [model, webcamRef, detectedLetter, handPresent, onHandDetected, onLetterRecognized, debouncedFeatureExtraction, trainingMode, drawHand, activeLanguage]);
  
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
  
  // Show error if model failed to load
  if (modelError.current) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg font-medium text-destructive mb-2">
          Could not load hand detection model
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Please try refreshing the page
        </p>
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
