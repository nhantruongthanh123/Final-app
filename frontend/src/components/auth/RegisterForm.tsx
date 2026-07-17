import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/services/authService";
import { useState } from "react";
import { FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !firstName || !lastName || !password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }

    try {
      await AuthService.register(email, password, firstName, lastName);
      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand">
            Create your account
          </CardTitle>
          <CardDescription className="text-gray-600 text-sm">
            Join PhotoBook today.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              type="text"
              placeholder="Enter your first name"
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              type="text"
              placeholder="Enter your last name"
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full flex flex-row">
              <FaGoogle className="w-4 h-4 text-gray-700 flex justify-start" />
              <span className="ml-2">Continue with google</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-row">
              <FaFacebook className="w-4 h-4 text-blue-600 flex justify-start" />
              <span className="ml-2">Continue with facebook</span>
            </Button>
            <Button variant="outline" className="w-full flex flex-row">
              <FaTwitter className="w-4 h-4 text-sky-500 flex justify-start" />
              <span className="ml-2 ">Continue with twitter</span>
            </Button>
          </div>

          <Button
            className="w-full bg-brand hover:bg-indigo-700"
            onClick={handleRegister}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
