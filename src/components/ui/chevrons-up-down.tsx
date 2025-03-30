
import React from 'react';
import { ChevronsUpDown as LucideChevronsUpDown } from 'lucide-react';

const ChevronsUpDown = React.forwardRef<
  SVGSVGElement,
  React.ComponentPropsWithoutRef<typeof LucideChevronsUpDown>
>(({ className, ...props }, ref) => {
  return <LucideChevronsUpDown className={className} ref={ref} {...props} />;
});

ChevronsUpDown.displayName = 'ChevronsUpDown';

export { ChevronsUpDown };
