import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="text-2xl font-bold flex flex-1 flex-col items-center justify-center p-4 bg-indigo-100 w-full h-screen">
      <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">
        Page not found
      </h2>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg text-center">
        Oops! The page you are looking for doesn't exist or might have been
        removed.
      </p>

      <Link to="/feed">
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Feed
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
