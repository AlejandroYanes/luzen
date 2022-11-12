import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button, Code, createStyles, Group, Header, Text, Tooltip, } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';
import { IconBulb, IconSearch } from '@tabler/icons';

import RenderIf from 'components/RenderIf';
import AvatarMenu from 'components/AvatarMenu';
import { openSignInModal } from 'components/SignInModal';
import NotificationCenter from 'components/NotificationCenter';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}));

const AppHeader = () => {
  const { classes } = useStyles();
  const { status, data } = useSession();

  return (
    <Header height={56} className={classes.header} mb={48} px={24}>
      <div className={classes.inner}>
        <Group>
          <Link href="/">
            <IconBulb size={32} />
          </Link>
        </Group>

        <Group>
          <RenderIf condition={status !== 'authenticated'}>
            <Tooltip
              label="Sign In and start sharing right now."
              color="blue"
              position="bottom"
              offset={20}
              withArrow
            >
              <Text>What to post your ideas?</Text>
            </Tooltip>
          </RenderIf>
          <Button
            variant="default"
            leftIcon={<IconSearch size={16} stroke={1.5} />}
            rightIcon={<Code>⌘ + K</Code>}
            onClick={() => openSpotlight()}
          >
            Search
          </Button>
          <RenderIf
            condition={status === 'authenticated'}
            fallback={
              <Group>
                <Button onClick={() => openSignInModal()}>Sign in</Button>
              </Group>
            }
          >
            <Group>
              <Link href="/post">
                <Button>Post new Idea</Button>
              </Link>
              <NotificationCenter />
              <AvatarMenu user={data?.user} />
            </Group>
          </RenderIf>
        </Group>
      </div>
    </Header>
  );
};

export default AppHeader;
