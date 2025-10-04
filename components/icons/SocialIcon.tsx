
import React from 'react';

export const SocialIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H13.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 10.5V13.5"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5V13.5"
    />
  </svg>
);
