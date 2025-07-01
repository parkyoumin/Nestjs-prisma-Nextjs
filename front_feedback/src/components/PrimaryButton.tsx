import Link from "next/link";
import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "grey";
}

const PrimaryButton = ({
  children,
  href,
  onClick,
  className = "",
  variant = "primary",
}: PrimaryButtonProps) => {
  const baseClasses =
    "inline-block w-full rounded-lg px-6 py-3 font-semibold transition-colors text-center";

  const variants = {
    primary: "bg-primary text-black hover:bg-primary/80",
    grey: "bg-gray-200 text-gray-700 hover:bg-gray-300",
  };

  const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default PrimaryButton;
