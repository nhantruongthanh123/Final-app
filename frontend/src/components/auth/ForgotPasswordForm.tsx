import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EmailPayload } from "@/schemas/auth.schema";
import { emailSchema } from "@/schemas/auth.schema";
import { AuthService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const {
    register: forgotPassword,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailPayload>({
    resolver: zodResolver(emailSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: EmailPayload) => {
    try {
      const response = await AuthService.forgotPassword(data);
      toast.success(response.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error("Failed to send reset link.");
      }
    }
  };

  return (
    <form className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand">
            Forgot Password ?
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Recovery Email</Label>
            <Input id="email" type="email" {...forgotPassword("email")} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-brand hover:bg-indigo-700"
          >
            {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
          </Button>

          <CardFooter className="flex flex-row gap-2 justify-around text-sm text-center">
            <button
              className="text-indigo-600 hover:underline"
              onClick={() => navigate("/login")}
              type="button"
            >
              Login
            </button>

            <button
              className="text-indigo-600 hover:underline"
              onClick={() => navigate("/register")}
              type="button"
            >
              Register
            </button>
          </CardFooter>
        </CardContent>
      </Card>
    </form>
  );
};

export default ForgotPasswordForm;
