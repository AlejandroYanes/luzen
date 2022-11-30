/* eslint-disable react/jsx-closing-bracket-location */
import { Fragment, useState } from 'react';
import Link from 'next/link';
import {
  ActionIcon,
  Button,
  Drawer,
  Indicator,
  Notification,
  Popover,
  Stack,
  Title,
} from '@mantine/core';
import { IconBell } from '@tabler/icons';

import { NOTIFICATION_TYPES } from 'constants/notifications';
import { clientEnv } from 'env/schema.mjs';
import { trpc } from 'utils/trpc';
import useMobileView from 'hooks/ui/useMobileView';
import resolveMessage from './helpers/resolve-message';

const linkMap: Record<number, (ideaId: string) => string> = {
  [NOTIFICATION_TYPES.NEW_IDEA]: (ideaId: string) => (
    `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/drafts/${ideaId}`
  ),
  [NOTIFICATION_TYPES.IDEA_PUBLISHED]: (ideaId: string) => (
    `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`
  ),
  [NOTIFICATION_TYPES.NEW_VOTE]: (ideaId: string) => (
    `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`
  ),
  [NOTIFICATION_TYPES.NEW_COMMENT]: (ideaId: string) => (
    `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`
  ),
};

const REFETCH_INTERVAL = 1000 * 60;

export default function CustomNotificationCenter() {
  const isMobileView = useMobileView();
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: infinite,
    hasNextPage,
    fetchNextPage,
  } = trpc.notifications.listInfinite.useInfiniteQuery({}, {
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: false,
  });

  const { data: unseenCount = 0, refetch: refetchUnseen } = trpc.notifications.countUnseen.useQuery(
    undefined,
    { refetchInterval: REFETCH_INTERVAL },
  );

  const { mutate: markAsSeen } = trpc.notifications.markAsSeen.useMutation({
    onSuccess: () => refetchUnseen()
  });

  const elements = infinite?.pages.map((page, index) => (
    <Fragment key={index}>
      {page.results.map((notification) => {
        const { title, message } = resolveMessage(notification);
        const linkGenerator = linkMap[notification.type];
        const link = linkGenerator!(notification.idea.id);
        return (
          <Link key={notification.id} href={link}>
            <Notification
              color={notification.seen ? 'gray' : 'blue'}
              title={title}
              styles={{
                root: {
                  boxShadow: 'none',
                  minWidth: '280px',
                },
              }}
              mb="xs"
              disallowClose
            >
              {message}
            </Notification>
          </Link>
        )
      })}
    </Fragment>
  )) || [];

  if (isMobileView) {
    return (
      <>
        <Indicator disabled={!unseenCount}>
          <ActionIcon onClick={() => setIsOpen(true)}>
            <IconBell size={32} />
          </ActionIcon>
        </Indicator>
        <Drawer
          size="100%"
          opened={isOpen}
          onClose={() => {
            setIsOpen(false);
            markAsSeen();
          }}
          title={<Title p={8} order={3}>Notifications</Title>}
        >
          <Stack spacing={0} px={8} sx={{ height: '100%' }}>
            {elements}
            <Button
              mt="auto"
              mx="auto"
              disabled={!hasNextPage}
              onClick={() => fetchNextPage()}
            >
              Load more
            </Button>
          </Stack>
        </Drawer>
      </>
    );
  }

  return (
    <Popover position="bottom-end" withArrow shadow="md" onClose={markAsSeen}>
      <Popover.Target>
        <Indicator disabled={!unseenCount}>
          <ActionIcon>
            <IconBell size={32} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown sx={{ minWidth: '200px' }}>
        {elements}
        <Stack mt="xl" align="center">
          <Button
            disabled={!hasNextPage}
            onClick={() => fetchNextPage()}
          >
            Load more
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
