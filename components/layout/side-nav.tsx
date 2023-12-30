'use client';
import { Listbox, ListboxItem, ListboxSection } from '@nextui-org/react';
import { Logo } from '../icons';
import { ListboxWrapper } from './listbox-wrapper';

export const SideNav = () => {
  'use client';
  return (
    <>
      <div className='w-100 align-content-center flex p-3'>
        <Logo className='flex-1' height={50} width={100} />
      </div>
      <ListboxWrapper>
        <Listbox variant='flat' aria-label='Listbox menu with sections'>
          <ListboxSection title='Actions' showDivider>
            <ListboxItem key='new'>New file</ListboxItem>
            <ListboxItem key='copy' description='Copy the file link'>
              Copy link
            </ListboxItem>
            <ListboxItem key='edit' description='Allows you to edit the file'>
              Edit file
            </ListboxItem>
          </ListboxSection>
          <ListboxSection title='Danger zone'>
            <ListboxItem
              key='delete'
              className='text-danger'
              color='danger'
              description='Permanently delete the file'
            >
              Delete file
            </ListboxItem>
          </ListboxSection>
        </Listbox>
      </ListboxWrapper>
    </>
  );
};
