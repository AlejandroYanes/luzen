import type { PropsWithChildren, ReactNode } from 'react';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createStyles } from '@mantine/core';

import AppHeader from 'components/AppHeader';
import { mobileViewMediaQuery } from 'hooks/ui/useMobileView';

const SearchSpotlight = dynamic(() => import('components/SearchSpotlight'), {
  ssr: false,
});

const DynamicSearchSpotlight = ({ children }: PropsWithChildren) => (
  <Suspense fallback={children}>
    <SearchSpotlight>
      {children}
    </SearchSpotlight>
  </Suspense>
);

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 48px 24px',

    [`@media ${mobileViewMediaQuery(theme)}`]: {
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
    <DynamicSearchSpotlight>
      <section className={classes.wrapper}>
        <AppHeader />
        <main className={classes.main}>
          {children}
        </main>
      </section>
    </DynamicSearchSpotlight>
  );
};

export default BaseLayout;
