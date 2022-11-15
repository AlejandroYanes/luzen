import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, createStyles, Group, Header, useMantineTheme, } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
import { useMediaQuery } from '@mantine/hooks';

import RenderIf from 'components/RenderIf';
import AvatarMenu from 'components/AvatarMenu';
import { openSignInModal } from 'components/SignInModal';
import NotificationCenter from 'components/NotificationCenter';
import TipText from './TipText';
import SearchButton from './SearchButton';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '48px',
    [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
      marginBottom: '16px',
    },
  },
}));

const AppHeader = () => {
  const { classes } = useStyles();
  const { status, data } = useSession();
  const { pathname } = useRouter();
  const theme = useMantineTheme();
  const isMobileScreen = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`);

  return (
    <Header height={56} className={classes.header} px={24}>
      <Group>
        <Link href="/ideas">
          <IconBulb size={32} />
        </Link>
      </Group>

      <Group>
        <TipText isLoggedIn={status === 'authenticated'} isMobileScreen={isMobileScreen} />
        <SearchButton isHomePage={pathname === '/'} isMobileScreen={isMobileScreen} />
        <RenderIf
          condition={status === 'authenticated'}
          fallback={
            <Group>
              <Button onClick={() => openSignInModal()}>Sign in</Button>
            </Group>
          }
        >
          <Group spacing="xl">
            <RenderIf condition={!isMobileScreen}>
              <Link href="/post">
                <Button>Post new Idea</Button>
              </Link>
            </RenderIf>
            <NotificationCenter />
            <AvatarMenu user={data?.user} />
          </Group>
        </RenderIf>
      </Group>
    </Header>
  );
};

export default AppHeader;
