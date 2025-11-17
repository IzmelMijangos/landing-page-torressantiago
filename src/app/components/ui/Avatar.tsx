import * as React from "react";
import { cn } from "@/app/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={cn("relative flex-shrink-0", className)} {...props} />
  )
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(({ className = "", ...props }, ref) => (
  <img ref={ref} className={cn("h-full w-full object-cover rounded-full", className)} {...props} />
));

AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center justify-center h-full w-full bg-gray-200 text-gray-500", className)} {...props} />
));

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };