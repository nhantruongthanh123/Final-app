import React from "react";
import { mockAlbums } from "@/datas/albumData";
import AlbumUser from "@/components/album/AlbumUser";

const UserAlbums = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {mockAlbums.map((album, index) => (
        <AlbumUser key={index} albumData={album} />
      ))}
    </div>
  );
};

export default UserAlbums;
