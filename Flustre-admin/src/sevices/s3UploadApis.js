import { axiosInstance } from "../axios/axiosInstance";

// Upload multiple images to S3. Accepts an array of File objects.
// Optional options: { folder?: string, filename?: string }
export const uploadMultipleImagesToS3 = async (files, options = {}) => {
  if (!Array.isArray(files) || files.length === 0) return [];

  const formData = new FormData();
  for (const file of files) {
    if (file instanceof File) {
      formData.append("images", file);
    }
  }

  if (options.folder) formData.append("folder", options.folder);
  if (options.filename) formData.append("filename", options.filename);

  const { data } = await axiosInstance.post(
    "/s3-upload/upload-multiple",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const images = data?.data?.images || [];
  return images.map((img) => img.url).filter(Boolean);
};
