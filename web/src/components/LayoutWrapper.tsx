import React from 'react';

import Header from '@/components/Navbar';
import SectionContainer from '@/components/SectionContainer';
import Divider from '@/ui/Divider';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='bg-gray-100'>
      <SectionContainer>
        <div className='min-h-screen'>
          <Header />
          <main>{children}</main>
          <Divider className='my-4' />
        </div>
      </SectionContainer>
    </div>
  );
};

export default LayoutWrapper;