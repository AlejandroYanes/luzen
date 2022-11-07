import { Avatar, Badge, Table, Group, Text, Select } from '@mantine/core';
import { resolveInitials } from 'utils/strings';

interface UsersTableProps {
  isLoading: boolean;
  data: { image: string | null; name: string | null; email: string | null; role: string }[];
}

const rolesData = ['USER', 'ADMIN'];

const UsersTable = ({ data }: UsersTableProps) => {
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
        <Select data={rolesData} defaultValue={user.role} variant="unstyled" />
      </td>

      <td>
        {Math.random() > 0.5 ? (
          <Badge fullWidth>Active</Badge>
        ) : (
          <Badge color="gray" fullWidth>
            Disabled
          </Badge>
        )}
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

export default UsersTable;
