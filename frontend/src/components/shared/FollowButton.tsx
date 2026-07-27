import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const FollowButton = ({
  isCurrentUser,
  isFollowing,
  handleFollowToggle,
}: {
  isCurrentUser: boolean;
  isFollowing: boolean;
  handleFollowToggle: () => void;
}) => {
  const navigate = useNavigate();

  return isCurrentUser ? (
    <div className="inline-flex rounded-full bg-linear-to-r from-rose-400 to-orange-400 p-0.5 mt-2 transition-transform hover:scale-105 shadow-sm">
      <Button
        variant="ghost"
        className="h-8 px-6 rounded-full w-full bg-linear-to-r from-rose-400 to-orange-400 hover:opacity-90 transition-colors"
        onClick={() => navigate("/photos")}
      >
        <span className="text-white font-bold text-sm tracking-wide">You</span>
      </Button>
    </div>
  ) : (
    <div className="inline-flex rounded-full bg-linear-to-r from-rose-400 to-orange-400 p-0.5 mt-2 transition-transform hover:scale-105 shadow-sm">
      <Button
        variant="ghost"
        className={cn(
          "h-8 px-6 rounded-full w-full transition-colors",
          isFollowing
            ? "bg-white hover:bg-slate-50"
            : "bg-linear-to-r from-rose-400 to-orange-400 hover:opacity-90",
        )}
        onClick={handleFollowToggle}
      >
        {isFollowing ? (
          <span className="bg-linear-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent font-bold text-sm tracking-wide">
            Unfollow
          </span>
        ) : (
          <span className="text-white font-bold text-sm tracking-wide">
            Follow
          </span>
        )}
      </Button>
    </div>
  );
};

export default FollowButton;
