import { Accordion } from '@heroui/react';
import { FaCircleQuestion } from 'react-icons/fa6';
import Link from 'next/link';

interface LegendEntry {
  color: string;
  label: string;
  glossaryUrl?: string;
}

const hitboxEntries: LegendEntry[] = [
  { color: '#FF0000', label: 'id0' },
  { color: '#00FF00', label: 'id1' },
  { color: '#0000FF', label: 'id2' },
  { color: '#FF00FF', label: 'id3' },
];

const boneEntries: LegendEntry[] = [
  { color: '#FFFF00', label: 'Normal', glossaryUrl: 'https://example.com/glossary/normal' },
  { color: '#DAA520', label: 'Ungrabbable', glossaryUrl: 'https://example.com/glossary/ungrabbable' },
  { color: '#0000C0', label: 'Intangible', glossaryUrl: 'https://example.com/glossary/intangible' },
  { color: '#00FF00', label: 'Invincible', glossaryUrl: 'https://example.com/glossary/invincible' },
];

const characterEntries: LegendEntry[] = [
  { color: '#FF8000', label: 'Auto Cancel', glossaryUrl: 'https://example.com/glossary/auto-cancel' },
  { color: '#FF00C0', label: 'IASA', glossaryUrl: 'https://example.com/glossary/iasa' },
];

function LegendItem({ entry }: Readonly<{ entry: LegendEntry }>) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: entry.color }}
      />
      {entry.glossaryUrl ? (
        <Link
          href={entry.glossaryUrl}
          className="text-sm text-default-600 underline decoration-default-300 underline-offset-2 transition-colors hover:text-default-900"
        >
          {entry.label}
        </Link>
      ) : (
        <span className="text-sm text-default-600">{entry.label}</span>
      )}
    </div>
  );
}

export function AnimationLegendContent() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-default-500">Hitbox IDs</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {hitboxEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-default-500">Bone colors</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {boneEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-default-500">Character</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {characterEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div className="col-span-3 border-t border-default-200 pt-2">
        <h3 className="text-sm font-semibold text-default-500">Missing hitbox IDs</h3>
        <p className="mt-0.5 text-xs text-default-400">
          Sometimes hitbox colors and table data don&apos;t match. When this happens,{' '}
          <strong className="text-default-500">all hitboxes share the same data.</strong>
        </p>
      </div>
    </div>
  );
}

export default function AnimationLegend() {
  return (
    <Accordion>
      <Accordion.Item id="1">
        <Accordion.Heading>
          <Accordion.Trigger>
            <FaCircleQuestion className="mr-2" />
            Hitbox GIF Legend
            <span className="ml-2 text-sm font-normal text-default-500">
              Open this to learn more about what the hitbox colors mean
            </span>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            <AnimationLegendContent />
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
