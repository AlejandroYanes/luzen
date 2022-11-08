/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Avatar, Group, Select, Table, Text, Button } from '@mantine/core';
import { resolveInitials } from 'utils/strings';
import type { Role} from 'constants/roles';
import { ROLES } from 'constants/roles';

interface Props {
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

const UsersTable = (props: Props) => {
  const { data, currentUser, updateRole } = props;
  const rows = data.map((user) => (
    <tr key={user.id}>
      <td>
        <Group spacing="sm">
          <Avatar src={user.image}>
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
        <Button
          style={{ float: 'right' }}
          variant="outline"
          color="red"
          disabled={user.id === currentUser}
        >
          Block
        </Button>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th>User</th>
          <th style={{ width: '180px' }}>Role</th>
          <th style={{ width: '130px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default UsersTable;
