import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Uploads a file to Firebase Storage
 * @param {File} file - File object to upload
 * @param {string} path - The folder path in Firebase Storage (e.g., 'profilePictures/userId.jpg')
 * @param {Function} onProgress - Optional progress callback (percentage)
 * @returns {Promise<string>} - Resolves to the file's download URL
 */
export const uploadFile = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress.toFixed(0)); // e.g. "37"
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};