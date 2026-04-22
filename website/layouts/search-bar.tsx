import { MoveCard } from '@/components/moves/move-card';
import { characters } from '@/config/framedata/framedata';
import { ExportedMove } from '@/models/exported-moves';
import { search } from '@/utilities/search/search';
import { Button, Input, Modal } from '@heroui/react';
import { useEffect, useState } from 'react';
import { SearchIcon } from '../components/icons';

function getCharacter(move: ExportedMove) {
  return characters.find((character) => character.fightCoreId === move.characterId);
}

export const SearchBar = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
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
        className={'bg-default-100 ' + props.className}
        onClick={() => setIsOpen(true)}
        placeholder="Search..."
        type="search"
      />
      <Modal.Root isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container size="full">
            <Modal.Dialog>
              <Modal.Header className="flex flex-col gap-1">Search</Modal.Header>
              <Modal.Body>
                <Input
                  placeholder="Search..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  {filteredItems.map((move) => (
                    <MoveCard key={move.id} character={getCharacter(move)!} move={move} lazy={false} />
                  ))}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onPress={() => setIsOpen(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>
    </>
  );
};
