import type { ReactNode } from 'react';

import AppHeader from 'components/AppHeader';
import SearchSpotlight from 'components/SearchSpotlight';
import { StyledWrapper, StyledContent } from './styled';

interface Props {
	children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { children } = props;

  return (
    <SearchSpotlight>
      <StyledWrapper>
        <AppHeader />
        <StyledContent>
          {children}
        </StyledContent>
      </StyledWrapper>
    </SearchSpotlight>
  );
};

export default BaseLayout;
