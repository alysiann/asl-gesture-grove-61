
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import HandDetection from './HandDetection';

interface WebcamProps {
  onHandDetected?: (isDetected: boolean) => void;
  onLetterRecognized?: (letter: string) => void;
  onFeatureExtracted?: (features: number[]) => void;
  trainingMode?: boolean;
}

const Webcam: React.FC<WebcamProps> = ({ 
  onHandDetected,
  onLetterRecognized,
  onFeatureExtracted,
  trainingMode = false
}) => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const startWebcam = async () => {
    setError('');
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });
      
      streamRef.current = stream;
      
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        setIsStreaming(true);
        toast("Camera activated", {
          duration: 2000,
        });
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access your camera. Please check permissions and try again.');
      toast.error("Camera access denied", {
        description: "Please check your browser permissions",
      });
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (webcamRef.current) {
      webcamRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    toast("Camera deactivated", {
      duration: 2000,
    });
  };

  const toggleWebcam = () => {
    if (isStreaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  useEffect(() => {
    // Start webcam on component mount
    startWebcam();
    
    // Cleanup on unmount
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <motion.div 
      className="relative glass rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
    >
      <div className="relative aspect-video w-full max-w-3xl mx-auto">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-background/80">
            <CameraOff className="w-12 h-12 text-destructive mb-4" />
            <p className="text-lg font-medium text-center mb-2">{error}</p>
            <Button onClick={startWebcam} className="mt-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        )}
        
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
          onLoadedMetadata={() => setIsStreaming(true)}
        />
        
        {isStreaming && (
          <HandDetection 
            webcamRef={webcamRef} 
            onHandDetected={onHandDetected}
            onLetterRecognized={onLetterRecognized}
            onFeatureExtracted={onFeatureExtracted}
            trainingMode={trainingMode}
          />
        )}
        
        <div className="absolute bottom-4 right-4 z-20">
          <Button 
            onClick={toggleWebcam}
            size="icon" 
            variant={isStreaming ? "destructive" : "default"}
            className="rounded-full h-12 w-12 shadow-lg"
          >
            {isStreaming ? (
              <CameraOff className="w-5 h-5" />
            ) : (
              <Camera className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Webcam;
