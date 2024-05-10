import { Input, Kbd } from '@nextui-org/react';
import { SearchIcon } from '../../components/icons';

export const SearchBar = ({ ...props }) => {
  return (
    <Input
      aria-label='Search'
      classNames={{
        inputWrapper: 'bg-default-100 ' + props.className,
        input: 'text-sm',
      }}
      endContent={
        <Kbd className='hidden lg:inline-block' keys={['ctrl']}>
          K
        </Kbd>
      }
      labelPlacement='outside'
      placeholder='Search...'
      startContent={
        <SearchIcon className='text-base text-default-400 pointer-events-none flex-shrink-0' />
      }
      type='search'
    />
  );
};
