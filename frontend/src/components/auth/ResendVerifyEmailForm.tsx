import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ResendVerifyEmailForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await AuthService.resendVerificationEmail(email);
      toast.success(response.message);
      setEmail("");
    } catch (error) {
      toast.error("Failed to send verification email.");
      console.error("Error sending verification email:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand">
            Resend Verification Email
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email"> Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-brand hover:bg-indigo-700"
          >
            {isLoading
              ? "Sending verification email..."
              : "Send Verification Email"}
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

export default ResendVerifyEmailForm;
