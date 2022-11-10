import { Avatar, Group, Select, Table, Text, Button, TextInput, Pagination } from '@mantine/core';

import { resolveInitials } from 'utils/strings';
import { calculateTotal } from 'utils/pagiantion';
import type { Role} from 'constants/roles';
import { ROLES_LIST } from 'constants/roles';

interface Props {
  page: number;
  count: number;
  data: {
    id: string;
    image: string | null;
    name: string | null;
    email: string | null;
    role: string;
  }[];
  currentUser: string | undefined;
  updateRole: (userId: string, newRole: Role) => void;
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

const UsersTable = (props: Props) => {
  const { page, count, data, currentUser, updateRole, onPageChange, onQueryChange } = props;

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
          data={ROLES_LIST}
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
    <>
      <TextInput
        my="lg"
        mr="auto"
        defaultValue=""
        placeholder="Search users"
        sx={{ width: '280px' }}
        onChange={(e) => onQueryChange(e.target.value)}
      />
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
      <Group position="right" py="lg">
        <Pagination
          page={page}
          onChange={onPageChange}
          total={calculateTotal(count)}
        />
      </Group>
    </>
  );
}

export default UsersTable;
