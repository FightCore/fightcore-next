import { SearchResult } from '@/components/global-search/search-result-card';
import { Separator } from '@heroui/react';
import Image from 'next/image';

interface SearchListItemProps {
  result: SearchResult;
  hovered: boolean;
}

function createStats(result: SearchResult): { name: string; value: string }[] {
  const resultValue = [];

  if (result.start && result.end) {
    resultValue.push({ name: 'Active', value: result.start + '-' + result.end });
  }

  if (result.totalFrames) {
    resultValue.push({ name: 'Total', value: result.totalFrames.toString() });
  }

  return resultValue;
}

export function SearchListItem({ result, hovered }: Readonly<SearchListItemProps>) {
  const stats = createStats(result);
  return (
    <div className={'w-full ' + (hovered ? 'bg-surface-hover cursor-pointer' : '')}>
      <div className="flex flex-row justify-between p-1">
        <div className="flex flex-row gap-1">
          <Image alt={result.character} width={30} height={30} src={'/newicons/' + result.character + '.webp'} />
          <span>{result.move}</span>
        </div>
        <div className="flex flex-row gap-1.5">
          {stats.map((stat, index) => {
            return (
              <div key={result.id + '' + stat.name} className="flex flex-row gap-1.5">
                {index > 0 && <Separator orientation="vertical" />}
                <div className="text-muted">
                  {stat.name} <span className="text-foreground">{stat.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
