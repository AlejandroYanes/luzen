import { Button, Stack, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
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
  const { mutate, isLoading } = trpc.ideas.postComment.useMutation({
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
