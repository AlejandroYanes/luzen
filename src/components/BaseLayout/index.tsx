import type { ReactNode } from 'react';
import AppHeader from '../AppHeader';
import { StyledWrapper, StyledContent } from './styled';

interface Props {
	children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { children } = props;

  return (
    <StyledWrapper>
      <AppHeader />
      <StyledContent>
        {children}
      </StyledContent>
    </StyledWrapper>
  );
};

export default BaseLayout;
