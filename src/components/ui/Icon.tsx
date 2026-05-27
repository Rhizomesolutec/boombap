import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  d: string;
  size?: number;
}

export function Icon({ d, size = 18, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
