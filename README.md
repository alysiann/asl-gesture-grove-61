
# ASL Recognition System

This application is an American Sign Language (ASL) recognition system that uses machine learning to detect and recognize hand gestures in real-time. It allows users to train custom gestures for improved accuracy.

## Project Overview

**URL**: https://lovable.dev/projects/1eb87f48-f66c-4bb5-b43a-a8e493148622

## Features

- **Real-time ASL Letter Recognition**: Recognizes American Sign Language alphabet gestures through a webcam
- **Custom Training Mode**: Train the system with your own hand gestures for improved accuracy
- **Combined Recognition Model**: Uses both pre-trained defaults and user training data
- **Gesture History**: Tracks recently recognized gestures 
- **Visual Reference**: Shows the ASL alphabet for learning purposes

## How It Works

### Recognition System

The application uses TensorFlow.js and the Handpose model to detect hand landmarks in real-time through the user's webcam. These landmarks are processed to extract features which are then compared against training data to recognize the corresponding ASL letter.

#### Technical Process:

1. **Hand Detection**: The webcam feed is processed by the TensorFlow Handpose model to identify hand landmarks (21 key points on each hand)
2. **Feature Extraction**: Hand landmarks are converted to normalized feature vectors relative to palm position
3. **Gesture Classification**: Feature vectors are compared against training data using distance calculations
4. **Letter Recognition**: The closest matching gesture is identified and displayed

### Training System

Users can train the system with custom gestures to improve recognition accuracy for their specific hand shapes and signing style.

#### Training Process:

1. Select a letter to train from A-Z
2. Position your hand in the ASL gesture for that letter
3. Capture multiple samples (5-10 recommended) with slight variations
4. Save the training data
5. Repeat for different letters as needed

The system combines user-trained data with default training data, prioritizing user-trained gestures when available.

## Technology Stack

### Core Technologies

- **Frontend**: React, TypeScript, Vite
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Animation**: Framer Motion
- **State Management**: React Hooks and Context
- **Hand Detection**: TensorFlow.js and Handpose model

### Key Libraries

- **[@tensorflow-models/handpose](https://github.com/tensorflow/tfjs-models/tree/master/handpose)**: Pre-trained model for hand pose detection
- **[@tensorflow/tfjs](https://www.tensorflow.org/js)**: Core TensorFlow.js library for machine learning in the browser
- **[framer-motion](https://www.framer.com/motion/)**: Animation library for React
- **[lucide-react](https://lucide.dev/)**: Icon library
- **[sonner](https://sonner.emilkowal.ski/)**: Toast notification system
- **[shadcn/ui](https://ui.shadcn.com/)**: UI component library based on Radix UI

## Application Architecture

The application is structured around these key components:

1. **Webcam Component**: Handles camera access and video display
2. **HandDetection Component**: Processes video frames through the Handpose model
3. **Training Service**: Manages saving and loading of training data
4. **Hand Utilities**: Contains algorithms for feature extraction and gesture recognition
5. **Recognition/Training Pages**: User interfaces for the two main application modes

## How to Use

### Recognition Mode

1. Navigate to the Recognition page
2. Allow camera access when prompted
3. Position your hand in frame making ASL letter gestures
4. The system will display recognized letters in real-time
5. Recently recognized letters appear in the history panel

### Training Mode

1. Navigate to the Training page
2. Select a letter to train from the grid
3. Position your hand in the ASL gesture for that letter
4. Click "Capture Sample" to store the current hand position
5. Capture 5-10 samples with slight variations
6. Click "Save Training Data" when finished
7. Repeat for each letter you want to train

## Data Storage

The application stores all training data in the browser's localStorage:

- **User training data**: Stored under the key 'asl-training-data'
- **Default training data cache**: Stored under the key 'asl-default-alphabet-cache'

No data is sent to external servers, ensuring privacy.

## Performance Considerations

- The application uses frame skipping and feature caching to optimize performance
- The handpose model is configured with optimized detection parameters
- Default training data is cached in localStorage for faster access

## How to Run the Project Locally

Follow these steps to run the project locally:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## Deployment

Simply open [Lovable](https://lovable.dev/projects/1eb87f48-f66c-4bb5-b43a-a8e493148622) and click on Share -> Publish.

## Custom Domain Setup

We don't support custom domains yet. If you want to deploy your project under your own domain, we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Future Improvements

Potential enhancements for the system:

- Support for full ASL words and phrases beyond individual letters
- Multi-hand detection for more complex gestures
- Improved recognition accuracy through deeper neural networks
- Offline support with model download for use without internet
- Integration with learning tools for ASL education

## License

This project is built using open-source libraries and technologies.
