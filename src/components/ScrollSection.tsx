import { ReactNode } from 'react';

interface ScrollSectionProps {
  title: string;
  subtitle?: string;
  specs?: { label: string; value: string }[];
  children?: ReactNode;
  align?: 'left' | 'right' | 'center';
  active: boolean;
}

export default function ScrollSection({
  title,
  subtitle,
  specs,
  children,
  align = 'left',
  active,
}: ScrollSectionProps) {
  const alignClass =
    align === 'right'
      ? 'items-end text-right ml-auto mr-8 md:mr-20'
      : align === 'center'
      ? 'items-center text-center mx-auto'
      : 'items-start text-left ml-8 md:ml-20';

  return (
    <div
      className={`flex flex-col justify-center max-w-md transition-all duration-700 ${alignClass} ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {subtitle && (
        <span className="font-mono-code text-xs tracking-[0.3em] uppercase text-primary mb-3">
          {subtitle}
        </span>
      )}
      <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
        {title}
      </h2>

      {specs && (
        <div className="space-y-2 mt-4">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="flex justify-between gap-6 font-mono-code text-xs border-b border-border/30 pb-2"
            >
              <span className="text-muted-foreground uppercase tracking-wider">
                {spec.label}
              </span>
              <span className="text-foreground font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      )}

      {children}

      {/* Corner decorations */}
      <div className="relative mt-6 p-4 corner-frame">
        <div className="w-16 h-[1px] bg-primary/40" />
      </div>
    </div>
  );
}
