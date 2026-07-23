import PhotoAdmin from "@/components/photo/PhotoAdmin";
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
import { PhotoService } from "@/services/photo.service";
import type { Photo } from "@/types/photo";
import { getPaginationItem } from "@/utils/getPaginationItem";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Photos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const photosPerPage = 12;

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
    const fetchPhotos = async () => {
      try {
        const data = await PhotoService.getAllPhotos(
          currentPage,
          photosPerPage,
          debouncedSearch,
          status === "All" ? undefined : status === "Public",
        );
        setPhotos(data.photos);
        setTotalPages(Math.ceil(data.totalPhotos / photosPerPage));
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [currentPage, photosPerPage, debouncedSearch, status]);

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Photos</h1>
        <p className="text-slate-500 text-sm mt-1">
          View, edit, or suspend photo entries.
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

      {/* PHOTOS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {photos.map((photo) => (
          <Link key={photo.id} to={`${photo.id}`}>
            <PhotoAdmin key={photo.id} photo={photo} />
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
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
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

export default Photos;
