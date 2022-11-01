/* eslint-disable max-len */
import { useSession } from 'next-auth/react';
import { IconAlertCircle } from '@tabler/icons';
import { Alert, Button, Group } from '@mantine/core';
import Link from 'next/link';

/*
* TS2786: 'AuthGuard' cannot be used as a JSX component.
* Its return type 'string | number | boolean | ReactFragment | Element | null | undefined' is not a valid JSX element.
* Type 'undefined' is not assignable to type 'Element | null'.
* 👆this error forced me to have the children | loadingUI as any instead of ReactNode
*/
interface Props {
  children: any;
  loadingUI: any;
}

const AuthGuard = (props: Props) => {
  const { loadingUI, children } = props;
  const { status } = useSession();

  if (status === 'loading') return loadingUI;

  if (status === 'unauthenticated') {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Hmm..."
        // color="dark"
        variant="outline"
      >
        {`Seems we're not sure who you are, do you mind signing in?`}
        <Group position="right" mt="md">
          <Link href="/signin">
            <Button>Sign in</Button>
          </Link>
        </Group>
      </Alert>
    );
  }

  return children;
};

export default AuthGuard;
