import { SearchList } from '@/components/global-search/search-list';
import { FightcoreCard } from '@/components/ui/fightcore-card';
import { useDebounce } from '@/hooks/use-debounce';
import { Button, Input, Kbd, Modal } from '@heroui/react';
import { useCallback, useEffect, useState } from 'react';
import { SearchIcon } from '../icons';
import { useGlobalSearch } from './global-search-context';
import { SearchResult, SearchResultCard } from './search-result-card';

interface GlobalSearchProps {
  showTrigger?: boolean;
}

export function GlobalSearch({ showTrigger = true }: Readonly<GlobalSearchProps>) {
  const { isOpen, onOpen, onClose, onOpenChange, triggerNavigate } = useGlobalSearch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (showTrigger) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen, showTrigger]);

  useEffect(() => {
    if (showTrigger) return;

    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        // @ts-ignore
        umami.track('search', { query });
      } catch {
        // Ignored on purpose
      }
      try {
        const response = await fetch(`https://api.meleesearch.com/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, showTrigger]);

  const handleNavigate = useCallback(() => {
    onClose();
    setQuery('');
    setResults([]);
    triggerNavigate();
  }, [onClose, triggerNavigate]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      onOpenChange(open);
      if (!open) {
        setQuery('');
        setResults([]);
      }
    },
    [onOpenChange],
  );

  if (showTrigger) {
    return (
      <Button variant="tertiary" aria-label="Search" className="text-default-500 w-full justify-start" onPress={onOpen}>
        <SearchIcon className="text-default-400 pointer-events-none shrink-0 text-base" />
        Search...
        <Kbd className="ml-auto hidden lg:inline-block">Ctrl + K</Kbd>
      </Button>
    );
  }

  return (
    <Modal.Root isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Modal.Backdrop>
        <Modal.Container scroll="inside">
          <Modal.Dialog className="h-1/2 max-w-5xl overflow-hidden rounded-xl p-0">
            <FightcoreCard className="h-full flex flex-col">
              <FightcoreCard.Header>
                <Input
                  autoFocus
                  placeholder="Search for a move..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </FightcoreCard.Header>
              <FightcoreCard.Body className="flex-1 min-h-0 overflow-y-auto">
                <div className="flex">
                  <div className="flex-4">
                    {!isLoading && results.length > 0 && (
                      <div className="flex flex-col">
                        <SearchList results={results} onSelectedResult={setSelectedResult}></SearchList>
                      </div>
                    )}
                  </div>
                  <div className="flex-3">
                    {selectedResult && (
                      <SearchResultCard key={selectedResult.id} result={selectedResult} onNavigate={handleNavigate} />
                    )}
                  </div>
                </div>
              </FightcoreCard.Body>
              <FightcoreCard.Footer>
                <span className="text-default-400 text-xs">
                  Powered by{' '}
                  <a
                    href="https://www.meleesearch.com"
                    className="text-xs underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MeleeSearch.com
                  </a>
                </span>
              </FightcoreCard.Footer>
            </FightcoreCard>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
