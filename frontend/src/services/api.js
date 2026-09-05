import axios from 'axios';

// Create a dedicated Axios instance
// Uses Vite proxy '/api/predict' in development, fallback directly to 'http://127.0.0.1:8000/predict'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sif_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Predict SIF risk for a safety observation report.
 * @param {string} reportText - The incident observation narrative
 * @returns {Promise<{ prediction: string, confidence: number, executionTimeMs: number }>}
 */
export const predictSIFRisk = async (reportText) => {
  const startTime = performance.now();
  
  if (!reportText || typeof reportText !== 'string' || !reportText.trim()) {
    throw new Error('Incident report text cannot be empty.');
  }

  try {
    // Make request to backend API
    const response = await apiClient.post('/predict', {
      report: reportText.trim(),
    });

    const endTime = performance.now();
    const executionTimeMs = Math.round(endTime - startTime);

    if (response.data && response.data.prediction !== undefined) {
      return {
        prediction: response.data.prediction, // "SIF" or "Non-SIF"
        confidence: parseFloat(response.data.confidence), // e.g. 66.99
        executionTimeMs: executionTimeMs || 142,
        timestamp: new Date().toISOString(),
        isDemoFallback: false,
      };
    } else {
      throw new Error('Invalid response structure received from AI server.');
    }
  } catch (error) {
    console.error('SIF AI API Request Error:', error);
    
    // Determine user-friendly error message
    let errorMessage = 'Unable to connect to AI server.';
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'AI server request timed out. Please try again.';
    } else if (error.response) {
      errorMessage = `Server error (${error.response.status}): ${error.response.data?.message || 'Prediction failed.'}`;
    } else if (error.request) {
      errorMessage = 'Unable to connect to AI server at http://127.0.0.1:8000. Please ensure the FastAPI backend is running.';
    } else {
      errorMessage = error.message || 'An unexpected error occurred.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    enhancedError.isNetworkError = !error.response;
    throw enhancedError;
  }
};

/**
 * Perform offline/demo prediction fallback based on keyword indicators
 * Used when backend FastAPI is offline during quick UI test / demo mode.
 */
export const predictDemoFallback = (reportText) => {
  const text = reportText.toLowerCase();
  const sifKeywords = [
    'height', 'harness', 'scaffold', 'fall', 'crane', 'rigging', 'confined space',
    'gas', 'leak', 'toxic', 'explosion', 'fire', 'high voltage', 'electric shock',
    'trench', 'cave-in', 'amputation', 'crushed', 'bypassed safety', 'loto', 'lockout'
  ];

  let matches = 0;
  sifKeywords.forEach(word => {
    if (text.includes(word)) matches++;
  });

  const isSIF = matches > 0 || text.length > 80;
  const baseConfidence = isSIF ? 74.50 : 88.20;
  const variance = Math.floor(Math.random() * 15);
  const confidence = Math.min(98.8, Math.max(58.0, baseConfidence + (matches * 4) + (variance / 10)));

  return {
    prediction: isSIF ? 'SIF' : 'Non-SIF',
    confidence: Number(confidence.toFixed(2)),
    executionTimeMs: 120 + Math.floor(Math.random() * 80),
    timestamp: new Date().toISOString(),
    isDemoFallback: true,
  };
};

export default {
  predictSIFRisk,
  predictDemoFallback,
};
