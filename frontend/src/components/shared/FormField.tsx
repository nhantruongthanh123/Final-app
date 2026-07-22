import { Input } from "@base-ui/react";
import React, { forwardRef } from "react";
import { Label } from "../ui/label";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, ...props }, ref) => {
    const safeId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          <Label
            htmlFor={safeId}
            className="md:w-1/3 md:text-right font-bold text-slate-700 whitespace-nowrap"
          >
            {label}
          </Label>
          <div className="md:w-2/3">
            <Input id={safeId} ref={ref} {...props} />
          </div>
        </div>
        {error && (
          <div className="flex gap-2 md:gap-4">
            <div className="hidden md:block md:w-1/3" />
            <p className="text-sm text-red-500 md:w-2/3">{error}</p>
          </div>
        )}
      </div>
    );
  },
);
FormField.displayName = "FormField";
export default FormField;
