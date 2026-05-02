import * as tf from "@tensorflow/tfjs";
import * as knnClassifier from "@tensorflow-models/knn-classifier";

const KNN_DATASET_KEY = "ecosorter_knn_dataset";

/**
 * Saves the KNN Classifier dataset to localStorage so it persists across reloads.
 */
export async function saveClassifierDataset(classifier: knnClassifier.KNNClassifier) {
  try {
    const dataset = classifier.getClassifierDataset();
    const datasetObj: Record<string, number[]> = {};

    for (const key in dataset) {
      // Get the tensor array data
      const data = await dataset[key].data();
      // Array.from converts Float32Array to standard array
      datasetObj[key] = Array.from(data);
    }

    const jsonStr = JSON.stringify({
      dataset: datasetObj,
      tensorsShape: dataset[Object.keys(dataset)[0]]?.shape || null
    });
    
    localStorage.setItem(KNN_DATASET_KEY, jsonStr);
    return true;
  } catch (err) {
    console.error("Error saving KNN dataset:", err);
    return false;
  }
}

/**
 * Loads the KNN Classifier dataset from localStorage.
 */
export function loadClassifierDataset(classifier: knnClassifier.KNNClassifier) {
  try {
    const jsonStr = localStorage.getItem(KNN_DATASET_KEY);
    if (!jsonStr) return false;

    const { dataset, tensorsShape } = JSON.parse(jsonStr);
    if (!dataset || Object.keys(dataset).length === 0 || !tensorsShape) return false;

    const tensorObj: { [label: string]: tf.Tensor2D } = {};

    for (const key in dataset) {
      tensorObj[key] = tf.tensor2d(dataset[key], tensorsShape);
    }

    classifier.setClassifierDataset(tensorObj);
    return true;
  } catch (err) {
    console.error("Error loading KNN dataset:", err);
    return false;
  }
}

/**
 * Clears the custom dataset
 */
export function clearClassifierDataset(classifier: knnClassifier.KNNClassifier) {
  classifier.clearAllClasses();
  localStorage.removeItem(KNN_DATASET_KEY);
}

/**
 * Checks if there's a custom dataset available
 */
export function hasCustomDataset(): boolean {
  return !!localStorage.getItem(KNN_DATASET_KEY);
}
