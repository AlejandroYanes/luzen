import Link from 'next/link';
import { Accordion, createStyles, Group, Text, Button, Badge } from '@mantine/core';

import type { Props as TopProps } from './index';
import RenderIf from '../RenderIf';

const useStyles = createStyles((theme) => ({
  item: {
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.lg,

    border: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },
}));

interface Props {
  data: TopProps['data'];
}

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div style={{ width: '80px' }}>
    <Text align="center" size="lg" weight={500}>
      {value}
    </Text>
    <Text align="center" size="sm" color="dimmed">
      {label}
    </Text>
  </div>
);

export default function StackView(props: Props) {
  const { data } = props;
  const { classes } = useStyles();

  const ideas = data.map((idea) => (
    <Accordion.Item key={idea.id} className={classes.item} value={idea.id}>
      <Accordion.Control>
        <Group>
          <Text>{idea.title}</Text>
          <Badge
            variant="light"
            color={idea.isDraft ? 'orange' : 'blue'}
          >
            {idea.isDraft ? 'Draft' : 'Public'}
          </Badge>
        </Group>
      </Accordion.Control>
      <Accordion.Panel>
        <Group position="apart" align="flex-end">
          <Group spacing="xs">
            <Stat label="Votes" value={idea.votes} />
            <RenderIf
              condition={idea._count.comments > 0}
              fallback={<Stat label="Comments" value={idea._count.comments} />}
            >
              <Link
                href={`/me/ideas/${idea.id}/comments`}
              >
                <Button size="sm" variant="subtle" style={{ height: '48px', padding: 0 }}>
                  <Stat label="Comments" value={idea._count.comments} />
                </Button>
              </Link>
            </RenderIf>
          </Group>
          <RenderIf
            condition={idea.isDraft}
            fallback={
              <Link href={idea.isDraft ? `/ideas/drafts/${idea.id}` : `/ideas/${idea.id}`}>
                <Button variant="outline">
                Visit
                </Button>
              </Link>
            }
          >
            <Link href={`/post/${idea.id}`}>
              <Button
                disabled={!idea.isDraft}
                variant="outline"
              >
                Edit
              </Button>
            </Link>
          </RenderIf>
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion variant="separated">
      {ideas}
    </Accordion>
  );
}
