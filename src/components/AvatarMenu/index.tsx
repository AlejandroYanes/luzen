import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import type { Role } from '@prisma/client';
import { Avatar, Menu } from '@mantine/core';
import {
  IconLogout,
  IconSettings,
  IconUsers,
  IconBuildingLighthouse,
  IconBulb,
} from '@tabler/icons';
import { resolveInitials } from 'utils/strings';
import RenderIf from '../RenderIf';

interface Props {
  user?: {
    name?: string | null;
    image?: string | null;
    role: Role;
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
        <RenderIf condition={user?.role === 'ADMIN'}>
          <Menu.Item
            onClick={() => router.push('/management/users')}
            icon={<IconUsers size={14} />}
          >
            Manage Users
          </Menu.Item>
          <Menu.Item
            onClick={() => router.push('/management/ideas')}
            icon={<IconBuildingLighthouse size={14} />}
          >
            Manage Ideas
          </Menu.Item>
        </RenderIf>
        <Menu.Item
          onClick={() => router.push('/me/ideas/published')}
          icon={<IconBulb size={14} />}
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
