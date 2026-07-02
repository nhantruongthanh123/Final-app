import type { FollowingUser } from "@/types/user";
import { Button } from "@/components/ui/button";

const UserCard = ({ user }: { user: FollowingUser }) => {
  return (
    <div className="flex flex-col items-center rounded-lg border-2 border-gray-300 bg-gray-50 shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-16 h-16 rounded-full object-cover m-2"
      />
      <h3 className="text-lg font-semibold mt-2">{user.name}</h3>
      <div className="flex flex-row gap-4 p-2">
        <div className="text-brand font-bold flex flex-col items-center">
          <div>{user.numOfPhotos}</div>
          <div>photos</div>
        </div>

        <div className="text-brand font-bold flex flex-col items-center">
          <div>{user.numOfAlbums}</div>
          <div>albums</div>
        </div>
      </div>

      <div className="inline-flex rounded-full bg-linear-to-r from-rose-400 to-orange-400 p-0.5 mt-2 transition-transform hover:scale-105 shadow-sm">
        <Button
          variant="ghost"
          className="h-8 px-6 bg-white rounded-full hover:bg-slate-50 w-full"
        >
          <span className="bg-linear-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent font-bold text-sm lowercase tracking-wide">
            Unfollow
          </span>
        </Button>
      </div>
    </div>
  );
};

export default UserCard;
