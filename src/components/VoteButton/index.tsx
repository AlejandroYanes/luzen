import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
import { openSignInModal } from 'components/SignInModal';
import { trpc } from 'utils/trpc';

interface Props {
  ideaId: string;
  votes: number;
}

const VoteButton = (props: Props) => {
  const { status } = useSession();
  const { ideaId, votes: originalVotes } = props;
  const [votes, setVotes] = useState(originalVotes);

  const { data: userVotedFor = false, refetch } = trpc.ideas.checkIfUserVoted.useQuery(ideaId, {
    enabled: status === 'authenticated',
  });

  const { mutate } = trpc.ideas.toggleVote.useMutation({
    onSuccess: () => {
      refetch();
      const modifier = userVotedFor ? -1 : 1;
      setVotes(votes + modifier);
    },
  });

  const handleLightUp = () => {
    if (status === 'unauthenticated') {
      openSignInModal();
      return;
    }
    mutate(ideaId);
  };

  return (
    <Button
      color={userVotedFor ? 'orange' : 'blue'}
      leftIcon={<IconBulb />}
      onClick={handleLightUp}
    >
      Light Up ({votes})
    </Button>
  );
};

export default VoteButton;
