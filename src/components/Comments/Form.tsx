import { useSession } from 'next-auth/react';
import { Button, Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { openSignInModal } from 'components/SignInModal';
import { trpc } from 'utils/trpc';

interface Props {
  ideaId: string;
  refetch: () => void;
}

interface CommentFormValues {
  content: string;
}

const initialValues: CommentFormValues = {
  content: '',
};

const formRules = {
  content: (value: string) => !value ? 'Please type something here' : null,
};

const Form = (props: Props) => {
  const { ideaId, refetch } = props;
  const { status } = useSession();
  const { mutate, isLoading } = trpc.comments.postComment.useMutation({
    onSuccess: () => {
      form.reset();
      refetch();
    },
  });

  const form = useForm<CommentFormValues>({
    initialValues,
    validate: formRules,
  });

  const handlePost = form.onSubmit((values: CommentFormValues) => {
    mutate({ ...values, idea: ideaId });
  });

  if (status === 'unauthenticated') {
    return (
      <Button mr="auto" onClick={() => openSignInModal()}>Sign in to comment</Button>
    );
  }

  return (
    <form onSubmit={handlePost}>
      <Stack>
        <Textarea
          mt="xl"
          label="Drop some words"
          placeholder="Start typing here"
          description="500 characters left"
          minRows={8}
          maxRows={20}
          maxLength={500}
          autosize
          {...form.getInputProps('content')}
        />
        <Button type="submit" loading={isLoading}>Post</Button>
      </Stack>
    </form>
  );
};

export default Form;
