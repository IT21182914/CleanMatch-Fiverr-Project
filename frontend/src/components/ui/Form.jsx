import { forwardRef } from "react";
import { cn } from "../../lib/utils";

// Input Component
export const Input = forwardRef(
  ({ className, label, error, helperText, type = "text", ...props }, ref) => {
    const inputId = props.id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          ref={ref}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base px-3 py-2 sm:py-2.5",
            {
              "border-red-300 focus:border-red-500 focus:ring-red-500": error,
            },
            className
          )}
          {...props}
        />
        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Select Component
export const Select = forwardRef(
  ({ className, label, error, helperText, children, ...props }, ref) => {
    const selectId = props.id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base px-3 py-2 sm:py-2.5",
            {
              "border-red-300 focus:border-red-500 focus:ring-red-500": error,
            },
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

// Textarea Component
export const Textarea = forwardRef(
  ({ className, label, error, helperText, rows = 3, ...props }, ref) => {
    const textareaId = props.id || props.name;

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          ref={ref}
          className={cn(
            "block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base px-3 py-2",
            {
              "border-red-300 focus:border-red-500 focus:ring-red-500": error,
            },
            className
          )}
          {...props}
        />
        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-xs sm:text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

// Checkbox Component
export const Checkbox = forwardRef(
  ({ className, label, error, helperText, ...props }, ref) => {
    const checkboxId = props.id || props.name;

    return (
      <div className="space-y-1">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded",
              {
                "border-red-300 focus:ring-red-500": error,
              },
              className
            )}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className="ml-2 block text-sm text-gray-900"
            >
              {label}
              {props.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

// Radio Group Component
export const RadioGroup = ({
  label,
  error,
  helperText,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <fieldset>
          <legend className="text-sm font-medium text-gray-700">{label}</legend>
          <div className="mt-2 space-y-2">{children}</div>
        </fieldset>
      )}
      {!label && children}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

// Radio Component
export const Radio = forwardRef(({ className, label, ...props }, ref) => {
  const radioId = props.id || `${props.name}-${props.value}`;

  return (
    <div className="flex items-center">
      <input
        type="radio"
        id={radioId}
        ref={ref}
        className={cn(
          "h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300",
          className
        )}
        {...props}
      />
      {label && (
        <label htmlFor={radioId} className="ml-2 block text-sm text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
});

Radio.displayName = "Radio";
