import { useState, useEffect } from "react";
import PhotoAdmin from "@/components/photo/PhotoAdmin";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Photo } from "@/types/photo";
import { PhotoService } from "@/service/photoService";
import { Link } from "react-router-dom";

const Photos = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const photosPerPage = 12;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await PhotoService.getAllPhotos(
          currentPage,
          photosPerPage,
        );
        setPhotos(data.photos);
        setTotalPages(Math.ceil(data.totalPhotos / photosPerPage));
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();
  }, [currentPage, photosPerPage]);

  return (
    <div className="flex flex-col h-full flex-1">
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
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
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
