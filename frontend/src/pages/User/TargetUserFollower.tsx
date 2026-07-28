import EmptyState from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import UserCard from "@/components/user/UserCard";
import { useFollowerUser } from "@/hooks/user/useFollowerUser";
import { LoaderCircle, UserX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const TargetUserFollower = () => {
  const { id: publicUserId } = useParams<{ id: string }>();

  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFollowerUser(publicUserId, debouncedSearch);

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
          title={"No results found."}
          description={
            "This user hasn't followed anyone yet or no results match your search."
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

export default TargetUserFollower;
