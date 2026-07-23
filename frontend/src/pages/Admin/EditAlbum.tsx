import EditAlbumForm from "@/components/album/EditAlbumForm";
import { useParams } from "react-router-dom";

const EditAlbum = () => {
  const { id } = useParams<{ id: string }>();

  return <EditAlbumForm id={id} backlink="/admin/albums" />;
};

export default EditAlbum;
