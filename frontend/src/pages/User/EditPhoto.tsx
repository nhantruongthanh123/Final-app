import EditPhotoForm from "@/components/photo/EditPhotoForm";
import { useParams } from "react-router-dom";

const EditPhoto = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Photo ID is missing</div>;
  }

  return <EditPhotoForm id={id} backlink="/photos" />;
};

export default EditPhoto;
