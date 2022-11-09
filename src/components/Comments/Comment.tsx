import { createStyles, Text, Avatar, Group, Paper } from '@mantine/core';

import { resolveInitials } from 'utils/strings';
import { formatDate } from 'utils/dates';

const useStyles = createStyles((theme) => ({
  comment: {
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
  },

  body: {
    paddingLeft: 54,
    paddingTop: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
  },

  content: {
    '& > p:last-child': {
      marginBottom: 0,
    },
  },
}));

interface Props {
  postedAt: Date;
  content: string;
  author?: {
    name: string | null;
    image?: string | null;
  };
}

export default function Comment(props: Props) {
  const { postedAt, content, author } = props;
  const { classes } = useStyles();
  return (
    <Paper withBorder radius="md" className={classes.comment}>
      <Group mb="xs">
        <Avatar src={author?.image} alt={author?.name as string}>
          {author?.name ? resolveInitials(author?.name as string) : 'A/N'}
        </Avatar>
        <div>
          <Text size="sm">{author?.name ?? 'Anonymous'}</Text>
          <Text size="xs" color="dimmed">{formatDate(postedAt, 'en')}</Text>
        </div>
      </Group>
      <Text>{content}</Text>
    </Paper>
  );
}
