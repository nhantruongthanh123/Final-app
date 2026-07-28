import AlbumUser from "@/components/album/AlbumUser";
import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlbumUser } from "@/hooks/useAlbumUser";
import { useAuthStore } from "@/store/authStore";
import { ImageOff, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Albums = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useAlbumUser(
    user?.id,
    debouncedSearch,
    status === "All" ? undefined : status === "Public",
  );

  const sentinelRef = useRef<HTMLDivElement>(null);
  const albums = data?.pages.flatMap((page) => page.albums) ?? [];

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

  if (albums.length === 0) {
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

        <EmptyState
          icon={<ImageOff className="w-10 h-10 text-orange-400" />}
          title={"You haven't created any albums yet."}
          description={
            "Create your first album by uploading your photos. Click the button below to get started!"
          }
          actionLabel={"Create Album"}
          onAction={() => {
            navigate("/albums/add");
          }}
        />
      </div>
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
        {albums.map((album) => (
          <AlbumUser key={album.id} album={album} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <LoaderCircle className="animate-spin h-15 w-15" />
      )}
    </div>
  );
};

export default Albums;
