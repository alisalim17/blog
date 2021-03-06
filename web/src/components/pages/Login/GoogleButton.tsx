import React from 'react';
import { ImGoogle } from 'react-icons/im';

import Button from '@/ui/buttons/Button';
import UnstyledLink from '@/ui/links/UnstyledLink';

import { isServer } from '@/utils/isServer';

interface GoogleButtonProps {
  backToSamePage?: boolean;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  backToSamePage,
  children,
}) => {
  return (
    <UnstyledLink
      href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?next=${
        !isServer
          ? backToSamePage
            ? window?.location?.href
            : window?.location?.origin
          : ''
      }`}
    >
      <Button variant='light'>
        <div className='flex flex-row items-center px-4'>
          <ImGoogle className='mr-2' />
          {children}
        </div>
      </Button>
    </UnstyledLink>
  );
};
export default GoogleButton;
