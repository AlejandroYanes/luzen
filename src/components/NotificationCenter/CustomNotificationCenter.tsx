/* eslint-disable react/jsx-closing-bracket-location */
import { useState } from 'react';
import { ActionIcon, Button, Drawer, Indicator, Popover, Stack, Title, } from '@mantine/core';
import { IconBell } from '@tabler/icons';

import { clientEnv } from 'env/schema.mjs';
import useMobileView from 'hooks/ui/useMobileView';

const linkMap: Record<string, (ideaId: string) => string> = {
  'new-idea': (ideaId: string) => `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/drafts/${ideaId}`,
  'idea-made-public': ideaId => `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`,
  'idea-voted-up': ideaId => `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`,
  'new-comment-for-idea': ideaId => `${clientEnv.NEXT_PUBLIC_DOMAIN}/ideas/${ideaId}`,
};

export default function CustomNotificationCenter() {
  const isMobileView = useMobileView();
  const [isOpen, setIsOpen] = useState(false);

  // const newNotificationsCount = [].reduce(
  //   (acc, notification) => notification.seen ? acc : acc + 1,
  //   0,
  // );
  //
  // const elements = notifications.map((notification) => {
  //   const linkGenerator = linkMap[notification.templateIdentifier as string];
  //   const link = linkGenerator!(notification?.payload?.ideaId as string);
  //   return (
  //     <Link key={notification._id} href={link}>
  //       <Notification
  //         color={notification.seen ? 'gray' : 'blue'}
  //         title={notification.content as string}
  //         styles={{
  //           root: {
  //             boxShadow: 'none',
  //           },
  //         }}
  //         mb="xs"
  //         disallowClose
  //       />
  //     </Link>
  //   )
  // });

  if (isMobileView) {
    return (
      <>
        <Indicator disabled>
          <ActionIcon onClick={() => setIsOpen(true)}>
            <IconBell size={32} />
          </ActionIcon>
        </Indicator>
        <Drawer
          size="100%"
          opened={isOpen}
          onClose={() => {
            setIsOpen(false);
          }}
          title={<Title p={8} order={3}>Notifications</Title>}
        >
          <Stack spacing={0} px={8} sx={{ height: '100%' }}>
            {/*{elements}*/}
            <Button
              mt="auto"
              mx="auto"
              // loading={fetching}
              // disabled={!hasNextPage}
              // onClick={() => fetchNextPage}
            >
              Load more
            </Button>
          </Stack>
        </Drawer>
      </>
    );
  }

  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Indicator disabled>
          <ActionIcon>
            <IconBell size={32} />
          </ActionIcon>
        </Indicator>
      </Popover.Target>
      <Popover.Dropdown sx={{ minWidth: '200px' }}>
        {/*{elements}*/}
        <Stack mt="xl" align="center">
          <Button
            // loading={fetching}
            // disabled={!hasNextPage}
            // onClick={() => fetchNextPage}
          >
            Load more
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
