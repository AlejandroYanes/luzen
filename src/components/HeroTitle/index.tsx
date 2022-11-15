/* eslint-disable max-len */
import { createStyles, Container, Text, Button, Group } from '@mantine/core';
import Link from 'next/link';

const BREAKPOINT = '@media (max-width: 755px)';

const useStyles = createStyles((theme) => ({
  inner: {
    position: 'relative',
    paddingTop: 80,
    paddingBottom: 120,

    [BREAKPOINT]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [BREAKPOINT]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,

    [BREAKPOINT]: {
      fontSize: 18,
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 2,

    [BREAKPOINT]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: 54,
    paddingLeft: 38,
    paddingRight: 38,

    [BREAKPOINT]: {
      height: 54,
      paddingLeft: 18,
      paddingRight: 18,
      flex: 1,
    },
  },
}));

export default function HeroTitle() {
  const { classes } = useStyles();

  return (
    <Container className={classes.inner}>
      <h1 className={classes.title}>
        Have an{' '}
        <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
          idea
        </Text>{' '}
        for an app?
        <br />
        <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
          Share
        </Text>{' '}
        it.
      </h1>

      <Text className={classes.description} color="dimmed">
        {"Weather you're looking for market validation or want somebody else to build it, here's the place to share it with the world."}
      </Text>

      <Group className={classes.controls}>
        <Link href="/ideas">
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Get started
          </Button>
        </Link>
      </Group>
    </Container>
  );
}
