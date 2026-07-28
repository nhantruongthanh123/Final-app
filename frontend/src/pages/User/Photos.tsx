import PhotoUser from "@/components/photo/PhotoUser";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePhotoUser } from "@/hooks/usePhotoUser";
import { useAuthStore } from "@/store/authStore";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Photos = () => {
  // const [photos, setPhotos] = useState<Photo[]>([]);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePhotoUser(
    user?.id,
    debouncedSearch,
    status === "All" ? undefined : status === "Public",
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const photos = data?.pages.flatMap((page) => page.photos) ?? [];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [data?.pages, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  if (photos.length === 0) {
    return (
      <EmptyState
        icon={<ImageOff className="w-10 h-10 text-orange-400" />}
        title={"You haven't uploaded any photos yet."}
        description={
          "Start sharing your memories by uploading your first photo. Click the button below to get started!"
        }
        actionLabel={"Upload Photo"}
        onAction={() => {
          navigate("/photos/add");
        }}
      />
    );
  }

  return (
    <div className="flex flex-col w-full p-4">
      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <Select
          defaultValue="All"
          onValueChange={(value) => {
            setStatus(value || "All");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Private">Private</SelectItem>
            <SelectItem value="Public">Public</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {photos.map((photo) => (
          <PhotoUser key={photo.id} photo={photo} />
        ))}

        <div ref={sentinelRef} style={{ height: 1 }} />
        {isFetchingNextPage && (
          <LoaderCircle className="animate-spin h-15 w-15" />
        )}
      </div>
    </div>
  );
};

export default Photos;
