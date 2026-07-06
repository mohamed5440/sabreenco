import React from "react";

interface HighlightCurveProps {
  children: React.ReactNode;
  className?: string;
  svgClassName?: string;
}

export const HighlightCurve: React.FC<HighlightCurveProps> = ({
  children,
  className = "",
  svgClassName = "absolute -bottom-2 sm:-bottom-3 left-0 w-full h-3 sm:h-4 text-primary/20",
}) => {
  return (
    <span className={`text-primary relative inline-block ${className}`}>
      {children}
      <svg
        className={svgClassName}
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 10 Q 50 18 100 10"
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
};
