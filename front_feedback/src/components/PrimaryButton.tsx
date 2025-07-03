import Link from "next/link";
import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "grey" | "danger";
}

const PrimaryButton = ({
  children,
  href,
  className = "",
  variant = "primary",
  ...rest
}: PrimaryButtonProps) => {
  const baseClasses =
    "inline-block w-full rounded-lg px-6 py-3 font-semibold transition-colors text-center whitespace-nowrap";

  const variants = {
    primary: "bg-primary text-black hover:bg-primary/80",
    grey: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button {...rest} className={combinedClasses}>
      {children}
    </button>
  );
};

export default PrimaryButton;
