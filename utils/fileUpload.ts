import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";
import multer from "multer";

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for streaming
const upload = multer({ storage });

// Function to upload a single image to Cloudinary
const uploadSingleImage = (file: Express.Multer.File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "image" },
      (error, result: any) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url); // Return the URL of the uploaded image
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream); // Stream the image buffer to Cloudinary
  });
};

// Function to upload multiple images to Cloudinary
export const uploadImages = async (
  files: Express.Multer.File[]
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadSingleImage(file)); // Map each file to an upload promise
  return Promise.all(uploadPromises); // Wait for all uploads to complete
};

// Export the multer upload middleware for multiple files
export const multerUpload = upload.array("images", 10); // 'images' is the field name for the uploaded files, and 10 is the maximum number of files to accept
