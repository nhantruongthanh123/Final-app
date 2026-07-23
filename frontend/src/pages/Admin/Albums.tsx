import AlbumAdmin from "@/components/album/AlbumAdmin";
import { JumpToPageEllipsis } from "@/components/shared/JumpToPageEllipsis";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlbumService } from "@/services/album.service";
import type { Album } from "@/types/album";
import { getPaginationItem } from "@/utils/getPaginationItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Albums = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const albumsPerPage = 12;

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const { albums, totalAlbums } = await AlbumService.getAllAlbums(
          currentPage,
          albumsPerPage,
          debouncedSearch,
          status === "All" ? undefined : status === "Public",
        );
        setAlbums(albums);
        setTotalPages(Math.ceil(totalAlbums / albumsPerPage));
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    loadAlbums();
  }, [currentPage, debouncedSearch, status]);

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Albums</h1>
        <p className="text-slate-500 text-sm mt-1">
          View, edit, or suspend album entries.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title"
          onChange={(e) => {
            setSearchInput(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          defaultValue="All"
          onValueChange={(value) => {
            setStatus(value || "All");
            setCurrentPage(1);
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

      {/* Albums */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {albums.map((album) => (
          <Link key={album.id} to={`${album.id}`}>
            <AlbumAdmin key={album.id} album={album} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center mt-auto pt-8 pb-8">
        <Pagination>
          <PaginationContent>
            {/* --- PREVIOUS BUTTON --- */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Stops the browser from jumping to the top of the page
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                // Visually disable the button if we are on page 1
                className={cn(
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer",
                )}
              />
            </PaginationItem>

            {/* --- PAGE NUMBERS --- */}
            {getPaginationItem(currentPage, totalPages).map((item) => {
              if (item === "...") {
                return (
                  <PaginationItem key={item}>
                    <JumpToPageEllipsis
                      totalPages={totalPages}
                      setCurrentPage={setCurrentPage}
                    />
                  </PaginationItem>
                );
              }
              const pageNumber = parseInt(item);
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === pageNumber}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* --- NEXT BUTTON --- */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                // Visually disable if we are on the last page
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Albums;
