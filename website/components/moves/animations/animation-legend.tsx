import { Accordion } from '@heroui/react';
import Link from 'next/link';
import { FaCircleQuestion } from 'react-icons/fa6';

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
  { color: '#FFFF00', label: 'Normal', glossaryUrl: undefined },
  { color: '#DAA520', label: 'Ungrabbable', glossaryUrl: undefined },
  { color: '#0000C0', label: 'Intangible', glossaryUrl: undefined },
  { color: '#00FF00', label: 'Invincible', glossaryUrl: undefined },
];

const characterEntries: LegendEntry[] = [
  { color: '#FF8000', label: 'Auto Cancel', glossaryUrl: undefined },
  { color: '#FF00C0', label: 'IASA', glossaryUrl: undefined },
];

function LegendItem({ entry }: Readonly<{ entry: LegendEntry }>) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
      {entry.glossaryUrl ? (
        <Link
          href={entry.glossaryUrl}
          className="text-default-600 decoration-default-300 hover:text-default-900 text-sm underline underline-offset-2 transition-colors"
        >
          {entry.label}
        </Link>
      ) : (
        <span className="text-default-600 text-sm">{entry.label}</span>
      )}
    </div>
  );
}

export function AnimationLegendContent() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      <div>
        <h3 className="text-default-500 mb-1 text-sm font-semibold tracking-wide">Hitbox IDs</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {hitboxEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-default-500 mb-1 text-sm font-semibold tracking-wide">Bone colors</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {boneEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-default-500 mb-1 text-sm font-semibold tracking-wide">Character</h3>
        <div className="grid grid-cols-1 gap-0.5">
          {characterEntries.map((entry) => (
            <LegendItem key={entry.label} entry={entry} />
          ))}
        </div>
      </div>
      <div className="border-default-200 col-span-3 border-t pt-2">
        <h3 className="text-default-500 text-sm font-semibold">Missing hitbox IDs</h3>
        <p className="text-default-400 mt-0.5 text-xs">
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
            <span className="text-default-500 ml-2 text-sm font-normal">
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
