import StalenessSelector from '@/components/moves/crouch-cancel/staleness-selector';
import { useState } from 'react';

export interface StalenessQueueData {
  onStalenessChange: (staleness: number) => void;
}

export default function StalenessQueue(data: StalenessQueueData) {
  const [staleness, setStaleness] = useState<number>(0);

  function calculateStaleness(value: boolean, multiplier: number): void {
    let originalStaleness = staleness;
    if (value) {
      originalStaleness += multiplier;
    } else {
      originalStaleness -= multiplier;
    }
    setStaleness(originalStaleness);
    data.onStalenessChange(originalStaleness);
  }

  return (
    <div className="flex gap-1">
      <StalenessSelector
        slot="1"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.09)}
      ></StalenessSelector>
      <StalenessSelector
        slot="2"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.08)}
      ></StalenessSelector>
      <StalenessSelector
        slot="3"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.07)}
      ></StalenessSelector>
      <StalenessSelector
        slot="4"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.06)}
      ></StalenessSelector>
      <StalenessSelector
        slot="5"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.05)}
      ></StalenessSelector>
      <StalenessSelector
        slot="6"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.04)}
      ></StalenessSelector>
      <StalenessSelector
        slot="7"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.03)}
      ></StalenessSelector>
      <StalenessSelector
        slot="8"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.02)}
      ></StalenessSelector>
      <StalenessSelector
        slot="9"
        onValueChange={(isSelected: boolean) => calculateStaleness(isSelected, 0.01)}
      ></StalenessSelector>
    </div>
  );
}
