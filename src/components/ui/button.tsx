import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("button", {
  variants: { variant: { primary: "button-primary", outline: "button-outline", light: "button-light", navy: "button-navy" } },
  defaultVariants: { variant: "primary" },
});
export function Button({ className, variant, type = "button", ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, className }))} {...props} />;
}
