import { Button, Description, Dropdown, Label, Separator } from '@heroui/react';
import { useEffect, useRef, useState } from 'react';

const COLOR_THEME_KEY = 'fightcore-color-theme';

type ColorTheme = 'default' | 'fightcore' | 'ocean' | 'violet' | 'forest';

const themes: { id: ColorTheme; label: string; color: string }[] = [
  { id: 'fightcore', label: 'Original', color: 'oklch(57% 0.21 25)' },
  { id: 'default', label: 'Blue', color: 'oklch(83.55% 0.0703 235.76)' },
  { id: 'ocean', label: 'Ocean', color: 'oklch(65% 0.18 185)' },
  { id: 'violet', label: 'Violet', color: 'oklch(62% 0.22 290)' },
  { id: 'forest', label: 'Forest', color: 'oklch(60% 0.20 145)' },
];

function applyTheme(id: ColorTheme) {
  if (id === 'default') {
    document.documentElement.removeAttribute('data-color-theme');
  } else {
    document.documentElement.setAttribute('data-color-theme', id);
  }
}

export const ThemePicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<ColorTheme>('default');
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme | null;
    if (stored && themes.some((t) => t.id === stored)) {
      applyTheme(stored);
      setActiveTheme(stored);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectTheme = (id: ColorTheme) => {
    applyTheme(id);
    setActiveTheme(id);
    localStorage.setItem(COLOR_THEME_KEY, id);
    setIsOpen(false);
  };

  const current = themes.find((t) => t.id === activeTheme)!;

  if (!isMounted) return <div className="h-5.5 w-5.5" />;

  return (
    <Dropdown>
      <Button aria-label="Menu" variant="ghost">
        <span
          className="block h-5.5 w-5.5 rounded-full border-2 border-white/25"
          style={{ background: current.color }}
        />
      </Button>
      <Dropdown.Popover>
        <Dropdown.Menu
          selectedKeys={[current.id]}
          selectionMode="single"
          onSelectionChange={(key) => {
            selectTheme([...key][0].toString() as ColorTheme);
          }}
        >
          <Dropdown.Section>
            {themes.map((theme) => (
              <Dropdown.Item key={theme.id} id={theme.id} textValue={theme.label}>
                <span className="h-3.5 w-3.5 rounded-full" style={{ background: theme.color }} />
                <Label>
                  <span className="text-left">{theme.label}</span>
                </Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Section>
          <Separator />
          <Dropdown.Section>
            <Dropdown.Item className="flex flex-col">
              <Label>Provide feedback</Label>
              <Description>We are looking for help on finding our new look</Description>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
