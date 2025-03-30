
import React from "react";
import { LucideProps } from "lucide-react";

// Create a custom ChevronsUpDown icon since it's not available directly
const ChevronsUpDown: React.FC<LucideProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
};

export default ChevronsUpDown;
