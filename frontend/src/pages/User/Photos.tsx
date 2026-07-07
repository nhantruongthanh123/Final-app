import MyProfileHeader from "@/components/user/MyProfileHeader";
import UserPhotos from "@/components/user/UserPhotos";

const Photos = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader />
        <UserPhotos />
      </div>
    </div>
  );
};

export default Photos;
