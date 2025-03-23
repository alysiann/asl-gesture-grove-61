
# ASL Recognition System

This application is a Sign Language recognition system that uses machine learning to detect and recognize hand gestures in real-time. It supports both American Sign Language (ASL) and Filipino Sign Language (FSL), allowing users to train custom gestures for improved accuracy.

## Project Overview

**URL**: https://lovable.dev/projects/1eb87f48-f66c-4bb5-b43a-a8e493148622

## Features

- **Multilingual Sign Language Support**: 
  - American Sign Language (ASL) alphabet recognition
  - Filipino Sign Language (FSL) alphabet recognition
- **Real-time Letter Recognition**: Recognizes sign language alphabet gestures through a webcam
- **Custom Training Mode**: Train the system with your own hand gestures for improved accuracy
- **Combined Recognition Model**: Uses both pre-trained defaults and user training data
- **Gesture History**: Tracks recently recognized gestures 
- **Visual Reference**: Shows the alphabet for learning purposes
- **Language Switching**: Easily switch between ASL and FSL

## How It Works

### Recognition System

The application uses TensorFlow.js and the Handpose model to detect hand landmarks in real-time through the user's webcam. These landmarks are processed to extract features which are then compared against training data to recognize the corresponding sign language letter.

#### Technical Process:

1. **Hand Detection**: The webcam feed is processed by the TensorFlow Handpose model to identify hand landmarks (21 key points on each hand)
2. **Feature Extraction**: Hand landmarks are converted to normalized feature vectors relative to palm position
3. **Gesture Classification**: Feature vectors are compared against training data using distance calculations
4. **Letter Recognition**: The closest matching gesture is identified and displayed

### Training System

Users can train the system with custom gestures to improve recognition accuracy for their specific hand shapes and signing style. The system supports training for both ASL and FSL.

#### Training Process:

1. Select the sign language (ASL or FSL)
2. Select a letter to train from A-Z (plus Ñ and NG for FSL)
3. Position your hand in the sign language gesture for that letter
4. Capture multiple samples (5-10 recommended) with slight variations
5. Save the training data
6. Repeat for different letters as needed

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
3. **Training Service**: Manages saving and loading of training data for different sign languages
4. **Hand Utilities**: Contains algorithms for feature extraction and gesture recognition
5. **Recognition/Training Pages**: User interfaces for the two main application modes
6. **Language Selector**: UI for switching between sign languages

## How to Use

### Recognition Mode

1. Navigate to the Recognition page
2. Select your preferred sign language (ASL or FSL)
3. Allow camera access when prompted
4. Position your hand in frame making sign language letter gestures
5. The system will display recognized letters in real-time
6. Recently recognized letters appear in the history panel

### Training Mode

1. Navigate to the Training page
2. Select your preferred sign language (ASL or FSL)
3. Select a letter to train from the grid
4. Position your hand in the sign language gesture for that letter
5. Click "Capture Sample" to store the current hand position
6. Capture 5-10 samples with slight variations
7. Click "Save Training Data" when finished
8. Repeat for each letter you want to train

## Data Storage

The application stores all training data in the browser's localStorage:

- **ASL user training data**: Stored under the key 'asl-training-data'
- **FSL user training data**: Stored under the key 'fsl-training-data'
- **Default training data cache**: Stored under the keys 'asl-default-alphabet-cache' and 'fsl-default-alphabet-cache'
- **Current language preference**: Stored under the key 'current-sign-language'

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

### Lovable Platform
Simply open [Lovable](https://lovable.dev/projects/1eb87f48-f66c-4bb5-b43a-a8e493148622) and click on Share -> Publish.

### Deployment to Vercel, Netlify, or Other Hosting Services

This application can be easily deployed on various free hosting platforms:

#### Vercel
1. Create a Vercel account if you don't have one
2. Connect your GitHub repository to Vercel
3. Configure the build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy the application

#### Netlify
1. Create a Netlify account
2. Connect your GitHub repository or upload the build folder directly
3. Configure the build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
4. Deploy the application

#### GitHub Pages
1. Add a `homepage` field to your package.json: `"homepage": "https://yourusername.github.io/your-repo-name"`
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Add deployment scripts to package.json:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run `npm run deploy`

### Important Deployment Notes

Since this application uses the browser's camera, ensure your deployment has an HTTPS connection for WebRTC APIs to work properly. Most hosting services provide this by default.

The application is fully client-side and doesn't require a backend server, making it perfect for static site hosting platforms.

## Custom Domain Setup

We don't support custom domains yet. If you want to deploy your project under your own domain, we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Future Improvements

Potential enhancements for the system:

- Support for additional sign languages beyond ASL and FSL
- Support for full sign language words and phrases beyond individual letters
- Multi-hand detection for more complex gestures
- Improved recognition accuracy through deeper neural networks
- Offline support with model download for use without internet
- Integration with learning tools for sign language education
- Mobile app version using React Native

## License

This project is built using open-source libraries and technologies.
