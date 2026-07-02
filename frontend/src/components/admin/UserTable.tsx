import type { User } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const UserTable = ({ users }: { users: User[] }) => {
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
            <TableCell className="font-medium">{user.name}</TableCell>
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
                    user.status === "Active"
                      ? "bg-indigo-600 dark:text-indigo-400"
                      : "bg-red-500 dark:bg-red-400",
                  )}
                />
                <span
                  className={cn(
                    "font-medium",
                    user.status === "Active"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-red-500 dark:text-red-400",
                  )}
                >
                  {user.status}
                </span>
              </div>
            </TableCell>

            <TableCell>{user.lastLogin}</TableCell>

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
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    Suspend User
                  </DropdownMenuItem>
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
