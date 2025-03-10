
import React, { useEffect, useRef, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import {
  loadHandposeModel,
  recognizeASLLetter,
  isHandDetected
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
  
  // Extract feature vector from landmarks
  const extractFeatures = (landmarks: Array<[number, number, number]>): number[] => {
    if (!landmarks || landmarks.length < 21) return [];
    
    // Extract relative positions of fingers to palm
    const palmPosition = landmarks[0]; // Base of palm
    
    // Create a normalized feature vector (relative to palm position)
    const featureVector: number[] = [];
    
    // For each landmark, compute position relative to palm
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
  
  // Load the model
  useEffect(() => {
    async function initializeModel() {
      const loadedModel = await loadHandposeModel();
      setModel(loadedModel);
      setLoading(false);
      toast("Hand detection model loaded", {
        description: "Ready to recognize ASL gestures",
        duration: 3000,
      });
    }
    
    initializeModel();
    
    return () => {
      if (predictionLoop.current) {
        cancelAnimationFrame(predictionLoop.current);
      }
    };
  }, []);
  
  // Run predictions
  useEffect(() => {
    if (!model || !webcamRef.current) return;
    
    const runPrediction = async () => {
      if (
        webcamRef.current &&
        webcamRef.current.readyState === 4 &&
        canvasRef.current
      ) {
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
          if (handDetected && now - lastToastTime.current > 3000) {
            toast(`Hand ${handDetected ? "detected" : "lost"}`, {
              duration: 1500,
            });
            lastToastTime.current = now;
          }
        }
        
        // In training mode, extract features when hand is detected
        if (handDetected && predictions.length > 0) {
          const features = extractFeatures(predictions[0].landmarks);
          if (features.length > 0 && onFeatureExtracted && trainingMode) {
            onFeatureExtracted(features);
          }
          
          // Only recognize letters in recognition mode (not training)
          if (!trainingMode) {
            const letter = recognizeASLLetter(predictions);
            if (letter && letter !== detectedLetter) {
              setDetectedLetter(letter);
              onLetterRecognized?.(letter);
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
  }, [model, webcamRef, detectedLetter, handPresent, onHandDetected, onLetterRecognized, onFeatureExtracted, trainingMode]);
  
  // Draw hand landmarks
  const drawHand = (
    predictions: handpose.AnnotatedPrediction[],
    ctx: CanvasRenderingContext2D
  ) => {
    if (predictions.length > 0) {
      predictions.forEach((prediction) => {
        const landmarks = prediction.landmarks;
        
        // Draw keypoints
        for (let i = 0; i < landmarks.length; i++) {
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
        
        // Draw lines
        fingerJoints.forEach((finger) => {
          for (let i = 0; i < finger.length - 1; i++) {
            const [x1, y1] = landmarks[finger[i]];
            const [x2, y2] = landmarks[finger[i + 1]];
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#60a5fa"; // Lighter blue
            ctx.lineWidth = 3;
            ctx.stroke();
          }
        });
      });
    }
  };
  
  return (
    <div className="relative">
      {loading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
          <p className="text-lg font-medium text-center">Loading hand detection model...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
          />
          
          {handPresent && detectedLetter && !trainingMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-5 left-0 right-0 mx-auto flex justify-center z-20"
            >
              <div className="glass px-6 py-3 rounded-full">
                <span className="text-xl font-medium">
                  Detected: <span className="text-primary font-bold">{detectedLetter}</span>
                </span>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default HandDetection;
