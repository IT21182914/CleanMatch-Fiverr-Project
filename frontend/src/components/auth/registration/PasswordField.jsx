import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PasswordField = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  showPassword,
  onToggleVisibility,
  required = true,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required={required}
          value={value}
          onChange={onChange}
          className={`auth-input autofill-override appearance-none relative block w-full pr-10 pl-3 py-2.5 sm:py-3 border ${
            error ? "border-red-300" : "border-gray-300"
          } placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 text-sm transition-colors duration-200`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={onToggleVisibility}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          ) : (
            <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordField;
