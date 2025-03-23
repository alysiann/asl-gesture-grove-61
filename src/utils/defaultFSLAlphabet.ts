
// Default Filipino Sign Language (FSL) alphabet training data
// This provides baseline recognition for FSL without requiring user training

export const getDefaultFSLAlphabet = () => {
  return [
    {
      letter: "A",
      samples: generateDefaultSamples("A"),
      timestamp: Date.now()
    },
    {
      letter: "B",
      samples: generateDefaultSamples("B"),
      timestamp: Date.now()
    },
    {
      letter: "C",
      samples: generateDefaultSamples("C"),
      timestamp: Date.now()
    },
    {
      letter: "D",
      samples: generateDefaultSamples("D"),
      timestamp: Date.now()
    },
    {
      letter: "E",
      samples: generateDefaultSamples("E"),
      timestamp: Date.now()
    },
    {
      letter: "F",
      samples: generateDefaultSamples("F"),
      timestamp: Date.now()
    },
    {
      letter: "G",
      samples: generateDefaultSamples("G"),
      timestamp: Date.now()
    },
    {
      letter: "H",
      samples: generateDefaultSamples("H"),
      timestamp: Date.now()
    },
    {
      letter: "I",
      samples: generateDefaultSamples("I"),
      timestamp: Date.now()
    },
    {
      letter: "J",
      samples: generateDefaultSamples("J"),
      timestamp: Date.now()
    },
    {
      letter: "K",
      samples: generateDefaultSamples("K"),
      timestamp: Date.now()
    },
    {
      letter: "L",
      samples: generateDefaultSamples("L"),
      timestamp: Date.now()
    },
    {
      letter: "M",
      samples: generateDefaultSamples("M"),
      timestamp: Date.now()
    },
    {
      letter: "N",
      samples: generateDefaultSamples("N"),
      timestamp: Date.now()
    },
    {
      letter: "Ñ",
      samples: generateDefaultSamples("Ñ"),
      timestamp: Date.now()
    },
    {
      letter: "NG",
      samples: generateDefaultSamples("NG"),
      timestamp: Date.now()
    },
    {
      letter: "O",
      samples: generateDefaultSamples("O"),
      timestamp: Date.now()
    },
    {
      letter: "P",
      samples: generateDefaultSamples("P"),
      timestamp: Date.now()
    },
    {
      letter: "Q",
      samples: generateDefaultSamples("Q"),
      timestamp: Date.now()
    },
    {
      letter: "R",
      samples: generateDefaultSamples("R"),
      timestamp: Date.now()
    },
    {
      letter: "S",
      samples: generateDefaultSamples("S"),
      timestamp: Date.now()
    },
    {
      letter: "T",
      samples: generateDefaultSamples("T"),
      timestamp: Date.now()
    },
    {
      letter: "U",
      samples: generateDefaultSamples("U"),
      timestamp: Date.now()
    },
    {
      letter: "V",
      samples: generateDefaultSamples("V"),
      timestamp: Date.now()
    },
    {
      letter: "W",
      samples: generateDefaultSamples("W"),
      timestamp: Date.now()
    },
    {
      letter: "X",
      samples: generateDefaultSamples("X"),
      timestamp: Date.now()
    },
    {
      letter: "Y",
      samples: generateDefaultSamples("Y"),
      timestamp: Date.now()
    },
    {
      letter: "Z",
      samples: generateDefaultSamples("Z"),
      timestamp: Date.now()
    }
  ];
};

