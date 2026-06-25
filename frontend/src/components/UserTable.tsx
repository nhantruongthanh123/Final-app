import type { User } from "@/types/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "./ui/badge";

const UserTable = ({ users }: { users: User[] }) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 hover:bg-slate-200">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead> Last Login </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index} className="group">
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge
                  variant={
                    user.role === "Admin" || user.role === "Super Admin"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    user.role === "Admin" || user.role === "Super Admin"
                      ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
                      : ""
                  }
                >
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${user.status === "Active" ? "bg-indigo-600" : "bg-red-500"}`}
                  />
                  <span
                    className={`font-medium ${user.status === "Active" ? "text-indigo-600" : "text-red-500"}`}
                  >
                    {user.status}
                  </span>
                </div>
              </TableCell>

              <TableCell>{user.lastLogin}</TableCell>
              <TableCell className="text-right">
                <button className="text-blue-500 hover:underline">Edit</button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
