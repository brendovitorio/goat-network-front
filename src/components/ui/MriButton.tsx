import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { mriButtonVariants, type MriButtonSize, type MriButtonVariant } from "./mri-button-variants";

export interface MriButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MriButtonVariant;
  size?: MriButtonSize;
  asChild?: boolean;
}

export const MriButton = React.forwardRef<HTMLButtonElement, MriButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(mriButtonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
MriButton.displayName = "MriButton";
