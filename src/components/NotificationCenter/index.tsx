import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';
import { useColorScheme } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { clientEnv } from 'env/schema.mjs';

const theme = {
  common: {
    fontFamily: 'Roboto, serif'
  },
};

const NotificationCenter = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { data } = useSession();

  function onNotificationClick(notification: any) {
    router.push(notification.cta.data.url);
  }

  return (
    <NovuProvider
      subscriberId={data?.user?.id}
      applicationIdentifier={clientEnv.NEXT_PUBLIC_NOVU_APP_ID as string}
    >
      <PopoverNotificationCenter
        theme={theme}
        colorScheme={colorScheme}
        onNotificationClick={onNotificationClick}
      >
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
  );
};

export default NotificationCenter;
