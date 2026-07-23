import { cn } from "@/lib/utils";
import type { UserStatType } from "@/types/user";
import { Link } from "react-router-dom";

const TargetUserStat = ({
  activeTab,
  stats,
}: {
  activeTab: string;
  stats: UserStatType[];
}) => {
  return (
    <div className="flex flex-row gap-2 text-sm text-slate-500">
      {stats.map((stat) => (
        <Link
          key={stat.id}
          to={`${stat.id}`}
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

export default TargetUserStat;
