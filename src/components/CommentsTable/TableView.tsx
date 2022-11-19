import { Button, Group, Table, Text } from '@mantine/core';

import UserAvatar from 'components/UserAvatar';
import { formatDate } from 'utils/dates';
import type { Props as BaseProps } from './index';

interface Props {
  data: BaseProps['data'];
}

export default function TableView(props: Props) {
  const { data } = props;
  const rows = data.map((comment) => (
    <tr key={comment.id}>
      <td style={{ verticalAlign: 'top' }}>
        <Group>
          <UserAvatar user={comment.author} />
          <div>
            <Text weight={500}>
              {comment.author?.name || 'Anonymous'}
            </Text>
            <Text size="xs" color="dimmed">
              {formatDate(comment.postedAt, 'en')}
            </Text>
          </div>
        </Group>
      </td>
      <td>
        {comment.content}
      </td>
      <td style={{ verticalAlign: 'top' }}>
        <Button
          style={{ float: 'right' }}
          variant="outline"
          color="red"
          mt={2}
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
          <th style={{ width: '240px' }}>Author</th>
          <th>Content</th>
          <th style={{ width: '100px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}

