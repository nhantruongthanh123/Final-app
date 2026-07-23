import UserTable from "@/components/admin/UserTable";
import { JumpToPageEllipsis } from "@/components/shared/JumpToPageEllipsis";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/user";
import { getPaginationItem } from "@/utils/getPaginationItem";
import { useEffect, useState } from "react";

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 12;

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { users, totalUsers } = await UserService.getAllUsers(
          currentPage,
          usersPerPage,
        );
        setUsers(users);
        setTotalUsers(totalUsers);
        setTotalPages(Math.ceil(totalUsers / usersPerPage));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();
  }, [currentPage, usersPerPage]);

  if (!users) {
    return (
      <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
        <p className="text-slate-500 text-sm mt-1">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manage Users</h1>
        <p className="text-slate-500 text-sm mt-1">
          View, edit, or suspend user accounts.
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="flex gap-4 mb-6">
        <Input placeholder="Search by name or email" />
        <Select defaultValue="All">
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="All">
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* THE TABLE */}
      <div className="flex-1 overflow-auto bg-white rounded-lg border shadow-sm">
        <UserTable users={users} />
      </div>

      {/* PAGINATION FOOTER */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing {users.length} of {totalUsers} users
        </p>
        <div className="flex justify-center items-center mt-auto pt-8 pb-8">
          <Pagination>
            <PaginationContent>
              {/* --- PREVIOUS BUTTON --- */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Stops the browser from jumping to the top of the page
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  // Visually disable the button if we are on page 1
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* --- PAGE NUMBERS --- */}
              {getPaginationItem(currentPage, totalPages).map((item) => {
                if (item === "...") {
                  return (
                    <PaginationItem key={item}>
                      <JumpToPageEllipsis
                        totalPages={totalPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </PaginationItem>
                  );
                }
                const pageNumber = parseInt(item);
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === pageNumber}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* --- NEXT BUTTON --- */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  // Visually disable if we are on the last page
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default Users;
