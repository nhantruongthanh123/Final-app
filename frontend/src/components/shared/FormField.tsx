import React from "react";
import { Label } from "../ui/label";
import { Input } from "@base-ui/react";

const FormField = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) => {
  const safeId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
      <Label
        htmlFor={safeId}
        className="md:w-1/3 md:text-right font-bold text-slate-700 whitespace-nowrap"
      >
        {label}
      </Label>
      <div className="md:w-2/3">
        <Input id={safeId} placeholder={placeholder} />
      </div>
    </div>
  );
};

export default FormField;
