import React from "react";

const Button = React.forwardRef(function Button({
  children,
  type = "button",
  bgColor = "bg-blue-600",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`px-4 py-2 rounded-lg disabled:bg-blue-500 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
