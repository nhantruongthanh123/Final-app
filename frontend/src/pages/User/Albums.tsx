import MyProfileHeader from "@/components/user/MyProfileHeader";
import UserAlbums from "@/components/user/UserAlbums";

const Albums = () => {
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <MyProfileHeader />
        <UserAlbums />
      </div>
    </div>
  );
};

export default Albums;
