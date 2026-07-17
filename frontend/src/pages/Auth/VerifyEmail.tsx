import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthService } from "@/services/authService";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    token ? "loading" : "error",
  );

  useEffect(() => {
    if (!token) return;

    const message = AuthService.verifyEmail(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));

    console.log(message);
  }, [token]);

  if (status === "loading") return <div> Loading ...</div>;
  if (status === "error") {
    return (
      <p className="text-red-500">
        Verification failed. The token may be invalid or expired. Please try
        again or request a new verification email.
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-100 text-center shadow-lg">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Verification Successful</CardTitle>
          <CardDescription className="text-base mt-2">
            Your email has been securely verified. You are now ready to access
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full text-md h-12"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
