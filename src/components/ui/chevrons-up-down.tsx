
import React from 'react';
import { ChevronsUpDown as LucideChevronsUpDown } from 'lucide-react';

const ChevronsUpDown = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof LucideChevronsUpDown>
>(({ className, ...props }, ref) => {
  return <LucideChevronsUpDown className={className} ref={ref} {...props} />;
});

ChevronsUpDown.displayName = 'ChevronsUpDown';

export default ChevronsUpDown;
