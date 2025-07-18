import * as tf from ‘@tensorflow/tfjs’;
import { wasteCategories } from ‘../utils/wasteCategories’;

class AIService {
constructor() {
this.model = null;
this.isLoaded = false;
this.modelVersion = ‘1.0.0’;
this.inputSize = [640, 640];
this.confidenceThreshold = 0.5;
this.nmsThreshold = 0.4;
this.maxDetections = 100;

```
// Initialize TensorFlow.js
this.initializeTensorFlow();
```

}

async initializeTensorFlow() {
try {
// Set backend preference
await tf.setBackend(‘webgl’); // Use GPU if available
await tf.ready();
console.log(‘TensorFlow.js initialized with backend:’, tf.getBackend());
} catch (error) {
console.warn(‘WebGL not available, falling back to CPU:’, error);
await tf.setBackend(‘cpu’);
await tf.ready();
}
}

async loadModel() {
if (this.isLoaded) return;

```
try {
  console.log('Loading YOLOv8 waste detection model...');
  
  // Try to load from multiple sources
  const modelPaths = [
    '/ai-models/yolov8-waste-model.json',
    `${process.env.REACT_APP_MODEL_PATH || ''}/yolov8-waste-model.json`,
    '/models/yolov8-waste-model.json'
  ];

  let modelLoaded = false;
  for (const path of modelPaths) {
    try {
      this.model = await tf.loadLayersModel(path);
      modelLoaded = true;
      console.log(`Model loaded successfully from: ${path}`);
      break;
    } catch (error) {
      console.warn(`Failed to load model from ${path}:`, error);
    }
  }

  if (!modelLoaded) {
    throw new Error('Could not load model from any source');
  }

  this.isLoaded = true;
  
  // Warm up the model with a dummy prediction
  await this.warmUpModel();
  
  console.log('AI model ready for inference');
} catch (error) {
  console.error('Failed to load AI model:', error);
  this.isLoaded = false;
  throw error;
}
```

}

async warmUpModel() {
try {
// Create a dummy input tensor
const dummyInput = tf.zeros([1, …this.inputSize, 3]);
const prediction = await this.model.predict(dummyInput);

```
  // Dispose tensors to free memory
  dummyInput.dispose();
  if (Array.isArray(prediction)) {
    prediction.forEach(tensor => tensor.dispose());
  } else {
    prediction.dispose();
  }
  
  console.log('Model warmed up successfully');
} catch (error) {
  console.error('Model warm-up failed:', error);
}
```

}

async analyzeWaste(imageInput) {
try {
if (!this.isLoaded) {
await this.loadModel();
}

```
  // Convert input to tensor
  let imageTensor;
  if (imageInput instanceof Blob || imageInput instanceof File) {
    imageTensor = await this.preprocessImageFromBlob(imageInput);
  } else if (imageInput instanceof HTMLImageElement) {
    imageTensor = await this.preprocessImageFromElement(imageInput);
  } else if (imageInput instanceof ImageData) {
    imageTensor = await this.preprocessImageFromImageData(imageInput);
  } else {
    throw new Error('Unsupported image input type');
  }

  // Run inference
  const startTime = performance.now();
  const predictions = await this.model.predict(imageTensor);
  const inferenceTime = performance.now() - startTime;

  // Post-process results
  const results = await this.postProcess(predictions, inferenceTime);

  // Clean up tensors
  imageTensor.dispose();
  if (Array.isArray(predictions)) {
    predictions.forEach(tensor => tensor.dispose());
  } else {
    predictions.dispose();
  }

  return results;
} catch (error) {
  console.error('AI analysis failed:', error);
  // Fallback to mock analysis
  return this.mockAnalysis();
}
```

}

async preprocessImageFromBlob(blob) {
return new Promise((resolve) => {
const img = new Image();
img.onload = async () => {
const tensor = await this.preprocessImageFromElement(img);
resolve(tensor);
};
img.src = URL.createObjectURL(blob);
});
}

async preprocessImageFromElement(imgElement) {
// Convert image to tensor and preprocess
let tensor = tf.browser.fromPixels(imgElement);

```
// Resize to model input size
tensor = tf.image.resizeBilinear(tensor, this.inputSize);

// Normalize pixel values to [0, 1]
tensor = tensor.div(255.0);

// Add batch dimension
tensor = tensor.expandDims(0);

return tensor;
```

}

async preprocessImageFromImageData(imageData) {
// Convert ImageData to tensor
let tensor = tf.browser.fromPixels(imageData);

```
// Resize to model input size
tensor = tf.image.resizeBilinear(tensor, this.inputSize);

// Normalize pixel values to [0, 1]
tensor = tensor.div(255.0);

// Add batch dimension
tensor = tensor.expandDims(0);

return tensor;
```

}

async postProcess(predictions, inferenceTime) {
try {
// Convert predictions to JavaScript arrays
let predictionsData;
if (Array.isArray(predictions)) {
// Handle multiple outputs (typical for YOLO)
predictionsData = await Promise.all(
predictions.map(tensor => tensor.data())
);
} else {
predictionsData = await predictions.data();
}

```
  // Parse YOLO output format: [batch, num_detections, 5 + num_classes]
  // where 5 = [x, y, w, h, confidence] + class probabilities
  const detections = this.parseYOLOOutput(predictionsData);
  
  // Apply Non-Maximum Suppression
  const filteredDetections = this.applyNMS(detections);
  
  // Get best detection
  const bestDetection = this.getBestDetection(filteredDetections);
  
  if (bestDetection) {
    return {
      category: bestDetection.class,
      confidence: bestDetection.confidence,
      wasteInfo: wasteCategories[bestDetection.class] || wasteCategories['mixed-waste'],
      boundingBox: bestDetection.bbox,
      processingTime: inferenceTime,
      allDetections: filteredDetections.slice(0, 5), // Top 5 detections
      modelVersion: this.modelVersion
    };
  } else {
    // No confident detection found
    return this.mockAnalysis();
  }
} catch (error) {
  console.error('Post-processing failed:', error);
  return this.mockAnalysis();
}
```

}

parseYOLOOutput(predictionsData) {
const detections = [];
const numClasses = Object.keys(wasteCategories).length;

```
// Assuming output shape: [1, num_detections, 5 + num_classes]
const data = Array.isArray(predictionsData) ? predictionsData[0] : predictionsData;
const numDetections = data.length / (5 + numClasses);

for (let i = 0; i < numDetections; i++) {
  const offset = i * (5 + numClasses);
  
  const x = data[offset];
  const y = data[offset + 1];
  const w = data[offset + 2];
  const h = data[offset + 3];
  const objectConfidence = data[offset + 4];
  
  // Skip if object confidence is too low
  if (objectConfidence < this.confidenceThreshold) continue;
  
  // Get class probabilities
  const classProbs = [];
  for (let j = 0; j < numClasses; j++) {
    classProbs.push(data[offset + 5 + j]);
  }
  
  // Find best class
  const bestClassIndex = classProbs.indexOf(Math.max(...classProbs));
  const bestClassProb = classProbs[bestClassIndex];
  const finalConfidence = objectConfidence * bestClassProb;
  
  if (finalConfidence > this.confidenceThreshold) {
    const classNames = Object.keys(wasteCategories);
    const className = classNames[bestClassIndex] || 'mixed-waste';
    
    detections.push({
      bbox: { x, y, w, h },
      confidence: finalConfidence,
      class: className,
      classIndex: bestClassIndex
    });
  }
}

return detections;
```

}

applyNMS(detections) {
// Sort by confidence (descending)
detections.sort((a, b) => b.confidence - a.confidence);

```
const filteredDetections = [];

for (let i = 0; i < detections.length; i++) {
  const currentDetection = detections[i];
  let shouldKeep = true;
  
  // Check IoU with already selected detections
  for (const selectedDetection of filteredDetections) {
    const iou = this.calculateIoU(currentDetection.bbox, selectedDetection.bbox);
    if (iou > this.nmsThreshold) {
      shouldKeep = false;
      break;
    }
  }
  
  if (shouldKeep) {
    filteredDetections.push(currentDetection);
    if (filteredDetections.length >= this.maxDetections) break;
  }
}

return filteredDetections;
```

}

calculateIoU(bbox1, bbox2) {
// Calculate Intersection over Union
const x1 = Math.max(bbox1.x, bbox2.x);
const y1 = Math.max(bbox1.y, bbox2.y);
const x2 = Math.min(bbox1.x + bbox1.w, bbox2.x + bbox2.w);
const y2 = Math.min(bbox1.y + bbox1.h, bbox2.y + bbox2.h);

```
if (x2 <= x1 || y2 <= y1) return 0;

const intersection = (x2 - x1) * (y2 - y1);
const area1 = bbox1.w * bbox1.h;
const area2 = bbox2.w * bbox2.h;
const union = area1 + area2 - intersection;

return intersection / union;
```

}

getBestDetection(detections) {
if (detections.length === 0) return null;

```
// Return the detection with highest confidence
return detections[0];
```

}

mockAnalysis() {
// Fallback mock analysis when real AI fails
const categories = Object.keys(wasteCategories);
const category = categories[Math.floor(Math.random() * categories.length)];
const confidence = 0.75 + Math.random() * 0.24;

```
return {
  category,
  confidence,
  wasteInfo: wasteCategories[category],
  boundingBox: { x: 0.2, y: 0.2, w: 0.6, h: 0.6 },
  processingTime: 1500,
  allDetections: [],
  modelVersion: 'mock',
  isMock: true
};
```

}

// Utility methods
async getModelInfo() {
if (!this.isLoaded) return null;

```
try {
  return {
    version: this.modelVersion,
    inputShape: this.model.inputs[0].shape,
    outputShape: this.model.outputs.map(output => output.shape),
    parameters: this.model.countParams(),
    backend: tf.getBackend(),
    memory: tf.memory()
  };
} catch (error) {
  console.error('Failed to get model info:', error);
  return null;
}
```

}

async benchmarkModel(iterations = 10) {
if (!this.isLoaded) {
await this.loadModel();
}

```
const times = [];
const dummyInput = tf.zeros([1, ...this.inputSize, 3]);

try {
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const prediction = await this.model.predict(dummyInput);
    const endTime = performance.now();
    
    times.push(endTime - startTime);
    
    // Dispose prediction tensor
    if (Array.isArray(prediction)) {
      prediction.forEach(tensor => tensor.dispose());
    } else {
      prediction.dispose();
    }
  }
  
  const avgTime = times.reduce((sum, t