import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import type { ContextModalProps } from '@mantine/modals';
import { Stack, Text } from '@mantine/core';

import { GoogleButton } from 'components/SocialButtons';
import openSignInModal from './open-sign-in-modal';
import { GithubButton } from '../SocialButtons/GitHibButton';
import { DiscordButton } from '../SocialButtons/DiscordButton';

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
      <GithubButton onClick={() => signIn('github')} />
      <DiscordButton onClick={() => signIn('discord')} />
      <GoogleButton onClick={() => signIn('google')} />
    </Stack>
  );
};

export default SignInModal;