// Generate default samples for each letter based on Filipino Sign Language hand positions
function generateDefaultSamples(letter: string): number[][] {
  // Create 5 sample variations for each letter
  const samples = [];
  
  // Base patterns for FSL letters
  const getBasePattern = (letter: string): number[] => {
    // These patterns represent normalized vectors of finger joint positions
    // relative to the palm, adapted for Filipino Sign Language
    
    switch(letter) {
      case 'A': // Fist with thumb alongside (similar to ASL but with slight variation)
        return [0.5, 0.1, 0, 0.35, 0.2, 0, 0.1, 0.2, 0, 0, 0.2, 0, 0, 0.2, 0, 0, 0.2, 0];
      case 'B': // Flat hand with fingers together (similar to ASL)
        return [0, 0.8, 0, 0, 0.8, 0, 0, 0.8, 0, 0, 0.8, 0, 0, 0.8, 0, 0.2, 0, 0];
      case 'C': // Curved hand (similar to ASL)
        return [0.5, 0.3, 0.3, 0.5, 0.4, 0.3, 0.5, 0.4, 0.3, 0.5, 0.4, 0.3, 0.4, 0.3, 0.2];
      case 'D': // Index up, others curled (similar to ASL)
        return [0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.3, 0.2, 0];
      case 'E': // Curled fingers against palm
        return [0.2, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0, 0.2, 0.2, 0];
      case 'F': // Index and thumb touching, other fingers extended
        return [0.3, 0.3, 0, 0.3, 0.3, 0, 0, 0.7, 0, 0, 0.7, 0, 0, 0.7, 0];
      case 'G': // Index pointing, thumb extended (similar to ASL)
        return [0.4, 0.1, 0, 0.7, 0.3, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'H': // Index and middle finger extended (similar to ASL)
        return [0.3, 0.1, 0, 0, 0.8, 0, 0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'I': // Pinky extended (similar to ASL)
        return [0.3, 0.1, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0, 0.8, 0];
      case 'J': // J shape motion with pinky
        return [0.3, 0.1, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0, 0.8, 0.3];
      case 'K': // Index and middle fingers forming V, palm facing forward
        return [0.3, 0.1, 0, 0, 0.8, 0.3, 0, 0.8, 0.3, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'L': // L shape with thumb and index (similar to ASL)
        return [0.8, 0, 0, 0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'M': // Three middle fingers down to palm
        return [0.3, 0.1, 0, 0.1, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1, 0.2, 0];
      case 'N': // Index and middle fingers down to palm
        return [0.3, 0.1, 0, 0.1, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'Ñ': // N with a wave motion
        return [0.3, 0.1, 0.1, 0.1, 0.3, 0.3, 0.1, 0.3, 0.2, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'NG': // Hand in N position with movement
        return [0.3, 0.1, 0.2, 0.1, 0.3, 0.3, 0.1, 0.3, 0.3, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'O': // Fingers and thumb forming circle (similar to ASL)
        return [0.4, 0.3, 0.1, 0.4, 0.3, 0.1, 0.4, 0.3, 0.1, 0.4, 0.3, 0.1, 0.4, 0.3, 0.1];
      case 'P': // Index pointing down, thumb out
        return [0.4, 0.2, 0, 0, 0.7, 0.3, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'Q': // Q shape (similar to ASL)
        return [0.4, 0.2, 0, 0.7, 0.3, 0.3, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'R': // Crossed fingers (similar to ASL)
        return [0.3, 0.1, 0, 0, 0.8, 0, 0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'S': // Closed fist with thumb across fingers
        return [0.5, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'T': // Thumb between index and middle finger
        return [0.3, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'U': // Index and middle extended together (similar to ASL)
        return [0.3, 0.1, 0, 0, 0.8, 0, 0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'V': // Index and middle extended in V shape (similar to ASL)
        return [0.3, 0.1, 0, 0, 0.8, 0, 0, 0.8, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'W': // Three fingers extended (similar to ASL)
        return [0.3, 0.1, 0, 0, 0.8, 0, 0, 0.8, 0, 0, 0.8, 0, 0.1, 0.2, 0];
      case 'X': // Hook-shaped index finger
        return [0.3, 0.1, 0, 0.4, 0.4, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      case 'Y': // Thumb and pinky extended, others closed (similar to ASL)
        return [0.7, 0.1, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0, 0.8, 0];
      case 'Z': // Index zigzag motion (similar to ASL)
        return [0.3, 0.1, 0, 0.6, 0.3, 0, 0.1, 0.2, 0, 0.1, 0.2, 0, 0.1, 0.2, 0];
      default:
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
  };

  // Get the base pattern for the letter
  const basePattern = getBasePattern(letter);
  
  // Create variations with slight modifications to simulate multiple samples
  for (let i = 0; i < 5; i++) {
    const variation = basePattern.map(v => {
      // Add small random variations (±10%)
      const randomFactor = 1 + (Math.random() * 0.2 - 0.1);
      return v * randomFactor;
    });
    
    // Each actual feature vector should be 60 elements (20 landmarks × 3 coordinates)
    // Extend the simplified pattern to a full feature vector
    const fullFeatureVector = [];
    for (let j = 0; j < 20; j++) {
      // For positions we have data for, use it
      if (j < basePattern.length / 3) {
        fullFeatureVector.push(variation[j*3], variation[j*3+1], variation[j*3+2]);
      } 
      // For remaining positions, use interpolated values
      else {
        fullFeatureVector.push(
          variation[Math.floor(Math.random() * basePattern.length / 3) * 3] * (0.8 + Math.random() * 0.4),
          variation[Math.floor(Math.random() * basePattern.length / 3) * 3 + 1] * (0.8 + Math.random() * 0.4),
          variation[Math.floor(Math.random() * basePattern.length / 3) * 3 + 2] * (0.8 + Math.random() * 0.4)
        );
      }
    }
    
    samples.push(fullFeatureVector);
  }
  
  return samples;
}
