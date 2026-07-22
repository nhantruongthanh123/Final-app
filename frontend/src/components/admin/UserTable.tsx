import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UserService } from "@/services/user.service";
import type { User } from "@/types/user";
import { formatDateTime } from "@/utils/formatDateTime";
import { MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserTable = ({ users }: { users: User[] }) => {
  const navigate = useNavigate();

  const suspendUser = async (userId: string) => {
    toast.promise(UserService.updateUserIsActiveByAdmin(userId, false), {
      loading: "Suspending user...",
      success: () => {
        setTimeout(() => navigate(0), 1000);
        return "User suspended successfully!";
      },
      error: "Failed to suspend user.",
    });
  };

  const activateUser = async (userId: string) => {
    toast.promise(UserService.updateUserIsActiveByAdmin(userId, true), {
      loading: "Activating user...",
      success: () => {
        setTimeout(() => navigate(0), 1000);
        return "User activated successfully!";
      },
      error: "Failed to activate user.",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead> Last Login </TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="group dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <TableCell className="font-medium">{`${user.firstName} ${user.lastName}`}</TableCell>
            <TableCell>{user.email}</TableCell>

            <TableCell>
              <Badge
                variant={user.role === "Admin" ? "default" : "secondary"}
                className={
                  user.role === "Admin"
                    ? "bg-indigo-100 text-brand hover:bg-indigo-100 dark:bg-indigo-500/20"
                    : ""
                }
              >
                {user.role}
              </Badge>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    user.isActive === true
                      ? "bg-indigo-600 dark:text-indigo-400"
                      : "bg-red-500 dark:bg-red-400",
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    user.isActive === true
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-red-500 dark:text-red-400",
                  )}
                >
                  {user.isActive === true ? "Active" : "Inactive"}
                </span>
              </div>
            </TableCell>

            <TableCell>{formatDateTime(user.updatedAt)}</TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(user.email)}
                  >
                    Copy Email
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link to={`/admin/users/${user.id}`}>View Profile</Link>
                  </DropdownMenuItem>
                  {user.isActive === true ? (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={() => suspendUser(user.id)}
                    >
                      Suspend User
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-green-600 focus:text-green-600 focus:bg-green-50"
                      onClick={() => activateUser(user.id)}
                    >
                      Activate User
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
