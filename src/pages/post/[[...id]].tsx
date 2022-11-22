import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from '@mantine/form';
import { ActionIcon, Alert, Button, Stack, Textarea, TextInput, Title, Text } from '@mantine/core';
import { IconAlertCircle, IconArrowLeft } from '@tabler/icons';

import { trpc } from 'utils/trpc';
import BaseLayout from 'components/BaseLayout';
import RenderIf from 'components/RenderIf';
import AuthGuard from 'components/AuthGuard';
import Loading from 'components/EditorSkeletons';

interface IdeaFormValues {
  title: string;
  tagLine: string;
  summary: string;
  description: string;
}

const initialValues: IdeaFormValues = {
  title: '',
  tagLine: '',
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

  const idFromQuery = router.query.id?.[0] as string;
  const {
    data: ideaFromDb,
    isFetching: loadingFromDb,
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
        tagLine: ideaFromDb.tagLine as string,
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
        </Head>
        <BaseLayout>
          <Stack spacing="xl" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
            <ActionIcon onClick={() => router.back()}>
              <IconArrowLeft />
            </ActionIcon>
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
          Bucket List | ${ideaFromDb?.id ? 'Editing' : 'Share a new idea with the world'}
        </title>
      </Head>
      <BaseLayout>
        <Stack spacing="xl" style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
          <AuthGuard loadingUI={<Loading />}>
            <RenderIf condition={!loadingFromDb} fallback={<Loading />}>
              <ActionIcon onClick={() => router.back()}>
                <IconArrowLeft />
              </ActionIcon>
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
                    label="Tagline"
                    description={
                      <>
                        <Text size="xs">
                          {`${140 - form.values.tagLine.length} characters left`}
                        </Text>
                        <Text size="xs">
                          this will be used as the summary when sharing the link
                        </Text>
                      </>
                    }
                    minRows={2}
                    maxRows={2}
                    maxLength={140}
                    {...form.getInputProps('tagLine')}
                  />
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
                  <Button type="submit" mt="xl" loading={isLoading}>Save</Button>
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
