"use client";

import type { ReactNode } from "react";

// Link de conversão com registro de clique — gancho para plugar pixel depois.
// Cada CTA carrega data-cta com um id único de origem.
export default function Cta({
  cta,
  href,
  className,
  children,
  novaAba,
}: {
  cta: string;
  href: string;
  className?: string;
  children: ReactNode;
  novaAba?: boolean;
}) {
  return (
    <a
      href={href}
      data-cta={cta}
      className={className}
      target={novaAba ? "_blank" : undefined}
      rel={novaAba ? "noopener noreferrer" : undefined}
      onClick={() => console.log("[verit-cta]", cta)}
    >
      {children}
    </a>
  );
}
