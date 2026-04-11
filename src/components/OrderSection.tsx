import { Button } from '@/components/ui/button';

interface OrderSectionProps {
  active: boolean;
}

export default function OrderSection({ active }: OrderSectionProps) {
  return (
    <div
      className={`flex flex-col items-center text-center max-w-lg mx-auto transition-all duration-1000 ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <span className="font-mono-code text-xs tracking-[0.4em] uppercase text-primary mb-4">
        — Available Now —
      </span>

      <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-2">
        AUREX <span className="text-gradient-primary">ONE</span>
      </h2>

      <p className="text-muted-foreground text-sm md:text-base mt-4 mb-2 leading-relaxed">
        Precision engineered. Uncompromising quality.
        <br />
        The camera that redefines what's possible.
      </p>

      <div className="flex items-baseline gap-2 my-6">
        <span className="text-muted-foreground text-sm line-through">$4,299</span>
        <span className="text-3xl md:text-5xl font-bold text-foreground">$3,499</span>
        <span className="text-muted-foreground text-xs">.00</span>
      </div>

      <Button
        size="lg"
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-base font-semibold tracking-wider rounded-sm"
      >
        ORDER NOW
      </Button>

      <p className="text-muted-foreground/60 text-xs mt-4 font-mono-code">
        Free shipping · 2-year warranty · 30-day returns
      </p>
    </div>
  );
}
