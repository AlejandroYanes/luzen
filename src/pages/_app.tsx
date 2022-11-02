import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { useColorScheme } from '@mantine/hooks';
import { trpc } from 'utils/trpc';
import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const colorScheme = useColorScheme();
  return (
    <SessionProvider session={session}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme,
          globalStyles: (theme) => ({
            '*, *::before, *::after': {
              boxSizing: 'border-box',
            },
            html: {
              colorScheme: theme.colorScheme,
            },
            body: {
              ...theme.fn.fontStyles(),
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
            },
          }),
        }}
      >
        <NotificationsProvider position="top-right">
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
