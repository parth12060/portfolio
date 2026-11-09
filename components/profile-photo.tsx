import Image from "next/image";
import { site } from "@/lib/data";

export function ProfilePhoto({
  size,
  priority = false,
  decorative = false,
  className = "",
}: {
  size: number;
  priority?: boolean;
  decorative?: boolean;
  className?: string;
}) {
  return (
    <Image
      src="/parth-lodat.png"
      alt={decorative ? "" : site.name}
      width={size}
      height={size}
      sizes={`${size}px`}
      priority={priority}
      className={`border-foreground/20 bg-card shrink-0 rounded-full border object-cover object-[50%_35%] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
