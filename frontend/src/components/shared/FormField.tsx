import { Input } from "@base-ui/react";
import React from "react";
import { Label } from "../ui/label";

const FormField = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
        <Input
          id={safeId}
          placeholder={placeholder}
          value={value}
          type={type}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default FormField;
