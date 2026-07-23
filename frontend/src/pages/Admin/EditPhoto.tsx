import EditPhotoForm from "@/components/photo/EditPhotoForm";
import { useParams } from "react-router-dom";

const EditPhoto = () => {
  const { id } = useParams<{ id: string }>();
  return <EditPhotoForm id={id} backlink="/admin/photos" />;
};

export default EditPhoto;
