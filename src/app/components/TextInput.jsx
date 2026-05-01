import React from "react";

function TextInput({ label, value, onChange, type = "text", required = false, placeholder = "", ...props }) {
  return (
    <div className="mb-7">
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm dark:bg-neutral-900 dark:text-white"
        {...props}
      />
    </div>
  );
}

export default TextInput;
