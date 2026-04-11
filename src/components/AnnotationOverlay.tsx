import { useMemo } from 'react';

interface Annotation {
  id: string;
  label: string;
  // Position on the image as percentages
  x: number;
  y: number;
  // Direction the line extends: left or right
  side: 'left' | 'right';
}

interface AnnotationOverlayProps {
  annotations: Annotation[];
  activeId: string | null;
  specs: Record<string, { label: string; value: string }[]>;
}

export default function AnnotationOverlay({ annotations, activeId, specs }: AnnotationOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {annotations.map((ann) => {
        const isActive = ann.id === activeId;
        const lineLength = 120;
        const specData = specs[ann.id] || [];

        return (
          <div key={ann.id} className="absolute" style={{ left: `${ann.x}%`, top: `${ann.y}%` }}>
            {/* Dot on the camera */}
            <div
              className={`absolute w-3 h-3 rounded-full border-2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
                isActive
                  ? 'border-primary bg-primary/40 scale-125'
                  : 'border-primary/30 bg-transparent scale-75 opacity-40'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
              )}
            </div>

            {/* Line + Label */}
            <div
              className={`absolute top-1/2 -translate-y-1/2 transition-all duration-700 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                [ann.side === 'right' ? 'left' : 'right']: '12px',
                width: `${lineLength}px`,
              }}
            >
              {/* Dashed line */}
              <div
                className={`absolute top-1/2 h-[1px] border-t border-dashed border-primary/60 transition-all duration-700 ${
                  isActive ? 'w-full' : 'w-0'
                }`}
                style={{
                  [ann.side === 'right' ? 'left' : 'right']: '0',
                }}
              />

              {/* Spec card */}
              <div
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 delay-200 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0'
                } ${ann.side === 'right' ? '' : 'right-0'}`}
                style={{
                  [ann.side === 'right' ? 'left' : 'right']: `${lineLength + 8}px`,
                  transform: `translateY(-50%) ${
                    isActive
                      ? ''
                      : ann.side === 'right'
                      ? 'translateX(-20px)'
                      : 'translateX(20px)'
                  }`,
                }}
              >
                <div className="bg-background/80 backdrop-blur-md border border-border/40 rounded-sm p-3 min-w-[200px] pointer-events-auto">
                  <h4 className="text-xs font-mono-code text-primary tracking-wider uppercase mb-2">
                    {ann.label}
                  </h4>
                  <div className="space-y-1.5">
                    {specData.map((spec) => (
                      <div key={spec.label} className="flex justify-between gap-4 text-[10px] font-mono-code">
                        <span className="text-muted-foreground uppercase tracking-wider">{spec.label}</span>
                        <span className="text-foreground font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
