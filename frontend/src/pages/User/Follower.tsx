import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import UserCard from "@/components/user/UserCard";
import { useFollowerUser } from "@/hooks/user/useFollowerUser";
import { useAuthStore } from "@/store/authStore";
import { LoaderCircle, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Follower = () => {
  const user = useAuthStore((state) => state.user);

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowerUser(user?.id, debouncedSearch);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const followers = data?.pages.flatMap((page) => page.followers) ?? [];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [data?.pages, fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  if (!followers || followers.length === 0) {
    return (
      <div className="flex flex-col p-4 w-full">
        {/* FILTER BAR */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search by title"
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          />
        </div>
        <EmptyState
          icon={<UserX className="w-10 h-10 text-orange-400" />}
          title={"You haven't received any followers yet or no results found."}
          description={
            "You haven't received any followers yet. Start sharing your photos and engaging with the community to attract followers!"
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full">
      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search by title"
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {followers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && (
        <LoaderCircle className="animate-spin h-15 w-15" />
      )}
    </div>
  );
};

export default Follower;
