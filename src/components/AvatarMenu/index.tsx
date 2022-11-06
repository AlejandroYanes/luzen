import { signOut } from 'next-auth/react';
import { Avatar, Menu } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconLogout, IconSettings, IconList } from '@tabler/icons';
import { resolveInitials } from 'utils/strings';
import { useRouter } from 'next/router';

interface Props {
  user?: {
    name?: string | null;
    image?: string | null;
  };
}

const AvatarMenu = (props: Props) => {
  const { user } = props;
  const router = useRouter();
  return (
    <Menu position="bottom-end" offset={20} width={160}>
      <Menu.Target>
        <Avatar src={user?.image} alt={user?.name as string} style={{ cursor: 'pointer' }}>
          {user?.name ? resolveInitials(user?.name as string) : null}
        </Avatar>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => router.push('/me/ideas/published')}
          icon={<IconList size={14} />}
        >
          My ideas
        </Menu.Item>
        <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
        <Menu.Item
          color="red"
          icon={<IconLogout size={14} />}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AvatarMenu;
