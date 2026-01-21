'use client';

import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Link } from '@heroui/link';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import { Spinner } from '@heroui/spinner';
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
    // Only register the keyboard shortcut for the instance that renders the modal
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
    // Only run search effects for the instance that renders the modal
    if (showTrigger) return;

    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
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
      onOpenChange();
      if (!open) {
        setQuery('');
        setResults([]);
      }
    },
    [onOpenChange],
  );

  // Only render the trigger button
  if (showTrigger) {
    return (
      <Button
        variant="bordered"
        aria-label="Search"
        className="text-default-500 w-full justify-start"
        startContent={<SearchIcon className="text-default-400 pointer-events-none shrink-0 text-base" />}
        endContent={
          <Kbd className="ml-auto hidden lg:inline-block" keys={['ctrl']}>
            K
          </Kbd>
        }
        onPress={onOpen}
      >
        Search...
      </Button>
    );
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Search Moves</ModalHeader>
            <ModalBody>
              <Input
                variant="underlined"
                autoFocus
                color="primary"
                size="lg"
                placeholder="Search for a move..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                startContent={<SearchIcon className="text-default-400" />}
              />
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
            </ModalBody>
            <ModalFooter>
              <span className="text-default-400 text-xs">
                Powered by{' '}
                <Link href="https://www.meleesearch.com" className="text-xs" target="_blank">
                  MeleeSearch.com
                </Link>
              </span>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
