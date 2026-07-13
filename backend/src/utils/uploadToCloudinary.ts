import cloudinary from "#/config/cloudinary.js";

export function uploadToCloudinary(
  buffer: Buffer,
  folder = "photobook",
): Promise<{ photoUrl: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ photoUrl: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}
