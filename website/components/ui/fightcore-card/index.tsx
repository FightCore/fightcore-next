import { cn, Surface } from '@heroui/react';
import { ReactNode } from 'react';

interface RootSlotProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'secondary' | 'tertiary' | 'transparent';
}

interface SlotProps {
  children: ReactNode;
  className?: string;
}

function FightcoreCardRoot({ children, className, variant }: Readonly<RootSlotProps>) {
  return (
    <Surface variant={variant} className={cn('border-divider overflow-hidden rounded-xl border', className)}>
      {children}
    </Surface>
  );
}

function Header({ children, className }: Readonly<SlotProps>) {
  return (
    <div className={cn('border-divider flex items-center justify-between border-b px-4 py-3', className)}>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function Title({ children, className }: Readonly<SlotProps>) {
  return (
    <span className={cn('text-foreground-400 text-xs font-semibold tracking-wider uppercase', className)}>
      {children}
    </span>
  );
}

function Subtitle({ children, className }: Readonly<SlotProps>) {
  return <span className={cn('text-foreground-500 text-xs', className)}>{children}</span>;
}

function Body({ children, className }: Readonly<SlotProps>) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

function Footer({ children, className }: Readonly<SlotProps>) {
  return <div className={cn('border-divider flex items-center border-t px-4 py-3', className)}>{children}</div>;
}

export const FightcoreCard = Object.assign(FightcoreCardRoot, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
});
