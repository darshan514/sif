/**
 * Biometric facial feature extraction & similarity matching.
 * Includes skin-tone ratio & luminance variance check to verify face presence.
 */

export const detectFacePresence = (canvas) => {
  const ctx = canvas.getContext('2d');
  const width = canvas.width || 300;
  const height = canvas.height || 300;

  if (width === 0 || height === 0) return false;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalPixels = width * height;

  let skinPixelCount = 0;
  let luminanceSum = 0;
  let luminanceSqSum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    luminanceSum += lum;
    luminanceSqSum += lum * lum;

    // Standard RGB skin tone heuristic
    const isSkin =
      r > 60 &&
      g > 35 &&
      b > 20 &&
      r > g &&
      r > b &&
      Math.abs(r - g) > 12 &&
      r - Math.min(g, b) > 10;

    if (isSkin) skinPixelCount++;
  }

  const meanLum = luminanceSum / totalPixels;
  const varianceLum = luminanceSqSum / totalPixels - meanLum * meanLum;
  const skinRatio = skinPixelCount / totalPixels;

  // Face requires minimum skin tone distribution and lighting contrast variance
  const hasFace = skinRatio >= 0.06 && varianceLum >= 80;

  return {
    hasFace,
    skinRatio: (skinRatio * 100).toFixed(1),
    variance: varianceLum.toFixed(1),
  };
};

export const extractFaceEmbeddings = (canvas) => {
  const presence = detectFacePresence(canvas);
  if (!presence.hasFace) {
    return { hasFace: false, embedding: [] };
  }

  const ctx = canvas.getContext('2d');
  const width = canvas.width || 300;
  const height = canvas.height || 300;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // Divide canvas into an 8x8 grid (64 sub-regions)
  const gridSize = 8;
  const cellWidth = Math.floor(width / gridSize);
  const cellHeight = Math.floor(height / gridSize);
  const vector = [];

  for (let gy = 0; gy < gridSize; gy++) {
    for (let gx = 0; gx < gridSize; gx++) {
      let sumLuminance = 0;
      let count = 0;

      for (let y = gy * cellHeight; y < (gy + 1) * cellHeight; y++) {
        for (let x = gx * cellWidth; x < (gx + 1) * cellWidth; x++) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          sumLuminance += lum;
          count++;
        }
      }

      vector.push(count > 0 ? sumLuminance / count : 0);
    }
  }

  // L2 Normalize vector
  const norm = Math.sqrt(vector.reduce((acc, val) => acc + val * val, 0)) || 1;
  const normalizedVector = vector.map(val => val / norm);

  return {
    hasFace: true,
    embedding: normalizedVector,
  };
};

export const calculateSimilarity = (vecA = [], vecB = []) => {
  if (!vecA.length || !vecB.length || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
};

export default {
  detectFacePresence,
  extractFaceEmbeddings,
  calculateSimilarity,
};
