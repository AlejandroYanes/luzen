import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import type { ContextModalProps } from '@mantine/modals';
import { Stack, Text } from '@mantine/core';

import { GoogleButton } from 'components/SocialButtons';
import openSignInModal from './open-sign-in-modal';

export { openSignInModal };

const SignInModal = (props: ContextModalProps) => {
  const { id, context } = props;
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      context.closeModal(id);
    }
  }, [status]);

  return (
    <Stack>
      <Text mb="xl">Start sharing your ideas and helping others get real</Text>
      <GoogleButton onClick={() => signIn('google')} />
    </Stack>
  );
};

export default SignInModal;
