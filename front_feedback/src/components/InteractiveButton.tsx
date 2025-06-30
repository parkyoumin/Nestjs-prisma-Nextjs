"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface InteractiveButtonProps {
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
}

export function InteractiveButton({
  href,
  onClick,
  className,
  children,
}: InteractiveButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
    }

    if (href) {
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(href);
      }
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
