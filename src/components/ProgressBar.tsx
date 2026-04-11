interface ProgressBarProps {
  progress: number;
  sections: string[];
  activeIndex: number;
}

export default function ProgressBar({ progress, sections, activeIndex }: ProgressBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1">
      {sections.map((section, i) => (
        <div key={section} className="flex items-center gap-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-6 h-1 rounded-full transition-all duration-300 ${
                i <= activeIndex ? 'bg-primary' : 'bg-muted'
              }`}
            />
            <span
              className={`text-[8px] font-mono-code mt-1 tracking-wider transition-all duration-300 ${
                i === activeIndex ? 'text-primary opacity-100' : 'text-muted-foreground opacity-0'
              }`}
            >
              {section}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
