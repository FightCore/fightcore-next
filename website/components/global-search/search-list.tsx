import { SearchListItem } from '@/components/global-search/search-list-item';
import { SearchResult } from '@/components/global-search/search-result-card';
import { useEffect, useState } from 'react';

interface SearchListProps {
  results: SearchResult[];
  onSelectedResult(result: SearchResult | null): void;
}

export function SearchList({ results, onSelectedResult }: Readonly<SearchListProps>) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex > -1 && selectedIndex < results.length) {
      onSelectedResult(results[selectedIndex]);
    } else {
      onSelectedResult(null);
    }
  }, [selectedIndex]);

  return (
    <div className="flex flex-col">
      {results.map((result, index) => {
        return (
          <div key={result.id.toString()} onMouseEnter={() => setSelectedIndex(index)}>
            <SearchListItem result={result} hovered={selectedIndex === index}></SearchListItem>
          </div>
        );
      })}
    </div>
  );
}
