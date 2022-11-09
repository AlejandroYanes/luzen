import Link from 'next/link';
import { Badge, Button, Group, Pagination, Switch, Table, Text, TextInput, } from '@mantine/core';
import RenderIf from 'components/RenderIf';
import { calculateTotal } from 'utils/pagiantion';
import type { inferOppositeExcludingType } from 'utils/prop-types';

interface CommonProps {
  page: number;
  count: number;
  data: {
    id: string;
    title: string;
    summary: string;
    postedAt: Date;
    votes: number;
    isDraft: boolean;
    author: {
      name: string | null;
      image: string | null;
    } | null;
    _count: {
      comments: number;
    };
  }[];
  onQueryChange: (nextQuery: string) => void;
  onPageChange: (nextPage: number) => void;
}

interface UserProps {
  isForUsers: true;
  onEdit: (ideaId: string) => void;
}

interface AdminProps {
  isForAdmins: true;
  onToggleStatus: (ideaId: string) => void;
}

type Props = CommonProps & inferOppositeExcludingType<UserProps, AdminProps>;

const IdeasTable = (props: Props) => {
  const {
    page,
    count,
    data,
    isForAdmins,
    onToggleStatus,
    onPageChange,
    onQueryChange,
    onEdit,
  } = props;

  const rows = data.map((idea) => (
    <tr key={idea.id}>
      <td>
        <div>
          <Text weight={500}>
            {idea.title}
          </Text>
          <Text size="xs" color="dimmed">
            {idea.author?.name || 'Anonymous'}
          </Text>
        </div>
      </td>
      <td style={{ textAlign: 'center' }}>
        {idea.votes}
      </td>
      <td style={{ textAlign: 'center' }}>
        <RenderIf condition={idea._count.comments > 0} fallback={idea._count.comments}>
          <Link
            href={(
              isForAdmins
                ? `/management/ideas/${idea.id}/comments`
                : `/me/ideas/${idea.id}/comments`
            )}
          >
            <Button size="sm" variant="subtle">
              {idea._count.comments}
            </Button>
          </Link>
        </RenderIf>
      </td>
      <td>
        <RenderIf
          condition={!!isForAdmins}
          fallback={
            <Badge
              color={idea.isDraft ? 'orange' : 'blue'}
              variant="light"
            >
              {idea.isDraft ? 'Draft' : 'Public'}
            </Badge>
          }
        >
          <Switch
            sx={{ display: 'flex' }}
            checked={!idea.isDraft}
            onChange={() => onToggleStatus!(idea.id)}
            onLabel="Public"
            offLabel="Draft"
            size="lg"
          />
        </RenderIf>
      </td>
      <td>
        <Group position="right">
          <RenderIf
            condition={!!isForAdmins}
            fallback={
              <Button
                onClick={() => onEdit!(idea.id)}
                disabled={!idea.isDraft}
                variant="outline"
              >
                Edit
              </Button>
            }
          >
            <Button variant="outline" color="red">Block</Button>
          </RenderIf>
        </Group>
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
            <th>Title</th>
            <th style={{ width: '70px', textAlign: 'center' }}>Votes</th>
            <th style={{ width: '140px', textAlign: 'center' }}>Comments</th>
            <th style={{ width: '140px' }}>Status</th>
            <th style={{ width: '120px' }}></th>
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

export default IdeasTable;
