import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginPayload } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LoginForm = () => {
  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register: login,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginPayload) => {
    try {
      const response = await AuthService.login(data);

      setAuth(response.accessToken, response.user);
      if (response.user.role === "ADMIN") {
        await navigate("/admin/photos");
        console.log("Admin user logged in, navigating to /admin/photos");
      } else {
        await navigate("/feed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.data?.message ===
          "Email is not verified. Please verify your email before logging in."
        ) {
          toast.error(error.response?.data?.message);
          setIsEmailVerified(false);
        } else {
          toast.error(error.response?.data?.message);
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8"
    >
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand">
            PhotoBook Login
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...login("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...login("password")} />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-background dark:text-slate-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full flex flex-row"
              onClick={() =>
                (window.location.href = `${apiUrl}/api/auth/google`)
              }
            >
              <FaGoogle className="w-4 h-4 text-gray-700 flex justify-start" />
              <span className="ml-2">Continue with google</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex flex-row"
              onClick={() =>
                (window.location.href = `${apiUrl}/api/auth/facebook`)
              }
            >
              <FaFacebook className="w-4 h-4 text-blue-600 flex justify-start" />
              <span className="ml-2">Continue with facebook</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-row">
              <FaTwitter className="w-4 h-4 text-sky-500 flex justify-start" />
              <span className="ml-2 ">Continue with twitter</span>
            </Button>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand hover:bg-indigo-700"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          {!isEmailVerified && (
            <Button
              type="button"
              disabled={isSubmitting}
              className="w-full bg-brand hover:bg-indigo-700"
              onClick={() => navigate("/resend-verification-email")}
            >
              Verify email
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-sm text-center">
          <button
            className="text-indigo-600 hover:underline"
            onClick={() => navigate("/forgot-password")}
            type="button"
          >
            Forgot password?
          </button>

          <button
            className="text-indigo-600 hover:underline"
            onClick={() => navigate("/register")}
            type="button"
          >
            Create a new account
          </button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default LoginForm;
