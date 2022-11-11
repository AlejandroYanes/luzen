import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
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
  const router = useRouter();

  const idFromQuery = router.query.id as string;
  const {
    data: ideaFromDb,
    isLoading: loadingFromDb,
  } = trpc.ideas.fetchDraft.useQuery(
    idFromQuery,
    {
      enabled: !!idFromQuery,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const {
    mutate,
    isLoading,
    error: errorMutating,
  } = trpc.ideas.post.useMutation({
    onSuccess: (ideaId) => router.push(`/ideas/drafts/${ideaId}`),
  });

  const form = useForm<IdeaFormValues>({
    initialValues,
    validate: formRules,
  });

  const handleFormSubmit = form.onSubmit((values: IdeaFormValues) => {
    mutate({ id: idFromQuery, ...values });
  });

  useEffect(() => {
    if (idFromQuery && !loadingFromDb && ideaFromDb) {
      form.setValues({
        title: ideaFromDb.title,
        summary: ideaFromDb.summary,
        description: ideaFromDb.description,
      });
    }
  }, [loadingFromDb]);

  if (idFromQuery && !loadingFromDb && !ideaFromDb) {
    return (
      <>
        <Head>
          <title>
            Bucket List | No idea to be found
          </title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <BaseLayout>
          <Stack spacing="xl" style={{ width: '600px', margin: '0 auto' }}>
            <Link href="/">
              <ActionIcon>
                <IconArrowLeft />
              </ActionIcon>
            </Link>
            <Title order={1} mb={48} align="center">Oops, we could not find this idea</Title>
            <span style={{ fontSize: '72px', textAlign: 'center' }}>😔</span>
          </Stack>
        </BaseLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          Bucket List | ${ideaFromDb?.id ? 'Editing' : 'Post a new idea to the world'}
        </title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ width: '600px', margin: '0 auto' }}>
          <AuthGuard loadingUI={<Loading />}>
            <RenderIf condition={!loadingFromDb} fallback={<Loading />}>
              <Link href="/">
                <ActionIcon>
                  <IconArrowLeft />
                </ActionIcon>
              </Link>
              <Title order={1} mb="xl">Share your idea</Title>
              <RenderIf condition={!!errorMutating}>
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
            </RenderIf>
          </AuthGuard>
        </Stack>
      </BaseLayout>
    </>
  );
};

export default Post;
