
import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1 text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}

