import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
import { ExportedMove } from '@/models/exported-moves';
import { search } from '@/utilities/search/search';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Kbd } from '@heroui/kbd';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/modal';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../components/icons';

function getCharacter(move: ExportedMove) {
  return characters.find((character) => character.fightCoreId === move.characterId);
}

export const SearchBar = ({ ...props }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const initialState: ExportedMove[] = [];
  const [filteredItems, setFilteredItems] = useState(initialState);

  useEffect(() => {
    async function fetchData() {
      setFilteredItems(await search(searchTerm, initialState));
    }
    fetchData();
  }, [searchTerm]);

  return (
    <>
      <Input
        aria-label="Search"
        classNames={{
          inputWrapper: 'bg-default-100 ' + props.className,
          input: 'text-sm',
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={['ctrl']}>
            K
          </Kbd>
        }
        onClick={onOpen}
        labelPlacement="outside"
        placeholder="Search..."
        startContent={<SearchIcon className="text-default-400 pointer-events-none shrink-0 text-base" />}
        type="search"
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Search</ModalHeader>
              <ModalBody>
                <Input
                  color="primary"
                  size="lg"
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  {filteredItems.map((move) => (
                    <MoveCard key={move.id} character={getCharacter(move)!} move={move} lazy={false} />
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
