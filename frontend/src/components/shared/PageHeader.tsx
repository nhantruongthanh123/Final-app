import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowBigLeft } from "lucide-react";

const PageHeader = ({
  title,
  backlink,
}: {
  title: string;
  backlink: string;
}) => {
  return (
    <div className="flex flex-row justify-between w-full">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <Link to={backlink}>
        <Button
          variant="ghost"
          className="ml-auto bg-indigo-50 hover:bg-indigo-100"
        >
          <ArrowBigLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
    </div>
  );
};

export default PageHeader;
