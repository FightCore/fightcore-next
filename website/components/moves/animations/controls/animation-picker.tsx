import { ToggleButton, ToggleButtonGroup } from '@heroui/react';

export interface AnimationPickerProps {
  descriptions: string[];
  onChange: (key: number) => void;
}

export const AnimationPicker = ({ descriptions, onChange }: AnimationPickerProps) => {
  return (
    <div>
      <ToggleButtonGroup
        isDetached
        selectionMode="single"
        onSelectionChange={(keys) => {
          const first = [...keys][0];
          const key = Number(first);
          onChange(key + 1);
        }}
      >
        {descriptions.slice(1).map((description, index) => {
          return (
            <ToggleButton key={description} id={index}>
              {description}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
    </div>
  );
};
