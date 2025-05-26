const cloudinary = require("./cloudinary");
const streamifier = require("streamifier");

async function uploadFileCloudinary(file, folder) {
  if (!file) return null;
  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

module.exports = uploadFileCloudinary;
