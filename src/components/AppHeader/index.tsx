import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { ActionIcon, Button, createStyles, Group, Header, } from '@mantine/core';
import { IconBulb } from '@tabler/icons';

import useMobileView from 'hooks/ui/useMobileView';
import RenderIf from 'components/RenderIf';
import AvatarMenu from 'components/AvatarMenu';
import { openSignInModal } from 'components/SignInModal';
import TipText from './TipText';
import SearchButton from './SearchButton';

const NotificationCenter = dynamic(() => import('components/NotificationCenter'), {
  ssr: false,
});

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
  },
}));

const AppHeader = () => {
  const { classes } = useStyles();
  const { status, data } = useSession();
  const { pathname } = useRouter();
  const isMobileScreen = useMobileView();

  return (
    <Header height={56} className={classes.header} px={24}>
      <Group>
        <Link href="/ideas">
          <ActionIcon>
            <IconBulb size={32} />
          </ActionIcon>
        </Link>
      </Group>

      <RenderIf condition={status !== 'loading'}>
        <Group>
          <TipText isLoggedIn={status === 'authenticated'} isMobileScreen={isMobileScreen} />
          <RenderIf condition={status === 'authenticated' && !isMobileScreen}>
            <Link href="/post/">
              <Button>Post new Idea</Button>
            </Link>
          </RenderIf>
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
              <NotificationCenter />
              <AvatarMenu user={data?.user} />
            </Group>
          </RenderIf>
        </Group>
      </RenderIf>
    </Header>
  );
};

export default AppHeader;
