import type { SpotlightActionProps } from '@mantine/spotlight';
import { createStyles, Text, Title, UnstyledButton } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  action: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '10px 12px',
    borderRadius: theme.radius.sm,
  },

  actionHovered: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[1],
  },

  actionBody: {
    flex: 1,
  },
}));

export default function CustomAction(props: SpotlightActionProps) {
  const {
    action,
    styles,
    classNames,
    hovered,
    onTrigger,
    ...others
  } = props;

  // @ts-ignore
  const { classes, cx } = useStyles(null, { styles, classNames, name: 'Spotlight' });

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event: any) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Title order={5}>{action.title}</Title>
      <Text lineClamp={3}>
        {action.description}
      </Text>
    </UnstyledButton>
  );
}
