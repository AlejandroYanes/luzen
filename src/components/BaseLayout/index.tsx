import type { ReactNode } from 'react';
import { createStyles } from '@mantine/core';

import AppHeader from 'components/AppHeader';
import SearchSpotlight from 'components/SearchSpotlight';

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',

    // Media query with value from theme
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      padding: '0 16px 24px',
    },
  },
}));

interface Props {
	children: ReactNode;
}

const BaseLayout = (props: Props) => {
  const { children } = props;
  const { classes } = useStyles();

  return (
    <SearchSpotlight>
      <section className={classes.wrapper}>
        <AppHeader />
        <main className={classes.main}>
          {children}
        </main>
      </section>
    </SearchSpotlight>
  );
};

export default BaseLayout;
