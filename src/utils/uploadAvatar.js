const cloudinary = require("./cloudinary");
const streamifier = require("streamifier");

async function uploadAvatar(file) {
  if (!file) return null;
  return await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "workers" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
}

module.exports = uploadAvatar;
