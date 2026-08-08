import React, { useId } from 'react';

const Input = React.forwardRef(
  function Input({ label, type = "text", className = "", ...props }, ref) {
    const id = useId();
    return (
      <div className="w-full font-['Geist',sans-serif]">
        {label && (
          <label
            className="inline-block mb-1.5 font-['JetBrains_Mono',monospace] text-xs font-semibold text-[#5a4138] uppercase tracking-wider"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          className={`w-full px-4 py-2.5 rounded-lg bg-[#f2f3fa] text-[#191c21] border border-[#e1e2e9] outline-none focus:bg-white focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 duration-200 text-sm font-medium ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
      </div>
    );
  }
);

export default Input;