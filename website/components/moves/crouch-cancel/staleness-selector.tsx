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
          ? 'border-red-700 bg-red-700 text-white'
          : 'border-gray-300 bg-transparent text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700',
      )}
    >
      {slot}
    </button>
  );
}
