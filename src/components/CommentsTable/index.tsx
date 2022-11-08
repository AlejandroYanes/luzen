import { Avatar, Button, Group, Pagination, Table, Text, TextInput } from '@mantine/core';
import { formatDate } from 'utils/dates';
import { resolveInitials } from 'utils/strings';
import { calculateTotal } from 'utils/pagiantion';

interface Props {
  page: number;
  count: number;
  data: {
    id: string;
    postedAt: Date;
    content: string;
    author: {
      name: string | null;
      image: string | null;
    } | null;
  }[];
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

const CommentsTable = (props: Props) => {
  const { page, count, data, onQueryChange, onPageChange } = props;

  const rows = data.map((comment) => (
    <tr key={comment.id}>
      <td style={{ verticalAlign: 'top' }}>
        <Group>
          <Avatar src={comment.author?.image}>
            {comment.author?.name ? resolveInitials(comment.author.name) : 'A/N'}
          </Avatar>
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
    <>
      <TextInput
        my="lg"
        mr="auto"
        defaultValue=""
        placeholder="Search comments"
        sx={{ width: '280px' }}
        onChange={(e) => onQueryChange(e.target.value)}
      />
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

export default CommentsTable;
