/* eslint-disable max-len */
import { useSession } from 'next-auth/react';

import SignInAlert from '../SignInAlert';

/*
* TS2786: 'AuthGuard' cannot be used as a JSX component.
* Its return type 'string | number | boolean | ReactFragment | Element | null | undefined' is not a valid JSX element.
* Type 'undefined' is not assignable to type 'Element | null'.
* 👆this error forced me to have the children | loadingUI as any instead of ReactNode
*/
interface Props {
  children: any;
  loadingUI?: any;
}

const AuthGuard = (props: Props) => {
  const { loadingUI = null, children } = props;
  const { status } = useSession();

  if (status === 'loading') return loadingUI;

  if (status === 'unauthenticated') {
    return <SignInAlert />;
  }
  return children;
};

export default AuthGuard;
