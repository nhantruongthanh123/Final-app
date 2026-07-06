import { useState, useEffect } from "react";
import { AlbumService } from "@/service/albumService";
import type { Album } from "@/types/album";
import AlbumAdmin from "@/components/album/AlbumAdmin";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Albums = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const albumsPerPage = 12;

  useEffect(() => {
    const loadAlbums = async () => {
      try {
        const { albums, totalAlbums } = await AlbumService.getAllAlbums(
          currentPage,
          albumsPerPage,
        );
        setAlbums(albums);
        setTotalPages(Math.ceil(totalAlbums / albumsPerPage));
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    loadAlbums();
  }, [currentPage]);

  return (
    <div className="mx-2 flex flex-col h-full flex-1">
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

export default Albums;
