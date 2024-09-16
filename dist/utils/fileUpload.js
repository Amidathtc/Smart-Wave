"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerUpload = exports.uploadImages = void 0;
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const multer_1 = __importDefault(require("multer"));
// Set up multer for file uploads
const storage = multer_1.default.memoryStorage(); // Store files in memory for streaming
const upload = (0, multer_1.default)({ storage });
// Function to upload a single image to Cloudinary
const uploadSingleImage = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_1.default.v2.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result.secure_url); // Return the URL of the uploaded image
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(stream); // Stream the image buffer to Cloudinary
    });
};
// Function to upload multiple images to Cloudinary
const uploadImages = (files) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map((file) => uploadSingleImage(file)); // Map each file to an upload promise
    return Promise.all(uploadPromises); // Wait for all uploads to complete
});
exports.uploadImages = uploadImages;
// Export the multer upload middleware for multiple files
exports.multerUpload = upload.array("images", 10); // 'images' is the field name for the uploaded files, and 10 is the maximum number of files to accept
