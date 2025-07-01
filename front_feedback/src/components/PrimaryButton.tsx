import Link from "next/link";
import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const PrimaryButton = ({
  children,
  href,
  onClick,
  className = "",
}: PrimaryButtonProps) => {
  const baseClasses =
    "inline-block w-full rounded-lg bg-primary px-6 py-3 font-semibold text-black hover:bg-primary/80 transition-colors";

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} text-center ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  );
};

export default PrimaryButton;
