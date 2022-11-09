import { Text } from '@mantine/core';

import { trpc } from 'utils/trpc';
import Comment from './Comment';
import Form from './Form';

interface Props {
  ideaId: string;
}

const Comments = (props: Props) => {
  const { ideaId } = props;
  const { data: comments, refetch } = trpc.comments.list.useQuery(ideaId);

  if (!comments || comments.length === 0) {
    return (
      <>
        <Text>Be the first to comment.</Text>
        <Form ideaId={ideaId} refetch={refetch} />
      </>
    );
  }

  const commentElements = comments.map((comment) => <Comment key={comment.id} {...comment} />)

  return (
    <>
      {commentElements}
      <Form ideaId={ideaId} refetch={refetch} />
    </>
  );
};

export default Comments;
