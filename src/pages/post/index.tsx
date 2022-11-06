import { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  ActionIcon,
  Button,
  Stack,
  Textarea,
  TextInput,
  Title,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons';
import { trpc } from 'utils/trpc';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';
import AuthGuard from 'components/AuthGuard';
import Loading from './Loading';

interface IdeaFormValues {
  title: string;
  summary: string;
  description: string;
}

const initialValues = {
  title: '',
  summary: '',
  description: '',
};

const formRules = {
  title: (value: string) => !value ? 'Please type something here' : null,
  summary: (value: string) => !value ? 'Please type something here' : null,
  description: (value: string) => !value ? 'Please type something here' : null,
};

const Post: NextPage = () => {
  const [postFailed, setPostFailed] = useState(false);
  const router = useRouter();
  const { mutate, isLoading } = trpc.ideas.post.useMutation({
    onSuccess: (ideaId) => router.push(`/ideas/drafts/${ideaId}`),
    onError: () => setPostFailed(true),
  });
  const form = useForm<IdeaFormValues>({
    initialValues,
    validate: formRules,
  });

  const handleFormSubmit = form.onSubmit((values: IdeaFormValues) => {
    mutate(values);
  });

  return (
    <BaseLayout>
      <Stack spacing="xl" style={{ width: '600px', margin: '0 auto' }}>
        <AuthGuard loadingUI={<Loading />}>
          <Link href="/">
            <ActionIcon>
              <IconArrowLeft />
            </ActionIcon>
          </Link>
          <Title order={1} mb="xl">Share your idea</Title>
          <RenderIf condition={postFailed}>
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Bummer!"
              color="orange"
              variant="outline"
            >
              Something terrible happened! We could not publish your idea.
            </Alert>
          </RenderIf>
          <form onSubmit={handleFormSubmit}>
            <Stack spacing="xl">
              <TextInput withAsterisk label="Title" {...form.getInputProps('title')} />
              <Textarea
                withAsterisk
                label="Summary"
                description={`${690 - form.values.summary.length} characters left`}
                minRows={8}
                maxRows={8}
                maxLength={690}
                {...form.getInputProps('summary')}
              />
              <Textarea
                autosize
                withAsterisk
                label="Description"
                minRows={20}
                {...form.getInputProps('description')}
              />
              <Button type="submit" mt="xl" loading={isLoading}>Publish</Button>
            </Stack>
          </form>
        </AuthGuard>
      </Stack>
    </BaseLayout>
  );
};

export default Post;
