/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Avatar, Group, Select, Table, Text, Button } from '@mantine/core';
import { resolveInitials } from 'utils/strings';
import type { Role} from 'constants/roles';
import { ROLES } from 'constants/roles';

interface UsersTableProps {
  data: {
    id: string;
    image: string | null;
    name: string | null;
    email: string | null;
    role: string;
  }[];
  currentUser: string | undefined;
  updateRole: (userId: string, newRole: Role) => void;
}

const UsersTable = (props: UsersTableProps) => {
  const { data, currentUser, updateRole } = props;
  const rows = data.map((user) => (
    <tr key={user.name}>
      <td>
        <Group spacing="sm">
          <Avatar size={40} src={user.image}>
            {user.name ? resolveInitials(user.name) : 'A/N'}
          </Avatar>
          <div>
            <Text size="sm" weight={500}>
              {user.name ?? 'Anonymous'}
            </Text>
            <Text size="xs" color="dimmed">
              {user.email ?? 'no email'}
            </Text>
          </div>
        </Group>
      </td>

      <td>
        <Select
          disabled={user.id === currentUser}
          data={ROLES}
          value={user.role}
          onChange={(value) => updateRole(user.id, value! as Role)}
          variant="unstyled"
        />
      </td>
      <td>
        <Button color="red" disabled={user.id === currentUser}>Block</Button>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default UsersTable;
