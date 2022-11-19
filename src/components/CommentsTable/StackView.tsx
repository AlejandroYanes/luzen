import { Accordion, createStyles, Stack, Text } from '@mantine/core';

import { formatDate } from 'utils/dates';
import type { Props as BaseProps } from './index';

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
  data: BaseProps['data'];
}

export default function StackView(props: Props) {
  const { data } = props;
  const { classes } = useStyles();

  const comments = data.map((comment) => (
    <Accordion.Item key={comment.id} className={classes.item} value={comment.id}>
      <Accordion.Control>
        <Stack spacing={0}>
          <Text>{comment.author?.name ?? 'Anonymous'}</Text>
          <Text size="sm" color="dimmed">{formatDate(comment.postedAt, 'en')}</Text>
        </Stack>
      </Accordion.Control>
      <Accordion.Panel>
        {comment.content}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion variant="separated">
      {comments}
    </Accordion>
  );
}
