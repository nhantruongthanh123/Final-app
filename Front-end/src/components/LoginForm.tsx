import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { FaGoogle, FaFacebook, FaTwitter } from "react-icons/fa";

const LoginForm = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 py-8">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-indigo-800">
            PhotoBook Login
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
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

          <Button className="w-full bg-indigo-800 hover:bg-indigo-700">
            Login
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-sm text-center">
          <button className="text-indigo-600 hover:underline">
            Forgot password?
          </button>
          <button className="text-indigo-600 hover:underline">
            Create a new account
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
