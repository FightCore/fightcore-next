import clsx from 'clsx';
import { useState } from 'react';

interface StalenessSlotProps {
  slot: string;
  onValueChange: (isSelected: boolean) => void;
}

export default function StalenessSelector({ slot, onValueChange }: StalenessSlotProps) {
  const [isSelected, setIsSelected] = useState(false);

  const toggle = () => {
    const newValue = !isSelected;
    setIsSelected(newValue);
    onValueChange(newValue);
  };

  return (
    <button
      onClick={toggle}
      className={clsx(
        'cursor-pointer rounded border px-2 py-1 text-sm transition-colors',
        isSelected
          ? 'border-accent bg-accent text-accent-foreground'
          : 'border-default bg-transparent text-muted hover:bg-surface-secondary',
      )}
    >
      {slot}
    </button>
  );
}
