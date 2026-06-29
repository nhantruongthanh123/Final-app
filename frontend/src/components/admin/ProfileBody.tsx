import type { User } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Calendar,
  Clock,
  Mail,
  Phone,
  Shield,
  UserCircle,
} from "lucide-react";

const ProfileBody = ({ user }: { user: User | undefined }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="User Information" className="shadow-sm border-slate-100">
        <CardHeader className="">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            Account details
          </CardTitle>
        </CardHeader>

        <CardContent className="">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> User Name
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.name}
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
              <Phone className="w-4 h-4" /> Phone Number
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              +1 (555) 123-4567
            </span>{" "}
            {/* Mock data */}
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Member Since
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              October 24, 2023
            </span>{" "}
            {/* Mock data */}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-100">
        <CardHeader className="pb-4">
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
                className={
                  user?.status === "Active"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-red-100 text-red-800 hover:bg-red-100"
                }
              >
                {user?.status}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-500 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Last Login
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              {user?.lastLogin}
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
