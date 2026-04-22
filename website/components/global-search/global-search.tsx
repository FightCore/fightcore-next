import { useDebounce } from '@/hooks/use-debounce';
import { Button, Input, Kbd, Modal, Spinner } from '@heroui/react';
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
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col gap-1">Search Moves</Modal.Header>
            <Modal.Body>
              <div className="p-2">
                <Input
                  autoFocus
                  placeholder="Search for a move..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {isLoading && (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              )}
              {!isLoading && results.length > 0 && (
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {results.map((result) => (
                    <SearchResultCard key={result.id} result={result} onNavigate={handleNavigate} />
                  ))}
                </div>
              )}
              {!isLoading && query && debouncedQuery && results.length === 0 && (
                <div className="text-default-500 py-8 text-center">No results found for "{debouncedQuery}"</div>
              )}
            </Modal.Body>
            <Modal.Footer>
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
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal.Root>
  );
}
