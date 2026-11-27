"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";

  return (
    <div key={pathname} className="cavo-page-enter">
      {children}
    </div>
  );
}
