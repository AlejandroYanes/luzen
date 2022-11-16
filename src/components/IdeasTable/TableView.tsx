import Link from 'next/link';
import { ActionIcon, Badge, Button, Group, Switch, Table, Text } from '@mantine/core';
import { IconEye } from '@tabler/icons';

import RenderIf from '../RenderIf';
import type { Props as TopProps } from './index';

interface Props {
  data: TopProps['data'];
  onToggleStatus: TopProps['onToggleStatus'];
  isForAdmins: boolean;
}

export default function TableView(props: Props) {
  const { data, isForAdmins, onToggleStatus } = props;
  const rows = data.map((idea) => (
    <tr key={idea.id}>
      <td>
        <Link href={idea.isDraft ? `/ideas/drafts/${idea.id}` : `/ideas/${idea.id}`}>
          <ActionIcon>
            <IconEye size={14} />
          </ActionIcon>
        </Link>
      </td>
      <td>
        <div>
          <Text weight={500}>
            {idea.title}
          </Text>
          <RenderIf condition={isForAdmins}>
            <Text size="xs" color="dimmed">
              {idea.author?.name || 'Anonymous'}
            </Text>
          </RenderIf>
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
          condition={isForAdmins}
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
            condition={isForAdmins}
            fallback={
              <Link href={`/post/${idea.id}`}>
                <Button
                  disabled={!idea.isDraft}
                  variant="outline"
                >
                  Edit
                </Button>
              </Link>
            }
          >
            <Button variant="outline" color="red">Block</Button>
          </RenderIf>
        </Group>
      </td>
    </tr>
  ));

  return (
    <Table verticalSpacing="sm">
      <thead>
        <tr>
          <th style={{ width: '32px' }} />
          <th>Title</th>
          <th style={{ width: '70px', textAlign: 'center' }}>Votes</th>
          <th style={{ width: '140px', textAlign: 'center' }}>Comments</th>
          <th style={{ width: '140px' }}>Status</th>
          <th style={{ width: '120px' }}></th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
