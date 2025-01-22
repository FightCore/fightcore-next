import { SwitchProps, useSwitch } from "@heroui/switch";
import { VisuallyHidden } from '@react-aria/visually-hidden';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';

import { MoonFilledIcon, SunFilledIcon } from '@/components/icons';

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps['classNames'];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  const onChange = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch({
    isSelected: theme === 'light',
    onChange,
  });

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  // Prevent Hydration Mismatch
  if (!isMounted) return <div className="h-6 w-6" />;

  return (
    <Component
      {...getBaseProps({
        className: clsx('px-px transition-opacity hover:opacity-80 cursor-pointer', className, classNames?.base),
      })}
    >
      <VisuallyHidden>
        <input aria-labelledby="theme-switcher" {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        aria-label="theme-switcher-icon"
        className={slots.wrapper({
          class: clsx(
            [
              'h-auto w-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              '!text-foreground',
              'pt-px',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {isSelected ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
      </div>
    </Component>
  );
};
