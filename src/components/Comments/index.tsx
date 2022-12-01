import { Space, Button } from '@mantine/core';

import { trpc } from 'utils/trpc';
import RenderIf from 'components/RenderIf';
import Comment from './Comment';
import Form from './Form';

interface Props {
  ideaId: string;
}

const Comments = (props: Props) => {
  const { ideaId } = props;
  const {
    data: infinite,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = trpc.comments.listInfinite.useInfiniteQuery(
    { ideaId },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
      refetchOnWindowFocus: false,
    },
  );

  if (!infinite?.pages || infinite?.pages.length === 0) {
    return <Form ideaId={ideaId} refetch={refetch} />;
  }

  const commentElements = infinite?.pages
    .flatMap((page) => page.results)
    .map((comment) => <Comment key={comment.id} {...comment} />);

  return (
    <>
      <RenderIf condition={commentElements.length > 0}>
        {commentElements}
        <Button
          mt="md"
          color="gray"
          variant="subtle"
          disabled={!hasNextPage}
          onClick={() => fetchNextPage()}
        >
          Load more
        </Button>
        <Space h="xl" />
      </RenderIf>
      <Form ideaId={ideaId} refetch={refetch} />
    </>
  );
};

export default Comments;
