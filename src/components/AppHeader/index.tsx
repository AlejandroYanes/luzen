import Link from 'next/link';
import { Button, createStyles, Group, Header, Avatar, Menu, Code } from '@mantine/core';
import { openSpotlight } from '@mantine/spotlight';
import { useHotkeys } from '@mantine/hooks';
import { IconLogout, IconSearch, IconSettings, IconBucket } from '@tabler/icons';
import { useSession, signOut } from 'next-auth/react';
import RenderIf from 'components/RenderIf';
import { resolveInitials } from 'utils/strings';

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
  useHotkeys([
    ['mod+K', () => openSpotlight()],
  ]);

  return (
    <Header height={56} className={classes.header} mb={120} px={24}>
      <div className={classes.inner}>
        <Group>
          <Link href="/">
            <IconBucket size={24} />
          </Link>
        </Group>

        <Group>
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
              <Link href="/signin">
                <Button>Log in</Button>
              </Link>
            }
          >
            <Menu position="bottom-end" offset={20} width={160}>
              <Menu.Target>
                <Avatar src={data?.user?.image} alt={data?.user?.name as string}>
                  {data?.user?.name ? resolveInitials(data?.user?.name as string) : null}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
                <Menu.Item color="red" icon={<IconLogout size={14} />} onClick={() => signOut()}>
                  Log out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </RenderIf>
        </Group>
      </div>
    </Header>
  );
};

export default AppHeader;
