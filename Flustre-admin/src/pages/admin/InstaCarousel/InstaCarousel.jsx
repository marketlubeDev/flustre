import React, { useEffect, useRef, useState } from "react";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { RiSortDesc } from "react-icons/ri";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { HiOutlineDotsVertical } from "react-icons/hi";
import SearchInput from "../../../components/common/SearchInput";
import Button from "../../../components/common/Button";
import InstaVideoDrawer from "./Components/InstaVideoDrawer";
import { toast } from "react-toastify";
import ConfirmationModal from "../../../components/Admin/ConfirmationModal";
import {
  createInstaCarouselVideo,
  getInstaCarouselVideos,
  updateInstaCarouselVideo,
  deleteInstaCarouselVideo,
} from "../../../sevices/instaCarouselApis";

function InstaVideoCard({
  id,
  src,
  title,
  isActive: initialActive,
  checked,
  onCheckedChange,
  onChanged,
  onRequestDelete,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isActive, setIsActive] = useState(!!initialActive);
  const [isBusy, setIsBusy] = useState(false);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[9/16] w-full relative">
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        controls={false}
        muted
        playsInline
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top overlay: checkbox, truncated title, 3-dots */}
      <div className="absolute top-0 left-0 right-0 px-2 py-1 flex items-center gap-2 bg-gradient-to-b from-black/60 to-transparent">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(id, e.target.checked)}
          className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
          aria-label="Select video"
        />
        <div className="flex-1 min-w-0 text-white text-xs truncate">
          {title}
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            className="p-1 rounded-full text-white/90 hover:text-white hover:bg-white/10"
            aria-label="More actions"
          >
            <HiOutlineDotsVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5 z-10">
              <button
                type="button"
                disabled={isBusy}
                onClick={async () => {
                  setIsBusy(true);
                  try {
                    const next = !isActive;
                    await updateInstaCarouselVideo(id, { isActive: next });
                    setIsActive(next);
                    onChanged?.();
                  } catch (e) {
                    toast.error("Failed to update status");
                  } finally {
                    setIsBusy(false);
                    setMenuOpen(false);
                  }
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
              >
                {isActive ? "Set inactive" : "Set active"}
              </button>
              <div className="h-px bg-gray-100" />
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onRequestDelete?.(id)}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={togglePlay}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-black/50 text-white hover:bg-black/60 focus:outline-none"
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        {isPlaying ? (
          <IoMdPause className="w-7 h-7" />
        ) : (
          <IoMdPlay className="w-7 h-7 translate-x-0.5" />
        )}
      </button>
      {/* Bottom gradient for subtle readability on thumbnails */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
function InstaCarousel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    id: null,
    isLoading: false,
  });
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    isOpen: false,
    isLoading: false,
  });

  const handleAddVideo = async ({ title, files, thumbnails }) => {
    if (!files || files.length === 0) return;
    setIsSubmitting(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const thumbnail = Array.isArray(thumbnails) ? thumbnails[i] : undefined;
        await createInstaCarouselVideo({ title, file, thumbnail });
      }
      setIsDrawerOpen(false);
      await fetchVideos();
      toast.success(
        `Added ${files.length} video${files.length > 1 ? "s" : ""} successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to add some videos");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchVideos = async () => {
    setIsLoading(true);
    try {
      const res = await getInstaCarouselVideos({
        search: searchTerm,
        sort: sortOption,
      });
      setVideos(res?.data || []);
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const anySelected = selectedIds.size > 0;
  const allSelected = videos.length > 0 && selectedIds.size === videos.length;

  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(new Set(videos.map((v) => v._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const onCardCheckedChange = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const deleteSelected = async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleteModal({ isOpen: true, isLoading: false });
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption]);

  useEffect(() => {
    const id = setTimeout(() => {
      fetchVideos();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full max-w-lg">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search video..."
              inputClassName="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 outline-none shadow-sm focus:bg-white focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 text-sm"
              containerClassName="relative flex-1"
            />

            <div className="relative">
              <RiSortDesc
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                aria-hidden="true"
              />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 outline-none shadow-sm focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 text-sm"
              >
                <option value="recent">Recently added</option>
                <option value="oldest">Oldest</option>
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
              </select>
            </div>
          </div>
          {anySelected ? (
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="accent-rose-500 w-4 h-4 rounded"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                />
                Select all
              </label>
              <Button variant="gradientRose" onClick={deleteSelected}>
                Delete selected
              </Button>
            </div>
          ) : (
            <Button
              variant="gradientRose"
              onClick={() => setIsDrawerOpen(true)}
            >
              <AiOutlineVideoCameraAdd className="w-4 h-4 mr-2" />
              Add New Video
            </Button>
          )}
        </div>
      </div>

      <div className="px-6 pb-10">
        {isLoading ? (
          <div className="text-sm text-gray-500">Loading videos...</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5">
            {videos.length === 0 ? (
              <div className="text-sm text-gray-500">No videos found.</div>
            ) : (
              videos.map((v) => (
                <InstaVideoCard
                  key={v._id}
                  id={v._id}
                  src={v.videoUrl}
                  title={v.title}
                  isActive={v.isActive}
                  checked={selectedIds.has(v._id)}
                  onCheckedChange={onCardCheckedChange}
                  onChanged={fetchVideos}
                  onRequestDelete={(id) =>
                    setDeleteModal({ isOpen: true, id, isLoading: false })
                  }
                />
              ))
            )}
          </div>
        )}
      </div>

      <InstaVideoDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddVideo}
        isSubmitting={isSubmitting}
      />

      {/* Single Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, id: null, isLoading: false })
        }
        onConfirm={async () => {
          if (!deleteModal.id) return;
          setDeleteModal((prev) => ({ ...prev, isLoading: true }));
          try {
            await deleteInstaCarouselVideo(deleteModal.id);
            toast.success("Video deleted");
            await fetchVideos();
          } catch (e) {
            toast.error("Failed to delete video");
          } finally {
            setDeleteModal({ isOpen: false, id: null, isLoading: false });
          }
        }}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        warningMessage="Deleting will permanently remove the video."
        confirmButtonText="Delete"
        confirmButtonColor="red"
        isLoading={deleteModal.isLoading}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={() => setBulkDeleteModal({ isOpen: false, isLoading: false })}
        onConfirm={async () => {
          setBulkDeleteModal({ isOpen: true, isLoading: true });
          try {
            await Promise.all(
              Array.from(selectedIds).map((id) => deleteInstaCarouselVideo(id))
            );
            toast.success("Selected videos deleted");
            await fetchVideos();
          } catch (e) {
            toast.error("Failed to delete some videos");
            await fetchVideos();
          } finally {
            setBulkDeleteModal({ isOpen: false, isLoading: false });
          }
        }}
        title="Delete Selected Videos"
        message={`Are you sure you want to delete ${selectedIds.size} selected video(s)? This cannot be undone.`}
        warningMessage="All selected videos will be permanently removed."
        confirmButtonText="Delete"
        confirmButtonColor="red"
        isLoading={bulkDeleteModal.isLoading}
      />
    </div>
  );
}

export default InstaCarousel;
