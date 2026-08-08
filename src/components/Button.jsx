import React from 'react';

function Button({
  children,
  type = 'button',
  bgColor = 'bg-[#ea580c]',
  textColor = 'text-white',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer active:scale-98 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;