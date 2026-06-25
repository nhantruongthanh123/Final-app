const UserStat = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const stats = [
    { id: "photos", count: 108, label: "PHOTOS" },
    { id: "albums", count: 43, label: "ALBUMS" },
    { id: "followings", count: 22, label: "FOLLOWINGS" },
    { id: "followers", count: 13, label: "FOLLOWERS" },
  ];

  return (
    <div className="flex flex-row gap-2 text-sm text-slate-500">
      {stats.map((stat) => (
        <p
          key={stat.id}
          onClick={() => setActiveTab(stat.id)}
          className={`cursor-pointer ${activeTab === stat.id ? "font-semibold text-indigo-800" : ""}`}
        >
          {stat.count} {stat.label}
        </p>
      ))}
    </div>
  );
};

export default UserStat;
