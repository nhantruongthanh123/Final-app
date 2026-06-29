import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const UserStat = ({ activeTab }: { activeTab: string }) => {
  const stats = [
    { id: "photos", count: 108, label: "PHOTOS" },
    { id: "albums", count: 43, label: "ALBUMS" },
    { id: "followings", count: 22, label: "FOLLOWINGS" },
    { id: "followers", count: 13, label: "FOLLOWERS" },
  ];

  return (
    <div className="flex flex-row gap-2 text-sm text-slate-500">
      {stats.map((stat) => (
        <Link
          key={stat.id}
          to={`/${stat.id}`}
          className={cn(
            "cursor-pointer",
            activeTab === stat.id
              ? "font-semibold text-brand md:m-2"
              : "md:m-2",
          )}
        >
          {stat.count} {stat.label}
        </Link>
      ))}
    </div>
  );
};

export default UserStat;
