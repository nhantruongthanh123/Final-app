import {
  resetPasswordSchema,
  type ResetPasswordPayload,
} from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const {
    register: resetPassword,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ResetPasswordPayload) => {
    if (!token) {
      toast.error(
        "Token is missing or expired. Please request a new password reset.",
      );
      return;
    }

    try {
      await AuthService.resetPassword({ token, newPassword: data.newPassword });
      toast.success("Password reset successfully! Please log in again.");
      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(
          "Token is missing or expired. Please request a new password reset.",
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold text-center">Reset Password</h1>

      <div className="grid gap-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...resetPassword("newPassword")}
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...resetPassword("confirmNewPassword")}
        />
        {errors.confirmNewPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmNewPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
