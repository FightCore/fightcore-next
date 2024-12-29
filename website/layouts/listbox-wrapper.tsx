import React from 'react';

interface ListboxWrapperInput {
  children: any;
}

export const ListboxWrapper = (input: ListboxWrapperInput) => (
  <div className="w-full max-w-[260px] rounded-small border-small border-default-200 px-1 py-2 dark:border-default-100">
    {input.children}
  </div>
);
