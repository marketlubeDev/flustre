import React, { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";
import { IoClose } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/webm",
];

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Drawer to add a new Instagram video.
 * Pure UI for now – emits title and File on submit.
 */
const InstaVideoDrawer = ({ open, onClose, onSubmit, isSubmitting }) => {
  const fileInputRef = useRef(null);
  const thumbInputRef = useRef(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [thumbDragActive, setThumbDragActive] = useState(false);
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [thumbnailPreviews, setThumbnailPreviews] = useState([]);

  // Reset the form each time the drawer opens
  useEffect(() => {
    if (open) {
      setVideoTitle("");
      setFiles([]);
      setDragActive(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setThumbDragActive(false);
      if (thumbInputRef.current) thumbInputRef.current.value = "";
      thumbnailPreviews.forEach((u) => URL.revokeObjectURL(u));
      setThumbnailFiles([]);
      setThumbnailPreviews([]);
    }
  }, [open]);

  useEffect(() => {
    return () => {
      thumbnailPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [thumbnailPreviews]);

  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const picked = Array.from(fileList);
    const valid = [];
    const invalid = [];
    picked.forEach((f) => {
      if (ACCEPTED_VIDEO_TYPES.includes(f.type)) valid.push(f);
      else invalid.push(f.name);
    });
    if (invalid.length > 0) {
      toast.error(
        `Unsupported type for: ${invalid.slice(0, 3).join(", ")}${
          invalid.length > 3 ? ` and ${invalid.length - 3} more` : ""
        }`
      );
    }
    if (valid.length > 0) {
      setFiles((prev) => {
        const next = [...prev, ...valid];
        setThumbnailFiles((prevThumbs) => {
          const padded = [...prevThumbs];
          while (padded.length < next.length) padded.push(null);
          return padded;
        });
        setThumbnailPreviews((prevPrev) => {
          const padded = [...prevPrev];
          while (padded.length < next.length) padded.push("");
          return padded;
        });
        return next;
      });
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer?.files;
    handleFiles(dropped);
  };

  const onBrowse = (e) => {
    const picked = e.target.files;
    handleFiles(picked);
  };

  const submit = () => {
    if (!videoTitle.trim()) {
      toast.warn("Please enter a video title.");
      return;
    }
    if (!files || files.length === 0) {
      toast.warn("Please select at least one video file.");
      return;
    }
    if (thumbnailFiles.length !== files.length) {
      toast.warn("Please add one thumbnail per video.");
      return;
    }
    const missingIndex = thumbnailFiles.findIndex((f) => !f);
    if (missingIndex !== -1) {
      toast.warn(`Please select a thumbnail for video #${missingIndex + 1}.`);
      return;
    }
    onSubmit?.({ title: videoTitle.trim(), files, thumbnails: thumbnailFiles });
  };

  const clearAndClose = () => {
    setVideoTitle("");
    setFiles([]);
    setThumbDragActive(false);
    if (thumbInputRef.current) thumbInputRef.current.value = "";
    thumbnailPreviews.forEach((u) => URL.revokeObjectURL(u));
    setThumbnailFiles([]);
    setThumbnailPreviews([]);
    setSelectedThumbIndex(null);
    onClose?.();
  };

  const handleThumbForIndex = (index, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const picked = Array.from(fileList);
    const candidate = picked[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(candidate.type)) {
      toast.error("Unsupported thumbnail type. Use JPG, PNG, or WEBP.");
      return;
    }
    const existingUrl = thumbnailPreviews[index];
    if (existingUrl) URL.revokeObjectURL(existingUrl);
    const previewUrl = URL.createObjectURL(candidate);
    setThumbnailFiles((prev) => {
      const next = [...prev];
      next[index] = candidate;
      return next;
    });
    setThumbnailPreviews((prev) => {
      const next = [...prev];
      next[index] = previewUrl;
      return next;
    });
  };

  const onThumbDrop = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbDragActive(false);
    const dropped = e.dataTransfer?.files;
    handleThumbForIndex(index, dropped);
  };

  const onThumbBrowse = (index, e) => {
    const picked = e.target.files;
    handleThumbForIndex(index, picked);
  };

  return (
    <Drawer
      title={<span>Add new video</span>}
      closeIcon={
        <span className="text-gray-600 hover:text-gray-800 text-xl leading-none">
          <IoClose />
        </span>
      }
      open={open}
      onClose={clearAndClose}
      placement="right"
      width="36vw"
      destroyOnClose
      maskClosable
      rootClassName="insta-drawer"
      styles={{
        header: {
          padding: "16px 20px",
          borderBottom: "1px solid #e5e7eb",
          borderRadius: "12px 12px 0 0",
        },
        body: {
          padding: 16,
          borderRadius: "0 0 12px 12px",
        },
        wrapper: {
          marginRight: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
      footer={
        <div className="flex justify-between items-center px-4 py-2">
          <button
            type="button"
            onClick={clearAndClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(180deg, #6D0D26 0%, #A94962 100%)",
              borderRadius: "12px",
              borderBottom: "1px solid #B3536C",
              boxShadow: "0 2px 8px rgba(109, 13, 38, 0.25)",
            }}
          >
            {isSubmitting ? "Adding..." : "Add video"}
          </button>
        </div>
      }
    >
      <div className="px-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Video title
        </label>
        <input
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          placeholder="Enter video title (for admin use only)"
          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 outline-none shadow-sm focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 text-sm"
        />

        <div className="mt-4">
          <div
            onDragEnter={() => setDragActive(true)}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`relative flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed ${
              dragActive
                ? "border-rose-400 bg-rose-50"
                : "border-gray-200 bg-gray-50"
            } text-center`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_VIDEO_TYPES.join(",")}
              multiple
              className="hidden"
              onChange={onBrowse}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700"
            >
              <AiOutlinePlus />
            </button>
            <p className="mt-2 text-sm text-gray-600">
              Drop videos here, or browse
            </p>
            <p className="text-xs text-gray-400">
              MP4, WEBM or MOV (max. 20MB)
            </p>

            {files && files.length > 0 && (
              <div className="absolute bottom-3 left-3 right-3 text-xs text-gray-700 bg-white/90 rounded px-2 py-1 border border-gray-200 max-h-24 overflow-auto text-left">
                <div className="font-medium mb-1">
                  Selected ({files.length}):
                </div>
                <ul className="space-y-0.5">
                  {files.map((f, idx) => (
                    <li key={`${f.name}-${idx}`} className="truncate">
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {files && files.length > 0 && (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnails per video
            </label>
            {files.map((videoFile, idx) => (
              <div
                key={`${videoFile.name}-${idx}`}
                className="border border-gray-200 rounded-xl p-3 bg-white"
              >
                <div className="text-xs text-gray-600 mb-2 truncate">
                  Video {idx + 1}: {videoFile.name}
                </div>
                <div
                  onDragEnter={() => setThumbDragActive(true)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDragLeave={() => setThumbDragActive(false)}
                  onDrop={(e) => onThumbDrop(idx, e)}
                  className={`relative flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed ${
                    thumbDragActive
                      ? "border-rose-400 bg-rose-50"
                      : "border-gray-200 bg-gray-50"
                  } text-center`}
                >
                  <input
                    id={`thumb-input-${idx}`}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    className="hidden"
                    onChange={(e) => onThumbBrowse(idx, e)}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`thumb-input-${idx}`)?.click()
                    }
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700"
                  >
                    <AiOutlinePlus />
                  </button>
                  <p className="mt-2 text-sm text-gray-600">
                    Drop image here, or browse
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, or WEBP (max. 5MB)
                  </p>

                  {thumbnailFiles[idx] && (
                    <div className="absolute bottom-2 left-2 right-2 flex items-center gap-3 text-xs text-gray-700 bg-white/90 rounded px-2 py-1 border border-gray-200 text-left">
                      {thumbnailPreviews[idx] && (
                        <img
                          src={thumbnailPreviews[idx]}
                          alt={`thumb-${idx}`}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                        />
                      )}
                      <span className="truncate">
                        {thumbnailFiles[idx]?.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const url = thumbnailPreviews[idx];
                          if (url) URL.revokeObjectURL(url);
                          setThumbnailFiles((prev) =>
                            prev.map((t, i) => (i === idx ? null : t))
                          );
                          setThumbnailPreviews((prev) =>
                            prev.map((u, i) => (i === idx ? "" : u))
                          );
                        }}
                        className="ml-auto px-2 py-1 text-gray-600 hover:text-gray-800"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default InstaVideoDrawer;
