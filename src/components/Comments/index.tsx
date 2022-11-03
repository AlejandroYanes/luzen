import { Button, Textarea, Title } from '@mantine/core';
import Comment from './Comment';
import { mockComment } from './mock-comment';

const Comments = () => {
  return (
    <>
      <Title order={3}>Comments</Title>
      <Comment {...mockComment} />
      <Comment {...mockComment} />
      <Comment {...mockComment} />
      <Textarea
        label="Drop some words"
        placeholder="Start typing here"
        description="500 characters left"
        minRows={8}
        maxRows={20}
        maxLength={500}
        autosize
      />
      <Button>Post</Button>
    </>
  );
};

export default Comments;
