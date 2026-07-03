import type { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Mail,
  Shield,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProfileBody = ({ user }: { user: User | undefined }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="User Information" className="shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Account Information
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> User Name
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {`${user?.firstName} ${user?.lastName}`}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.email}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Member Since
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.createdAt}
            </span>{" "}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
            <Shield className="w-5 h-5 text-indigo-600" />
            Account Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Account Status
            </span>
            <div className="mt-1">
              <Badge
                className={cn(
                  user?.isActive === true
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100",
                )}
              >
                {user?.isActive === true ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Last Login
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.updatedAt}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4" /> Permission Level
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.role} Access
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileBody;
