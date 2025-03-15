import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  return <Loader2 className={cn("h-8 w-8 animate-spin", className)} />;
}
